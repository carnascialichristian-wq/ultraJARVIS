"""QA Verifier – summarizes gate results into PASS/FAIL."""

from __future__ import annotations

from pathlib import Path
from typing import Dict, List, Optional, Tuple
import json


def summarize_gates(gate_text: str) -> Tuple[str, List[str]]:
    if not gate_text or not gate_text.strip():
        return "FAIL", ["No gate output provided"]
    lower = gate_text.lower()
    notes: List[str] = []
    has_fail = any(token in lower for token in ("fail", "error", "traceback", "exception", "critical"))
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
        status = "FAIL"
        notes.append("Ambiguous gate output – defaulting to FAIL")
    return status, notes


def write_verify(
    job_dir: str | Path,
    gate_text: str = "",
    extra: Optional[Dict] = None,
    status: Optional[str] = None,
    notes: Optional[List[str]] = None,
) -> Path:
    job_dir = Path(job_dir)
    job_dir.mkdir(parents=True, exist_ok=True)
    if status is None or notes is None:
        status, notes = summarize_gates(gate_text)
    lines = [f"STATUS: {status}", "", "Notes:"]
    for n in notes:
        lines.append(f"- {n}")
    lines.append("")
    lines.append("--- Raw gates (truncated) ---")
    lines.append(gate_text[:2000] if gate_text else "(empty)")
    verify_txt = job_dir / "verify.txt"
    verify_txt.write_text("\n".join(lines), encoding="utf-8")
    if extra is not None:
        payload = {"status": status, "notes": notes, **extra}
        (job_dir / "verify.json").write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return verify_txt
