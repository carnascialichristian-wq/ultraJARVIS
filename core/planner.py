"""Task planner for UltraJarvis.

Turns a free-form task description into a structured Plan.
"""

from __future__ import annotations

from dataclasses import dataclass, field, asdict
from typing import List
import json
from pathlib import Path


@dataclass
class Plan:
    """Structured plan produced by the planner."""

    title: str
    milestones: List[str] = field(default_factory=list)
    risks: List[str] = field(default_factory=list)
    done_criteria: List[str] = field(default_factory=list)

    def to_markdown(self) -> str:
        """Render the plan as a readable Markdown document."""
        lines = [
            f"# Plan: {self.title}",
            "",
            "## Milestones",
        ]
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
    """Return registry tool names whose short name appears in the prompt."""
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
            # whole-token match preferred; skip very short keys that cause false positives
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


def _plan_via_llm(task_text: str) -> Plan | None:
    """
    Optional LLM-backed planner (Phase 2 adapter).

    Calls cloud_bridge.ask_cloud_ai and expects a small JSON object:
      {"title": "...", "milestones": [...], "risks": [...], "done_criteria": [...]}

    Returns None on any failure so the heuristic planner remains the fallback.
    Enabled only when UJ_PLANNER_LLM=1.
    """
    import os
    import re

    if os.getenv("UJ_PLANNER_LLM", "").strip() != "1":
        return None
    if not (task_text or "").strip():
        return None

    try:
        from cloud_bridge import ask_cloud_ai
    except Exception:
        return None

    system = (
        "You are the UltraJarvis task planner. "
        "Reply with ONLY a single JSON object (no markdown fences) with keys: "
        "title (string), milestones (array of strings), risks (array of strings), "
        "done_criteria (array of strings). Keep lists short (3-6 items)."
    )
    user = f"Create a plan for this task:\n\n{task_text.strip()[:2000]}"
    raw = ask_cloud_ai(user, system=system)
    if not raw or not raw.strip():
        return None

    # Strip optional markdown fences if the model ignored instructions
    cleaned = raw.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)

    try:
        data = json.loads(cleaned)
    except Exception:
        # last-ditch: find first { ... } block
        m = re.search(r"\{[\s\S]*\}", cleaned)
        if not m:
            return None
        try:
            data = json.loads(m.group(0))
        except Exception:
            return None

    if not isinstance(data, dict):
        return None
    title = str(data.get("title") or "").strip() or "Untitled task"
    milestones = [str(x).strip() for x in (data.get("milestones") or []) if str(x).strip()]
    risks = [str(x).strip() for x in (data.get("risks") or []) if str(x).strip()]
    done = [str(x).strip() for x in (data.get("done_criteria") or []) if str(x).strip()]
    if not milestones:
        return None  # too empty to be useful

    # Surface existing tools even on the LLM path
    existing = _matching_tools(task_text)
    if existing:
        milestones.insert(
            1,
            f"Review existing tools that may already cover this: {', '.join(existing)}",
        )
        risks.append(
            "Reimplementing a capability that already exists in the registry"
        )

    return Plan(
        title=title[:120],
        milestones=milestones[:8],
        risks=risks[:6],
        done_criteria=done[:6] or [
            "All unit tests pass",
            "Code is linted and formatted",
        ],
    )


def plan(task_text: str) -> Plan:
    """
    Create a Plan from a natural-language task description.

    Prefer the LLM adapter when UJ_PLANNER_LLM=1 and the model returns
    usable JSON; otherwise fall back to the deterministic heuristic.
    """
    llm_plan = _plan_via_llm(task_text)
    if llm_plan is not None:
        return llm_plan

    # Deterministic heuristic fallback
    text = (task_text or "").strip()
    if not text:
        title = "Untitled task"
    else:
        # First line or first 80 chars as title
        title = text.split("\n")[0][:80].strip() or "Untitled task"

    # Simple heuristic milestones
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
        milestones.insert(
            1,
            f"Review existing tools that may already cover this: {', '.join(existing)}",
        )
        risks.append(
            "Reimplementing a capability that already exists in the registry"
        )

    return Plan(
        title=title,
        milestones=milestones,
        risks=risks,
        done_criteria=done_criteria,
    )


def write_plan_md(plan_obj: Plan, job_dir: str | Path) -> Path:
    """Write plan.md inside a job directory and return the path."""
    job_dir = Path(job_dir)
    job_dir.mkdir(parents=True, exist_ok=True)
    path = job_dir / "plan.md"
    path.write_text(plan_obj.to_markdown(), encoding="utf-8")
    return path
