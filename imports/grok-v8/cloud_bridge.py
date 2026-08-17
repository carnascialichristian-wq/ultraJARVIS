"""Cloud / LLM bridge with reliability."""

from __future__ import annotations

import os
from typing import Any, Optional

from core.reliability import retry


@retry(max_attempts=3, delay=1.0, backoff=2.0)
def call_openai(prompt: str, *, model: str = "gpt-4o-mini") -> str:
    """Stub OpenAI-style call (replace with real client)."""
    # Placeholder – real implementation would use openai SDK
    if not prompt:
        raise ValueError("empty prompt")
    return f"[openai:{model}] {prompt[:80]}..."


@retry(max_attempts=2, delay=0.5)
def call_local_llm(prompt: str, *, model: str = "local") -> str:
    """Stub local LLM call."""
    return f"[local:{model}] {prompt[:80]}..."


def complete(prompt: str, *, provider: Optional[str] = None) -> str:
    """Route to the configured provider."""
    provider = provider or os.getenv("MODEL_PROVIDER", "openai")
    if provider == "local":
        return call_local_llm(prompt)
    return call_openai(prompt)
