"""Tests for core.memory."""

from __future__ import annotations

from core import memory


def test_remember_recall(tmp_path, monkeypatch):
    path = tmp_path / "memory.jsonl"
    monkeypatch.setattr(memory, "DEFAULT_PATH", path)
    memory.remember("User prefers Italian", tags=["pref"])
    memory.remember("Project is UltraJarvis_v8", tags=["project"])
    all_facts = memory.recall(path=path)
    assert len(all_facts) == 2
    italian = memory.recall("italian", path=path)
    assert len(italian) == 1
    pref = memory.recall(tag="pref", path=path)
    assert len(pref) == 1


def test_empty_fact_raises(tmp_path, monkeypatch):
    import pytest

    monkeypatch.setattr(memory, "DEFAULT_PATH", tmp_path / "m.jsonl")
    with pytest.raises(ValueError):
        memory.remember("  ")


def test_list_tags(tmp_path, monkeypatch):
    path = tmp_path / "memory.jsonl"
    monkeypatch.setattr(memory, "DEFAULT_PATH", path)
    memory.remember("a", tags=["x", "y"])
    memory.remember("b", tags=["x"])
    counts = memory.list_tags(path=path)
    assert counts.get("x") == 2
    assert counts.get("y") == 1
