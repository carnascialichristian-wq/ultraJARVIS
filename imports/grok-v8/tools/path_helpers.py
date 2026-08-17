"""Path helpers (pure, no I/O)."""
from __future__ import annotations
from pathlib import PurePosixPath

def join_posix(*parts: str) -> str:
    return str(PurePosixPath(*parts))

def extension(path: str) -> str:
    return PurePosixPath(path).suffix.lower()
