"""Tests for core.reliability."""

from __future__ import annotations

import time
from pathlib import Path

import pytest

from core.reliability import retry, safe_write, with_timeout


class TestRetry:
    def test_succeeds_first_try(self):
        calls = []

        @retry(max_attempts=3, delay=0.01)
        def ok():
            calls.append(1)
            return "ok"

        assert ok() == "ok"
        assert len(calls) == 1

    def test_retries_then_succeeds(self):
        calls = []

        @retry(max_attempts=3, delay=0.01)
        def flaky():
            calls.append(1)
            if len(calls) < 3:
                raise ValueError("fail")
            return "done"

        assert flaky() == "done"
        assert len(calls) == 3

    def test_exhausts_attempts(self):
        @retry(max_attempts=2, delay=0.01)
        def always_fail():
            raise RuntimeError("boom")

        with pytest.raises(RuntimeError, match="boom"):
            always_fail()


class TestSafeWrite:
    def test_writes_and_creates_parents(self, tmp_path: Path):
        target = tmp_path / "nested" / "file.txt"
        safe_write(target, "hello")
        assert target.read_text() == "hello"

    def test_backup_created(self, tmp_path: Path):
        target = tmp_path / "data.txt"
        target.write_text("old")
        safe_write(target, "new", backup=True)
        assert target.read_text() == "new"
        bak = target.with_suffix(".txt.bak")
        assert bak.exists()
        assert bak.read_text() == "old"


class TestWithTimeout:
    def test_passes_when_fast(self):
        @with_timeout(1.0)
        def fast():
            return 42

        assert fast() == 42

    def test_raises_when_slow(self):
        @with_timeout(0.05)
        def slow():
            time.sleep(0.2)
            return 1

        with pytest.raises(TimeoutError):
            slow()
