"""Sum helpers."""
from __future__ import annotations
from typing import Iterable

def total(values: Iterable[float]) -> float:
    return float(sum(values))
