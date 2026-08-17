"""Tests for structured logging."""

from __future__ import annotations

import json
import logging
from io import StringIO

from core.logging_uj import get_logger, log_event, JsonFormatter


def test_json_formatter():
    fmt = JsonFormatter()
    record = logging.LogRecord("test", logging.INFO, "", 0, "hello", (), None)
    out = fmt.format(record)
    data = json.loads(out)
    assert data["msg"] == "hello"
    assert data["level"] == "INFO"
    assert "ts" in data


def test_log_event(capsys):
    logger = get_logger("test_uj")
    # ensure handler writes to stderr which capsys captures
    log_event(logger, "job done", job_id="abc", status="ok")
    captured = capsys.readouterr().err
    assert "job done" in captured
    assert "abc" in captured or "job_id" in captured
