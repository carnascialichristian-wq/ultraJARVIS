"""Modulo helpers."""
from __future__ import annotations

def mod(a: int, b: int) -> int:
    if b == 0:
        raise ValueError("modulo by zero")
    return int(a) % int(b)
