"""Multi-agent debate loop: safety + style + critic, iterative rounds."""

from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List, Optional


def _vote_safety(job_dir: Path) -> tuple[str, dict]:
    try:
        from advisors.safety import scan_job_dir
        safety = scan_job_dir(job_dir)
        return ("approve" if safety.get("safe", True) else "reject", safety)
    except Exception as exc:
        return ("abstain", {"error": str(exc)})


def _vote_style(job_dir: Path) -> tuple[str, dict]:
    try:
        from advisors.style import scan_job_style
        style = scan_job_style(job_dir)
        hard = sum(
            1
            for notes in (style.get("files") or {}).values()
            for n in notes
            if any(k in n for k in ("bare except", "wildcard import", "CamelCase"))
        )
        return ("reject" if hard >= 3 else "approve", style)
    except Exception as exc:
        return ("abstain", {"error": str(exc)})


def _vote_critic(summary: Optional[dict], job_dir: Path) -> tuple[str, dict]:
    try:
        from advisors.critic import critique
        crit = critique(summary or {"status": "UNKNOWN", "title": job_dir.name})
        status = (summary or {}).get("status", "")
        vote = "reject" if status == "FAIL" else "approve"
        return (vote, crit if isinstance(crit, dict) else {"critique": crit})
    except Exception as exc:
        return ("abstain", {"error": str(exc)})


def debate_job(
    job_dir: str | Path,
    summary: Optional[dict] = None,
    *,
    max_rounds: int = 3,
) -> Dict[str, Any]:
    job_dir = Path(job_dir)
    max_rounds = max(1, min(int(max_rounds), 5))
    history: List[dict] = []
    decision = "abstain"
    last_agents: Dict[str, Any] = {}
    last_votes: List[str] = []
    for rnd in range(1, max_rounds + 1):
        v_s, a_s = _vote_safety(job_dir)
        v_st, a_st = _vote_style(job_dir)
        v_c, a_c = _vote_critic(summary, job_dir)
        votes = [v_s, v_st, v_c]
        agents = {"safety": a_s, "style": a_st, "critic": a_c}
        history.append({"round": rnd, "votes": votes})
        last_agents, last_votes = agents, votes
        if "reject" in votes:
            decision = "reject"
            if rnd < max_rounds:
                continue
            break
        if votes.count("approve") >= 2:
            decision = "approve"
            break
        decision = "approve" if "approve" in votes else "abstain"
        break
    return {
        "decision": decision,
        "votes": last_votes,
        "agents": last_agents,
        "rounds": len(history),
        "history": history,
        "job_dir": str(job_dir),
    }
