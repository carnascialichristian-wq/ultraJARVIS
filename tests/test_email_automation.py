"""Tests for email and automation stubs."""

from __future__ import annotations

import pytest

from tools.email import draft, send, list_pending, clear_log
from tools.automation import paste_text, type_text, history, clear_history
from core.registry import get_registry


def test_email_draft_and_safe_send():
    clear_log()
    d = draft("user@example.com", "Hello", "Body text")
    assert d.to == "user@example.com"
    msg = send(d)
    assert "SAFE_MODE" in msg or "NOT sent" in msg
    assert len(list_pending()) == 1


def test_email_requires_fields():
    with pytest.raises(ValueError):
        draft("", "subj", "body")


def test_automation_dry_run():
    clear_history()
    assert "dry-run" in paste_text("ciao")
    assert "dry-run" in type_text("mondo", delay_ms=10)
    assert len(history()) == 2


def test_registry_has_new_tools():
    reg = get_registry()
    names = {t.name for t in reg.list_tools()}
    assert "email.draft" in names
    assert "automation.paste_text" in names
