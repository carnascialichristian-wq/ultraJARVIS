"""NaturalTaskRunner pipeline implementation."""
from __future__ import annotations

from core.nt_helpers import (  # noqa: F401
    ROOT,
    JOBS_DIR,
    _code_via_llm,
    _code_for_prompt,
    _detect_multi_patterns,
    _code_for_key,
    _write_dep_graph,
    _skills_hint,
)
from core.nt_runner import NaturalTaskRunner, promote_job_to_tools  # noqa: F401

__all__ = [
    "NaturalTaskRunner",
    "promote_job_to_tools",
    "ROOT",
    "JOBS_DIR",
    "_code_via_llm",
    "_code_for_prompt",
    "_detect_multi_patterns",
    "_code_for_key",
    "_write_dep_graph",
    "_skills_hint",
]
