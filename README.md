# PaperScope 🔬

**100% Local, Self-Hosted Research Paper Summarizer & Conversational Assistant**

PaperScope is an offline AI research assistant built from the ground up to parse academic papers, display them side-by-side in an interactive viewer, extract structured sections, index them in a local vector database, and perform grounded Q&A and comprehensive summarization with clickable page citations — **without calling any cloud APIs (OpenAI, Gemini, Groq) and without external daemons like Ollama**.

---

## 🏗️ Architecture

```
Research Paper (PDF)
         │
         ├───► 1. Inline PDF Viewer (Local Browser Canvas / Frame)
         │        • Split-screen side-by-side view with chat
         │        • Interactive Page-Jumping on citation click
         │
         └───► 2. Local Text Extraction (pypdf) 
                  • Page-aware sliding-window chunking
                  │
                  ▼
               3. Local Embeddings & Vector Store (ChromaDB)
                  • sentence-transformers (all-MiniLM-L6-v2)
                  • Offline on disk in backend/chroma_db
                  │
                  ▼
               4. 100% Local ONNX Inference Engine (Qwen2.5-1.5B)
                  • Multi-threaded AVX2 local CPU execution
                  • Strictly private & offline
                  │
                  ▼
               5. Next.js Research UI (frontend/src/app/page.tsx)
                  • Executive Summaries & Citations
                  • Click citation pill -> PDF jumps to that exact page
```

---

## 🚀 How to Run

### 1. Start the Local Backend
Double-click `run_backend.bat` or run:
```powershell
.\run_backend.bat
# Or manually:
.\.venv312\Scripts\activate
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI server will be active at `http://127.0.0.1:8000`.

### 2. Start the Frontend UI
Double-click `run_frontend.bat` or run:
```powershell
.\run_frontend.bat
# Or manually:
cd frontend
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## ✨ Features

- **Side-by-Side Document View**: Upload a PDF and read it alongside your conversation with the local AI.
- **Clickable Citations**: Every answer includes page citation buttons in the lower section. Clicking `📄 Page X` automatically navigates the PDF viewer to that exact page.
- **Executive Summaries**: Click `⚡ Summarize Paper` to get a structured breakdown (Problem, Methodology, Key Findings, Takeaways).
- **Zero Cloud APIs**: No API keys, no monthly fees, no network requests to external servers.
- **No Ollama / Docker**: Runs directly inside your standard Python virtual environment.
