"""Expandtabs helper."""
from __future__ import annotations

def expandtabs(text: str, tabsize: int = 8) -> str:
    return str(text).expandtabs(int(tabsize))
