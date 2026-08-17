"""Replace helpers."""
from __future__ import annotations

def replace(text: str, old: str, new: str) -> str:
    return str(text).replace(str(old), str(new))
