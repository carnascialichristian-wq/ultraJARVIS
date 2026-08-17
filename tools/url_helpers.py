"""URL helpers (pure parsing)."""
from __future__ import annotations
from urllib.parse import urlparse

def host_of(url: str) -> str:
    return (urlparse(url).hostname or "").lower()

def is_https(url: str) -> bool:
    return urlparse(url).scheme == "https"
