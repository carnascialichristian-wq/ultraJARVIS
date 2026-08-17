"""Format helpers."""
from __future__ import annotations

def format_map(template: str, **kwargs: object) -> str:
    return str(template).format(**kwargs)
