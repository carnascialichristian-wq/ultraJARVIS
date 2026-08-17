"""Cloud / local LLM bridge with reliability helpers."""

from __future__ import annotations

import os
import sys
import time
from typing import Optional

from core.reliability import retry

PROVIDER = os.getenv("MODEL_PROVIDER", "openai").lower()
VERBOSE = os.getenv("LLM_VERBOSE", "1") == "1"


def _log(msg: str) -> None:
    if VERBOSE:
        print(f"[cloud_bridge] {msg}", file=sys.stderr)


_DEFAULT_SYSTEM = "Be precise. Return the required FILES block only."


@retry(max_attempts=3, delay=1.0, backoff=1.5, exceptions=(Exception,))
def _call_openai(prompt: str, *, system: str = _DEFAULT_SYSTEM) -> str:
    from openai import OpenAI

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    r = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
        temperature=0.2,
    )
    out = (r.choices[0].message.content or "").strip()
    if not out:
        _log("OpenAI returned empty content")
    return out


@retry(max_attempts=3, delay=1.0, backoff=1.5, exceptions=(Exception,))
def _call_local(prompt: str, *, system: str = _DEFAULT_SYSTEM) -> str:
    import requests

    base = os.getenv("LMSTUDIO_BASE", "http://localhost:1234")
    model = os.getenv("LMSTUDIO_MODEL", "llama-3.1-8b-instruct")
    res = requests.post(
        f"{base}/v1/chat/completions",
        json={
            "model": model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.2,
        },
        timeout=120,
    )
    res.raise_for_status()
    data = res.json()
    out = (data["choices"][0]["message"]["content"] or "").strip()
    if not out:
        _log("Local LLM returned empty content")
    return out


def ask_cloud_ai(prompt: str, *, system: str | None = None) -> str:
    """Return model text or empty string on failure (but log why).

    Optional ``system`` overrides the default system prompt (useful for
    planner / writer adapters that need structured JSON rather than FILES).
    """
    sys_prompt = system if system is not None else _DEFAULT_SYSTEM
    if PROVIDER == "openai":
        try:
            return _call_openai(prompt, system=sys_prompt)
        except Exception as e:
            _log(f"OpenAI ultimately failed: {e}")
            return ""

    # local server (LM Studio / Ollama-compatible)
    try:
        return _call_local(prompt, system=sys_prompt)
    except Exception as e:
        _log(f"Local LLM ultimately failed: {e}")
        return ""
