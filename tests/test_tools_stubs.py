"""Tests for the Phase-1 tool stubs."""

from __future__ import annotations

import pytest

from tools.websearch import search
from tools.browser import is_allowed, open_url
from tools.os_control import set_volume, open_app, list_safe_apps


def test_websearch_stub():
    results = search("ultra jarvis")
    assert len(results) == 1
    assert "title" in results[0]
    assert search("") == []


def test_browser_allowlist():
    assert is_allowed("https://github.com/mootmoot1/UltraJarvis_v8") is True
    assert is_allowed("https://evil.example.net") is False
    assert open_url("https://docs.python.org/3/") == "Would open: https://docs.python.org/3/"
    with pytest.raises(PermissionError):
        open_url("https://malware.site")


def test_os_control_stubs():
    assert "50%" in set_volume(50)
    assert "calculator" in open_app("calculator")
    with pytest.raises(PermissionError):
        open_app("rm -rf /")
    assert "calculator" in list_safe_apps()
