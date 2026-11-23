import os
from typing import Dict, List, Optional
import chromadb

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
CHROMA_DB_DIR = os.path.join(BASE_DIR, "backend", "chroma_db")

_client = None
_collection = None
_latest_doc_id = None


def get_collection():
    """Lazy loader for ChromaDB collection and sentence-transformer embeddings."""
    global _client, _collection
    if _collection is None:
        from chromadb.utils import embedding_functions

        embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        _client = chromadb.PersistentClient(path=CHROMA_DB_DIR)
        _collection = _client.get_or_create_collection(
            name="paperscope_docs", embedding_function=embedding_fn
        )
    return _collection


def store_chunks(doc_id: str, chunks: List[Dict[str, any]]):
    """Indexes text chunks into ChromaDB with metadata."""
    global _latest_doc_id
    collection = get_collection()
    documents = [c["text"] for c in chunks]
    metadatas = [
        {"doc_id": doc_id, "page": c["metadata"]["page"], "chunk_index": i}
        for i, c in enumerate(chunks)
    ]
    ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]

    collection.add(documents=documents, metadatas=metadatas, ids=ids)
    _latest_doc_id = doc_id


def get_latest_doc_id() -> Optional[str]:
    return _latest_doc_id


def set_latest_doc_id(doc_id: Optional[str] = None):
    global _latest_doc_id
    _latest_doc_id = doc_id


def query_relevant_chunks(
    doc_id: Optional[str], query: str, top_k: int = 4
) -> List[Dict[str, any]]:
    """Retrieves top matching chunks for a user query filtered by doc_id."""
    collection = get_collection()
    effective_doc_id = doc_id or _latest_doc_id

    where_filter = {"doc_id": effective_doc_id} if effective_doc_id else None

    kwargs = {"query_texts": [query], "n_results": top_k}
    if where_filter:
        kwargs["where"] = where_filter

    results = collection.query(**kwargs)

    retrieved = []
    if results and "documents" in results and results["documents"] and results["documents"][0]:
        for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
            retrieved.append({"text": doc, "metadata": meta})

    return retrieved


def get_document_summary_chunks(doc_id: Optional[str], max_chunks: int = 5) -> List[Dict[str, any]]:
    """Fetches key chunks (abstract, introduction, conclusion) to build a paper summary."""
    effective_doc_id = doc_id or _latest_doc_id
    if not effective_doc_id:
        return []

    collection = get_collection()
    records = collection.get(
        where={"doc_id": effective_doc_id},
        include=["documents", "metadatas"]
    )

    if not records or not records["documents"]:
        return []

    # Sort chunks by chunk_index
    indexed_chunks = []
    for doc, meta in zip(records["documents"], records["metadatas"]):
        indexed_chunks.append({
            "text": doc,
            "metadata": meta,
            "index": meta.get("chunk_index", 0)
        })
    indexed_chunks.sort(key=lambda x: x["index"])

    if len(indexed_chunks) <= max_chunks:
        return [{"text": c["text"], "metadata": c["metadata"]} for c in indexed_chunks]

    # Sample beginning (abstract/intro) and end (conclusion)
    head_count = max(2, max_chunks - 2)
    tail_count = max_chunks - head_count

    selected = indexed_chunks[:head_count] + indexed_chunks[-tail_count:]
    return [{"text": c["text"], "metadata": c["metadata"]} for c in selected]