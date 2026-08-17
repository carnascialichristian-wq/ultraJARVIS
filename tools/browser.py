"""Browser stub with allow-list."""
from __future__ import annotations
from urllib.parse import urlparse

ALLOWLIST = {"example.com", "github.com", "docs.python.org", "pypi.org"}

def is_allowed(url: str) -> bool:
    try:
        host = (urlparse(url).hostname or "").lower().lstrip("www.")
        return host in ALLOWLIST or any(host.endswith("." + d) for d in ALLOWLIST)
    except Exception:
        return False

def open_url(url: str) -> str:
    if not is_allowed(url):
        raise PermissionError(f"URL not in allow-list: {url}")
    return f"Would open: {url}"
