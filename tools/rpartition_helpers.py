"""Rpartition helper."""
from __future__ import annotations
from typing import Tuple

def rpartition(text: str, sep: str) -> Tuple[str, str, str]:
    return str(text).rpartition(str(sep))
