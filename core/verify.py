"""QA Verifier – summarizes gate results into PASS/FAIL."""

from __future__ import annotations

from pathlib import Path
from typing import Dict, List, Optional, Tuple
import json


def summarize_gates(gate_text: str) -> Tuple[str, List[str]]:
    """
    Parse a gates report (plain text) and return (status, notes).

    status is "PASS" or "FAIL".
    """
    if not gate_text or not gate_text.strip():
        return "FAIL", ["No gate output provided"]

    lower = gate_text.lower()
    notes: List[str] = []

    # Simple heuristics
    has_fail = any(
        token in lower
        for token in ("fail", "error", "traceback", "exception", "critical")
    )
    has_pass = "pass" in lower or "ok" in lower or "success" in lower

    if has_fail and not has_pass:
        status = "FAIL"
        notes.append("Detected failure keywords in gate output")
    elif has_pass and not has_fail:
        status = "PASS"
        notes.append("All checks appear successful")
    elif has_fail and has_pass:
        status = "FAIL"
        notes.append("Mixed results – treating as FAIL")
    else:
        # Ambiguous – conservative
        status = "FAIL"
        notes.append("Ambiguous gate output – defaulting to FAIL")

    return status, notes


def write_verify(
    job_dir: str | Path,
    gate_text: str,
    extra: Optional[Dict] = None,
) -> Path:
    """
    Write verify.txt (and optionally verify.json) for a job.

    Returns path to verify.txt.
    """
    job_dir = Path(job_dir)
    job_dir.mkdir(parents=True, exist_ok=True)

    # Prefer explicit status from caller (structured gates) over text heuristics
    if extra and "status" in extra and extra["status"] in ("PASS", "FAIL"):
        status = extra["status"]
        notes = list(extra.get("notes") or []) or [f"Status provided by caller: {status}"]
    else:
        status, notes = summarize_gates(gate_text)

    lines = [
        f"STATUS: {status}",
        "",
        "Notes:",
    ]
    for n in notes:
        lines.append(f"- {n}")
    lines.append("")
    lines.append("--- Raw gates (truncated) ---")
    lines.append(gate_text[:2000] if gate_text else "(empty)")

    verify_txt = job_dir / "verify.txt"
    verify_txt.write_text("\n".join(lines), encoding="utf-8")

    if extra is not None:
        payload = {**extra, "status": status, "notes": notes}
        (job_dir / "verify.json").write_text(
            json.dumps(payload, indent=2), encoding="utf-8"
        )

    return verify_txt
