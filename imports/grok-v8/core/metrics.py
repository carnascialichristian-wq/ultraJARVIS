"""JSONL metrics for UltraJarvis."""
from __future__ import annotations

import json
import time
from pathlib import Path
from typing import Any, Optional

ROOT = Path(__file__).resolve().parent.parent
METRICS_PATH = ROOT / "workspace" / "metrics.jsonl"


def record(event: str, **kwargs: Any) -> None:
    """Append a metric event as one JSON line."""
    METRICS_PATH.parent.mkdir(parents=True, exist_ok=True)
    row = {"ts": time.time(), "event": event, **kwargs}
    with METRICS_PATH.open("a", encoding="utf-8") as f:
        f.write(json.dumps(row, ensure_ascii=False) + "\n")


def recent(limit: int = 50, event: Optional[str] = None) -> list[dict]:
    if not METRICS_PATH.exists():
        return []
    rows: list[dict] = []
    with METRICS_PATH.open(encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except json.JSONDecodeError:
                continue
            if event and obj.get("event") != event:
                continue
            rows.append(obj)
    return rows[-limit:]
