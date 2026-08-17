"""List helpers."""
from __future__ import annotations
from typing import Iterable, List, TypeVar, Any, Optional

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

def flatten(nested: Iterable[Iterable[T]]) -> List[T]:
    """Flatten one level of nested iterables."""
    out: List[T] = []
    for sub in nested:
        out.extend(list(sub))
    return out

def safe_get(items: List[T], index: int, default: Any = None) -> Any:
    """List index with default on out-of-range (negative from end still works if in range)."""
    try:
        if index < 0:
            index = len(items) + index
        if index < 0 or index >= len(items):
            return default
        return items[index]
    except Exception:
        return default
