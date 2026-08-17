"""Encode helpers."""
from __future__ import annotations

def to_bytes(text: str, encoding: str = "utf-8") -> bytes:
    return str(text).encode(encoding)

def from_bytes(data: bytes, encoding: str = "utf-8") -> str:
    return bytes(data).decode(encoding)
