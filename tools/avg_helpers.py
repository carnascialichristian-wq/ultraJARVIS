"""Average helpers."""
from __future__ import annotations
from typing import Iterable

def mean(values: Iterable[float]) -> float:
    xs = list(values)
    if not xs:
        return 0.0
    return sum(xs) / len(xs)
