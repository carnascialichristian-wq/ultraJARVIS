"""Web-search stub for UltraJarvis.

In production this would call a real search API.
Currently returns a deterministic placeholder so the pipeline can be tested.
"""

from __future__ import annotations

from typing import List, Dict


def search(query: str, *, limit: int = 5) -> List[Dict[str, str]]:
    """
    Return a list of search-result dicts.

    Each dict has keys: title, url, snippet.
    """
    if not query or not query.strip():
        return []
    return [
        {
            "title": f"Stub result for: {query[:60]}",
            "url": "https://example.com/stub",
            "snippet": "This is a placeholder search result. Replace with a real adapter.",
        }
    ][:limit]
