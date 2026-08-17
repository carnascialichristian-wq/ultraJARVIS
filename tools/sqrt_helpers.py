"""Sqrt helpers."""
from __future__ import annotations
import math

def sqrt(n: float) -> float:
    if n < 0:
        raise ValueError("n must be >= 0")
    return math.sqrt(float(n))
