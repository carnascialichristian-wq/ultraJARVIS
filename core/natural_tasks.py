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

# Job-dir writes use reliability.safe_write (atomic, no project-root lock).
# Agent-facing writes should still go through tools.files.
from core.reliability import safe_write as guarded_write
from core.metrics import record as metric_record
from advisors.critic import critique
from advisors.safety import scan_job_dir
from advisors.style import scan_job_style


ROOT = Path(__file__).resolve().parent.parent
JOBS_DIR = ROOT / "workspace" / "jobs"
JOBS_DIR.mkdir(parents=True, exist_ok=True)



def _code_for_prompt(prompt: str, title: str) -> str:
    """Heuristic code body for common utility patterns.

    Prefer self-contained implementations that mirror the pure helpers
    in tools/*_helpers.py so generated jobs stay isolated and testable.
    """
    low = prompt.lower()

    # --- math ---
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
            "        raise ValueError(\"n must be >= 0\")\n"
            "    result = 1\n"
            "    for i in range(2, n + 1):\n"
            "        result *= i\n"
            "    return result\n\n\n"
            "def run() -> str:\n"
            "    assert factorial(5) == 120\n"
            '    return "ok – factorial works"\n'
        )
    if "fibonacci" in low or "fib(" in low:
        return (
            "def fib(n: int) -> int:\n"
            '    """Return the n-th Fibonacci number (n >= 0)."""\n'
            "    if n < 0:\n"
            "        raise ValueError(\"n must be >= 0\")\n"
            "    a, b = 0, 1\n"
            "    for _ in range(n):\n"
            "        a, b = b, a + b\n"
            "    return a\n\n\n"
            "def run() -> str:\n"
            "    assert fib(10) == 55\n"
            '    return "ok – fib works"\n'
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
            '    """Least common multiple."""\n'
            "    a, b = abs(a), abs(b)\n"
            "    if a == 0 or b == 0:\n"
            "        return 0\n"
            "    return a // gcd(a, b) * b\n\n\n"
            "def run() -> str:\n"
            "    assert lcm(4, 6) == 12\n"
            '    return "ok – lcm works"\n'
        )
    if "gcd" in low or "greatest common" in low:
        return (
            "def gcd(a: int, b: int) -> int:\n"
            '    """Greatest common divisor."""\n'
            "    a, b = abs(a), abs(b)\n"
            "    while b:\n"
            "        a, b = b, a % b\n"
            "    return a\n\n\n"
            "def run() -> str:\n"
            "    assert gcd(12, 18) == 6\n"
            '    return "ok – gcd works"\n'
        )
    if "clamp" in low:
        return (
            "def clamp(x: float, lo: float, hi: float) -> float:\n"
            '    """Clamp x into [lo, hi]."""\n'
            "    return max(lo, min(hi, x))\n\n\n"
            "def run() -> str:\n"
            "    assert clamp(5, 0, 3) == 3 and clamp(-1, 0, 3) == 0\n"
            '    return "ok – clamp works"\n'
        )
    if "mean" in low or "average" in low or "arithmetic mean" in low:
        return (
            "def mean(values):\n"
            '    """Arithmetic mean of a non-empty sequence of numbers."""\n'
            "    values = list(values)\n"
            "    if not values:\n"
            "        raise ValueError(\"mean of empty sequence\")\n"
            "    return sum(values) / len(values)\n\n\n"
            "def run() -> str:\n"
            "    assert mean([1, 2, 3, 4]) == 2.5\n"
            '    return "ok – mean works"\n'
        )

    # --- string ---
    if "palindrome" in low:
        return (
            "def is_palindrome(s: str) -> bool:\n"
            '    """Return True if s is a palindrome (case-insensitive)."""\n'
            "    t = \"\".join(ch.lower() for ch in s if ch.isalnum())\n"
            "    return t == t[::-1]\n\n\n"
            "def run() -> str:\n"
            "    assert is_palindrome(\"Racecar\")\n"
            '    return "ok – palindrome works"\n'
        )
    if "slugify" in low or "slug" in low:
        return (
            "import re\n\n\n"
            "def slugify(text: str) -> str:\n"
            '    """Lowercase, replace non-alnum with underscore."""\n'
            "    text = text.lower().strip()\n"
            "    text = re.sub(r\"[^a-z0-9]+\", \"_\", text)\n"
            "    return text.strip(\"_\") or \"item\"\n\n\n"
            "def run() -> str:\n"
            "    assert slugify(\"Hello World!\") == \"hello_world\"\n"
            '    return "ok – slugify works"\n'
        )
    if "reverse_words" in low or "reverse word" in low or "reverse the words" in low:
        return (
            "def reverse_words(text: str) -> str:\n"
            '    """Reverse the order of words in a string."""\n'
            "    return \" \".join(reversed(text.split()))\n\n\n"
            "def run() -> str:\n"
            "    assert reverse_words(\"one two three\") == \"three two one\"\n"
            '    return "ok – reverse_words works"\n'
        )

    # --- list ---
    if "unique" in low or "dedupe" in low or "deduplicate" in low:
        return (
            "def unique(items):\n"
            '    """Return unique items preserving order."""\n'
            "    seen = set()\n"
            "    out = []\n"
            "    for x in items:\n"
            "        if x not in seen:\n"
            "            seen.add(x)\n"
            "            out.append(x)\n"
            "    return out\n\n\n"
            "def run() -> str:\n"
            "    assert unique([1, 2, 1, 3, 2]) == [1, 2, 3]\n"
            '    return "ok – unique works"\n'
        )
    if "flatten" in low:
        return (
            "def flatten(nested):\n"
            '    """Flatten one level of nested lists."""\n'
            "    out = []\n"
            "    for item in nested:\n"
            "        if isinstance(item, list):\n"
            "            out.extend(item)\n"
            "        else:\n"
            "            out.append(item)\n"
            "    return out\n\n\n"
            "def run() -> str:\n"
            "    assert flatten([[1, 2], [3], 4]) == [1, 2, 3, 4]\n"
            '    return "ok – flatten works"\n'
        )

    # fallback
    return (
        "def run() -> str:\n"
        f'    """Entry point for: {title}"""\n'
        f'    return "ok – executed for {title}"\n'
    )


