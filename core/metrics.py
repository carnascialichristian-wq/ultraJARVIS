"""Lightweight metrics / snapshots for UltraJarvis."""

from __future__ import annotations

import json
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

DEFAULT_PATH = Path("workspace/metrics.jsonl")


def record(event: str, **data: Any) -> Dict[str, Any]:
    """Append a metric event to the JSONL log."""
    entry = {
        "ts": time.time(),
        "event": event,
        **data,
    }
    path = DEFAULT_PATH
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    return entry


def recent(limit: int = 20, path: Path = DEFAULT_PATH) -> List[Dict[str, Any]]:
    """Return the last N metric events."""
    if not path.exists():
        return []
    lines = path.read_text(encoding="utf-8").strip().splitlines()
    out: List[Dict[str, Any]] = []
    for line in lines[-limit:]:
        try:
            out.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    return out


def snapshot_counts(path: Path = DEFAULT_PATH) -> Dict[str, int]:
    """Count events by name."""
    counts: Dict[str, int] = {}
    for e in recent(limit=10_000, path=path):
        name = e.get("event", "unknown")
        counts[name] = counts.get(name, 0) + 1
    return counts
