"""Partition helpers."""
from __future__ import annotations
from typing import Tuple

def partition(text: str, sep: str) -> Tuple[str, str, str]:
    return str(text).partition(str(sep))