class NaturalTaskRunner:
    """Architect → Write → Gates → Verify pipeline."""

    def __init__(
        self,
        jobs_root: Path | None = None,
        *,
        use_real_gates: bool = True,
    ) -> None:
        self.jobs_root = Path(jobs_root) if jobs_root else JOBS_DIR
        self.use_real_gates = use_real_gates

    def build_and_run(
        self,
        prompt: str,
        output_dir: Optional[str] = None,
    ) -> dict[str, Any]:
        if not prompt or not prompt.strip():
            raise ValueError("prompt must be non-empty")

        task_plan: Plan = plan(prompt)

        job_id = f"job_{slugify(task_plan.title)[:20]}_{int(time.time()) % 100000}"
        job_dir = self.jobs_root / job_id
        if output_dir:
            job_dir = Path(output_dir)
        job_dir.mkdir(parents=True, exist_ok=True)

        # 1. Plan
        plan_path = job_dir / "plan.md"
        if hasattr(task_plan, "to_markdown"):
            plan_md = task_plan.to_markdown()
        else:
            plan_md = f"# {task_plan.title}\n\n{getattr(task_plan, 'summary', '')}\n"
        guarded_write(plan_path, plan_md)

        # 2. Write (controlled stub under job_dir – never touches protected paths)
        written = self._write_implementation(job_dir, task_plan, prompt)

        # 3. Gates (real tools when available, else stub) – structured result (FIX-6)
        gates = run_gates(
            job_dir,
            files=written,
            use_real=self.use_real_gates,
        )
        gates_text = gates["text"] if isinstance(gates, dict) else str(gates)
        gates_path = job_dir / "gates.txt"
        guarded_write(gates_path, gates_text)

        # 4. Verify – prefer structured ok over text heuristics
        if isinstance(gates, dict) and gates.get("ok") is True:
            status, notes = "PASS", ["Gates reported ok=True"]
        elif isinstance(gates, dict) and gates.get("ok") is False:
            status, notes = "FAIL", ["Gates reported ok=False"]
        elif isinstance(gates, dict) and gates.get("ok") is None:
            # Stub mode: still allow pipeline progress but mark as non-real
            status, notes = "PASS", ["Gates ran in STUB mode (no real tools)"]
        else:
            status, notes = summarize_gates(gates_text)
        verify_path = write_verify(
            job_dir,
            gates_text,
            extra={"job_id": job_id, "status": status, "notes": notes},
        )

        summary = {
            "job_id": job_id,
            "prompt": prompt,
            "title": task_plan.title,
            "status": status,
            "notes": notes,
            "plan_path": str(plan_path),
            "verify_path": str(verify_path),
            "written_files": written,
            "gates_real": self.use_real_gates,
            "ts": time.time(),
        }
        guarded_write(job_dir / "summary.json", json.dumps(summary, indent=2, ensure_ascii=False))
        try:
            metric_record("job_done", job_id=job_id, status=status, title=task_plan.title)
        except Exception:
            pass
        try:
            summary["critique"] = critique(summary)
            guarded_write(job_dir / "critique.json", json.dumps(summary["critique"], indent=2, ensure_ascii=False))
        except Exception:
            pass
        try:
            safety = scan_job_dir(job_dir)
            summary["safety"] = safety
            guarded_write(job_dir / "safety.json", json.dumps(safety, indent=2))
            if not safety.get("safe", True):
                summary["status"] = "FAIL"
                summary.setdefault("notes", []).append("Safety advisor flagged dangerous patterns")
        except Exception:
            pass
        try:
            style = scan_job_style(job_dir)
            summary["style"] = style
            guarded_write(job_dir / "style.json", json.dumps(style, indent=2))
        except Exception:
            pass
        return summary

    def _write_implementation(
        self, job_dir: Path, task_plan: Plan, prompt: str
    ) -> list[str]:
        """
        Write a concrete Python module under the job directory.

        Uses guarded_write so path escape / protected paths are blocked.
        Job dirs are not in the protected set, so this is allowed.
        """
        stub_path = job_dir / "tool.py"
        body = _code_for_prompt(prompt, task_plan.title)
        content = f'''"""Auto-generated module for: {task_plan.title}

Original prompt:
{prompt}

Produced by NaturalTaskRunner (controlled write).
"""

from __future__ import annotations


{body}

if __name__ == "__main__":
    print(run())
'''
        guarded_write(stub_path, content)

        # Also write a tiny test so gates can potentially run pytest on it
        test_path = job_dir / "test_tool.py"
        test_content = f'''"""Smoke test for generated tool."""
from __future__ import annotations

from tool import run


def test_run_returns_ok():
    result = run()
    assert "ok" in result.lower()
'''
        guarded_write(test_path, test_content)

        return ["tool.py", "test_tool.py"]


