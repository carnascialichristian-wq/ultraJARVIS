#!/usr/bin/env python3
"""
S-17 reproduction probe — cloud_bridge / planner LLM adapter, STRICT_ZERO_CARD.

Measures how many BILLABLE API attempts `core.planner.plan()` makes under four
environment configurations.

SAFETY — read before running:
  * This probe NEVER touches the network. It injects a FAKE `openai` module on
    sys.path that counts attempts and raises. No socket is opened, no request is
    sent, no charge is possible.
  * Do NOT "improve" this probe by using the real `openai` package. The whole
    point of S-17 is that reaching the real client costs Christian money, and
    Article 5 / CLD-1 forbid it without an explicit, recorded decision.

Run from the repository root:
    python3 -B docs/threat-models/probes/S-17-cloud-bridge-probe.py

Expected output (measured 2026-08-18, main @ 04ae305):
    A. default                          -> 0 paid attempts
    B. UJ_PLANNER_LLM=1 only            -> 3 paid attempts   (gpt-4o-mini)
    C. + OPENAI_API_KEY set             -> 3 paid attempts, key transmitted
    D. + MODEL_PROVIDER=local           -> 0 paid attempts

The finding is the asymmetry: staying on the free path needs TWO correct
variables, landing on the paid path needs ONE.
"""

import json
import os
import subprocess
import sys
import tempfile

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))

FAKE_OPENAI = '''
"""FAKE openai module used only by the S-17 probe. Never touches the network."""
import os, json
CALLS = {"api_keys_seen": []}
_N = {"n": 0}

class _Completions:
    def create(self, **kw):
        _N["n"] += 1
        with open(os.environ["UJ_PROBE_LOG"], "a") as f:
            f.write(json.dumps({"n": _N["n"], "model": kw.get("model")}) + "\\n")
        raise RuntimeError("simulated failure - no real call was made")

class _Chat:
    def __init__(self):
        self.completions = _Completions()

class OpenAI:
    def __init__(self, api_key=None, **kw):
        CALLS["api_keys_seen"].append(api_key)
        self.chat = _Chat()
'''

CHILD = r'''
import os, sys, json
sys.path.insert(0, os.environ["UJ_FAKELIB"])
sys.path.insert(0, os.environ["UJ_REPO_ROOT"])
import cloud_bridge, openai
from core import planner
p = planner.plan("Build a CSV export tool for the reports page")
log = os.environ["UJ_PROBE_LOG"]
attempts = [json.loads(l) for l in open(log)] if os.path.exists(log) else []
print(json.dumps({
    "provider": cloud_bridge.PROVIDER,
    "paid_attempts": len(attempts),
    "models": [a["model"] for a in attempts],
    "keys_seen": openai.CALLS["api_keys_seen"],
    "title": p.title[:52],
}))
'''

SCENARIOS = [
    ("A. default, nothing set", {}),
    ("B. UJ_PLANNER_LLM=1 only (no key, no provider)", {"UJ_PLANNER_LLM": "1"}),
    ("C. key present, MODEL_PROVIDER forgotten",
     {"UJ_PLANNER_LLM": "1", "OPENAI_API_KEY": "sk-fake-not-a-real-key"}),
    ("D. explicit MODEL_PROVIDER=local",
     {"UJ_PLANNER_LLM": "1", "MODEL_PROVIDER": "local",
      "OPENAI_API_KEY": "sk-fake-not-a-real-key"}),
]


def main() -> int:
    workdir = tempfile.mkdtemp(prefix="s17-probe-")
    fakelib = os.path.join(workdir, "fakelib")
    os.makedirs(fakelib, exist_ok=True)
    with open(os.path.join(fakelib, "openai.py"), "w") as f:
        f.write(FAKE_OPENAI)
    log = os.path.join(workdir, "probe.log")

    failures = 0
    for label, scenario in SCENARIOS:
        open(log, "w").close()
        env = dict(os.environ)
        for key in ("UJ_PLANNER_LLM", "MODEL_PROVIDER", "OPENAI_API_KEY", "OPENAI_MODEL"):
            env.pop(key, None)
        env.update(scenario)
        env.update({"UJ_PROBE_LOG": log, "UJ_FAKELIB": fakelib,
                    "UJ_REPO_ROOT": REPO_ROOT})
        proc = subprocess.run([sys.executable, "-B", "-c", CHILD],
                              capture_output=True, text=True, env=env)
        payload = [l for l in proc.stdout.splitlines() if l.startswith("{")]
        if not payload:
            print(f"--- {label}\n    ERROR: {proc.stderr.strip()[:300]}\n")
            failures += 1
            continue
        data = json.loads(payload[0])
        seen = "NO - silent fallback" if data["paid_attempts"] else "n/a (never called)"
        print(f"--- {label}")
        print(f"    resolved provider       : {data['provider']}")
        print(f"    PAID API call attempts  : {data['paid_attempts']}  models={data['models']}")
        print(f"    api_key handed to OpenAI: {data['keys_seen']}")
        print(f"    plan() returned         : {data['title']!r}")
        print(f"    does the caller learn?  : {seen}")
        print()
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
