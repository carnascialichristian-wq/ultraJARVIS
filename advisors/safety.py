"""Safety advisor – checks for dangerous patterns in generated content."""

from __future__ import annotations

from pathlib import Path
from typing import List

DANGEROUS_SNIPPETS = [
    "rm -rf",
    "os.system(",
    "subprocess.call(",
    "eval(",
    "exec(",
    "__import__('os')",
    "shutil.rmtree",
]


def scan_text(text: str) -> List[str]:
    """Return list of matched dangerous snippets found in text."""
    found = []
    lower = text.lower()
    for snip in DANGEROUS_SNIPPETS:
        if snip.lower() in lower:
            found.append(snip)
    return found


def scan_job_dir(job_dir: str | Path) -> dict:
    """Scan all .py files in a job directory for dangerous patterns."""
    job_dir = Path(job_dir)
    hits: dict[str, List[str]] = {}
    for py in job_dir.glob("**/*.py"):
        try:
            content = py.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue
        found = scan_text(content)
        if found:
            hits[str(py.relative_to(job_dir))] = found
    return {
        "safe": len(hits) == 0,
        "hits": hits,
    }
