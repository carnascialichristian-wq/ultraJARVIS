"""Small pure utilities."""
from __future__ import annotations

import re
from typing import Optional


def slugify(text: str, max_length: int = 48) -> str:
    """Lowercase, replace non-alnum with -, collapse dashes."""
    s = (text or "").lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    if max_length and len(s) > max_length:
        s = s[:max_length].rstrip("-")
    return s or "item"


def human_seconds(seconds: float) -> str:
    """Human-readable duration."""
    if seconds < 0:
        return f"-{human_seconds(-seconds)}"
    if seconds < 1:
        return f"{seconds:.2f}s"
    if seconds < 60:
        return f"{int(seconds)}s"
    if seconds < 3600:
        m = int(seconds // 60)
        return f"{m}m"
    if seconds < 86400:
        h = int(seconds // 3600)
        return f"{h}h"
    d = int(seconds // 86400)
    return f"{d}d"
