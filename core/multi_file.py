"""Multi-file job support: detect patterns, write modules, emit deps.json."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Callable, List, Tuple


_MULTI_PATTERNS: list[tuple[str, tuple[str, ...], str]] = [
    ("is_even", ("is_even", "even int", "even number"), "is_even"),
    ("factorial", ("factorial",), "factorial"),
    ("fib", ("fibonacci", "fib("), "fibonacci"),
    ("is_prime", ("is_prime", "prime number"), "is_prime"),
    ("lcm", ("lcm", "least common"), "lcm"),
    ("gcd", ("gcd", "greatest common"), "gcd"),
    ("clamp", ("clamp",), "clamp"),
    ("mean", ("mean", "average", "arithmetic mean"), "mean"),
    ("palindrome", ("palindrome",), "palindrome"),
    ("slugify", ("slugify", "slug"), "slugify"),
    ("reverse_words", ("reverse_words", "reverse word", "reverse the words"), "reverse_words"),
    ("unique", ("unique", "dedupe", "deduplicate"), "unique"),
    ("flatten", ("flatten",), "flatten"),
]


def detect_multi_patterns(prompt: str) -> list[str]:
    """Return ordered list of pattern keys present in the prompt."""
    low = (prompt or "").lower()
    hits: list[str] = []
    for _stem, phrases, key in _MULTI_PATTERNS:
        if any(p in low for p in phrases) and key not in hits:
            hits.append(key)
    return hits


def write_dep_graph(
    job_dir: Path,
    modules: list[str],
    edges: list[tuple[str, str]],
    write_fn: Callable[[Path, str], None],
) -> str:
    graph = {
        "modules": modules,
        "edges": [{"from": a, "to": b} for a, b in edges],
        "roots": [m for m in modules if not any(e[1] == m for e in edges)],
    }
    path = job_dir / "deps.json"
    write_fn(path, json.dumps(graph, indent=2))
    return "deps.json"


def write_multi_file_job(
    job_dir: Path,
    prompt: str,
    title: str,
    *,
    code_for_key: Callable[[str, str], str],
    write_fn: Callable[[Path, str], None],
) -> tuple[list[str], list[tuple[str, str]]]:
    """Write one helper module per pattern + orchestrator tool.py."""
    patterns = detect_multi_patterns(prompt)
    written: list[str] = []
    edges: list[tuple[str, str]] = []
    import_lines: list[str] = []
    run_calls: list[str] = []

    for key in patterns:
        mod_name = f"{key}_mod"
        body = code_for_key(key, title)
        mod_path = job_dir / f"{mod_name}.py"
        mod_content = (
            f'"""Helper module for {key} (multi-file job)."""\n'
            "from __future__ import annotations\n\n\n"
            f"{body}\n"
        )
        write_fn(mod_path, mod_content)
        written.append(f"{mod_name}.py")
        import_lines.append(f"from {mod_name} import run as run_{key}")
        run_calls.append(f"    parts.append(run_{key}())")
        edges.append((f"{mod_name}.py", "tool.py"))

    orch = (
        f'"""Auto-generated multi-file orchestrator for: {title}\n\n'
        f"Original prompt:\n{prompt}\n\n"
        "Produced by NaturalTaskRunner (multi-file).\n"
        '"""\n\n'
        "from __future__ import annotations\n\n"
        + "\n".join(import_lines)
        + "\n\n\n"
        "def run() -> str:\n"
        '    """Run all helpers and join their ok messages."""\n'
        "    parts: list[str] = []\n"
        + "\n".join(run_calls)
        + "\n"
        '    return "ok – multi: " + " | ".join(parts)\n\n\n'
        'if __name__ == "__main__":\n'
        "    print(run())\n"
    )
    write_fn(job_dir / "tool.py", orch)
    written.append("tool.py")
    return written, edges
