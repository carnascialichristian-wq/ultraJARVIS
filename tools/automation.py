"""Automation helpers (clipboard / type) for UltraJarvis."""

from __future__ import annotations

import os
import shutil
import subprocess
from typing import List

_HISTORY: List[str] = []


def _clipboard_set(text: str) -> bool:
    if shutil.which("xclip"):
        p = subprocess.run(["xclip", "-selection", "clipboard"], input=text.encode("utf-8"), capture_output=True, timeout=5)
        return p.returncode == 0
    if shutil.which("xsel"):
        p = subprocess.run(["xsel", "--clipboard", "--input"], input=text.encode("utf-8"), capture_output=True, timeout=5)
        return p.returncode == 0
    return False


def paste_text(text: str, *, real: bool | None = None) -> str:
    if not text:
        raise ValueError("text required")
    do_real = real if real is not None else os.environ.get("UJ_AUTO_REAL", "").strip() == "1"
    if do_real and _clipboard_set(text):
        msg = f"Clipboard set ({len(text)} chars)"
    else:
        msg = f"[dry-run] Would paste {len(text)} characters"
    _HISTORY.append(msg)
    return msg


def type_text(text: str, *, delay_ms: int = 0, real: bool | None = None) -> str:
    if not text:
        raise ValueError("text required")
    do_real = real if real is not None else os.environ.get("UJ_AUTO_REAL", "").strip() == "1"
    if do_real and shutil.which("xdotool"):
        subprocess.run(["xdotool", "type", "--delay", str(max(0, int(delay_ms))), text], capture_output=True, timeout=30, check=False)
        msg = f"Typed {len(text)} characters via xdotool"
    else:
        msg = f"[dry-run] Would type {len(text)} characters (delay={delay_ms}ms)"
    _HISTORY.append(msg)
    return msg


def history() -> List[str]:
    return list(_HISTORY)


def clear_history() -> None:
    _HISTORY.clear()
