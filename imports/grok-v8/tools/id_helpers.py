"""ID helpers."""
from __future__ import annotations
import uuid

def new_uuid4() -> str:
    return str(uuid.uuid4())

def is_uuid_like(value: str) -> bool:
    try:
        uuid.UUID(str(value))
        return True
    except Exception:
        return False
