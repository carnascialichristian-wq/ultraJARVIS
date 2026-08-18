"""Billing skeleton — Stripe-compatible surface, mock without keys."""

from __future__ import annotations

import hashlib
import json
import os
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

DEFAULT_CUSTOMERS = Path("workspace/billing_customers.jsonl")
DEFAULT_EVENTS = Path("workspace/billing_events.jsonl")


def _stripe_key() -> str:
    return (os.getenv("STRIPE_SECRET_KEY") or "").strip()


def _append(path: Path, row: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(row, ensure_ascii=False) + "\n")


def create_customer(*, email: str, name: str = "", meta: Optional[dict] = None) -> Dict[str, Any]:
    if not email or "@" not in email:
        raise ValueError("valid email required")
    key = _stripe_key()
    if key.startswith("sk_"):
        try:
            import urllib.request
            import urllib.parse
            data = urllib.parse.urlencode({"email": email, "name": name or email}).encode()
            req = urllib.request.Request(
                "https://api.stripe.com/v1/customers",
                data=data,
                headers={"Authorization": f"Bearer {key}"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=20) as resp:
                payload = json.loads(resp.read().decode())
            _append(DEFAULT_CUSTOMERS, {"ts": time.time(), "provider": "stripe", "customer": payload})
            return payload
        except Exception as exc:
            return {"id": None, "error": str(exc), "email": email, "mock": False}
    cid = "cus_mock_" + hashlib.sha256(email.encode()).hexdigest()[:16]
    payload = {"id": cid, "email": email, "name": name or email, "mock": True, "meta": meta or {}}
    _append(DEFAULT_CUSTOMERS, {"ts": time.time(), "provider": "mock", "customer": payload})
    return payload


def create_checkout_session(
    *,
    customer_id: str,
    price_id: str = "",
    success_url: str = "https://example.com/success",
    cancel_url: str = "https://example.com/cancel",
    tier: str = "pro",
) -> Dict[str, Any]:
    key = _stripe_key()
    if key.startswith("sk_") and price_id:
        try:
            import urllib.request
            import urllib.parse
            fields = {
                "mode": "subscription",
                "customer": customer_id,
                "success_url": success_url,
                "cancel_url": cancel_url,
                "line_items[0][price]": price_id,
                "line_items[0][quantity]": "1",
            }
            data = urllib.parse.urlencode(fields).encode()
            req = urllib.request.Request(
                "https://api.stripe.com/v1/checkout/sessions",
                data=data,
                headers={"Authorization": f"Bearer {key}"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=20) as resp:
                payload = json.loads(resp.read().decode())
            _append(DEFAULT_EVENTS, {"ts": time.time(), "type": "checkout.created", "payload": payload})
            return payload
        except Exception as exc:
            return {"id": None, "error": str(exc), "mock": False}
    sid = "cs_mock_" + hashlib.sha256(f"{customer_id}:{tier}:{time.time()}".encode()).hexdigest()[:16]
    payload = {
        "id": sid,
        "object": "checkout.session",
        "url": f"https://checkout.stripe.com/mock/{sid}",
        "customer": customer_id,
        "status": "open",
        "metadata": {"tier": tier},
        "mock": True,
    }
    _append(DEFAULT_EVENTS, {"ts": time.time(), "type": "checkout.created", "payload": payload})
    return payload


def handle_webhook(payload: dict, *, sig_header: str = "") -> Dict[str, Any]:
    secret = (os.getenv("STRIPE_WEBHOOK_SECRET") or "").strip()
    if secret and sig_header:
        if "t=" not in sig_header and "v1=" not in sig_header:
            return {"ok": False, "error": "invalid signature header"}
    etype = payload.get("type") or payload.get("event") or "unknown"
    data = payload.get("data", {}).get("object", payload)
    _append(DEFAULT_EVENTS, {"ts": time.time(), "type": etype, "payload": payload})
    result: Dict[str, Any] = {"ok": True, "type": etype}
    if etype in ("checkout.session.completed", "customer.subscription.updated"):
        tier = (data.get("metadata") or {}).get("tier") or "pro"
        result["suggested_env"] = {"UJ_TIER": tier}
        result["tier"] = tier
    return result


def list_events(limit: int = 20) -> List[dict]:
    if not DEFAULT_EVENTS.exists():
        return []
    rows = []
    for line in DEFAULT_EVENTS.read_text(encoding="utf-8").splitlines():
        try:
            rows.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    return rows[-limit:]
