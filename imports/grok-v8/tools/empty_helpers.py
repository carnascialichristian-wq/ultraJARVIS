"""Empty checks."""
from __future__ import annotations
from typing import Any, Collection

def is_empty(value: Any) -> bool:
    if value is None:
        return True
    if isinstance(value, (str, bytes, Collection)):
        return len(value) == 0
    return False
