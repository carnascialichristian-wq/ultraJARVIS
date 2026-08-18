"""OS-control helpers (safe allow-list, optional real actions)."""

from __future__ import annotations

import os
import shutil
import subprocess
from typing import List

_ALLOWED_APPS = {
    "calculator": ["gnome-calculator", "kcalc", "xcalc", "calc"],
    "textedit": ["gedit", "kate", "mousepad", "xed", "nano"],
    "notepad": ["gedit", "kate", "mousepad", "xed"],
    "terminal": ["x-terminal-emulator", "gnome-terminal", "konsole", "xterm"],
}


def set_volume(level: int, *, real: bool | None = None) -> str:
    level = max(0, min(100, int(level)))
    do_real = real if real is not None else os.environ.get("UJ_OS_REAL", "").strip() == "1"
    if do_real:
        if shutil.which("pactl"):
            subprocess.run(["pactl", "set-sink-volume", "@DEFAULT_SINK@", f"{level}%"], capture_output=True, timeout=5, check=False)
            return f"Volume set to {level}% (pactl)"
        if shutil.which("amixer"):
            subprocess.run(["amixer", "-q", "sset", "Master", f"{level}%"], capture_output=True, timeout=5, check=False)
            return f"Volume set to {level}% (amixer)"
        return f"Volume set to {level}% (no mixer tool found – recorded only)"
    return f"Volume set to {level}% (dry-run; set UJ_OS_REAL=1 for real)"


def open_app(name: str, *, real: bool | None = None) -> str:
    if not name or not name.strip():
        raise ValueError("app name required")
    key = name.strip().lower()
    if key not in _ALLOWED_APPS:
        raise PermissionError(f"App not in safe list: {name}")
    do_real = real if real is not None else os.environ.get("UJ_OS_REAL", "").strip() == "1"
    if do_real:
        for bin_name in _ALLOWED_APPS[key]:
            if shutil.which(bin_name):
                subprocess.Popen([bin_name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                return f"Launched: {bin_name}"
        return f"No binary found for {name}; allowed candidates: {_ALLOWED_APPS[key]}"
    return f"Would open app: {name} (dry-run; set UJ_OS_REAL=1 for real)"


def list_safe_apps() -> List[str]:
    return sorted(_ALLOWED_APPS.keys())
