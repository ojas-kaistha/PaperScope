import os
import asyncio
import uuid
from contextlib import asynccontextmanager
from typing import Optional, List
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel

from backend.app.services.llm_engine import local_llm
from backend.app.services.pdf_parser import chunk_text, extract_text_from_pdf
from backend.app.services.vector_store import (
    get_document_summary_chunks,
    get_latest_doc_id,
    set_latest_doc_id,
    query_relevant_chunks,
    store_chunks,
)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
TEMP_UPLOADS_DIR = os.path.join(BASE_DIR, "temp_uploads")
os.makedirs(TEMP_UPLOADS_DIR, exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Pre-warm the local engine into RAM on boot for instant responses
    try:
        print("[PaperScope] Pre-warming local ONNX model in RAM...")
        local_llm._ensure_loaded()
        print("[PaperScope] Pre-warm complete! Ready for instantaneous generation.")
    except Exception as e:
        print(f"[PaperScope] Pre-warm warning: {e}")
    yield


app = FastAPI(title="PaperScope API", version="1.0.0", lifespan=lifespan)

# Enable CORS for Next.js frontend running locally
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    query: str
    doc_id: Optional[str] = None
    mode: Optional[str] = "rigorous"


class SummarizeRequest(BaseModel):
    doc_id: Optional[str] = None
    mode: Optional[str] = "rigorous"


class CompareRequest(BaseModel):
    doc_id_a: str
    doc_id_b: str
    focus: Optional[str] = "general"


class ReviewerRequest(BaseModel):
    doc_id: Optional[str] = None


class MathDissectRequest(BaseModel):
    doc_id: Optional[str] = None
    formula: Optional[str] = None


DOCUMENTS_REGISTRY: dict = {}


@app.get("/")
@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "PaperScope Cheerful Local Research Assistant",
        "active_document": get_latest_doc_id(),
        "local_model": "Qwen2.5-1.5B-Instruct ONNX",
        "hardware_engine": getattr(local_llm, "device_info", "Hybrid GPU (DirectML) + CPU (AVX2)"),
    }


@app.post("/api/reset")
@app.post("/api/v1/reset")
def reset_session():
    """Resets the currently active session document."""
    set_latest_doc_id(None)
    return {"status": "success", "message": "Active document session reset."}


async def process_pdf_upload(file: UploadFile):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400, detail="Only PDF files are supported."
        )

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    doc_id = str(uuid.uuid4())

    # Save PDF file locally immediately for direct inline viewing
    saved_pdf_path = os.path.join(TEMP_UPLOADS_DIR, f"{doc_id}.pdf")
    with open(saved_pdf_path, "wb") as f:
        f.write(content)

    # Run extraction in non-blocking background thread
    pages_data = await asyncio.to_thread(extract_text_from_pdf, content)
    if not pages_data:
        # Graceful fallback for image-only manuscripts so the PDF viewer opens and UI never crashes
        pages_data = [{"page": 1, "text": f"Document: {file.filename} (Visual paper loaded in reader)."}]

    # Balanced chunk size for rapid vectorization and swift indexing
    chunks = chunk_text(pages_data, chunk_size=450, overlap=50)

    # Store chunks into local vector store in background thread
    await asyncio.to_thread(store_chunks, doc_id, chunks)

    doc_info = {
        "status": "success",
        "doc_id": doc_id,
        "filename": file.filename,
        "total_pages": len(pages_data),
        "total_chunks": len(chunks),
        "pdf_url": f"/api/pdf/{doc_id}",
        "message": f"Successfully indexed '{file.filename}' into local vector store.",
    }
    DOCUMENTS_REGISTRY[doc_id] = doc_info

    return doc_info


