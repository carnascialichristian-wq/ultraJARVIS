"""Simple persistent memory for UltraJarvis (Phase 2 starter).

Stores short facts as JSONL. Not a vector store – just durable notes.
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
    """
    Return recent facts, optionally filtered by substring or tag.
    """
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
