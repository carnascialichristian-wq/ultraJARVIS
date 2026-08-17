"""List helpers."""
from __future__ import annotations
from typing import Iterable, List, TypeVar

T = TypeVar("T")

def chunked(items: List[T], size: int) -> List[List[T]]:
    if size <= 0:
        raise ValueError("size must be > 0")
    return [items[i:i+size] for i in range(0, len(items), size)]

def unique_preserve(items: Iterable[T]) -> List[T]:
    seen = set()
    out: List[T] = []
    for x in items:
        if x in seen:
            continue
        seen.add(x)
        out.append(x)
    return out
