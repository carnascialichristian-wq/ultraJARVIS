"""Monetization prep – usage metering hooks (no billing provider yet)."""

from __future__ import annotations

import json
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

DEFAULT_USAGE_PATH = Path("workspace/usage.jsonl")


def record_usage(
    event: str,
    *,
    units: float = 1.0,
    meta: Optional[Dict[str, Any]] = None,
    path: Optional[Path] = None,
) -> Dict[str, Any]:
    """Append a usage event for later billing aggregation."""
    if not event or not event.strip():
        raise ValueError("event required")
    path = path or DEFAULT_USAGE_PATH
    entry = {
        "ts": time.time(),
        "event": event.strip(),
        "units": float(units),
        "meta": meta or {},
    }
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    return entry


def summarize_usage(
    *,
    path: Optional[Path] = None,
    since_ts: float = 0.0,
) -> Dict[str, Any]:
    """Aggregate usage events by event name."""
    path = path or DEFAULT_USAGE_PATH
    totals: Dict[str, float] = {}
    count = 0
    if not path.exists():
        return {"events": totals, "count": 0}
    for line in path.read_text(encoding="utf-8").splitlines():
        try:
            e = json.loads(line)
        except json.JSONDecodeError:
            continue
        if float(e.get("ts") or 0) < since_ts:
            continue
        name = e.get("event") or "unknown"
        totals[name] = totals.get(name, 0.0) + float(e.get("units") or 0)
        count += 1
    return {"events": totals, "count": count}


def plan_tiers() -> List[Dict[str, Any]]:
    """Placeholder product tiers for future monetization."""
    return [
        {"id": "free", "jobs_per_day": 20, "llm": False, "price_usd": 0},
        {"id": "pro", "jobs_per_day": 500, "llm": True, "price_usd": 29},
        {"id": "team", "jobs_per_day": 5000, "llm": True, "price_usd": 99},
    ]
