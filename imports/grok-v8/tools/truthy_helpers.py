"""Truthy helpers."""
from __future__ import annotations
from typing import Any

def is_truthy(value: Any) -> bool:
    return bool(value)
