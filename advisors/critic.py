"""Critic advisor – reviews gate/verify output and suggests next actions."""

from __future__ import annotations

from typing import Any, Dict, List


def critique(summary: Dict[str, Any]) -> Dict[str, Any]:
    """
    Given a job summary (from NaturalTaskRunner), produce a short critique.

    Returns dict with: verdict, notes, suggested_next.
    """
    status = (summary.get("status") or "").upper()
    notes: List[str] = list(summary.get("notes") or [])
    suggested: List[str] = []

    if status == "PASS":
        verdict = "OK"
        notes.append("Gates passed – safe to merge or enqueue follow-up polish.")
        suggested.append("Optionally run full project pytest.")
        suggested.append(
            "If useful, promote with: uj promote <job_dir> <module_name>"
        )
    else:
        verdict = "NEEDS_WORK"
        notes.append("Gates failed – inspect gates.txt and fix before merging.")
        suggested.append("Re-run with use_real_gates=True after installing ruff/black.")
        suggested.append("Narrow the prompt and re-seed the job.")

    written = summary.get("written_files") or []
    if not written:
        notes.append("No files were written – writer step may have been skipped.")
        suggested.append("Check NaturalTaskRunner._write_implementation.")

    return {
        "verdict": verdict,
        "notes": notes,
        "suggested_next": suggested,
        "job_id": summary.get("job_id"),
    }
