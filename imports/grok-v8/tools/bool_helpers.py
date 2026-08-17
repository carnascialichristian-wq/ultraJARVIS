"""Boolean helpers."""
from __future__ import annotations

def xor(a: bool, b: bool) -> bool:
    return bool(a) ^ bool(b)

def all_true(*values: bool) -> bool:
    return all(values)
