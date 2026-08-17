"""Rounding helpers."""
from __future__ import annotations

def round_to(value: float, places: int = 0) -> float:
    return round(float(value), int(places))
