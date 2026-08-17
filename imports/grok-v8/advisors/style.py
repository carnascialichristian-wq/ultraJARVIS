"""Style advisor – lightweight checklist on generated Python."""

from __future__ import annotations

from pathlib import Path
from typing import List


def check_style(path: Path) -> List[str]:
    notes: List[str] = []
    try:
        text = path.read_text(encoding="utf-8")
    except Exception as exc:
        return [f"cannot read: {exc}"]
    if '"""' not in text and "'''" not in text:
        notes.append("missing module or function docstring")
    if "from __future__ import annotations" not in text:
        notes.append("consider enabling from __future__ import annotations")
    if "\t" in text:
        notes.append("contains tab characters – prefer spaces")
    lines = text.splitlines()
    long_lines = [i + 1 for i, ln in enumerate(lines) if len(ln) > 100]
    if long_lines:
        notes.append(f"long lines (>100) at: {long_lines[:5]}")
    return notes


def scan_job_style(job_dir: str | Path) -> dict:
    job_dir = Path(job_dir)
    report = {}
    for py in sorted(job_dir.glob("*.py")):
        report[py.name] = check_style(py)
    return {"ok": all(not v for v in report.values()), "files": report}
