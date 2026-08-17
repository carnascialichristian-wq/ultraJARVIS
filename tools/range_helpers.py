"""Range helpers."""
from __future__ import annotations
from typing import List

def inclusive_range(start: int, end: int) -> List[int]:
    if end < start:
        return []
    return list(range(start, end + 1))