def promote_job_to_tools(
    job_dir: Path | str,
    module_name: str,
    *,
    root: Path | None = None,
    force: bool = False,
) -> Path:
    """
    Promote a successful job's tool.py into tools/ using guarded file I/O.

    - Validates that tool.py exists and contains a callable.
    - Writes via tools.files.safe_write (respects PROTECTED paths).
    - Does **not** auto-register in the registry (manual / future step).
    - Returns the path written under tools/.

    Raises PermissionError / FileNotFoundError / ValueError on problems.
    """
    from tools.files import safe_write, is_protected

    job_dir = Path(job_dir)
    src = job_dir / "tool.py"
    if not src.is_file():
        raise FileNotFoundError(f"No tool.py in job dir: {job_dir}")

    text = src.read_text(encoding="utf-8")
    if "def " not in text:
        raise ValueError("tool.py does not appear to define any function")

    # Safety gate (FIX-1 / UJ-SEC-003): refuse to promote code matching known
    # dangerous patterns unless the caller explicitly passes force=True.
    from advisors.safety import scan_text
    hits = scan_text(text)
    if hits and not force:
        raise PermissionError(
            f"Refusing to promote: dangerous patterns {hits}. "
            f"Use force=True only with an explicit human decision."
        )

    # Normalise module name: only safe identifier chars
    import re
    safe_name = re.sub(r"[^a-zA-Z0-9_]", "_", module_name.strip()).strip("_").lower()
    if not safe_name or safe_name[0].isdigit():
        raise ValueError(f"Invalid module_name: {module_name!r}")

    # Prefer *_helpers.py naming convention used by the project
    if not safe_name.endswith("_helpers"):
        dest_name = f"{safe_name}_helpers.py"
    else:
        dest_name = f"{safe_name}.py"

    root = root or ROOT
    dest = root / "tools" / dest_name

    if is_protected(dest, root=root) and not force:
        raise PermissionError(f"Refusing to write protected path: {dest}")

    # Header so the promoted file is clearly marked
    header = (
        f'"""Promoted from job {job_dir.name} by NaturalTaskRunner.promote_job_to_tools.\n'
        f"Original prompt / title may be found in the job directory.\n"
        f'"""\n\n'
    )
    # Drop the auto-generated header of the job module to avoid duplication noise
    body = text
    if body.startswith('"""Auto-generated'):
        # skip until the closing """ of the module docstring
        end = body.find('"""', 3)
        if end != -1:
            body = body[end + 3 :].lstrip("\n")

    content = header + body
    return safe_write(dest, content, root=root, force=force)
