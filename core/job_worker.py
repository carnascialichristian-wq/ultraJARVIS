"""Job queue worker for UltraJarvis.

Reads tasks from workspace/queue.jsonl, executes them via NaturalTaskRunner,
and appends results to workspace/done.jsonl.
"""

from __future__ import annotations

import json
import time
from pathlib import Path
from typing import Any, Optional, Union

ROOT = Path(__file__).resolve().parent.parent
QUEUE = ROOT / "workspace" / "queue.jsonl"
DONE = ROOT / "workspace" / "done.jsonl"
QUEUE.parent.mkdir(parents=True, exist_ok=True)


def enqueue(prompt: str, *, output_dir: str | None = None) -> dict:
    """Append a new job to the queue. Returns the record that was written."""
    rec = {"prompt": prompt, "output_dir": output_dir, "ts": time.time()}
    with open(QUEUE, "a", encoding="utf-8") as f:
        f.write(json.dumps(rec, ensure_ascii=False) + "\n")
    return rec


def _read_one() -> Optional[Union[str, dict]]:
    if not QUEUE.exists():
        return None
    lines = QUEUE.read_text(encoding="utf-8").splitlines()
    if not lines:
        return None
    head, rest = lines[0], "\n".join(lines[1:])
    QUEUE.write_text(rest, encoding="utf-8")
    head = head.strip()
    if not head:
        return "__EMPTY__"
    try:
        return json.loads(head)
    except Exception:
        DONE.parent.mkdir(parents=True, exist_ok=True)
        with open(DONE.with_name("bad_queue.jsonl"), "a", encoding="utf-8") as bf:
            bf.write(head + "\n")
        return "__BAD__"


def process_one() -> Optional[dict]:
    from core.natural_tasks import NaturalTaskRunner
    from core.metrics import record as metric_record

    rec = _read_one()
    if rec is None:
        return None
    if rec in ("__EMPTY__", "__BAD__"):
        return None

    runner = NaturalTaskRunner()
    result: dict[str, Any]
    try:
        out = runner.build_and_run(rec["prompt"], rec.get("output_dir"))
        result = {
            "ok": True,
            "job": rec,
            "result": out,
            "ts_done": time.time(),
        }
    except Exception as e:
        result = {
            "ok": False,
            "job": rec,
            "err": str(e),
            "ts_done": time.time(),
        }

    with open(DONE, "a", encoding="utf-8") as f:
        f.write(json.dumps(result, ensure_ascii=False) + "\n")
    try:
        metric_record(
            "worker_process",
            ok=result.get("ok"),
            prompt=(rec.get("prompt") or "")[:80],
        )
    except Exception:
        pass
    return result


def run_forever(sleep_sec: float = 3.0) -> None:
    while True:
        result = process_one()
        if result is None:
            time.sleep(sleep_sec)


def queue_status() -> dict:
    pending = 0
    if QUEUE.exists():
        pending = sum(1 for line in QUEUE.read_text(encoding="utf-8").splitlines() if line.strip())
    done = 0
    if DONE.exists():
        done = sum(1 for line in DONE.read_text(encoding="utf-8").splitlines() if line.strip())
    return {"pending": pending, "done": done, "queue": str(QUEUE), "done_file": str(DONE)}


__all__ = ["enqueue", "process_one", "run_forever", "queue_status"]
