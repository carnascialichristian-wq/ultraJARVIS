"""Split helpers."""
from __future__ import annotations
from typing import List

def split(text: str, sep: str | None = None) -> List[str]:
    return str(text).split(sep)
