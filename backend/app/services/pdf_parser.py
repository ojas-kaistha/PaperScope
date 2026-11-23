import io
import os
import re
from typing import Dict, List, Any, Optional

_ocr_engine = None

def get_ocr_engine():
    """Lazily loads local ONNX-based OCR engine for scanned papers."""
    global _ocr_engine
    if _ocr_engine is None:
        try:
            from rapidocr_onnxruntime import RapidOCR
            _ocr_engine = RapidOCR()
            print("[PaperScope OCR] Pure local ONNX OCR engine initialized.")
        except Exception as e:
            # If rapidocr is not installed or loading, mark as unavailable
            print(f"[PaperScope OCR] OCR engine initialization note: {e}")
            _ocr_engine = False
    return _ocr_engine if _ocr_engine is not False else None


def extract_text_from_pdf(pdf_bytes: bytes) -> List[Dict[str, Any]]:
    """
    Extracts text page-by-page from raw PDF bytes using PyMuPDF.
    If the document has digital text layers, extracts instantaneously in milliseconds.
    If and only if the document is completely scanned/image-only (no digital text),
    runs multi-threaded local OCR fallback with an intelligent budget.
    """
    pages_data = []

    try:
        import pymupdf
        doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
        total_pages = len(doc)

        # Pass 1: Instant digital text extraction across all pages
        raw_pages = []
        total_digital_chars = 0
        for page_num in range(total_pages):
            page = doc[page_num]
            text = (page.get_text() or "").strip()
            raw_pages.append(text)
            total_digital_chars += len(text)

        # If the document contains digital text (>= 50 chars total across pages):
        # It is a digital PDF! Use the extracted digital text directly and instantaneously.
        # DO NOT run slow neural OCR on empty/figure pages!
        if total_digital_chars >= 50:
            print(f"[PaperScope Parser] Digital text layer detected ({total_digital_chars} chars across {total_pages} pages). Instant extraction complete.")
            for page_num, text in enumerate(raw_pages, start=1):
                if text:
                    pages_data.append({"page": page_num, "text": text})
            if pages_data:
                return pages_data

        # Pass 2: Scanned / image-only PDF fallback (only if entire document lacks digital text)
        print(f"[PaperScope Parser] Scanned/image-only document detected (only {total_digital_chars} digital chars). Initiating fast parallel OCR...")
        ocr = get_ocr_engine()
        if ocr:
            import concurrent.futures

            # Prioritize key semantic pages to finish in ~10-15 seconds and prevent network/tunnel timeouts:
            # - For small documents (<= 6 pages): OCR all pages.
            # - For larger documents (> 6 pages): OCR top 5 pages (Abstract, Intro, Methods) + last page (Conclusions).
            if total_pages <= 6:
                target_pages = list(range(total_pages))
            else:
                target_pages = list(range(min(5, total_pages)))
                if total_pages > 5:
                    target_pages.append(total_pages - 1)

            # Pre-render images on main thread at dpi=72 (rapid neural inference)
            page_images = []
            for p_num in target_pages:
                try:
                    pix = doc[p_num].get_pixmap(dpi=72)
                    page_images.append((p_num + 1, pix.tobytes("png")))
                except Exception as e:
                    print(f"[PaperScope Pixmap] Page {p_num + 1} render note: {e}")

            def ocr_single_image(item) -> Optional[Dict[str, Any]]:
                page_idx, png_bytes = item
                try:
                    result, _ = ocr(png_bytes)
                    if result:
                        lines = [line[1] for line in result if line and len(line) > 1 and line[1]]
                        ocr_text = "\n".join(lines).strip()
                        if ocr_text:
                            return {"page": page_idx, "text": ocr_text}
                except Exception as err:
                    print(f"[PaperScope OCR] Page {page_idx} OCR warning: {err}")
                return None

            max_workers = min(4, os.cpu_count() or 2)
            with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
                ocr_results = list(executor.map(ocr_single_image, page_images))

            for res in ocr_results:
                if res:
                    pages_data.append(res)

            print(f"[PaperScope OCR] Parallel OCR extracted text from {len(pages_data)} pages successfully.")

        if pages_data:
            return pages_data

    except Exception as e:
        print(f"[PaperScope] PyMuPDF extraction note: {e}, falling back to pypdf...")

    # Fallback to pypdf if PyMuPDF encountered an unexpected issue
    try:
        from pypdf import PdfReader
        reader = PdfReader(io.BytesIO(pdf_bytes))
        for page_num, page in enumerate(reader.pages, start=1):
            text = page.extract_text() or ""
            if text.strip():
                pages_data.append({"page": page_num, "text": text.strip()})
    except Exception as fallback_err:
        print(f"[PaperScope] pypdf fallback error: {fallback_err}")

    return pages_data


def chunk_text(
    pages_data: List[Dict[str, Any]], chunk_size: int = 450, overlap: int = 50
) -> List[Dict[str, Any]]:
    """Splits page text into overlapping chunks while tracking page numbers."""
    chunks = []

    for page in pages_data:
        text = page["text"]
        words = text.split()

        start = 0
        while start < len(words):
            end = start + chunk_size
            chunk_str = " ".join(words[start:end])

            chunks.append(
                {"text": chunk_str, "metadata": {"page": page["page"]}}
            )

            if end >= len(words):
                break
            start += chunk_size - overlap

    return chunks