"""Email stub for UltraJarvis (SAFE_MODE by default).

Never actually sends mail. Records the intent for inspection.
"""

from __future__ import annotations

from dataclasses import dataclass, asdict
from typing import List, Optional
import os

# Default is always safe. Override only via explicit env var (not a module global
# that any importer can flip with tools.email.SAFE_MODE = False).
def _safe_mode() -> bool:
    """Return True unless UJ_EMAIL_UNSAFE=1 is set in the environment."""
    return os.environ.get("UJ_EMAIL_UNSAFE", "").strip() != "1"


_LOG: List[dict] = []


@dataclass
class EmailDraft:
    to: str
    subject: str
    body: str
    cc: Optional[str] = None


def draft(to: str, subject: str, body: str, *, cc: Optional[str] = None) -> EmailDraft:
    """Create an email draft (never sends)."""
    if not to or not subject:
        raise ValueError("to and subject are required")
    return EmailDraft(to=to, subject=subject, body=body, cc=cc)


def send(draft_obj: EmailDraft, *, force: bool = False) -> str:
    """
    'Send' an email.

    Always logs the draft. Real sending is never performed while _safe_mode()
    is True. The ``force`` argument is accepted for API compatibility but is
    ignored under safe mode (FIX-8).
    """
    safe = _safe_mode()
    record = asdict(draft_obj)
    record["safe_mode"] = safe
    record["force_requested"] = force
    record["sent"] = False
    _LOG.append(record)

    if safe:
        # force is intentionally ignored – leaving SAFE_MODE requires env opt-in
        return f"[SAFE_MODE] Email NOT sent to {draft_obj.to}: {draft_obj.subject}"

    # Real send would go here – intentionally omitted until a transport exists
    record["sent"] = True
    return f"Would send email to {draft_obj.to}: {draft_obj.subject}"


def list_pending() -> List[dict]:
    """Return drafts that were attempted but not really sent."""
    return list(_LOG)


def clear_log() -> None:
    _LOG.clear()


# Backwards-compatible name for tests that still read the module attribute.
# Prefer _safe_mode() / env var for actual policy decisions.
SAFE_MODE = True
