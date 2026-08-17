"""Tests for core.health."""

from __future__ import annotations

import pytest

from core.health import (
    check_python_version,
    check_write_perms,
    run_health_scan,
    format_health_report,
)


def test_python_version():
    ok, msg = check_python_version()
    assert ok is True
    assert "Python" in msg


def test_write_perms(tmp_path):
    ok, msg = check_write_perms(tmp_path)
    assert ok is True


def test_run_health_scan():
    report = run_health_scan()
    assert "overall" in report
    assert report["overall"] in ("PASS", "FAIL")
    assert "checks" in report


def test_format():
    report = run_health_scan()
    text = format_health_report(report)
    assert "HEALTH:" in text
