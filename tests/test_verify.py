"""Tests for core.verify."""

from __future__ import annotations

from pathlib import Path

import pytest

from core.verify import summarize_gates, write_verify


def test_pass_case():
    status, notes = summarize_gates("All tests passed\nOK")
    assert status == "PASS"


def test_fail_case():
    status, notes = summarize_gates("ERROR: something broke\nTraceback ...")
    assert status == "FAIL"


def test_empty():
    status, notes = summarize_gates("")
    assert status == "FAIL"


def test_write_verify(tmp_path: Path):
    path = write_verify(tmp_path / "job", "tests passed successfully")
    assert path.exists()
    content = path.read_text()
    assert "STATUS: PASS" in content
