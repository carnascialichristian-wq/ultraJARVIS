"""Tests for core.gates."""

from __future__ import annotations

from pathlib import Path

from core.gates import run_gates


def test_stub_gates(tmp_path: Path):
    result = run_gates(tmp_path, use_real=False)
    assert isinstance(result, dict)
    assert result["ok"] is None  # stub is not a real pass
    assert result["any_real"] is False
    assert "STUB" in result["text"]
    assert "Overall:" in result["text"]


def test_real_gates_no_tools_or_empty(tmp_path: Path):
    # Even with use_real=True, missing tools should not crash
    result = run_gates(tmp_path, files=["foo.py"], use_real=True)
    assert isinstance(result, dict)
    assert "ok" in result
    assert "text" in result
    assert "Overall:" in result["text"]
    text = result["text"].lower()
    assert "ruff" in text or "skip" in text or "stub" in text or "pass" in text or "fail" in text


def test_gates_with_simple_file(tmp_path: Path):
    (tmp_path / "hello.py").write_text("x = 1\n", encoding="utf-8")
    result = run_gates(tmp_path, files=["hello.py"], use_real=True)
    assert isinstance(result, dict)
    assert "Overall:" in result["text"]
