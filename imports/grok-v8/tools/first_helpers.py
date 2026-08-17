"""First/last helpers."""
from __future__ import annotations
from typing import Iterable, TypeVar, Optional

T = TypeVar("T")

def first(items: Iterable[T], default: Optional[T] = None) -> Optional[T]:
    for x in items:
        return x
    return default

def last(items: Iterable[T], default: Optional[T] = None) -> Optional[T]:
    result = default
    for x in items:
        result = x
    return result
