"""Simple persistent memory for UltraJarvis (Phase 2 starter).

Stores short facts as JSONL. Includes lightweight TF-cosine semantic recall.
"""

from __future__ import annotations

import json
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

DEFAULT_PATH = Path("workspace/memory.jsonl")


def remember(fact: str, *, tags: Optional[List[str]] = None, path: Optional[Path] = None) -> Dict[str, Any]:
    """Append a fact to memory."""
    if not fact or not fact.strip():
        raise ValueError("fact required")
    path = path or DEFAULT_PATH
    entry = {
        "ts": time.time(),
        "fact": fact.strip(),
        "tags": tags or [],
    }
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    return entry


def recall(
    query: str = "",
    *,
    limit: int = 20,
    tag: Optional[str] = None,
    path: Optional[Path] = None,
) -> List[Dict[str, Any]]:
    """Return recent facts, optionally filtered by substring or tag."""
    path = path or DEFAULT_PATH
    if not path.exists():
        return []
    results: List[Dict[str, Any]] = []
    q = query.lower().strip()
    for line in path.read_text(encoding="utf-8").splitlines():
        try:
            e = json.loads(line)
        except json.JSONDecodeError:
            continue
        if tag and tag not in (e.get("tags") or []):
            continue
        if q and q not in (e.get("fact") or "").lower():
            continue
        results.append(e)
    return results[-limit:]


def clear(path: Path = DEFAULT_PATH) -> None:
    if path.exists():
        path.unlink()


def list_tags(path: Optional[Path] = None) -> Dict[str, int]:
    """Return a count of facts per tag (most recent file state)."""
    path = path or DEFAULT_PATH
    counts: Dict[str, int] = {}
    if not path.exists():
        return counts
    for line in path.read_text(encoding="utf-8").splitlines():
        try:
            e = json.loads(line)
        except json.JSONDecodeError:
            continue
        for t in e.get("tags") or []:
            counts[t] = counts.get(t, 0) + 1
    return counts


def _tokenize(text: str) -> list[str]:
    import re
    return [t for t in re.findall(r"[a-z0-9_]{2,}", (text or "").lower()) if t]


def _tf(tokens: list[str]) -> dict[str, float]:
    if not tokens:
        return {}
    n = len(tokens)
    counts: dict[str, int] = {}
    for t in tokens:
        counts[t] = counts.get(t, 0) + 1
    return {t: c / n for t, c in counts.items()}


def _cosine(a: dict[str, float], b: dict[str, float]) -> float:
    if not a or not b:
        return 0.0
    keys = set(a) | set(b)
    dot = sum(a.get(k, 0.0) * b.get(k, 0.0) for k in keys)
    na = sum(v * v for v in a.values()) ** 0.5
    nb = sum(v * v for v in b.values()) ** 0.5
    if na == 0 or nb == 0:
        return 0.0
    return dot / (na * nb)


def recall_semantic(
    query: str,
    *,
    limit: int = 10,
    tag: Optional[str] = None,
    path: Optional[Path] = None,
    min_score: float = 0.05,
) -> List[Dict[str, Any]]:
    """
    Lightweight embedding-style recall using bag-of-words TF cosine similarity.

    No external model required. Optional upgrade path later via UJ_EMBEDDING.
    """
    path = path or DEFAULT_PATH
    if not path.exists() or not (query or "").strip():
        return []
    q_vec = _tf(_tokenize(query))
    scored: list[tuple[float, Dict[str, Any]]] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        try:
            e = json.loads(line)
        except json.JSONDecodeError:
            continue
        if tag and tag not in (e.get("tags") or []):
            continue
        fact = e.get("fact") or ""
        score = _cosine(q_vec, _tf(_tokenize(fact)))
        if score >= min_score:
            item = dict(e)
            item["score"] = round(score, 4)
            scored.append((score, item))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [e for _, e in scored[:limit]]