@app.post("/api/upload")
@app.post("/api/v1/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """Accepts a research paper PDF, stores file, parses text, and indexes into ChromaDB."""
    return await process_pdf_upload(file)


@app.get("/api/documents")
@app.get("/api/v1/documents")
def list_documents():
    """Returns list of currently indexed documents for multi-paper comparison."""
    return list(DOCUMENTS_REGISTRY.values())


@app.get("/api/pdf/{doc_id}")
@app.get("/api/v1/pdf/{doc_id}")
async def serve_pdf(doc_id: str):
    """Serves the PDF file for browser inline viewing."""
    pdf_path = os.path.join(TEMP_UPLOADS_DIR, f"{doc_id}.pdf")
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF not found.")
    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        headers={"Content-Disposition": "inline"},
    )


def find_snippet_rects(pdf_page, snippet: str):
    """Searches for snippet text across the page and returns bounding box rectangles."""
    import re
    if not snippet:
        return []
    clean = re.sub(r'[\s\n\r]+', ' ', snippet).strip()
    words = clean.split()
    if not words:
        return []

    # Progressive candidate phrase matching (longest to shortest)
    for n in (6, 5, 4, 3, 2):
        if len(words) >= n:
            candidate = " ".join(words[:n])
            rects = pdf_page.search_for(candidate)
            if rects:
                return rects

    # Fallback to key distinctive word
    for w in sorted(words, key=len, reverse=True):
        if len(w) >= 4 and w.lower() not in ("this", "that", "with", "from", "have", "were", "they"):
            rects = pdf_page.search_for(w)
            if rects:
                return rects

    return []


@app.get("/api/page_image/{doc_id}/{page}")
@app.get("/api/v1/page_image/{doc_id}/{page}")
async def get_page_image(doc_id: str, page: int, highlight: Optional[str] = None):
    """Renders a PDF page as a high-resolution PNG image with optional in-canvas highlighted bounding boxes."""
    pdf_path = os.path.join(TEMP_UPLOADS_DIR, f"{doc_id}.pdf")
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF not found.")

    try:
        import pymupdf
        doc = pymupdf.open(pdf_path)
        page_idx = max(0, min(page - 1, len(doc) - 1))
        pdf_page = doc[page_idx]

        if highlight:
            rects = find_snippet_rects(pdf_page, highlight)
            for r in rects:
                pdf_page.draw_rect(
                    r,
                    color=(0.88, 0.45, 0.1),
                    width=2,
                    fill=(1.0, 0.93, 0.35),
                    fill_opacity=0.42,
                )

        pix = pdf_page.get_pixmap(dpi=140)
        img_bytes = pix.tobytes("png")
        return Response(content=img_bytes, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to render page image: {str(e)}")


@app.get("/api/citation_bbox")
@app.get("/api/v1/citation_bbox")
async def get_citation_bbox(doc_id: str, page: int, snippet: str):
    """Calculates exact normalized percentage bounding boxes for a snippet on a target page."""
    pdf_path = os.path.join(TEMP_UPLOADS_DIR, f"{doc_id}.pdf")
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF not found.")

    try:
        import pymupdf
        doc = pymupdf.open(pdf_path)
        page_idx = max(0, min(page - 1, len(doc) - 1))
        pdf_page = doc[page_idx]
        pw = pdf_page.rect.width
        ph = pdf_page.rect.height

        rects = find_snippet_rects(pdf_page, snippet)
        bbox_list = []
        for r in rects:
            bbox_list.append({
                "left": round((r.x0 / pw) * 100, 2),
                "top": round((r.y0 / ph) * 100, 2),
                "width": round(((r.x1 - r.x0) / pw) * 100, 2),
                "height": round(((r.y1 - r.y0) / ph) * 100, 2),
            })

        return {
            "status": "success",
            "doc_id": doc_id,
            "page": page,
            "page_width": pw,
            "page_height": ph,
            "rects": bbox_list,
        }
    except Exception as e:
        return {
            "status": "error",
            "doc_id": doc_id,
            "page": page,
            "rects": [],
            "error": str(e),
        }


def execute_query(request: QueryRequest):
    doc_id = request.doc_id or get_latest_doc_id()
    if not doc_id:
        raise HTTPException(
            status_code=400,
            detail="No document loaded yet! Please upload a research paper on the left to get started.",
        )

    # 2 targeted chunks for lightning-fast prefill and razor-sharp retrieval
    context_chunks = query_relevant_chunks(doc_id, request.query, top_k=2)

    if not context_chunks:
        raise HTTPException(
            status_code=404,
            detail="No relevant context found in the uploaded paper for your query.",
        )

    context_str = "\n\n".join(
        [
            f"[Page {c['metadata'].get('page', '?')}]: {c['text'][:900]}"
            for c in context_chunks
        ]
    )

    mode_instructions = {
        "plain": "Plain & Easy English (ChatGPT / Gemini Style): Explain in simple, natural, conversational English using intuitive everyday analogies, straightforward sentences, and zero confusing academic jargon so anyone can follow along effortlessly.",
        "rigorous": "Deep-Dive Explained Clearly: Provide a thorough, scientifically detailed breakdown with rigorous logic and exact citations, but keep the prose natural, clean, and accessible.",
        "metrics": "Key Numbers & Metrics: Focus on quantitative benchmarks, statistics, dataset results, and exact figures presented in crisp, easy-to-read bullet points.",
    }
    # Default to easy-to-understand plain English like ChatGPT/Gemini
    mode_str = mode_instructions.get(request.mode or "plain", mode_instructions["plain"])

    prompt = (
        f"<|im_start|>system\n"
        f"You are PaperScope, an insightful, friendly, and articulate research companion like ChatGPT and Gemini! 🌟\n"
        f"Your mission is to make scientific papers fun, intuitive, and crystal-clear for everyone.\n"
        f"Style & Tone Guidelines:\n"
        f"• Write in natural, fluid, everyday English. Avoid stiff academic phrases and convoluted jargon.\n"
        f"• When explaining technical concepts, use relatable real-world analogies and short, punchy paragraphs.\n"
        f"• Use neat bullet points for key points so the reader can scan easily.\n"
        f"• Mode Directive: {mode_str}\n"
        f"• Ground all facts in the excerpts and cite page numbers like [Page X] where appropriate.\n"
        f"<|im_end|>\n"
        f"<|im_start|>user\n"
        f"Paper excerpts:\n{context_str}\n\n"
        f"Question: {request.query}\n\n"
        f"Please explain in clear, natural everyday English:<|im_end|>\n"
        f"<|im_start|>assistant\n"
    )

    answer = local_llm.generate(prompt=prompt, max_new_tokens=240, temperature=0.3)

    # Format and deduplicate sources with page numbers
    sources = []
    seen_pages = set()
    for c in context_chunks:
        p = c["metadata"].get("page", 1)
        snippet = c["text"][:160].strip() + ("..." if len(c["text"]) > 160 else "")
        sources.append({"page": p, "snippet": snippet})
        seen_pages.add(p)

    return {
        "doc_id": doc_id,
        "query": request.query,
        "answer": answer,
        "sources": sources,
    }


@app.post("/api/query")
@app.post("/api/v1/query")
async def query_pdf(request: QueryRequest):
    """Retrieves context chunks from ChromaDB and generates an answer using local ONNX LLM."""
    return await asyncio.to_thread(execute_query, request)


@app.post("/api/summarize")
@app.post("/api/v1/summarize")
async def summarize_pdf(request: SummarizeRequest):
    """Generates a structured scientific summary of the uploaded paper."""
    doc_id = request.doc_id or get_latest_doc_id()
    if not doc_id:
        raise HTTPException(
            status_code=400,
            detail="No document loaded. Please upload a research paper first.",
        )

    chunks = get_document_summary_chunks(doc_id, max_chunks=3)
    if not chunks:
        raise HTTPException(
            status_code=404,
            detail="Could not retrieve chunks for summarization.",
        )

    context_str = "\n\n".join(
        [
            f"[Page {c['metadata'].get('page', '?')}]: {c['text'][:800]}"
            for c in chunks
        ]
    )

    summary_mode_instructions = {
        "plain": "Plain & Easy English (ChatGPT / Gemini Style): Summarize using simple, natural, everyday words and intuitive analogies without complex jargon.",
        "rigorous": "Deep-Dive Explained Simply: Detail the architecture, pipeline, and empirical results thoroughly while keeping the prose clear and readable.",
        "metrics": "Key Metrics Focus: Highlight core benchmarks, percentage gains, and experimental numbers in clean bullet points.",
    }
    # Default to easy-to-understand plain English
    mode_str = summary_mode_instructions.get(request.mode or "plain", summary_mode_instructions["plain"])

    prompt = (
        f"<|im_start|>system\n"
        f"You are PaperScope, a friendly, crystal-clear research companion like ChatGPT and Gemini! 🚀\n"
        f"Explain this research paper in simple, natural, conversational English that is engaging and effortless to read.\n"
        f"Avoid dense, stuffy academic jargon. Use simple real-world analogies and clear, punchy bullet points.\n"
        f"Structure your response nicely:\n"
        f"• 🎯 The Big Picture: What real-world problem they solved in simple terms\n"
        f"• 🔬 How It Works: The core method explained with an intuitive analogy\n"
        f"• 🏆 Key Results: The most exciting discoveries and numbers [Page X]\n"
        f"• 💡 Why It Matters: Practical takeaways and real-world impact\n"
        f"Mode Directive: {mode_str}\n<|im_end|>\n"
        f"<|im_start|>user\n"
        f"Paper Excerpts:\n{context_str}\n\n"
        f"Summarize this paper for me in clean, natural everyday English!<|im_end|>\n"
        f"<|im_start|>assistant\n"
    )

    summary = await asyncio.to_thread(local_llm.generate, prompt=prompt, max_new_tokens=280, temperature=0.3)

    sources = []
    seen_pages = set()
    for c in chunks:
        p = c["metadata"].get("page", 1)
        if p not in seen_pages:
            snippet = c["text"][:160].strip() + ("..." if len(c["text"]) > 160 else "")
            sources.append({"page": p, "snippet": snippet})
            seen_pages.add(p)

    return {
        "doc_id": doc_id,
        "summary": summary,
        "sources": sources,
        "total_source_chunks": len(chunks),
    }


@app.post("/api/compare")
@app.post("/api/v1/compare")
async def compare_papers(request: CompareRequest):
    """Conducts a head-to-head comparative analysis between two research papers."""
    doc_a_meta = DOCUMENTS_REGISTRY.get(request.doc_id_a, {"filename": "Paper A", "doc_id": request.doc_id_a})
    doc_b_meta = DOCUMENTS_REGISTRY.get(request.doc_id_b, {"filename": "Paper B", "doc_id": request.doc_id_b})

    focus_queries = {
        "general": "problem methodology results performance benchmark conclusions",
        "benchmarks": "benchmarks accuracy quantitative evaluation speed throughput metrics results",
        "methodology": "architecture design algorithm methodology formulation model pipeline",
        "tradeoffs": "limitations comparison trade-offs baseline advantages weaknesses compute",
    }
    search_q = focus_queries.get(request.focus or "general", focus_queries["general"])

    chunks_a = query_relevant_chunks(request.doc_id_a, search_q, top_k=2)
    if not chunks_a:
        chunks_a = get_document_summary_chunks(request.doc_id_a, max_chunks=2)

    chunks_b = query_relevant_chunks(request.doc_id_b, search_q, top_k=2)
    if not chunks_b:
        chunks_b = get_document_summary_chunks(request.doc_id_b, max_chunks=2)

    if not chunks_a or not chunks_b:
        raise HTTPException(
            status_code=400,
            detail="Could not retrieve sufficient text from one or both papers to compare.",
        )

    name_a = doc_a_meta.get("filename", "Paper A")
    name_b = doc_b_meta.get("filename", "Paper B")

    context_a_str = "\n".join([f"[{name_a} - Page {c['metadata'].get('page', '?')}]: {c['text'][:650]}" for c in chunks_a])
    context_b_str = "\n".join([f"[{name_b} - Page {c['metadata'].get('page', '?')}]: {c['text'][:650]}" for c in chunks_b])

    focus_directives = {
        "general": "Provide a comprehensive side-by-side comparative matrix covering Core Objective, Methodology, Key Benchmarks, and Final Verdict.",
        "benchmarks": "Focus strictly on a head-to-head empirical comparison: accuracy metrics, datasets evaluated on, latency/throughput, and benchmark wins.",
        "methodology": "Focus strictly on technical architectural differences: algorithms used, mathematical mechanisms, parameter efficiency, and pipeline design.",
        "tradeoffs": "Focus strictly on advantages, disadvantages, computational constraints, failure modes, and when a researcher should choose each paper.",
    }
    directive = focus_directives.get(request.focus or "general", focus_directives["general"])

    prompt = (
        f"<|im_start|>system\n"
        f"You are PaperScope, a friendly and sharp research analyst like ChatGPT and Gemini! ⚖️🌟\n"
        f"Compare '{name_a}' vs '{name_b}' in clean, easy-to-understand everyday English.\n"
        f"Avoid dense academic fog. Explain differences simply and practically.\n"
        f"Directive: {directive}\n\n"
        f"Format your response with clean Markdown:\n"
        f"### 🥊 Head-to-Head Matrix: {name_a} vs {name_b}\n\n"
        f"| Dimension | {name_a} | {name_b} |\n"
        f"|---|---|---|\n"
        f"| **Core Goal** | ... | ... |\n"
        f"| **How It Works** | ... | ... |\n"
        f"| **Main Advantage** | ... | ... |\n"
        f"| **Biggest Limitation** | ... | ... |\n\n"
        f"#### 🔍 Key Takeaways\n"
        f"• **The Key Difference**: [Explained in plain, simple terms]\n"
        f"• **Performance Showdown**: [Which one performed better and why]\n"
        f"• **⚖️ Bottom-Line Recommendation**: [When to use {name_a} vs {name_b}]\n"
        f"<|im_end|>\n"
        f"<|im_start|>user\n"
        f"EXCERPTS FROM {name_a}:\n{context_a_str}\n\n"
        f"EXCERPTS FROM {name_b}:\n{context_b_str}\n\n"
        f"Compare these two papers in clear everyday English now!<|im_end|>\n"
        f"<|im_start|>assistant\n"
    )

    comparison = await asyncio.to_thread(local_llm.generate, prompt=prompt, max_new_tokens=360, temperature=0.25)

    sources_a = [{"page": c["metadata"].get("page", 1), "doc": name_a, "snippet": c["text"][:140].strip()} for c in chunks_a]
    sources_b = [{"page": c["metadata"].get("page", 1), "doc": name_b, "snippet": c["text"][:140].strip()} for c in chunks_b]

    return {
        "status": "success",
        "doc_a": doc_a_meta,
        "doc_b": doc_b_meta,
        "comparison": comparison,
        "sources_a": sources_a,
        "sources_b": sources_b,
    }


@app.post("/api/reviewer2")
@app.post("/api/v1/reviewer2")
async def reviewer2_audit(request: ReviewerRequest):
    """Simulates a ruthless, top-tier conference peer-review (NeurIPS/ICML/Nature)."""
    doc_id = request.doc_id or get_latest_doc_id()
    if not doc_id:
        raise HTTPException(
            status_code=400,
            detail="No document loaded. Please upload a research paper first.",
        )

    doc_meta = DOCUMENTS_REGISTRY.get(doc_id, {"filename": "Research Paper", "doc_id": doc_id})

    # Retrieve chunks on methodology, baselines, ablations, and limitations
    chunks = query_relevant_chunks(doc_id, "limitations baseline evaluation ablations weaknesses methodology empirical", top_k=3)
    if not chunks:
        chunks = get_document_summary_chunks(doc_id, max_chunks=3)

    context_str = "\n\n".join(
        [f"[Page {c['metadata'].get('page', '?')}]: {c['text'][:850]}" for c in chunks]
    )

    paper_name = doc_meta.get("filename", "this paper")

    prompt = (
        f"<|im_start|>system\n"
        f"You are 'Reviewer #2', a sharp, constructive, and uncompromising peer reviewer like ChatGPT and Gemini evaluating an academic paper! 🥊\n"
        f"Your goal is to stress-test the paper, uncover unstated assumptions, and expose missing baseline tests, but explain every critique in clear, natural, easy-to-understand English so anyone can follow.\n\n"
        f"Structure your critique with clean Markdown:\n"
        f"### 🥊 Reviewer #2 Peer-Review Audit: {paper_name}\n\n"
        f"| Dimension | Rating (1-5) | Plain-English Verdict |\n"
        f"|---|---|---|\n"
        f"| **Method Soundness** | ⭐⭐⭐ / 5 | ... |\n"
        f"| **Rigor & Baselines** | ⭐⭐⭐ / 5 | ... |\n"
        f"| **Reproducibility** | ⭐⭐⭐ / 5 | ... |\n\n"
        f"#### 🚨 Critical Assumptions & Blind Spots\n"
        f"• Explain 2 hidden assumptions that might fail in the real world in simple terms.\n\n"
        f"#### 🔬 Missing Baselines & Tests\n"
        f"• Highlight what tests or comparisons the authors left out.\n\n"
        f"#### 🛡️ Tough Defense Questions\n"
        f"1. [Clear, pointed defense question #1]\n"
        f"2. [Clear, pointed defense question #2]\n"
        f"3. [Clear, pointed defense question #3]\n"
        f"<|im_end|>\n"
        f"<|im_start|>user\n"
        f"Paper Excerpts:\n{context_str}\n\n"
        f"Deliver your Reviewer #2 critique in clear, natural English now!<|im_end|>\n"
        f"<|im_start|>assistant\n"
    )

    critique = await asyncio.to_thread(local_llm.generate, prompt=prompt, max_new_tokens=360, temperature=0.25)

    sources = []
    seen = set()
    for c in chunks:
        p = c["metadata"].get("page", 1)
        if p not in seen:
            snippet = c["text"][:150].strip() + ("..." if len(c["text"]) > 150 else "")
            sources.append({"page": p, "snippet": snippet})
            seen.add(p)

    return {
        "doc_id": doc_id,
        "critique": critique,
        "sources": sources,
    }


@app.post("/api/dissect_math")
@app.post("/api/v1/dissect_math")
async def dissect_math_formula(request: MathDissectRequest):
    """Dissects mathematical formulas and loss functions with variable-by-variable breakdowns."""
    doc_id = request.doc_id or get_latest_doc_id()
    if not doc_id:
        raise HTTPException(
            status_code=400,
            detail="No document loaded. Please upload a research paper first.",
        )

    search_q = request.formula or "equation loss function objective optimization formula theorem mathematical"
    chunks = query_relevant_chunks(doc_id, search_q, top_k=2)
    if not chunks:
        chunks = get_document_summary_chunks(doc_id, max_chunks=2)

    context_str = "\n\n".join(
        [f"[Page {c['metadata'].get('page', '?')}]: {c['text'][:800]}" for c in chunks]
    )

    prompt = (
        f"<|im_start|>system\n"
        f"You are PaperScope's Math & Formula Dissector like ChatGPT and Gemini! 🔬📐\n"
        f"Your mission is to make math equations simple, visual, and easy to grasp for anyone.\n"
        f"Explain variables using intuitive everyday analogies so the reader immediately understands what each part of the formula actually does.\n\n"
        f"Format your response with clean Markdown:\n"
        f"### 🔬 Formula Breakdown in Plain English\n\n"
        f"| Variable / Symbol | What It Means | Intuitive Real-World Meaning |\n"
        f"|---|---|---|\n"
        f"| **Primary Term** | ... | ... |\n"
        f"| **Scaling Factor** | ... | ... |\n"
        f"| **Target / Output** | ... | ... |\n\n"
        f"#### 💡 How It Works In Plain English\n"
        f"• **The Big Picture**: [Simple analogy explaining what the equation accomplishes]\n"
        f"• **Why This Matters**: [Why the authors designed the math this way in simple terms]\n"
        f"<|im_end|>\n"
        f"<|im_start|>user\n"
        f"{f'Formula to dissect: {request.formula}' if request.formula else 'Excerpts with equations:'}\n{context_str}\n\n"
        f"Dissect this math in clear, intuitive everyday English now!<|im_end|>\n"
        f"<|im_start|>assistant\n"
    )

    dissection = await asyncio.to_thread(local_llm.generate, prompt=prompt, max_new_tokens=340, temperature=0.25)

    sources = []
    seen = set()
    for c in chunks:
        p = c["metadata"].get("page", 1)
        if p not in seen:
            snippet = c["text"][:150].strip() + ("..." if len(c["text"]) > 150 else "")
            sources.append({"page": p, "snippet": snippet})
            seen.add(p)

    return {
        "doc_id": doc_id,
        "dissection": dissection,
        "sources": sources,
    }