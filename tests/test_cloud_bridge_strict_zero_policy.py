"""STRICT_ZERO policy tests for the LLM bridge (decision #7, approved 2026-08-18).

Policy being locked down here:
  * MODEL_PROVIDER defaults to a local provider - never a paid cloud one;
  * no cloud / pay-per-use call may happen implicitly;
  * if the local provider is unavailable the system fails safe, and never
    falls back to a cloud provider automatically.

These complement tests/test_cloud_bridge_strict_zero.py, which covers the
boundary itself. This file covers the *environment resolution* path, which is
how the defect in S-17 actually reached the paid provider.
"""

from __future__ import annotations

import importlib

import pytest

import cloud_bridge


def _reload_with_env(monkeypatch: pytest.MonkeyPatch, **env: str):
    """Re-import cloud_bridge so module-level PROVIDER is re-read from env."""
    for key in ("MODEL_PROVIDER", "OPENAI_API_KEY", "LMSTUDIO_BASE"):
        monkeypatch.delenv(key, raising=False)
    for key, value in env.items():
        monkeypatch.setenv(key, value)
    return importlib.reload(cloud_bridge)


# --- the decision itself -------------------------------------------------


def test_default_provider_is_local(monkeypatch: pytest.MonkeyPatch):
    """Unset MODEL_PROVIDER must resolve to a local provider, not a paid one."""
    mod = _reload_with_env(monkeypatch)
    assert mod.PROVIDER == "local"
    assert mod.PROVIDER in mod._LOCAL_PROVIDERS


def test_no_cloud_adapter_exists_at_all(monkeypatch: pytest.MonkeyPatch):
    """The paid adapter must be absent, not merely gated behind a flag."""
    mod = _reload_with_env(monkeypatch)
    assert not hasattr(mod, "_call_openai")


# --- no implicit pay-per-use --------------------------------------------


@pytest.mark.parametrize(
    "value",
    ["openai", "OpenAI", "  openai  ", "anthropic", "azure", "xai", ""],
)
def test_non_local_provider_never_reaches_an_adapter(
    monkeypatch: pytest.MonkeyPatch, value: str
):
    """Any non-local provider is refused before a request can be built."""
    mod = _reload_with_env(monkeypatch, MODEL_PROVIDER=value, OPENAI_API_KEY="sk-test")
    reached = []

    monkeypatch.setattr(
        mod, "_call_local", lambda *a, **k: reached.append(1) or "should not happen"
    )
    assert mod.ask_cloud_ai("must not be sent anywhere") == ""
    assert reached == []


# --- fail safe, never fall back to cloud ---------------------------------


def test_local_failure_fails_safe_without_cloud_fallback(
    monkeypatch: pytest.MonkeyPatch,
):
    """When the local provider is down, return empty - never escalate to cloud."""
    mod = _reload_with_env(monkeypatch, MODEL_PROVIDER="local")

    def boom(*args, **kwargs):
        raise ConnectionError("local LLM server is not running")

    monkeypatch.setattr(mod, "_call_local", boom)
    assert mod.ask_cloud_ai("prompt") == ""
    # there is no other adapter to escalate to
    assert not hasattr(mod, "_call_openai")


# --- the local endpoint is the new security boundary ---------------------


@pytest.mark.parametrize(
    "base",
    [
        "https://api.openai.com/v1",
        "http://127.0.0.1@evil.example/",       # userinfo trick
        "http://localhost.evil.example/",       # suffix trick
        "http://evil.example#127.0.0.1",        # fragment trick
        "http://2130706433:1234",               # 127.0.0.1 as a decimal int
        "http://[::ffff:127.0.0.1]:1234",       # ipv6-mapped ipv4
        "file:///etc/passwd",                   # non-http scheme
    ],
)
def test_non_loopback_endpoints_are_rejected(base: str):
    with pytest.raises(ValueError, match="loopback"):
        cloud_bridge._validate_local_base(base)


@pytest.mark.parametrize(
    "base", ["http://127.0.0.1:1234", "http://localhost:1234", "http://[::1]:1234"]
)
def test_loopback_endpoints_are_accepted(base: str):
    assert cloud_bridge._validate_local_base(base) == base.rstrip("/")


# --- the second place the same variable is read --------------------------


def test_config_provider_default_matches_the_bridge(monkeypatch: pytest.MonkeyPatch):
    """core/config.py reads the same env var and must not default to a paid one."""
    from core.config import Config

    monkeypatch.delenv("MODEL_PROVIDER", raising=False)
    assert Config().model_provider == "local"
    assert Config.from_env(dotenv_path="does-not-exist.env").model_provider == "local"
