"""Web search for UltraJarvis — DuckDuckGo HTML when network available."""

from __future__ import annotations

import re
import urllib.parse
import urllib.request
from typing import Dict, List


def _ddg_search(query: str, limit: int) -> List[Dict[str, str]]:
    url = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote(query)
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "UltraJarvis/1.0"},
    )
    with urllib.request.urlopen(req, timeout=8) as resp:
        html = resp.read().decode("utf-8", errors="replace")
    results: List[Dict[str, str]] = []
    for m in re.finditer(
        r'class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)</a>',
        html,
        re.I | re.S,
    ):
        href, title = m.group(1), re.sub(r"<[^>]+>", "", m.group(2)).strip()
        if "uddg=" in href:
            q = urllib.parse.parse_qs(urllib.parse.urlparse(href).query)
            href = urllib.parse.unquote(q.get("uddg", [href])[0])
        results.append({"title": title or href, "url": href, "snippet": ""})
        if len(results) >= limit:
            break
    return results


def search(query: str, *, limit: int = 5) -> List[Dict[str, str]]:
    if not query or not query.strip():
        return []
    limit = max(1, min(int(limit), 10))
    try:
        hits = _ddg_search(query.strip(), limit)
        if hits:
            return hits
    except Exception:
        pass
    return [
        {
            "title": f"Offline placeholder for: {query[:60]}",
            "url": "https://duckduckgo.com/?q=" + urllib.parse.quote(query[:80]),
            "snippet": "Network search unavailable; open the DuckDuckGo URL manually.",
        }
    ][:limit]
