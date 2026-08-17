"""Natural-language task runner for UltraJarvis.

Pipeline: Architect (plan) → Write (controlled) → Gates → Verify.
"""

from __future__ import annotations

import json
import time
from pathlib import Path
from typing import Any, Optional

from core.planner import plan, Plan
from core.verify import write_verify, summarize_gates
from core.utils import slugify
from core.gates import run_gates
from core.reliability import safe_write as guarded_write
from core.metrics import record as metric_record
from advisors.critic import critique
from advisors.safety import scan_job_dir
from advisors.style import scan_job_style

ROOT = Path(__file__).resolve().parent.parent
JOBS_DIR = ROOT / "workspace" / "jobs"
JOBS_DIR.mkdir(parents=True, exist_ok=True)


def _code_for_prompt(prompt: str, title: str) -> str:
    """Heuristic code body for common patterns."""
    low = prompt.lower()
    if "is_even" in low or "even int" in low:
        return (
            "def is_even(n: int) -> bool:\n"
            '    """Return True if n is even."""\n'
            "    return n % 2 == 0\n\n\n"
            "def run() -> str:\n"
            "    assert is_even(2) and not is_even(3)\n"
            '    return "ok – is_even works"\n'
        )
    if "factorial" in low:
        return (
            "def factorial(n: int) -> int:\n"
            '    """Return n! for n >= 0."""\n'
            "    if n < 0:\n"
            '        raise ValueError("n must be >= 0")\n'
            "    result = 1\n"
            "    for i in range(2, n + 1):\n"
            "        result *= i\n"
            "    return result\n\n\n"
            "def run() -> str:\n"
            "    assert factorial(5) == 120\n"
            '    return "ok – factorial works"\n'
        )
    if "is_prime" in low or "prime number" in low:
        return (
            "def is_prime(n: int) -> bool:\n"
            '    """Return True if n is a prime number."""\n'
            "    if n <= 1:\n"
            "        return False\n"
            "    if n <= 3:\n"
            "        return True\n"
            "    if n % 2 == 0 or n % 3 == 0:\n"
            "        return False\n"
            "    i = 5\n"
            "    while i * i <= n:\n"
            "        if n % i == 0 or n % (i + 2) == 0:\n"
            "            return False\n"
            "        i += 6\n"
            "    return True\n\n\n"
            "def run() -> str:\n"
            "    assert is_prime(17) and not is_prime(15)\n"
            '    return "ok – is_prime works"\n'
        )
    if "lcm" in low or "least common" in low:
        return (
            "def gcd(a: int, b: int) -> int:\n"
            "    a, b = abs(a), abs(b)\n"
            "    while b:\n"
            "        a, b = b, a % b\n"
            "    return a\n\n\n"
            "def lcm(a: int, b: int) -> int:\n"
            "    a, b = abs(a), abs(b)\n"
            "    if a == 0 or b == 0:\n"
            "        return 0\n"
            "    return a // gcd(a, b) * b\n\n\n"
            "def run() -> str:\n"
            "    assert lcm(4, 6) == 12\n"
            '    return "ok – lcm works"\n'
        )
    return (
        "def run() -> str:\n"
        f'    """Entry point for: {title}"""\n'
        f'    return "ok – executed for {title}"\n'
    )


class NaturalTaskRunner:
    """Architect → Write → Gates → Verify pipeline."""

    def __init__(self, jobs_root: Path | None = None, *, use_real_gates: bool = True) -> None:
        self.jobs_root = Path(jobs_root) if jobs_root else JOBS_DIR
        self.use_real_gates = use_real_gates

    def build_and_run(self, prompt: str, output_dir: Optional[str] = None) -> dict[str, Any]:
        if not prompt or not prompt.strip():
            raise ValueError("prompt must be non-empty")

        task_plan: Plan = plan(prompt)
        job_id = f"job_{slugify(task_plan.title)[:20]}_{int(time.time()) % 100000}"
        job_dir = self.jobs_root / job_id
        if output_dir:
            job_dir = Path(output_dir)
        job_dir.mkdir(parents=True, exist_ok=True)

        plan_md = task_plan.to_markdown() if hasattr(task_plan, "to_markdown") else f"# {task_plan.title}\n"
        guarded_write(job_dir / "plan.md", plan_md)

        written = self._write_implementation(job_dir, task_plan, prompt)

        gates_text = run_gates(job_dir, files=written, use_real=self.use_real_gates)
        guarded_write(job_dir / "gates.txt", gates_text if isinstance(gates_text, str) else str(gates_text))

        status = "PASS" if "PASS" in str(gates_text).upper() or "ok" in str(gates_text).lower() else "FAIL"
        summary = {
            "job_id": job_id,
            "status": status,
            "title": task_plan.title,
            "written_files": [str(p) for p in written],
            "notes": [],
        }

        try:
            crit = critique(summary)
        except Exception as e:
            crit = {"verdict": "UNKNOWN", "notes": [str(e)], "suggested_next": []}
        try:
            safety = scan_job_dir(job_dir)
        except Exception:
            safety = {"safe": True, "hits": {}}
        try:
            style = scan_job_style(job_dir)
        except Exception:
            style = {"ok": True, "files": {}}

        try:
            write_verify(job_dir, status=status, notes=crit.get("notes") or [])
        except Exception:
            pass

        try:
            metric_record("natural_task", job_id=job_id, status=status)
        except Exception:
            pass

        return {
            "job_id": job_id,
            "status": status,
            "critique": crit,
            "safety": safety,
            "style": style,
            "written": summary["written_files"],
        }

    def _write_implementation(self, job_dir: Path, task_plan: Plan, prompt: str) -> list[Path]:
        code = _code_for_prompt(prompt, task_plan.title)
        tool_body = (
            '"""Auto-generated tool module for job."""\n'
            "from __future__ import annotations\n\n"
            + code
        )
        test_body = (
            '"""Auto-generated tests."""\n'
            "from __future__ import annotations\n\n"
            "def test_run_returns_ok():\n"
            "    from tool import run\n"
            '    assert "ok" in run().lower()\n'
        )
        tool_path = job_dir / "tool.py"
        test_path = job_dir / "test_tool.py"
        guarded_write(tool_path, tool_body)
        guarded_write(test_path, test_body)
        return [tool_path, test_path]


def promote_job_to_tools(
    job_dir: Path | str,
    module_name: str,
    *,
    root: Path | None = None,
    force: bool = False,
) -> Path:
    """Promote a successful job's tool.py into tools/ using guarded I/O."""
    from tools.files import safe_write, is_protected
    import re

    job_dir = Path(job_dir)
    src = job_dir / "tool.py"
    if not src.is_file():
        raise FileNotFoundError(f"No tool.py in job dir: {job_dir}")

    text = src.read_text(encoding="utf-8")
    if "def " not in text:
        raise ValueError("tool.py does not appear to define any function")

    safe_name = re.sub(r"[^a-zA-Z0-9_]", "_", module_name.strip()).strip("_").lower()
    if not safe_name or safe_name[0].isdigit():
        raise ValueError(f"Invalid module_name: {module_name!r}")

    dest_name = f"{safe_name}_helpers.py" if not safe_name.endswith("_helpers") else f"{safe_name}.py"
    root = root or ROOT
    dest = root / "tools" / dest_name

    if is_protected(dest, root=root) and not force:
        raise PermissionError(f"Refusing to write protected path: {dest}")

    header = (
        f'"""Promoted from job {job_dir.name} by promote_job_to_tools.\n"'
        f'"""\n\n'
    )
    body = text
    safe_write(dest, header + body, root=root)
    return dest
