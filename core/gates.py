"""Gate runner for UltraJarvis.

Tries to run real tools (ruff, black, pytest) when available.
Falls back to a deterministic stub report so the pipeline always works.
"""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple


def _which(cmd: str) -> Optional[str]:
    return shutil.which(cmd)


def _run(cmd: List[str], cwd: Path, timeout: float = 60.0) -> Tuple[int, str]:
    """Run a command and return (returncode, combined output)."""
    try:
        proc = subprocess.run(
            cmd,
            cwd=str(cwd),
            capture_output=True,
            text=True,
            timeout=timeout,
        )
        out = (proc.stdout or "") + (proc.stderr or "")
        return proc.returncode, out.strip()
    except FileNotFoundError:
        return 127, f"command not found: {cmd[0]}"
    except subprocess.TimeoutExpired:
        return 124, f"timeout after {timeout}s: {' '.join(cmd)}"
    except Exception as exc:
        return 1, f"error running {cmd[0]}: {exc}"


def run_gates(
    target_dir: Path,
    *,
    files: Optional[List[str]] = None,
    use_real: bool = True,
) -> Dict[str, Any]:
    """
    Run quality gates against target_dir.

    Returns a structured dict:
      - ok: True | False | None  (None = stub / no real tools run)
      - any_real: whether real tools were invoked
      - tools_used: list of tool names that ran
      - text: human-readable report
    Callers must use the boolean, not parse the text (FIX-6).
    """
    target_dir = Path(target_dir)
    lines: List[str] = [
        "=== UltraJarvis Gates ===",
        f"Target: {target_dir}",
        f"Files: {', '.join(files) if files else '(all)'}",
        "",
    ]

    if not use_real:
        lines += [
            "ruff check ........ STUB (not executed)",
            "black --check ..... STUB (not executed)",
            "pytest ............ STUB (not executed)",
            "",
            "Overall: STUB (use_real=False)",
        ]
        return {
            "ok": None,  # not a real pass – caller must not treat as success of quality
            "any_real": False,
            "tools_used": [],
            "text": "\n".join(lines),
        }

    any_real = False
    any_fail = False
    tools_used: List[str] = []

    # --- py_compile (always available – real signal without extra deps) ---
    py_targets: List[Path] = []
    if files:
        for f in files:
            p = target_dir / f if not Path(f).is_absolute() else Path(f)
            if p.suffix == ".py" and p.is_file():
                py_targets.append(p)
    else:
        py_targets = sorted(target_dir.glob("**/*.py"))[:40]

    if py_targets:
        any_real = True
        tools_used.append("py_compile")
        compile_fail = False
        compile_notes: List[str] = []
        for p in py_targets:
            code, out = _run(
                [sys.executable, "-m", "py_compile", str(p)],
                cwd=target_dir,
                timeout=30.0,
            )
            if code != 0:
                compile_fail = True
                compile_notes.append(f"{p.name}: {out[:200] or 'compile error'}")
        if compile_fail:
            any_fail = True
            lines.append("py_compile ........ FAIL")
            lines.extend(compile_notes[:5])
        else:
            lines.append(f"py_compile ........ PASS ({len(py_targets)} files)")
    else:
        lines.append("py_compile ........ SKIP (no .py files)")

    # --- ruff ---
    ruff = _which("ruff")
    if ruff:
        any_real = True
        tools_used.append("ruff")
        targets = files if files else ["."]
        code, out = _run([ruff, "check", *targets], cwd=target_dir)
        status = "PASS" if code == 0 else "FAIL"
        if code != 0:
            any_fail = True
        lines.append(f"ruff check ........ {status}")
        if out:
            lines.append(out[:800])
    else:
        lines.append("ruff check ........ SKIP (ruff not installed)")

    # --- black ---
    black = _which("black")
    if black:
        any_real = True
        tools_used.append("black")
        targets = files if files else ["."]
        code, out = _run([black, "--check", "--quiet", *targets], cwd=target_dir)
        status = "PASS" if code == 0 else "FAIL"
        if code != 0:
            any_fail = True
        lines.append(f"black --check ..... {status}")
        if out and code != 0:
            lines.append(out[:800])
    else:
        lines.append("black --check ..... SKIP (black not installed)")

    # --- pytest ---
    # Prefer the current interpreter's pytest
    pytest_cmd = [sys.executable, "-m", "pytest", "-q", "--tb=no"]
    if files:
        # only test files that look like tests
        test_files = [f for f in files if "test" in Path(f).name]
        if test_files:
            pytest_cmd.extend(test_files)
            any_real = True
            tools_used.append("pytest")
            code, out = _run(pytest_cmd, cwd=target_dir, timeout=90.0)
            status = "PASS" if code == 0 else "FAIL"
            if code != 0:
                any_fail = True
            lines.append(f"pytest ............ {status}")
            if out:
                lines.append(out[:800])
        else:
            lines.append("pytest ............ SKIP (no test files in written set)")
    else:
        # try collecting tests in target_dir
        code, out = _run(pytest_cmd + [str(target_dir)], cwd=target_dir, timeout=90.0)
        # exit code 5 = no tests collected – treat as soft pass
        if code in (0, 5):
            lines.append("pytest ............ PASS" + (" (no tests collected)" if code == 5 else ""))
        else:
            any_fail = True
            lines.append("pytest ............ FAIL")
            if out:
                lines.append(out[:800])
        any_real = True
        tools_used.append("pytest")

    lines.append("")
    if not any_real:
        lines.append("No real tools available – treating as STUB (no quality signal)")
        lines.append("Overall: STUB")
        ok: Optional[bool] = None
    else:
        ok = not any_fail
        lines.append(f"Tools: {', '.join(tools_used) if tools_used else '(none)'}")
        lines.append(f"Overall: {'FAIL' if any_fail else 'PASS'}")

    return {
        "ok": ok,
        "any_real": any_real,
        "tools_used": tools_used,
        "text": "\n".join(lines),
    }
