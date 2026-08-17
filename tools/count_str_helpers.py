"""String count helpers."""
from __future__ import annotations

def count_substr(text: str, sub: str) -> int:
    return str(text).count(str(sub))
