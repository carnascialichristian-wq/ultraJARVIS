"""Rsplit helper."""
from __future__ import annotations
from typing import List

def rsplit(text: str, sep: str | None = None, maxsplit: int = -1) -> List[str]:
    return str(text).rsplit(sep, maxsplit)
