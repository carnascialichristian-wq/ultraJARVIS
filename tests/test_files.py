"""Tests for tools.files."""

from __future__ import annotations

from pathlib import Path

import pytest

from tools.files import safe_read, safe_write, safe_list, is_protected, PROJECT_ROOT


@pytest.fixture
def tmp_root(tmp_path, monkeypatch):
    """Isolate PROJECT_ROOT to a temporary directory."""
    monkeypatch.setattr("tools.files.PROJECT_ROOT", tmp_path)
    return tmp_path


def test_safe_write_and_read(tmp_root):
    target = safe_write("notes/hello.txt", "ciao mondo")
    assert target.exists()
    assert safe_read("notes/hello.txt") == "ciao mondo"


def test_protected_refusal(tmp_root):
    # Simulate a protected file
    (tmp_root / "grok.md").write_text("protected")
    with pytest.raises(PermissionError):
        safe_write("grok.md", "overwrite attempt")


def test_force_override(tmp_root):
    (tmp_root / "grok.md").write_text("old")
    path = safe_write("grok.md", "new", force=True)
    assert path.read_text() == "new"


def test_escape_root_refused(tmp_root):
    with pytest.raises(PermissionError):
        safe_write("/tmp/outside.txt", "nope")


def test_list(tmp_root):
    safe_write("a.txt", "1")
    safe_write("sub/b.txt", "2")
    files = safe_list(".")
    assert "a.txt" in files
    assert "sub/b.txt" in files


def test_is_protected(tmp_root):
    assert is_protected("grok.md") is True
    assert is_protected("docs/CONSTITUTION.md") is True
    assert is_protected("notes/foo.txt") is False
