"""Join helpers."""
from __future__ import annotations
from typing import Iterable

def join(parts: Iterable[str], sep: str = " ") -> str:
    return str(sep).join(str(p) for p in parts)
