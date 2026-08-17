"""Tests for core.gates."""

from __future__ import annotations

from pathlib import Path

from core.gates import run_gates


def test_stub_gates(tmp_path: Path):
    report = run_gates(tmp_path, use_real=False)
    assert "PASS" in report
    assert "Overall: PASS" in report


def test_real_gates_no_tools_or_empty(tmp_path: Path):
    # Even with use_real=True, missing tools should not crash
    report = run_gates(tmp_path, files=["foo.py"], use_real=True)
    assert "Overall:" in report
    assert "ruff" in report.lower() or "SKIP" in report or "PASS" in report


def test_gates_with_simple_file(tmp_path: Path):
    (tmp_path / "hello.py").write_text("x = 1\n", encoding="utf-8")
    report = run_gates(tmp_path, files=["hello.py"], use_real=True)
    assert "Overall:" in report
