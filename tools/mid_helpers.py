"""Substring helpers."""
from __future__ import annotations

def mid(text: str, start: int, length: int | None = None) -> str:
    s = str(text)
    if length is None:
        return s[int(start):]
    return s[int(start): int(start) + int(length)]
