"""Ensure developer documentation exists."""

from __future__ import annotations

from pathlib import Path


def test_developer_md_exists():
    path = Path("docs/DEVELOPER.md")
    assert path.exists(), "docs/DEVELOPER.md must exist"
    content = path.read_text(encoding="utf-8")
    assert "Architect" in content
    assert "Verify" in content
