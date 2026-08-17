"""Division helpers."""
from __future__ import annotations

def safe_div(a: float, b: float, default: float = 0.0) -> float:
    if b == 0:
        return default
    return float(a) / float(b)
