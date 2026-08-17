"""Text statistics."""
from __future__ import annotations

def word_count(text: str) -> int:
    return len(text.split())

def char_count(text: str, *, include_spaces: bool = True) -> int:
    return len(text) if include_spaces else len(text.replace(" ", ""))
