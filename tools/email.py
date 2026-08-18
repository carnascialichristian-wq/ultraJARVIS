"""Email for UltraJarvis (SAFE_MODE by default; optional SMTP when unlocked)."""

from __future__ import annotations

import os
import smtplib
from dataclasses import dataclass, asdict
from email.message import EmailMessage
from typing import List, Optional


def _safe_mode() -> bool:
    return os.environ.get("UJ_EMAIL_UNSAFE", "").strip() != "1"


_LOG: List[dict] = []


@dataclass
class EmailDraft:
    to: str
    subject: str
    body: str
    cc: Optional[str] = None


def draft(to: str, subject: str, body: str, *, cc: Optional[str] = None) -> EmailDraft:
    if not to or not subject:
        raise ValueError("to and subject are required")
    return EmailDraft(to=to, subject=subject, body=body, cc=cc)


def send(draft_obj: EmailDraft, *, force: bool = False) -> str:
    safe = _safe_mode()
    record = asdict(draft_obj)
    record["safe_mode"] = safe
    record["force_requested"] = force
    record["sent"] = False
    if safe:
        _LOG.append(record)
        return f"Draft logged (SAFE_MODE); not sent to {draft_obj.to}"
    host = os.environ.get("SMTP_HOST", "").strip()
    port = int(os.environ.get("SMTP_PORT", "587") or 587)
    user = os.environ.get("SMTP_USER", "").strip()
    password = os.environ.get("SMTP_PASS", "").strip()
    from_addr = os.environ.get("SMTP_FROM", user).strip()
    if not host or not from_addr:
        record["error"] = "SMTP_HOST/SMTP_FROM not configured"
        _LOG.append(record)
        return "SAFE unlocked but SMTP not configured – draft logged only"
    msg = EmailMessage()
    msg["From"] = from_addr
    msg["To"] = draft_obj.to
    msg["Subject"] = draft_obj.subject
    if draft_obj.cc:
        msg["Cc"] = draft_obj.cc
    msg.set_content(draft_obj.body)
    try:
        with smtplib.SMTP(host, port, timeout=20) as smtp:
            smtp.starttls()
            if user and password:
                smtp.login(user, password)
            smtp.send_message(msg)
        record["sent"] = True
        _LOG.append(record)
        return f"Sent to {draft_obj.to}"
    except Exception as exc:
        record["error"] = str(exc)
        _LOG.append(record)
        return f"Send failed: {exc}"


def log() -> List[dict]:
    return list(_LOG)


def clear_log() -> None:
    _LOG.clear()


def list_pending() -> List[dict]:
    return log()


SAFE_MODE = _safe_mode()
