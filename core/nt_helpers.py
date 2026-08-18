"""Helpers for natural tasks pipeline."""
from __future__ import annotations

from pathlib import Path
from typing import Any, Optional

from core.reliability import safe_write as guarded_write

ROOT = Path(__file__).resolve().parent.parent
JOBS_DIR = ROOT / "workspace" / "jobs"
JOBS_DIR.mkdir(parents=True, exist_ok=True)


def _code_via_llm(prompt: str, title: str) -> str | None:
    """Optional LLM-backed code writer. Opt-in UJ_WRITER_LLM=1."""
    import os
    import re
    if os.getenv("UJ_WRITER_LLM", "").strip() != "1":
        return None
    if not (prompt or "").strip():
        return None
    try:
        from cloud_bridge import ask_cloud_ai
    except Exception:
        return None
    system = (
        "You are the UltraJarvis code writer. "
        "Reply with ONLY valid Python source code (no markdown fences, no prose). "
        "The module must define a public function `run() -> str` that returns a string "
        "containing 'ok'. Add any helper functions needed for the task. "
        "Keep the code self-contained, no external imports beyond the standard library."
    )
    user = f"Task title: {title}\nTask prompt:\n{prompt.strip()[:1500]}\n\nWrite the Python module body now."
    raw = ask_cloud_ai(user, system=system)
    if not raw or not raw.strip():
        return None
    body = raw.strip()
    if body.startswith("```"):
        body = re.sub(r"^```(?:python)?\s*", "", body)
        body = re.sub(r"\s*```$", "", body)
        body = body.strip()
    if "def run" not in body:
        return None
    try:
        compile(body, "<llm-writer>", "exec")
    except SyntaxError:
        return None
    try:
        from advisors.safety import scan_text
        if scan_text(body):
            return None
    except Exception:
        return None
    return body


def _code_for_prompt(prompt: str, title: str) -> str:
    """Code body: LLM writer when UJ_WRITER_LLM=1 else heuristics."""
    llm_body = _code_via_llm(prompt, title)
    if llm_body is not None:
        return llm_body
    try:
        _skills_hint(prompt)
    except Exception:
        pass
    from core.code_templates import code_for_prompt
    return code_for_prompt(prompt, title)


def _detect_multi_patterns(prompt: str) -> list[str]:
    """Return ordered list of pattern keys present in the prompt (2+ => multi-file)."""
    from core.multi_file import detect_multi_patterns
    return detect_multi_patterns(prompt)


def _code_for_key(key: str, title: str) -> str:
    prompts = {
        "is_even": "is_even even int",
        "factorial": "factorial",
        "fibonacci": "fibonacci fib(",
        "is_prime": "is_prime prime number",
        "lcm": "lcm least common",
        "gcd": "gcd greatest common",
        "clamp": "clamp",
        "mean": "mean average arithmetic mean",
        "palindrome": "palindrome",
        "slugify": "slugify slug",
        "reverse_words": "reverse_words reverse the words",
        "unique": "unique dedupe",
        "flatten": "flatten",
    }
    return _code_for_prompt(prompts.get(key, key), title)


def _write_dep_graph(job_dir: Path, modules: list[str], edges: list[tuple[str, str]]) -> str:
    import json as _json
    graph = {
        "modules": modules,
        "edges": [{"from": a, "to": b} for a, b in edges],
        "roots": [m for m in modules if not any(e[1] == m for e in edges)],
    }
    path = job_dir / "deps.json"
    guarded_write(path, _json.dumps(graph, indent=2))
    return "deps.json"


def _skills_hint(prompt: str) -> str | None:
    try:
        from core.skills import list_skills, find_skill
    except Exception:
        return None
    low = (prompt or "").lower()
    for s in list_skills() or []:
        if not isinstance(s, dict):
            continue
        name = (s.get("name") or "")
        short = name.split(".")[0].lower()
        tags = [t.lower() for t in (s.get("tags") or [])]
        if short and short in low:
            return s.get("content") or s.get("description")
        if any(t in low for t in tags if len(t) > 2):
            return s.get("content") or s.get("description")
    for tok in low.replace("-", " ").split():
        if len(tok) < 3:
            continue
        try:
            hits = find_skill(tok) or []
        except Exception:
            hits = []
        if hits:
            hit = hits[0]
            return hit.get("content") or hit.get("description")
    return None
