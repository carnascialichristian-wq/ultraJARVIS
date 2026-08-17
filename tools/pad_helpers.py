"""Pad helpers."""
from __future__ import annotations

def pad_left(text: str, width: int, fill: str = " ") -> str:
    return str(text).rjust(int(width), fill[:1] or " ")
