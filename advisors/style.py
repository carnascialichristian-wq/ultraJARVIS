"""Style advisor – checklist on generated Python (naming, docs, types)."""

from __future__ import annotations

import re
from pathlib import Path
from typing import List


def check_style(path: Path) -> List[str]:
    """Return list of style notes (empty if OK)."""
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

    for m in re.finditer(r"^def ([A-Z][A-Za-z0-9_]*)\s*\(", text, re.M):
        notes.append(f"function {m.group(1)} uses CamelCase – prefer snake_case")

    if re.search(r"except\s*:", text):
        notes.append("bare except: – catch a specific exception")

    for m in re.finditer(r"^def ([a-z_][a-z0-9_]*)\s*\(([^)]*)\)\s*:", text, re.M):
        name, args = m.group(1), m.group(2)
        if name.startswith("_"):
            continue
        if args.strip() and ":" not in args and args.strip() not in ("", "self", "cls"):
            if not re.search(rf"def {name}\s*\([^)]*\)\s*->", text):
                notes.append(f"function {name} may lack type hints")

    if re.search(r"from\s+\S+\s+import\s+\*", text):
        notes.append("wildcard import (import *) – prefer explicit names")

    return notes


def scan_job_style(job_dir: str | Path) -> dict:
    job_dir = Path(job_dir)
    report = {}
    for py in sorted(job_dir.glob("*.py")):
        report[py.name] = check_style(py)
    return {
        "ok": all(not v for v in report.values()),
        "files": report,
    }
