"""Tests for core.metrics."""

from __future__ import annotations

from core import metrics


def test_record_and_recent(tmp_path, monkeypatch):
    path = tmp_path / "metrics.jsonl"
    monkeypatch.setattr(metrics, "DEFAULT_PATH", path)
    metrics.record("job_done", job_id="j1", status="PASS")
    metrics.record("job_done", job_id="j2", status="FAIL")
    recent = metrics.recent(limit=5, path=path)
    assert len(recent) == 2
    assert recent[0]["event"] == "job_done"
    counts = metrics.snapshot_counts(path=path)
    assert counts["job_done"] == 2
