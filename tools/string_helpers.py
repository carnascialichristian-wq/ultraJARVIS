"""String helpers."""

from __future__ import annotations


def slugify_basic(text: str) -> str:
    import re
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "_", text)
    return text.strip("_") or "item"


def reverse_words(text: str) -> str:
    return " ".join(reversed(text.split()))
