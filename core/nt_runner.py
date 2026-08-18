"""NaturalTaskRunner + promote_job_to_tools."""
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
from core.nt_helpers import (
    ROOT,
    JOBS_DIR,
    _code_via_llm,
    _code_for_prompt,
    _detect_multi_patterns,
    _code_for_key,
    _write_dep_graph,
    _skills_hint,
)


class NaturalTaskRunner:
    """Architect → Write → Gates → Verify pipeline."""

    def __init__(self, jobs_root: Path | None = None, *, use_real_gates: bool = True) -> None:
        self.jobs_root = Path(jobs_root) if jobs_root else JOBS_DIR
        self.use_real_gates = use_real_gates

    def build_and_run(self, prompt: str, output_dir: Optional[str] = None) -> dict[str, Any]:
        if not prompt or not prompt.strip():
            raise ValueError("prompt must be non-empty")
        try:
            from core.monetization import check_job_quota
            check_job_quota()
        except Exception as exc:
            from core.monetization import QuotaExceeded
            if isinstance(exc, QuotaExceeded):
                raise
        task_plan: Plan = plan(prompt)
        job_id = f"job_{slugify(task_plan.title)[:20]}_{int(time.time()) % 100000}"
        job_dir = self.jobs_root / job_id
        if output_dir:
            job_dir = Path(output_dir)
        job_dir.mkdir(parents=True, exist_ok=True)
        plan_path = job_dir / "plan.md"
        if hasattr(task_plan, "to_markdown"):
            plan_md = task_plan.to_markdown()
        else:
            plan_md = f"# {task_plan.title}\n\n{getattr(task_plan, 'summary', '')}\n"
        guarded_write(plan_path, plan_md)
        written = self._write_implementation(job_dir, task_plan, prompt)
        graph_result = None
        if (job_dir / "deps.json").is_file():
            try:
                from core.graph_exec import execute_graph
                graph_result = execute_graph(job_dir)
            except Exception as exc:
                graph_result = {"ok": False, "error": str(exc)}
        gates = run_gates(job_dir, files=written, use_real=self.use_real_gates)
        gates_text = gates["text"] if isinstance(gates, dict) else str(gates)
        guarded_write(job_dir / "gates.txt", gates_text)
        if isinstance(gates, dict) and gates.get("ok") is True:
            status, notes = "PASS", ["Gates reported ok=True"]
        elif isinstance(gates, dict) and gates.get("ok") is False:
            status, notes = "FAIL", ["Gates reported ok=False"]
        elif isinstance(gates, dict) and gates.get("ok") is None:
            status, notes = "PASS", ["Gates ran in STUB mode (no real tools)"]
        else:
            status, notes = summarize_gates(gates_text)
        verify_path = write_verify(job_dir, gates_text, extra={"job_id": job_id, "status": status, "notes": notes})
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
            "graph": graph_result,
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
        try:
            from advisors.debate import debate_job
            debate = debate_job(job_dir, summary)
            summary["debate"] = {"decision": debate.get("decision"), "votes": debate.get("votes")}
            guarded_write(job_dir / "debate.json", json.dumps(debate, indent=2, default=str))
            if debate.get("decision") == "reject" and summary.get("status") == "PASS":
                summary["status"] = "FAIL"
                summary.setdefault("notes", []).append("Debate rejected the job")
        except Exception:
            pass
        try:
            from core.monetization import record_usage
            record_usage("job_run", units=1.0, meta={"job_id": job_id, "status": summary.get("status")})
        except Exception:
            pass
        try:
            from core.memory import remember
            final_status = summary.get("status", status)
            remember(
                f"job:{job_id} title={task_plan.title!r} status={final_status}",
                tags=["job", final_status.lower(), "natural_tasks"],
            )
            summary["remembered"] = True
        except Exception:
            summary["remembered"] = False
        return summary

    def _write_implementation(self, job_dir: Path, task_plan: Plan, prompt: str) -> list[str]:
        patterns = _detect_multi_patterns(prompt)
        written: list[str] = []
        edges: list[tuple[str, str]] = []
        if len(patterns) >= 2:
            import_lines: list[str] = []
            run_calls: list[str] = []
            for key in patterns:
                mod_name = f"{key}_mod"
                body = _code_for_key(key, task_plan.title)
                mod_path = job_dir / f"{mod_name}.py"
                mod_content = (
                    f'"""Helper module for {key} (multi-file job)."""\n'
                    "from __future__ import annotations\n\n\n"
                    f"{body}\n"
                )
                guarded_write(mod_path, mod_content)
                written.append(f"{mod_name}.py")
                import_lines.append(f"from {mod_name} import run as run_{key}")
                run_calls.append(f"    parts.append(run_{key}())")
                edges.append((f"{mod_name}.py", "tool.py"))
            orch_header = (
                f'"""Auto-generated multi-file orchestrator for: {task_plan.title}\n\n'
                f"Original prompt:\n{prompt}\n\n"
                "Produced by NaturalTaskRunner (multi-file).\n"
                '"""\n\n'
                "from __future__ import annotations\n\n"
            )
            orch_body = (
                "\n".join(import_lines)
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
            guarded_write(job_dir / "tool.py", orch_header + orch_body)
            written.append("tool.py")
        else:
            body = _code_for_prompt(prompt, task_plan.title)
            content = (
                f'"""Auto-generated module for: {task_plan.title}\n\n'
                f"Original prompt:\n{prompt}\n\n"
                "Produced by NaturalTaskRunner (controlled write).\n"
                '"""\n\n'
                "from __future__ import annotations\n\n\n"
                f"{body}\n\n"
                'if __name__ == "__main__":\n'
                "    print(run())\n"
            )
            guarded_write(job_dir / "tool.py", content)
            written.append("tool.py")
        test_content = (
            '"""Smoke test for generated tool."""\n'
            "from __future__ import annotations\n\n"
            "from tool import run\n\n\n"
            "def test_run_returns_ok():\n"
            "    result = run()\n"
            '    assert "ok" in result.lower()\n'
        )
        guarded_write(job_dir / "test_tool.py", test_content)
        written.append("test_tool.py")
        if len(patterns) >= 2:
            edges.append(("tool.py", "test_tool.py"))
            dep_name = _write_dep_graph(job_dir, [w for w in written if w.endswith(".py")], edges)
            written.append(dep_name)
        self._maybe_format([job_dir / w for w in written if w.endswith(".py")])
        return written

    def _maybe_format(self, paths: list[Path]) -> None:
        import shutil
        import subprocess
        black = shutil.which("black")
        if not black:
            return
        try:
            subprocess.run(
                [black, "--quiet", *[str(p) for p in paths if p.is_file()]],
                capture_output=True, timeout=30, check=False,
            )
        except Exception:
            pass


def promote_job_to_tools(
    job_dir: Path | str,
    module_name: str,
    *,
    root: Path | None = None,
    force: bool = False,
    register: bool = False,
) -> Path:
    """Promote job tool.py into tools/ with safety scan and optional Registry.add."""
    import re
    from tools.files import safe_write, is_protected
    job_dir = Path(job_dir)
    src = job_dir / "tool.py"
    if not src.is_file():
        raise FileNotFoundError(f"No tool.py in job dir: {job_dir}")
    text = src.read_text(encoding="utf-8")
    if "def " not in text:
        raise ValueError("tool.py does not appear to define any function")
    from advisors.safety import scan_text
    hits = scan_text(text)
    if hits and not force:
        raise PermissionError(
            f"Refusing to promote: dangerous patterns {hits}. "
            f"Use force=True only with an explicit human decision."
        )
    safe_name = re.sub(r"[^a-zA-Z0-9_]", "_", module_name.strip()).strip("_").lower()
    if not safe_name or safe_name[0].isdigit():
        raise ValueError(f"Invalid module_name: {module_name!r}")
    if not safe_name.endswith("_helpers"):
        dest_name = f"{safe_name}_helpers.py"
        module_import = f"tools.{safe_name}_helpers"
        tool_prefix = safe_name
    else:
        dest_name = f"{safe_name}.py"
        module_import = f"tools.{safe_name}"
        tool_prefix = safe_name[: -len("_helpers")] if safe_name.endswith("_helpers") else safe_name
    root = root or ROOT
    dest = root / "tools" / dest_name
    if is_protected(dest, root=root) and not force:
        raise PermissionError(f"Refusing to write protected path: {dest}")
    header = (
        f'"""Promoted from job {job_dir.name} by NaturalTaskRunner.promote_job_to_tools.\n'
        f"Original prompt / title may be found in the job directory.\n"
        f'"""\n\n'
    )
    body = text
    if body.startswith('"""Auto-generated'):
        end = body.find('"""', 3)
        if end != -1:
            body = body[end + 3 :].lstrip("\n")
    content = header + body
    written = safe_write(dest, content, root=root, force=force)
    if register:
        names = re.findall(r"^def ([a-zA-Z_][a-zA-Z0-9_]*)\s*\(", body, re.M)
        public = [n for n in names if not n.startswith("_")]
        callable_name = "run" if "run" in public else (public[0] if public else None)
        if callable_name is None:
            raise ValueError("Cannot auto-register: no public function found in promoted module")
        from core.registry import ToolSpec, get_registry
        tool_name = f"{tool_prefix}.{callable_name}"
        spec = ToolSpec(
            name=tool_name,
            description=f"Promoted helper from job {job_dir.name}",
            module=module_import,
            callable_name=callable_name,
            safe=True,
            tags=["promoted", tool_prefix],
        )
        get_registry().add(spec)
        try:
            from core.skills import add_skill
            add_skill(
                name=tool_name,
                description=f"Promoted from {job_dir.name}",
                tags=["promoted", tool_prefix, "auto"],
                content=f"module={module_import} callable={callable_name}",
            )
        except Exception:
            pass
    return written
