"""Translate helpers."""
from __future__ import annotations

def translate_chars(text: str, frm: str, to: str) -> str:
    table = str.maketrans(frm, to)
    return str(text).translate(table)
