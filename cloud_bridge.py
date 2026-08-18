"""Local-only LLM bridge for the STRICT_ZERO baseline.

Owner decision #7 (approved 2026-08-18): MODEL_PROVIDER defaults to a local
provider, no cloud or pay-per-use call may happen implicitly, and an unavailable
local provider fails safe without falling back to a cloud provider.

There is deliberately no cloud adapter in this module. Enabling one requires a
separately reviewed policy change, not an environment variable.
"""

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
    Also enforces the monetization LLM quota / soft budget when configured.
    """
    try:
        from core.monetization import assert_llm_budget, record_llm_call
        assert_llm_budget()
        record_llm_call(meta={"provider": PROVIDER})
    except Exception as exc:
        try:
            from core.monetization import QuotaExceeded
            if isinstance(exc, QuotaExceeded):
                _log(f"LLM quota/budget blocked call: {exc}")
                return ""
        except Exception:
            pass

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


def embed(texts: list[str]) -> list[list[float]] | None:
    """Local embedding provider. Returns None on failure.

    STRICT_ZERO: like ask_cloud_ai, this has no cloud adapter. A non-local
    provider is refused before any request is built.

    The budget guard below deliberately does NOT sit inside a bare
    `except Exception: pass`. Swallowing QuotaExceeded there would let the call
    proceed past the very limit the guard exists to enforce.
    """
    if not texts:
        return []

    try:
        from core.monetization import assert_llm_budget, record_llm_call
        assert_llm_budget()
        record_llm_call(units=0.5 * len(texts), meta={"kind": "embed"})
    except Exception as exc:
        try:
            from core.monetization import QuotaExceeded
            if isinstance(exc, QuotaExceeded):
                _log(f"LLM quota/budget blocked embed: {exc}")
                return None
        except Exception:
            pass

    if PROVIDER not in _LOCAL_PROVIDERS:
        _log(
            f"Provider {PROVIDER or '<unset>'} blocked by STRICT_ZERO; "
            "embeddings require a loopback local provider"
        )
        return None

    try:
        import requests

        base = _validate_local_base(os.getenv("LMSTUDIO_BASE", "http://127.0.0.1:1234"))
        model = os.getenv(
            "LMSTUDIO_EMBED_MODEL",
            os.getenv("LMSTUDIO_MODEL", "text-embedding-nomic-embed-text-v1.5"),
        )
        res = requests.post(
            f"{base}/v1/embeddings", json={"model": model, "input": texts}, timeout=60
        )
        res.raise_for_status()
        data = sorted(res.json()["data"], key=lambda d: d["index"])
        return [list(d["embedding"]) for d in data]
    except Exception as e:
        _log(f"embed local failed: {e}")
        return None
