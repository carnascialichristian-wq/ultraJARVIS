"""Min/max helpers."""
from __future__ import annotations
from typing import Iterable, TypeVar

T = TypeVar("T")

def safe_min(items: Iterable[T], default: T | None = None) -> T | None:
    it = list(items)
    return min(it) if it else default

def safe_max(items: Iterable[T], default: T | None = None) -> T | None:
    it = list(items)
    return max(it) if it else default
