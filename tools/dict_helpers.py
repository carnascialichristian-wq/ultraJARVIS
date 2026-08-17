"""Dict helpers."""
from __future__ import annotations
from typing import Any, Dict, Optional

def safe_get(d: Dict, key: Any, default: Any = None) -> Any:
    if not isinstance(d, dict):
        return default
    return d.get(key, default)

def merge(a: Dict, b: Dict) -> Dict:
    out = dict(a or {})
    out.update(b or {})
    return out

def invert(d: Dict) -> Dict:
    return {v: k for k, v in (d or {}).items()}
