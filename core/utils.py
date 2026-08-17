"""Utility helpers for UltraJarvis."""

from __future__ import annotations

import re
import time
from typing import Union


def slugify(text: str, max_length: int = 64) -> str:
    if not text:
        return "untitled"
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "_", text)
    text = re.sub(r"_+", "_", text).strip("_")
    if not text:
        return "untitled"
    return text[:max_length]


def human_seconds(seconds: Union[int, float]) -> str:
    if seconds < 0:
        return "0s"
    seconds = float(seconds)
    if seconds < 60:
        if seconds == int(seconds):
            return f"{int(seconds)}s"
        return f"{seconds:.1f}s"
    days = int(seconds // 86400)
    hours = int((seconds % 86400) // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    parts: list[str] = []
    if days:
        parts.append(f"{days}d")
    if hours or days:
        parts.append(f"{hours}h")
    if minutes or hours or days:
        parts.append(f"{minutes}m")
    if secs or not parts:
        parts.append(f"{secs}s")
    return " ".join(parts)


def now_ts() -> float:
    return time.time()
