"""Health check utilities for UltraJarvis."""

from __future__ import annotations

import os
import shutil
import sys
from pathlib import Path
from typing import Dict, List, Tuple


def check_python_version(min_major: int = 3, min_minor: int = 10) -> Tuple[bool, str]:
    v = sys.version_info
    ok = (v.major, v.minor) >= (min_major, min_minor)
    msg = f"Python {v.major}.{v.minor}.{v.micro}"
    return ok, msg


def check_venv() -> Tuple[bool, str]:
    in_venv = hasattr(sys, "real_prefix") or (
        hasattr(sys, "base_prefix") and sys.base_prefix != sys.prefix
    )
    return in_venv, "virtualenv active" if in_venv else "not in a virtualenv"


def check_env_vars(required: List[str] | None = None) -> Tuple[bool, str]:
    required = required or ["MODEL_PROVIDER"]
    missing = [k for k in required if not os.getenv(k)]
    if missing:
        return False, f"missing: {', '.join(missing)}"
    return True, "required env vars present"


def check_tools() -> Tuple[bool, str]:
    tools = ["ruff", "black", "pytest"]
    found = []
    missing = []
    for t in tools:
        if shutil.which(t):
            found.append(t)
        else:
            missing.append(t)
    if missing:
        return False, f"missing tools: {', '.join(missing)}"
    return True, f"found: {', '.join(found)}"


def check_write_perms(path: str | Path = ".") -> Tuple[bool, str]:
    path = Path(path)
    try:
        test_file = path / ".uj_health_write_test"
        test_file.write_text("ok", encoding="utf-8")
        test_file.unlink()
        return True, f"write OK in {path.resolve()}"
    except Exception as e:
        return False, f"write failed: {e}"


def run_health_scan() -> Dict[str, any]:
    """
    Run all health checks and return a structured report.
    """
    checks = {
        "python": check_python_version(),
        "venv": check_venv(),
        "env": check_env_vars(),
        "tools": check_tools(),
        "write": check_write_perms(),
    }
    overall = all(ok for ok, _ in checks.values())
    return {
        "overall": "PASS" if overall else "FAIL",
        "checks": {name: {"ok": ok, "detail": detail} for name, (ok, detail) in checks.items()},
    }


def format_health_report(report: Dict) -> str:
    lines = [f"HEALTH: {report['overall']}", ""]
    for name, data in report["checks"].items():
        status = "PASS" if data["ok"] else "FAIL"
        lines.append(f"  [{status}] {name}: {data['detail']}")
    return "\n".join(lines)
