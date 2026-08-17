"""Safety advisor – checks for dangerous patterns in generated content."""

from __future__ import annotations

from pathlib import Path
from typing import List

# Early-warning substring list only (FIX-9 / UJ-SEC-003). Not a security boundary.
# Real containment is admission control (Registry.safe, promote force gate,
# path containment in tools.files).
DANGEROUS_SNIPPETS = [
    "rm -rf",
    "os.system(",
    "subprocess.call(",
    "subprocess.popen",
    "subprocess.run(",
    "eval(",
    "exec(",
    "__import__('os')",
    "importlib.import_module",
    "getattr(__builtins__",
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
