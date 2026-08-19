"""Tests for core.config."""

from __future__ import annotations

import os
from pathlib import Path

import pytest

from core.config import Config, get_config


def test_defaults(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.delenv("MODEL_PROVIDER", raising=False)
    monkeypatch.delenv("MODEL_NAME", raising=False)
    cfg = Config.from_env()
    assert cfg.model_provider == "openai"
    assert cfg.model_name == "gpt-4o-mini"


def test_overrides(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("MODEL_PROVIDER", "lmstudio")
    monkeypatch.setenv("MODEL_NAME", "my-model")
    cfg = Config.from_env()
    assert cfg.model_provider == "lmstudio"
    assert cfg.model_name == "my-model"


def test_dotenv_file(tmp_path: Path, monkeypatch: pytest.MonkeyPatch):
    env_file = tmp_path / ".env"
    env_file.write_text("MODEL_PROVIDER=local\nMODEL_NAME=test-model\n")
    # Clear existing
    monkeypatch.delenv("MODEL_PROVIDER", raising=False)
    monkeypatch.delenv("MODEL_NAME", raising=False)
    cfg = Config.from_env(dotenv_path=env_file)
    assert cfg.model_provider == "local"
    assert cfg.model_name == "test-model"
