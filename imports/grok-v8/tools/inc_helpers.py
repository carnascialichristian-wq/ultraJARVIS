"""Increment/decrement helpers."""
from __future__ import annotations

def inc(n: int, step: int = 1) -> int:
    return int(n) + int(step)

def dec(n: int, step: int = 1) -> int:
    return int(n) - int(step)
