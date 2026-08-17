"""Repeat helpers."""
from __future__ import annotations

def repeat(text: str, times: int) -> str:
    return str(text) * max(0, int(times))
