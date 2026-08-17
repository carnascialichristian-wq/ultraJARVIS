"""Simple validators."""
from __future__ import annotations
import re

_EMAIL = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

def is_email(value: str) -> bool:
    return bool(_EMAIL.match(value or ""))

def is_nonempty(value: str) -> bool:
    return bool(value and value.strip())
