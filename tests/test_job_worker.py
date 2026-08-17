"""Tests for core.job_worker."""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from core.job_worker import enqueue, process_one, queue_status, QUEUE, DONE


@pytest.fixture(autouse=True)
def clean_queue(tmp_path, monkeypatch):
    """Point QUEUE / DONE at a temporary location for isolation."""
    q = tmp_path / "queue.jsonl"
    d = tmp_path / "done.jsonl"
    monkeypatch.setattr("core.job_worker.QUEUE", q)
    monkeypatch.setattr("core.job_worker.DONE", d)
    # Also keep JOBS_DIR isolated
    jobs = tmp_path / "jobs"
    jobs.mkdir()
    monkeypatch.setattr("core.natural_tasks.JOBS_DIR", jobs)
    yield


def test_enqueue_and_status():
    assert queue_status()["pending"] == 0
    rec = enqueue("Add a hello-world tool")
    assert "prompt" in rec
    assert queue_status()["pending"] == 1


def test_process_one_success():
    enqueue("Create a simple utility function")
    result = process_one()
    assert result is not None
    assert result["ok"] is True
    assert "result" in result
    assert result["result"]["status"] == "PASS"
    assert queue_status()["pending"] == 0
    assert queue_status()["done"] == 1


def test_process_one_empty_queue():
    assert process_one() is None


def test_bad_line_is_skipped(tmp_path, monkeypatch):
    q = tmp_path / "queue.jsonl"
    d = tmp_path / "done.jsonl"
    monkeypatch.setattr("core.job_worker.QUEUE", q)
    monkeypatch.setattr("core.job_worker.DONE", d)
    q.write_text("this is not json\n", encoding="utf-8")
    # Should not raise, just skip
    assert process_one() is None
    bad = d.with_name("bad_queue.jsonl")
    assert bad.exists()
