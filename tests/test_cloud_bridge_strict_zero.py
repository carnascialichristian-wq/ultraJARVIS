"""Tests for the STRICT_ZERO cloud bridge boundary."""

from __future__ import annotations

import pytest

import cloud_bridge


def test_paid_provider_is_blocked_before_any_adapter(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setattr(cloud_bridge, "PROVIDER", "openai")
    called = []

    def fail_if_called(*args, **kwargs):
        called.append((args, kwargs))
        raise AssertionError("blocked provider reached an adapter")

    monkeypatch.setattr(cloud_bridge, "_call_local", fail_if_called)
    assert cloud_bridge.ask_cloud_ai("do not send this") == ""
    assert called == []


def test_remote_endpoint_is_rejected():
    with pytest.raises(ValueError, match="loopback"):
        cloud_bridge._validate_local_base("https://example.com/v1")


def test_loopback_endpoint_is_accepted():
    assert cloud_bridge._validate_local_base("http://127.0.0.1:1234/") == "http://127.0.0.1:1234"
