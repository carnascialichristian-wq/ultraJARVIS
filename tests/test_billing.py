"""Tests for core.billing."""

from __future__ import annotations

from core.billing import create_customer, create_checkout_session, handle_webhook


def test_mock_customer_and_checkout(monkeypatch):
    monkeypatch.delenv("STRIPE_SECRET_KEY", raising=False)
    c = create_customer(email="a@example.com", name="A")
    assert c.get("mock") is True
    assert c["id"].startswith("cus_mock_")
    s = create_checkout_session(customer_id=c["id"], tier="pro")
    assert s.get("mock") is True
    assert "url" in s


def test_webhook_suggests_tier():
    r = handle_webhook({"type": "checkout.session.completed", "data": {"object": {"metadata": {"tier": "team"}}}})
    assert r["ok"] is True
    assert r.get("tier") == "team"
