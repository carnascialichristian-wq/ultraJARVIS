"""Tests for core.natural_tasks."""

from __future__ import annotations

from pathlib import Path

import pytest

from core.natural_tasks import NaturalTaskRunner


@pytest.fixture
def runner(tmp_path):
    # force stub gates so tests don't depend on ruff/black being installed
    return NaturalTaskRunner(jobs_root=tmp_path / "jobs", use_real_gates=False)


def test_build_and_run_basic(runner):
    summary = runner.build_and_run("Add a utility that returns the current time")
    assert summary["status"] == "PASS"
    assert "job_id" in summary
    assert summary["title"]
    plan_path = Path(summary["plan_path"])
    assert plan_path.exists()
    assert "Plan:" in plan_path.read_text(encoding="utf-8")
    verify_path = Path(summary["verify_path"])
    assert verify_path.exists()
    assert "PASS" in verify_path.read_text(encoding="utf-8")


def test_empty_prompt_raises(runner):
    with pytest.raises(ValueError):
        runner.build_and_run("")


def test_written_files_exist(runner):
    summary = runner.build_and_run("Create a stub tool")
    job_dir = Path(summary["plan_path"]).parent
    stub = job_dir / "tool.py"
    assert stub.exists()
    content = stub.read_text(encoding="utf-8")
    assert "def run()" in content
    assert "Auto-generated" in content
    test_file = job_dir / "test_tool.py"
    assert test_file.exists()
    assert "tool.py" in summary["written_files"]
    assert "test_tool.py" in summary["written_files"]


def test_real_gates_mode_does_not_crash(tmp_path):
    runner = NaturalTaskRunner(jobs_root=tmp_path / "jobs", use_real_gates=True)
    summary = runner.build_and_run("Simple task for real gates")
    assert "status" in summary
    assert Path(summary["plan_path"]).exists()


@pytest.mark.parametrize(
    "prompt,expected_snippet",
    [
        ("Write a function is_even for integers", "def is_even"),
        ("Implement factorial", "def factorial"),
        ("Add a fibonacci helper", "def fib"),
        ("Create is_prime checker", "def is_prime"),
        ("Least common multiple lcm of two ints", "def lcm"),
        ("Write a gcd helper for two integers", "def gcd"),
        ("Clamp a number into a range", "def clamp"),
        ("Compute the arithmetic mean of a list", "def mean"),
        ("Check if a string is a palindrome", "def is_palindrome"),
        ("Slugify a title string", "def slugify"),
        ("Reverse the words in a sentence", "def reverse_words"),
        ("Return unique items preserving order", "def unique"),
        ("Flatten one level of nested lists", "def flatten"),
    ],
)
def test_heuristics_produce_concrete_functions(runner, prompt, expected_snippet):
    summary = runner.build_and_run(prompt)
    assert summary["status"] == "PASS"
    job_dir = Path(summary["plan_path"]).parent
    content = (job_dir / "tool.py").read_text(encoding="utf-8")
    assert expected_snippet in content
    assert "def run()" in content
    assert "ok –" in content


def test_promote_job_to_tools(runner, tmp_path):
    from core.natural_tasks import promote_job_to_tools

    summary = runner.build_and_run("Write a gcd helper for two integers")
    job_dir = Path(summary["plan_path"]).parent
    # Promote into a temporary "tools" tree under tmp_path so we never touch real tools/
    fake_root = tmp_path / "proj"
    (fake_root / "tools").mkdir(parents=True)
    dest = promote_job_to_tools(job_dir, "gcd_from_job", root=fake_root)
    assert dest.exists()
    assert dest.name == "gcd_from_job_helpers.py"
    text = dest.read_text(encoding="utf-8")
    assert "def gcd" in text
    assert "Promoted from job" in text
    assert "def run()" in text


def test_promote_rejects_missing_tool(tmp_path):
    from core.natural_tasks import promote_job_to_tools

    empty = tmp_path / "empty_job"
    empty.mkdir()
    with pytest.raises(FileNotFoundError):
        promote_job_to_tools(empty, "whatever", root=tmp_path)


def test_promote_optional_auto_register(runner, tmp_path):
    """register=True wires the promoted module into the runtime Registry."""
    from core.natural_tasks import promote_job_to_tools
    from core.registry import get_registry
    import core.registry as reg_mod

    # Isolate default registry so we don't pollute other tests
    reg_mod._default = None
    reg = get_registry()

    summary = runner.build_and_run("Write a gcd helper for two integers")
    job_dir = Path(summary["plan_path"]).parent
    fake_root = tmp_path / "proj"
    (fake_root / "tools").mkdir(parents=True)

    # Default: no auto-register
    dest = promote_job_to_tools(job_dir, "gcd_reg_test", root=fake_root)
    assert dest.exists()
    assert reg.get("gcd_reg_test.run") is None
    assert reg.get("gcd_reg_test.gcd") is None

    # Explicit register=True
    dest2 = promote_job_to_tools(
        job_dir, "gcd_reg_test", root=fake_root, register=True
    )
    assert dest2.exists()
    # Prefer `run` when present (generated tools always have it)
    spec = reg.get("gcd_reg_test.run")
    assert spec is not None
    assert spec.module == "tools.gcd_reg_test_helpers"
    assert spec.callable_name == "run"
    assert spec.safe is True
    assert "promoted" in spec.tags
