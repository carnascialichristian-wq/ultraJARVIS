"""Removeprefix/suffix helpers."""
from __future__ import annotations

def remove_prefix(text: str, prefix: str) -> str:
    s = str(text)
    p = str(prefix)
    return s[len(p):] if s.startswith(p) else s

def remove_suffix(text: str, suffix: str) -> str:
    s = str(text)
    su = str(suffix)
    return s[: -len(su)] if su and s.endswith(su) else s
