"""Task planner for UltraJarvis.

Turns a free-form task description into a structured Plan.
"""

from __future__ import annotations

from dataclasses import dataclass, field, asdict
from typing import List
from pathlib import Path


@dataclass
class Plan:
    title: str
    milestones: List[str] = field(default_factory=list)
    risks: List[str] = field(default_factory=list)
    done_criteria: List[str] = field(default_factory=list)

    def to_markdown(self) -> str:
        lines = [f"# Plan: {self.title}", "", "## Milestones"]
        for i, m in enumerate(self.milestones, 1):
            lines.append(f"{i}. {m}")
        lines += ["", "## Risks"]
        if self.risks:
            for r in self.risks:
                lines.append(f"- {r}")
        else:
            lines.append("- (none identified)")
        lines += ["", "## Done Criteria"]
        for c in self.done_criteria:
            lines.append(f"- [ ] {c}")
        lines.append("")
        return "\n".join(lines)

    def to_dict(self) -> dict:
        return asdict(self)


def _matching_tools(task_text: str) -> list[str]:
    try:
        from core.registry import get_registry
        import re
        reg = get_registry()
        low = (task_text or "").lower()
        tokens = set(re.findall(r"[a-z0-9_]+", low))
        hits: list[str] = []
        for t in reg.list_tools():
            name_key = t.name.split(".")[-1].lower()
            if not name_key:
                continue
            if name_key in tokens:
                hits.append(t.name)
            elif len(name_key) > 3 and any(name_key in tok for tok in tokens):
                hits.append(t.name)
        seen: set[str] = set()
        out: list[str] = []
        for h in hits:
            if h not in seen:
                seen.add(h)
                out.append(h)
        return out[:8]
    except Exception:
        return []


def plan(task_text: str) -> Plan:
    text = (task_text or "").strip()
    if not text:
        title = "Untitled task"
    else:
        title = text.split("\n")[0][:80].strip() or "Untitled task"

    milestones = [
        "Understand requirements and constraints",
        "Implement core functionality",
        "Write unit tests",
        "Run lint / format / tests",
        "Document changes",
    ]
    risks = [
        "Ambiguous requirements may lead to rework",
        "External dependencies or API keys may be missing",
    ]
    done_criteria = [
        "All unit tests pass",
        "Code is linted and formatted",
        "Documentation / docstring is present",
        "No critical files were modified unexpectedly",
    ]

    existing = _matching_tools(text)
    if existing:
        milestones.insert(1, f"Review existing tools that may already cover this: {', '.join(existing)}")
        risks.append("Reimplementing a capability that already exists in the registry")

    return Plan(title=title, milestones=milestones, risks=risks, done_criteria=done_criteria)


def write_plan_md(plan_obj: Plan, job_dir: str | Path) -> Path:
    job_dir = Path(job_dir)
    job_dir.mkdir(parents=True, exist_ok=True)
    path = job_dir / "plan.md"
    path.write_text(plan_obj.to_markdown(), encoding="utf-8")
    return path
