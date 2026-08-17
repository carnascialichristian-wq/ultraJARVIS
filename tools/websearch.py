"""Web-search stub for UltraJarvis."""
from __future__ import annotations
from typing import List, Dict

def search(query: str, *, limit: int = 5) -> List[Dict[str, str]]:
    if not query or not query.strip():
        return []
    return [{
        "title": f"Stub result for: {query[:60]}",
        "url": "https://example.com/stub",
        "snippet": "This is a placeholder search result. Replace with a real adapter.",
    }][:limit]
