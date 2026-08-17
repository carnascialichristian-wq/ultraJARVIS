"""Safe OS-control stubs for UltraJarvis."""

from __future__ import annotations

from typing import List


def set_volume(level: int) -> str:
    level = max(0, min(100, int(level)))
    return f"Volume set to {level}% (stub – no real change)"


def open_app(name: str) -> str:
    if not name or not name.strip():
        raise ValueError("app name required")
    allowed = {"calculator", "textedit", "notepad", "terminal"}
    key = name.strip().lower()
    if key not in allowed:
        raise PermissionError(f"App not in safe list: {name}")
    return f"Would open app: {name} (stub)"


def list_safe_apps() -> List[str]:
    return ["calculator", "textedit", "notepad", "terminal"]
