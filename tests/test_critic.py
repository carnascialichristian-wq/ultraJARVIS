"""Tests for advisors.critic."""

from __future__ import annotations

from advisors.critic import critique


def test_critique_pass():
    result = critique({"status": "PASS", "job_id": "j1", "written_files": ["tool.py"], "notes": []})
    assert result["verdict"] == "OK"
    assert result["suggested_next"]


def test_critique_fail():
    result = critique({"status": "FAIL", "job_id": "j2", "written_files": [], "notes": ["bad"]})
    assert result["verdict"] == "NEEDS_WORK"
    assert any("Gates failed" in n for n in result["notes"])
