"""Isupper/islower/istitle helpers."""
from __future__ import annotations

def is_upper(text: str) -> bool:
    return str(text).isupper()

def is_lower(text: str) -> bool:
    return str(text).islower()

def is_title(text: str) -> bool:
    return str(text).istitle()
