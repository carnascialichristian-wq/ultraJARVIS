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
    """Return model text or empty string on failure.

    Enforces monetization LLM quota / soft budget when configured.
    """
    try:
        from core.monetization import assert_llm_budget, record_llm_call, QuotaExceeded
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
    if PROVIDER == "openai":
        try:
            return _call_openai(prompt, system=sys_prompt)
        except Exception as e:
            _log(f"OpenAI ultimately failed: {e}")
            return ""
    try:
        return _call_local(prompt, system=sys_prompt)
    except Exception as e:
        _log(f"Local LLM ultimately failed: {e}")
        return ""


def embed(texts: list[str]) -> list[list[float]] | None:
    """Embedding provider. OpenAI or LM Studio; None on failure."""
    if not texts:
        return []
    try:
        from core.monetization import assert_llm_budget, record_llm_call
        assert_llm_budget()
        record_llm_call(units=0.5 * len(texts), meta={"kind": "embed"})
    except Exception:
        pass
    provider = os.getenv("MODEL_PROVIDER", "openai").lower()
    if provider == "openai":
        try:
            from openai import OpenAI
            client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            model = os.getenv("OPENAI_EMBED_MODEL", "text-embedding-3-small")
            out = client.embeddings.create(model=model, input=[t[:8000] for t in texts])
            data = sorted(out.data, key=lambda d: d.index)
            return [list(d.embedding) for d in data]
        except Exception as e:
            _log(f"embed openai failed: {e}")
            return None
    try:
        import requests
        base = os.getenv("LMSTUDIO_BASE", "http://localhost:1234")
        model = os.getenv("LMSTUDIO_EMBED_MODEL", os.getenv("LMSTUDIO_MODEL", "text-embedding-nomic-embed-text-v1.5"))
        res = requests.post(f"{base}/v1/embeddings", json={"model": model, "input": texts}, timeout=60)
        res.raise_for_status()
        data = sorted(res.json()["data"], key=lambda d: d["index"])
        return [list(d["embedding"]) for d in data]
    except Exception as e:
        _log(f"embed local failed: {e}")
        return None
