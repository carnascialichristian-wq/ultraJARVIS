"""Tests for advisors.style."""

from __future__ import annotations

from pathlib import Path

from advisors.style import check_style, scan_job_style


def test_style_ok(tmp_path):
    p = tmp_path / "ok.py"
    p.write_text('"""mod"""\nfrom __future__ import annotations\n\ndef f():\n    """d"""\n    return 1\n')
    assert check_style(p) == []


def test_style_notes(tmp_path):
    p = tmp_path / "bad.py"
    p.write_text("x=1\n")
    notes = check_style(p)
    assert notes
