"""Tests for core.monetization."""

from __future__ import annotations

from pathlib import Path

from core.monetization import record_usage, summarize_usage, plan_tiers


def test_record_and_summarize(tmp_path: Path):
    path = tmp_path / "usage.jsonl"
    record_usage("job_run", units=1.0, meta={"job": "a"}, path=path)
    record_usage("job_run", units=2.0, path=path)
    record_usage("llm_writer", units=1.0, path=path)
    s = summarize_usage(path=path)
    assert s["count"] == 3
    assert s["events"]["job_run"] == 3.0
    assert s["events"]["llm_writer"] == 1.0


def test_plan_tiers():
    tiers = plan_tiers()
    assert any(t["id"] == "free" for t in tiers)
    assert any(t["price_usd"] > 0 for t in tiers)
