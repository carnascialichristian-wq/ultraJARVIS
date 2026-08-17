"""Percentage helpers."""
from __future__ import annotations

def percent(part: float, whole: float) -> float:
    if whole == 0:
        return 0.0
    return 100.0 * float(part) / float(whole)
