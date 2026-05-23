import json
from pathlib import Path
from typing import Any

import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

MODEL_NAME = "all-MiniLM-L6-v2"

_model: SentenceTransformer | None = None
_index: faiss.Index | None = None
_ordered_sections: list[dict[str, Any]] | None = None


def _base_dirs() -> tuple[Path, Path, Path, Path]:
    backend_dir = Path(__file__).resolve().parent
    knowledge_dir = backend_dir / "knowledge"
    data_path = knowledge_dir / "bnss_data.json"
    index_dir = knowledge_dir / "faiss_index"
    return knowledge_dir, data_path, index_dir, backend_dir


def _load_sections(data_path: Path) -> list[dict[str, Any]]:
    if not data_path.exists():
        raise FileNotFoundError(f"Knowledge file not found: {data_path}")

    with data_path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    if not isinstance(data, list):
        raise ValueError("bnss_data.json must be a JSON array")

    sections: list[dict[str, Any]] = []
    for item in data:
        if isinstance(item, dict):
            sections.append(item)
    return sections


def _ensure_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer(MODEL_NAME)
    return _model


def _combined_text(section: dict[str, Any]) -> str:
    title = str(section.get("title", "")).strip()
    text = str(section.get("text", "")).strip()
    if title and text:
        return f"{title}\n{text}"
    return title or text


def _index_paths(index_dir: Path) -> tuple[Path, Path]:
    return index_dir / "index.faiss", index_dir / "meta.json"


def _load_existing_index(index_dir: Path, data_path: Path) -> tuple[faiss.Index, list[dict[str, Any]]] | None:
    index_path, meta_path = _index_paths(index_dir)
    if not index_path.exists() or not meta_path.exists():
        return None

    with meta_path.open("r", encoding="utf-8") as f:
        meta = json.load(f)

    ids = meta.get("ids")
    if not isinstance(ids, list) or not all(isinstance(x, str) for x in ids):
        return None

    sections = _load_sections(data_path)
    by_id: dict[str, dict[str, Any]] = {}
    for s in sections:
        sid = s.get("id")
        if isinstance(sid, str) and sid:
            by_id[sid] = s

    ordered: list[dict[str, Any]] = []
    for sid in ids:
        item = by_id.get(sid)
        if item is not None:
            ordered.append(item)

    if len(ordered) != len(ids) or len(ordered) == 0:
        return None

    index = faiss.read_index(str(index_path))
    return index, ordered


def build_index() -> None:
    global _index, _ordered_sections

    knowledge_dir, data_path, index_dir, _ = _base_dirs()
    index_dir.mkdir(parents=True, exist_ok=True)

    existing = _load_existing_index(index_dir, data_path)
    if existing is not None:
        _index, _ordered_sections = existing
        return

    sections = _load_sections(data_path)
    texts: list[str] = []
    ids: list[str] = []
    ordered_sections: list[dict[str, Any]] = []

    for s in sections:
        sid = s.get("id")
        combined = _combined_text(s)
        if isinstance(sid, str) and sid and combined:
            ids.append(sid)
            texts.append(combined)
            ordered_sections.append(s)

    if not texts:
        raise ValueError(f"No valid sections found in {data_path}")

    model = _ensure_model()
    batch_size = 64
    embeddings: list[np.ndarray] = []

    print(f"Building FAISS index with {len(texts)} sections using {MODEL_NAME}...")
    for start in range(0, len(texts), batch_size):
        end = min(start + batch_size, len(texts))
        print(f"Embedding progress: {end}/{len(texts)}")
        batch = model.encode(
            texts[start:end],
            batch_size=min(32, end - start),
            convert_to_numpy=True,
            normalize_embeddings=True,
            show_progress_bar=False,
        )
        embeddings.append(batch.astype(np.float32, copy=False))

    vectors = np.vstack(embeddings)
    dim = int(vectors.shape[1])
    index = faiss.IndexFlatIP(dim)
    index.add(vectors)

    index_path, meta_path = _index_paths(index_dir)
    faiss.write_index(index, str(index_path))
    with meta_path.open("w", encoding="utf-8") as f:
        json.dump({"model": MODEL_NAME, "ids": ids}, f, ensure_ascii=False, indent=2)

    _index = index
    _ordered_sections = ordered_sections


def _ensure_ready() -> tuple[faiss.Index, list[dict[str, Any]], SentenceTransformer]:
    if _index is None or _ordered_sections is None:
        build_index()
    assert _index is not None
    assert _ordered_sections is not None
    return _index, _ordered_sections, _ensure_model()


def _search(query: str, k: int) -> tuple[list[int], list[float]]:
    index, sections, model = _ensure_ready()
    if not query.strip():
        return [], []

    q_vec = model.encode(
        [query],
        convert_to_numpy=True,
        normalize_embeddings=True,
        show_progress_bar=False,
    ).astype(np.float32, copy=False)

    k = max(1, min(int(k), len(sections)))
    scores, idx = index.search(q_vec, k)

    indices = [int(i) for i in idx[0].tolist() if int(i) >= 0]
    sims = [float(s) for s in scores[0].tolist()[: len(indices)]]
    return indices, sims


def retrieve(query: str, k: int = 4) -> str:
    indices, _ = _search(query, k)
    if not indices:
        return "No matching sections found."

    _, sections, _ = _ensure_ready()
    chunks: list[str] = []
    for i in indices:
        s = sections[i]
        section_number = str(s.get("section_number", "")).strip()
        title = str(s.get("title", "")).strip()
        text = str(s.get("text", "")).strip()
        remedy = str(s.get("remedy", "")).strip()
        chunks.append(f"Section {section_number} - {title}:\n{text}\nRemedy: {remedy}\n")
    return "\n".join(chunks).strip() + "\n"


def get_categories(query: str) -> str:
    indices, scores = _search(query, 8)
    if not indices:
        return "unknown"

    _, sections, _ = _ensure_ready()
    weights: dict[str, float] = {}
    for i, score in zip(indices, scores):
        cat = sections[i].get("category")
        if not isinstance(cat, str) or not cat.strip():
            continue
        weights[cat] = weights.get(cat, 0.0) + float(score)

    if not weights:
        return "unknown"

    return max(weights.items(), key=lambda x: x[1])[0]
