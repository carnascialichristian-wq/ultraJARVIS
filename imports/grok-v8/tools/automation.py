"""Automation stubs for UltraJarvis (paste / keyboard helpers).

All operations are no-ops or dry-run only.
"""

from __future__ import annotations

from typing import List

_HISTORY: List[str] = []


def paste_text(text: str) -> str:
    if not text:
        raise ValueError("text required")
    msg = f"[dry-run] Would paste {len(text)} characters"
    _HISTORY.append(msg)
    return msg


def type_text(text: str, *, delay_ms: int = 0) -> str:
    if not text:
        raise ValueError("text required")
    msg = f"[dry-run] Would type {len(text)} characters (delay={delay_ms}ms)"
    _HISTORY.append(msg)
    return msg


def history() -> List[str]:
    return list(_HISTORY)


def clear_history() -> None:
    _HISTORY.clear()
