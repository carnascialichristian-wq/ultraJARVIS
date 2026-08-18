"""Tests for advisors.style."""

from __future__ import annotations

from pathlib import Path

from advisors.style import check_style, scan_job_style


def test_style_flags_bare_except(tmp_path: Path):
    p = tmp_path / "bad.py"
    p.write_text("def f():\n    try:\n        x=1\n    except:\n        pass\n", encoding="utf-8")
    notes = check_style(p)
    assert any("bare except" in n for n in notes)


def test_style_ok_clean(tmp_path: Path):
    p = tmp_path / "ok.py"
    p.write_text(
        '"""mod"""\nfrom __future__ import annotations\n\ndef run() -> str:\n    return "ok"\n',
        encoding="utf-8",
    )
    notes = check_style(p)
    assert not any("bare except" in n for n in notes)
    assert not any("CamelCase" in n for n in notes)
