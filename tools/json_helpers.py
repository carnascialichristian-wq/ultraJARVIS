"""JSON helpers."""
from __future__ import annotations
import json
from typing import Any

def dumps_pretty(obj: Any) -> str:
    return json.dumps(obj, indent=2, ensure_ascii=False, sort_keys=True)

def loads_safe(text: str, default: Any = None) -> Any:
    try:
        return json.loads(text)
    except Exception:
        return default
