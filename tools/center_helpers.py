"""Center helpers."""
from __future__ import annotations

def center(text: str, width: int, fill: str = " ") -> str:
    return str(text).center(int(width), (fill or " ")[:1])
