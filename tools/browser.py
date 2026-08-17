"""Browser opener with allow-list for UltraJarvis."""

from __future__ import annotations

from typing import List
from urllib.parse import urlparse

# Only these domains may be opened
ALLOWLIST = {
    "example.com",
    "github.com",
    "docs.python.org",
    "pypi.org",
}


def is_allowed(url: str) -> bool:
    """Return True if the URL's host is in the allow-list."""
    try:
        host = (urlparse(url).hostname or "").lower()
        if host.startswith("www."):
            host = host[4:]
        return host in ALLOWLIST or any(host.endswith("." + d) for d in ALLOWLIST)
    except Exception:
        return False


def open_url(url: str) -> str:
    """
    'Open' a URL if it is allowed.

    In this stub we only validate and return a status message.
    A real implementation would launch a browser or use playwright.
    """
    if not is_allowed(url):
        raise PermissionError(f"URL not in allow-list: {url}")
    return f"Would open: {url}"
