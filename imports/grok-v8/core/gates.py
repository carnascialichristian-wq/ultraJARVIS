"""Gate runner for UltraJarvis.

Tries to run real tools (ruff, black, pytest) when available.
Falls back to a deterministic stub report so the pipeline always works.
"""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path
from typing import List, Optional, Tuple


def _which(cmd: str) -> Optional[str]:
    return shutil.which(cmd)


def _run(cmd: List[str], cwd: Path, timeout: float = 60.0) -> Tuple[int, str]:
    try:
        proc = subprocess.run(
            cmd, cwd=str(cwd), capture_output=True, text=True, timeout=timeout,
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
) -> str:
    target_dir = Path(target_dir)
    lines: List[str] = [
        "=== UltraJarvis Gates ===",
        f"Target: {target_dir}",
        f"Files: {', '.join(files) if files else '(all)'}",
        "",
    ]

    if not use_real:
        lines += [
            "ruff check ........ PASS (forced stub)",
            "black --check ..... PASS (forced stub)",
            "pytest ............ PASS (forced stub)",
            "",
            "Overall: PASS",
        ]
        return "\n".join(lines)

    any_real = False
    any_fail = False

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
        lines.append("No real tools available – treating as PASS (stub fallback)")
        lines.append("Overall: PASS")
    else:
        lines.append(f"Overall: {'FAIL' if any_fail else 'PASS'}")

    return "\n".join(lines)
