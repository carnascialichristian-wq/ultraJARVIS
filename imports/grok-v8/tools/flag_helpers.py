"""Flag / bit helpers."""
from __future__ import annotations

def has_flag(value: int, flag: int) -> bool:
    return (int(value) & int(flag)) != 0
