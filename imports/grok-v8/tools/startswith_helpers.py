"""Startswith/endswith helpers."""
from __future__ import annotations

def starts_with(text: str, prefix: str) -> bool:
    return str(text).startswith(str(prefix))

def ends_with(text: str, suffix: str) -> bool:
    return str(text).endswith(str(suffix))
