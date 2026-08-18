"""Natural-language task runner for UltraJarvis.

Pipeline: Architect (plan) → Write (controlled) → Gates → Verify.
"""

from __future__ import annotations

from core.nt_pipeline import (  # noqa: F401
    NaturalTaskRunner,
    promote_job_to_tools,
    ROOT,
    JOBS_DIR,
    _code_via_llm,
    _code_for_prompt,
    _detect_multi_patterns,
    _code_for_key,
    _write_dep_graph,
    _skills_hint,
)

__all__ = [
    "NaturalTaskRunner",
    "promote_job_to_tools",
    "ROOT",
    "JOBS_DIR",
]
