"""Email stub for UltraJarvis (SAFE_MODE by default)."""
from __future__ import annotations
from dataclasses import dataclass, asdict
from typing import List, Optional

SAFE_MODE = True
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
    record = asdict(draft_obj)
    record["safe_mode"] = SAFE_MODE
    record["sent"] = False
    _LOG.append(record)
    if SAFE_MODE:
        return f"[SAFE_MODE] Email NOT sent to {draft_obj.to}: {draft_obj.subject}"
    record["sent"] = True
    return f"Would send email to {draft_obj.to}: {draft_obj.subject}"

def list_pending() -> List[dict]:
    return list(_LOG)

def clear_log() -> None:
    _LOG.clear()
