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
            "text": "\n".join(lines),
        }

    any_real = False
    any_fail = False

    # --- ruff ---
    ruff = _which("ruff")
    if ruff:
        any_real = True
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
    pytest_cmd = [sys.executable, "-m", "pytest", "-q", "--tb=no"]
    if files:
        test_files = [f for f in files if "test" in Path(f).name]
        if test_files:
            pytest_cmd.extend(test_files)
            any_real = True
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
        code, out = _run(pytest_cmd + [str(target_dir)], cwd=target_dir, timeout=90.0)
        if code in (0, 5):
            lines.append("pytest ............ PASS" + (" (no tests collected)" if code == 5 else ""))
        else:
            any_fail = True
            lines.append("pytest ............ FAIL")
            if out:
                lines.append(out[:800])
        any_real = True

    lines.append("")
    if not any_real:
        lines.append("No real tools available – treating as STUB (no quality signal)")
        lines.append("Overall: STUB")
        ok: Optional[bool] = None
    else:
        ok = not any_fail
        lines.append(f"Overall: {'FAIL' if any_fail else 'PASS'}")

    return {
        "ok": ok,
        "any_real": any_real,
        "text": "\n".join(lines),
    }
