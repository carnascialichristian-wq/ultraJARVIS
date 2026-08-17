"""Zfill helpers."""
from __future__ import annotations

def zfill(text: str, width: int) -> str:
    return str(text).zfill(int(width))
