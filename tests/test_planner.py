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
    # registry has math.is_even and math.factorial
    joined = " ".join(p.milestones) + " " + " ".join(p.risks)
    assert "is_even" in joined or "factorial" in joined or "existing tools" in joined.lower()
    assert any("existing tools" in m.lower() or "is_even" in m for m in p.milestones)
