"""Local-only LLM bridge for the STRICT_ZERO baseline."""

from __future__ import annotations

import os
import sys
from urllib.parse import urlparse

from core.reliability import retry

# The baseline is deliberately local-only. Cloud or paid providers are blocked
# before any adapter, credential, or network call can be reached.
PROVIDER = os.getenv("MODEL_PROVIDER", "local").strip().lower()
VERBOSE = os.getenv("LLM_VERBOSE", "1") == "1"

_LOCAL_PROVIDERS = frozenset({"local", "lmstudio", "ollama"})
_LOOPBACK_HOSTS = frozenset({"localhost", "127.0.0.1", "::1"})


def _log(msg: str) -> None:
    if VERBOSE:
        print(f"[cloud_bridge] {msg}", file=sys.stderr)


_DEFAULT_SYSTEM = "Be precise. Return the required FILES block only."


def _validate_local_base(base: str) -> str:
    parsed = urlparse(base)
    if parsed.scheme not in {"http", "https"} or parsed.hostname not in _LOOPBACK_HOSTS:
        raise ValueError("STRICT_ZERO permits only loopback LLM endpoints")
    return base.rstrip("/")


@retry(max_attempts=3, delay=1.0, backoff=1.5, exceptions=(Exception,))
def _call_local(prompt: str, *, system: str = _DEFAULT_SYSTEM) -> str:
    import requests

    base = _validate_local_base(os.getenv("LMSTUDIO_BASE", "http://127.0.0.1:1234"))
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
    """Return local model text or an empty string when the provider is blocked.

    The STRICT_ZERO baseline intentionally has no cloud-provider adapter.
    Provider-specific paid integrations require a separately reviewed policy
    change and must not be enabled through this module.
    """
    sys_prompt = system if system is not None else _DEFAULT_SYSTEM
    if PROVIDER not in _LOCAL_PROVIDERS:
        _log(
            f"Provider {PROVIDER or '<unset>'} blocked by STRICT_ZERO; "
            "use a loopback local provider"
        )
        return ""

    try:
        return _call_local(prompt, system=sys_prompt)
    except Exception as e:
        _log(f"Local LLM ultimately failed: {e}")
        return ""
