"""Tests for core.multi_file."""

from __future__ import annotations

from pathlib import Path

from core.multi_file import detect_multi_patterns, write_multi_file_job, write_dep_graph


def test_detect_multi():
    assert detect_multi_patterns("is_even") == ["is_even"]
    hits = detect_multi_patterns("Write gcd and factorial helpers")
    assert "gcd" in hits and "factorial" in hits


def test_write_multi(tmp_path: Path):
    def code_for_key(key, title):
        return f"def run() -> str:\n    return 'ok – {key}'\n"

    written, edges = write_multi_file_job(
        tmp_path,
        "gcd and factorial",
        "Demo",
        code_for_key=code_for_key,
        write_fn=lambda p, c: p.write_text(c, encoding="utf-8"),
    )
    assert "tool.py" in written
    assert any(w.endswith("_mod.py") for w in written)
    assert (tmp_path / "tool.py").exists()
    name = write_dep_graph(
        tmp_path,
        written,
        edges + [("tool.py", "test_tool.py")],
        write_fn=lambda p, c: p.write_text(c, encoding="utf-8"),
    )
    assert name == "deps.json"
    assert "modules" in (tmp_path / "deps.json").read_text()
