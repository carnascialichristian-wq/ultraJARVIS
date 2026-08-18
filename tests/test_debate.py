"""Tests for advisors.debate."""

from __future__ import annotations

from pathlib import Path

from advisors.debate import debate_job


def test_debate_on_simple_job(tmp_path: Path):
    py = tmp_path / "tool.py"
    py.write_text(
        '"""ok"""\nfrom __future__ import annotations\n\ndef run() -> str:\n    return "ok"\n',
        encoding="utf-8",
    )
    report = debate_job(tmp_path, {"status": "PASS", "title": "demo"})
    assert report["decision"] in ("approve", "reject", "abstain")
    assert "votes" in report
    assert "agents" in report
    assert "safety" in report["agents"]
    assert "style" in report["agents"]
