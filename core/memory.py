"""Persistent memory for UltraJarvis — JSONL + TF-cosine + optional neural embed."""

from __future__ import annotations

import json
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

DEFAULT_PATH = Path("workspace/memory.jsonl")


def remember(fact: str, *, tags: Optional[List[str]] = None, path: Optional[Path] = None) -> Dict[str, Any]:
    if not fact or not fact.strip():
        raise ValueError("fact required")
    path = path or DEFAULT_PATH
    entry = {"ts": time.time(), "fact": fact.strip(), "tags": tags or []}
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    return entry


def recall(query: str = "", *, limit: int = 20, tag: Optional[str] = None, path: Optional[Path] = None) -> List[Dict[str, Any]]:
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


def recall_semantic(query: str, *, limit: int = 10, tag: Optional[str] = None, path: Optional[Path] = None, min_score: float = 0.05) -> List[Dict[str, Any]]:
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


def embed_texts(texts: list[str]) -> list[list[float]] | None:
    import os
    if os.getenv("UJ_EMBEDDING", "").strip() != "1":
        return None
    try:
        from cloud_bridge import embed
        return embed(texts)
    except Exception:
        return None


def recall_semantic_embedded(query: str, *, limit: int = 10, tag: Optional[str] = None, path: Optional[Path] = None) -> List[Dict[str, Any]]:
    path = path or DEFAULT_PATH
    if not path.exists() or not (query or "").strip():
        return []
    facts = []
    for line in path.read_text(encoding="utf-8").splitlines():
        try:
            e = json.loads(line)
        except json.JSONDecodeError:
            continue
        if tag and tag not in (e.get("tags") or []):
            continue
        facts.append(e)
    if not facts:
        return []
    vectors = embed_texts([query] + [f.get("fact") or "" for f in facts])
    if not vectors or len(vectors) != len(facts) + 1:
        return recall_semantic(query, limit=limit, tag=tag, path=path)
    qv = vectors[0]
    scored = []
    for e, v in zip(facts, vectors[1:]):
        dot = sum(a * b for a, b in zip(qv, v))
        na = sum(a * a for a in qv) ** 0.5
        nb = sum(b * b for b in v) ** 0.5
        score = (dot / (na * nb)) if na and nb else 0.0
        item = dict(e)
        item["score"] = round(score, 4)
        scored.append((score, item))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [e for _, e in scored[:limit]]
