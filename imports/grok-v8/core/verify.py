"""QA gate summarizer for UltraJarvis."""

from __future__ import annotations

from pathlib import Path
from typing import List, Tuple


def summarize_gates(gate_lines: List[str]) -> Tuple[str, str]:
    """
    Summarize gate output lines into (status, report).

    status is PASS or FAIL.
    """
    failures = [ln for ln in gate_lines if "FAIL" in ln.upper() or "ERROR" in ln.upper()]
    if failures:
        status = "FAIL"
        report = "Gates FAILED:\n" + "\n".join(failures[:20])
    else:
        status = "PASS"
        report = "All gates PASSED.\n" + "\n".join(gate_lines[:10])
    return status, report


def write_verify(path: Path, status: str, report: str) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(f"STATUS: {status}\n\n{report}\n", encoding="utf-8")
    return path
