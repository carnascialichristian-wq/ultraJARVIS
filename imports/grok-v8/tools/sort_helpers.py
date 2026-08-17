"""Sort helpers."""
from __future__ import annotations
from typing import List, TypeVar

T = TypeVar("T")

def sorted_unique(items: List[T]) -> List[T]:
    return sorted(set(items))
