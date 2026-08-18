"""Browser opener with allow-list for UltraJarvis."""

from __future__ import annotations

import os
import webbrowser
from typing import List
from urllib.parse import urlparse

ALLOWLIST = {
    "example.com", "github.com", "docs.python.org", "pypi.org",
    "duckduckgo.com", "wikipedia.org", "python.org",
}


def is_allowed(url: str) -> bool:
    try:
        host = (urlparse(url).hostname or "").lower()
        if host.startswith("www."):
            host = host[4:]
        return host in ALLOWLIST or any(host.endswith("." + d) for d in ALLOWLIST)
    except Exception:
        return False


def open_url(url: str, *, real: bool | None = None) -> str:
    if not is_allowed(url):
        raise PermissionError(f"URL not in allow-list: {url}")
    do_real = real if real is not None else os.environ.get("UJ_BROWSER_REAL", "").strip() == "1"
    if do_real:
        webbrowser.open(url)
        return f"Opened: {url}"
    return f"Would open: {url}"


def list_allowed_domains() -> List[str]:
    return sorted(ALLOWLIST)
