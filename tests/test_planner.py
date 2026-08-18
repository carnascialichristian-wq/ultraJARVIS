"""Tests for core.planner."""

from __future__ import annotations

from pathlib import Path

import pytest

from core.planner import plan, Plan, write_plan_md


def test_plan_basic():
    p = plan("Add a reliability module with retries")
    assert isinstance(p, Plan)
    assert "reliability" in p.title.lower() or "Add" in p.title
    assert len(p.milestones) >= 3
    assert len(p.done_criteria) >= 2


def test_plan_empty():
    p = plan("")
    assert p.title == "Untitled task"
    assert p.milestones


def test_to_markdown():
    p = plan("Test task")
    md = p.to_markdown()
    assert md.startswith("# Plan:")
    assert "## Milestones" in md
    assert "## Done Criteria" in md


def test_write_plan_md(tmp_path: Path):
    p = plan("Write a file")
    out = write_plan_md(p, tmp_path / "job1")
    assert out.exists()
    assert "Plan:" in out.read_text()


def test_plan_surfaces_existing_tools():
    p = plan("Implement is_even and factorial helpers for integers")
    joined = " ".join(p.milestones) + " " + " ".join(p.risks)
    assert "is_even" in joined or "factorial" in joined or "existing tools" in joined.lower()
    assert any("existing tools" in m.lower() or "is_even" in m for m in p.milestones)


def test_plan_llm_adapter_opt_in(monkeypatch):
    import json
    import cloud_bridge

    payload = {
        "title": "LLM Plan Title",
        "milestones": ["Step A", "Step B", "Step C"],
        "risks": ["Risk X"],
        "done_criteria": ["Done Y"],
    }

    def fake_ask(prompt, *, system=None):
        return json.dumps(payload)

    monkeypatch.setenv("UJ_PLANNER_LLM", "1")
    monkeypatch.setattr(cloud_bridge, "ask_cloud_ai", fake_ask)

    p = plan("Build something interesting")
    assert p.title == "LLM Plan Title"
    assert "Step A" in p.milestones
    assert "Done Y" in p.done_criteria


def test_plan_llm_disabled_by_default(monkeypatch):
    import json
    import cloud_bridge

    calls = []

    def fake_ask(prompt, *, system=None):
        calls.append(1)
        return json.dumps({"title": "Should Not Appear", "milestones": ["x"]})

    monkeypatch.delenv("UJ_PLANNER_LLM", raising=False)
    monkeypatch.setattr(cloud_bridge, "ask_cloud_ai", fake_ask)

    p = plan("Heuristic only path")
    assert p.title != "Should Not Appear"
    assert calls == []


def test_plan_surfaces_related_memory(tmp_path, monkeypatch):
    """Planner mentions related past jobs from memory when available."""
    from core import memory as mem
    mem_path = tmp_path / "mem.jsonl"
    monkeypatch.setattr(mem, "DEFAULT_PATH", mem_path)
    mem.remember("job:job_abc title='factorial helper' status=PASS", tags=["job", "pass"])
    p = plan("Write a factorial function")
    joined = " ".join(p.milestones)
    assert "related past jobs" in joined.lower() or "factorial" in joined.lower()
