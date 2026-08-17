"""Sign helpers."""
from __future__ import annotations

def sign(n: float) -> int:
    if n > 0:
        return 1
    if n < 0:
        return -1
    return 0
