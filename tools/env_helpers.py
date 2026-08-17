"""Env helpers (read-only, safe)."""
from __future__ import annotations
import os

def get_env(name: str, default: str = "") -> str:
    return os.environ.get(name, default)
