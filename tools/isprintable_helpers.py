"""Isprintable helper."""
from __future__ import annotations

def is_printable(text: str) -> bool:
    return str(text).isprintable()
