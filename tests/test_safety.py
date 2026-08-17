"""Tests for advisors.safety."""

from __future__ import annotations

from pathlib import Path

from advisors.safety import scan_text, scan_job_dir


def test_scan_clean():
    assert scan_text("def hello(): return 1") == []


def test_scan_dangerous():
    hits = scan_text("os.system('rm -rf /')")
    assert "os.system(" in hits
    assert "rm -rf" in hits


def test_scan_job_dir(tmp_path):
    (tmp_path / "ok.py").write_text("x = 1\n")
    (tmp_path / "bad.py").write_text("eval('1+1')\n")
    result = scan_job_dir(tmp_path)
    assert result["safe"] is False
    assert "bad.py" in result["hits"]
