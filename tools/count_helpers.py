"""Count helpers."""
from __future__ import annotations
from typing import Iterable, Any

def count_of(items: Iterable[Any], value: Any) -> int:
    return sum(1 for x in items if x == value)
