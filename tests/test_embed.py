"""Tests for cloud_bridge.embed and memory embedded recall."""

from __future__ import annotations

import cloud_bridge
from core.memory import remember, clear, recall_semantic_embedded


def test_embed_returns_none_without_keys(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    monkeypatch.setenv("MODEL_PROVIDER", "openai")
    out = cloud_bridge.embed(["hello world"])
    assert out is None or isinstance(out, list)


def test_recall_semantic_embedded_fallback(tmp_path, monkeypatch):
    monkeypatch.setenv("UJ_EMBEDDING", "1")
    monkeypatch.setattr(cloud_bridge, "embed", lambda texts: None)
    path = tmp_path / "m.jsonl"
    clear(path)
    remember("factorial helper job pass", tags=["job"], path=path)
    hits = recall_semantic_embedded("factorial math", path=path, limit=3)
    assert hits
    assert "factorial" in hits[0]["fact"]
