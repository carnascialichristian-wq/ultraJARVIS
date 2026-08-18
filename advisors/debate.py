"""Multi-agent debate loop: safety + style + critic reach a consensus report."""

from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, Optional


def debate_job(job_dir: str | Path, summary: Optional[dict] = None) -> Dict[str, Any]:
    """
    Run advisors in sequence and produce a consensus verdict.

    Agents:
      - safety: blocks on dangerous patterns
      - style: soft quality notes
      - critic: high-level job critique (if summary provided)

    Returns a structured report with per-agent votes and overall decision.
    """
    job_dir = Path(job_dir)
    agents: Dict[str, Any] = {}
    votes: list[str] = []

    try:
        from advisors.safety import scan_job_dir
        safety = scan_job_dir(job_dir)
        agents["safety"] = safety
        votes.append("approve" if safety.get("safe", True) else "reject")
    except Exception as exc:
        agents["safety"] = {"error": str(exc)}
        votes.append("abstain")

    try:
        from advisors.style import scan_job_style
        style = scan_job_style(job_dir)
        agents["style"] = style
        hard = 0
        for notes in (style.get("files") or {}).values():
            for n in notes:
                if any(k in n for k in ("bare except", "wildcard import", "CamelCase")):
                    hard += 1
        votes.append("reject" if hard >= 3 else "approve")
    except Exception as exc:
        agents["style"] = {"error": str(exc)}
        votes.append("abstain")

    try:
        from advisors.critic import critique
        crit = critique(summary or {"status": "UNKNOWN", "title": job_dir.name})
        agents["critic"] = crit
        votes.append("approve")
    except Exception as exc:
        agents["critic"] = {"error": str(exc)}
        votes.append("abstain")

    reject = votes.count("reject")
    approve = votes.count("approve")
    if reject > 0:
        decision = "reject"
    elif approve > 0:
        decision = "approve"
    else:
        decision = "abstain"

    return {
        "decision": decision,
        "votes": votes,
        "agents": agents,
        "job_dir": str(job_dir),
    }
