"""Ord/chr helpers."""
from __future__ import annotations

def char_ord(ch: str) -> int:
    return ord(str(ch)[0])

def char_chr(code: int) -> str:
    return chr(int(code))
