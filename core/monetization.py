"""Monetization: usage metering, tiers, quota enforce, LLM budget."""

from __future__ import annotations

import json
import os
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

DEFAULT_USAGE_PATH = Path("workspace/usage.jsonl")
DEFAULT_BUDGET_PATH = Path("workspace/llm_budget.json")


def record_usage(
    event: str,
    *,
    units: float = 1.0,
    meta: Optional[Dict[str, Any]] = None,
    path: Optional[Path] = None,
) -> Dict[str, Any]:
    if not event or not event.strip():
        raise ValueError("event required")
    path = path or DEFAULT_USAGE_PATH
    entry = {
        "ts": time.time(),
        "event": event.strip(),
        "units": float(units),
        "meta": meta or {},
    }
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    return entry


def summarize_usage(
    *,
    path: Optional[Path] = None,
    since_ts: float = 0.0,
) -> Dict[str, Any]:
    path = path or DEFAULT_USAGE_PATH
    totals: Dict[str, float] = {}
    count = 0
    if not path.exists():
        return {"events": totals, "count": 0}
    for line in path.read_text(encoding="utf-8").splitlines():
        try:
            e = json.loads(line)
        except json.JSONDecodeError:
            continue
        if float(e.get("ts") or 0) < since_ts:
            continue
        name = e.get("event") or "unknown"
        totals[name] = totals.get(name, 0.0) + float(e.get("units") or 0)
        count += 1
    return {"events": totals, "count": count}


def plan_tiers() -> List[Dict[str, Any]]:
    return [
        {"id": "free", "jobs_per_day": 20, "llm_calls_per_day": 10, "llm": False, "price_usd": 0},
        {"id": "pro", "jobs_per_day": 500, "llm_calls_per_day": 2000, "llm": True, "price_usd": 29},
        {"id": "team", "jobs_per_day": 5000, "llm_calls_per_day": 20000, "llm": True, "price_usd": 99},
    ]


def current_tier() -> Dict[str, Any]:
    tid = os.environ.get("UJ_TIER", "free").strip().lower() or "free"
    for t in plan_tiers():
        if t["id"] == tid:
            return t
    return plan_tiers()[0]


def _day_start_ts() -> float:
    import datetime as dt
    now = dt.datetime.now(dt.timezone.utc)
    start = dt.datetime(now.year, now.month, now.day, tzinfo=dt.timezone.utc)
    return start.timestamp()


class QuotaExceeded(Exception):
    pass


def check_job_quota(*, usage_path: Optional[Path] = None) -> None:
    """Opt-in via UJ_ENFORCE_QUOTA=1."""
    if os.getenv("UJ_ENFORCE_QUOTA", "").strip() != "1":
        return
    tier = current_tier()
    limit = float(tier.get("jobs_per_day") or 0)
    if limit <= 0:
        return
    s = summarize_usage(path=usage_path, since_ts=_day_start_ts())
    used = float((s.get("events") or {}).get("job_run") or 0)
    if used >= limit:
        raise QuotaExceeded(f"job quota exceeded for tier {tier['id']}: {used}/{limit}")


def check_llm_quota(*, usage_path: Optional[Path] = None) -> None:
    if os.getenv("UJ_ENFORCE_QUOTA", "").strip() != "1":
        return
    tier = current_tier()
    limit = float(tier.get("llm_calls_per_day") or 0)
    if limit <= 0:
        return
    s = summarize_usage(path=usage_path, since_ts=_day_start_ts())
    used = float((s.get("events") or {}).get("llm_call") or 0)
    if used >= limit:
        raise QuotaExceeded(f"llm quota exceeded for tier {tier['id']}: {used}/{limit}")


def record_llm_call(*, units: float = 1.0, meta: Optional[dict] = None) -> dict:
    check_llm_quota()
    return record_usage("llm_call", units=units, meta=meta or {})


def get_llm_budget() -> Dict[str, Any]:
    soft_cap = float(os.environ.get("UJ_LLM_BUDGET_USD", "0") or 0)
    s = summarize_usage(since_ts=_day_start_ts())
    calls = float((s.get("events") or {}).get("llm_call") or 0)
    unit_cost = float(os.environ.get("UJ_LLM_UNIT_COST_USD", "0.001") or 0.001)
    spent = calls * unit_cost
    return {
        "calls_today": calls,
        "spent_usd_est": round(spent, 6),
        "soft_cap_usd": soft_cap,
        "ok": soft_cap <= 0 or spent < soft_cap,
        "tier": current_tier()["id"],
    }


def assert_llm_budget() -> None:
    b = get_llm_budget()
    if not b["ok"]:
        raise QuotaExceeded(
            f"LLM soft budget exceeded: ${b['spent_usd_est']} >= ${b['soft_cap_usd']}"
        )
