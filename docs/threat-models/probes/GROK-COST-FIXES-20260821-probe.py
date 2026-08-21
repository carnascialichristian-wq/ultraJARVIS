#!/usr/bin/env python3
"""
Verifica FIX-10 / FIX-13 / FIX-17 sul ramo di Grok, nei casi che la sonda delle tre porte
NON copre: opt-in esplicito al provider a pagamento, budget esaurito, quote per default.

Nessuna chiamata di rete: `openai` e `requests` sono sostituiti da stub che registrano il
tentativo e sollevano. Nessuna scrittura fuori dalle temp dir.
"""
import os
import subprocess
import sys
import textwrap
from pathlib import Path

WT = Path(sys.argv[1]).resolve()
rev = subprocess.run(["git", "-C", str(WT), "rev-parse", "--short", "HEAD"],
                     capture_output=True, text=True).stdout.strip()
print("=" * 78)
print("worktree:", WT, "@", rev)
print("=" * 78)

STUB = '''
import sys, types
_hits = []
class _FakeClient:
    def __init__(self, **kw):
        _hits.append(("client", kw.get("api_key")))
        raise RuntimeError("STUB: nessuna rete")
m = types.ModuleType("openai"); m.OpenAI = _FakeClient
sys.modules["openai"] = m
req = types.ModuleType("requests")
def _post(url, **kw):
    _hits.append(("http", url)); raise RuntimeError("STUB: nessuna rete")
req.post = _post; req.get = _post
sys.modules["requests"] = req
'''


def run(code, env_extra):
    env = dict(os.environ)
    env["PYTHONPATH"] = str(WT)
    env["PYTHONDONTWRITEBYTECODE"] = "1"
    for k in ("MODEL_PROVIDER", "UJ_ALLOW_PAID_API", "OPENAI_API_KEY",
              "UJ_ENFORCE_QUOTA", "UJ_LLM_BUDGET_USD", "UJ_TIER"):
        env.pop(k, None)
    env.update(env_extra)
    # ATTENZIONE: dedent va applicato al SOLO `code`. Lo STUB non e' indentato, quindi
    # dedent(STUB + code) non trova un prefisso comune e lascia `code` indentato ->
    # IndentationError. La guardia "NON MISURATO" ha intercettato proprio questo.
    p = subprocess.run([sys.executable, "-c", STUB + textwrap.dedent(code)],
                       cwd=str(WT), env=env, capture_output=True, text=True)
    return (p.stdout + p.stderr).strip()


print("\n### FIX-10b — opt-in ESPLICITO al provider a pagamento\n")
CODE = '''
    from cloud_bridge import ask_cloud_ai
    try:
        r = ask_cloud_ai("ciao")
        print("ESITO=RITORNATO", repr(r)[:70], "| tentativi di rete:", len(_hits))
    except Exception as e:
        print("ESITO=RIFIUTATO", type(e).__name__, str(e)[:110], "| tentativi:", len(_hits))
'''
for label, env, atteso in [
    ("MODEL_PROVIDER=openai, senza UJ_ALLOW_PAID_API", {"MODEL_PROVIDER": "openai"}, "nessun tentativo"),
    ("MODEL_PROVIDER=openai + chiave, senza opt-in", {"MODEL_PROVIDER": "openai", "OPENAI_API_KEY": "sk-fake"}, "nessun tentativo"),
    ("MODEL_PROVIDER=openai + UJ_ALLOW_PAID_API=1", {"MODEL_PROVIDER": "openai", "UJ_ALLOW_PAID_API": "1", "OPENAI_API_KEY": "sk-fake"}, "tentativo (opt-in esplicito)"),
]:
    out = run(CODE, env)
    riga = next((l for l in out.splitlines() if l.startswith("ESITO=")), "NON MISURATO: " + out[-120:])
    print(f"  {label:48s} -> {riga[:110]}")
    print(f"  {'':48s}    atteso: {atteso}")

print("\n### FIX-17a — le quote sono attive PER DEFAULT?\n")
Q = '''
    import tempfile, pathlib, json, time
    import core.monetization as m
    d = pathlib.Path(tempfile.mkdtemp(prefix="uj-q-"))
    usage = d / "usage.jsonl"
    # precarico il registro oltre il limite del tier free (10 chiamate/giorno)
    now = time.time()
    with usage.open("w") as f:
        for i in range(50):
            f.write(json.dumps({"ts": now, "event": "llm_call", "units": 1}) + "\\n")
    blocked = 0
    try:
        m.check_llm_quota(usage_path=usage)
    except m.QuotaExceeded:
        blocked = 1
    print("ESITO=quota_blocca=" + str(blocked))
'''
for label, env, atteso in [
    ("nessuna variabile impostata", {}, "1 (blocca)"),
    ("UJ_ENFORCE_QUOTA=0 (disattivazione esplicita)", {"UJ_ENFORCE_QUOTA": "0"}, "0 (non blocca)"),
]:
    out = run(Q, env)
    riga = next((l for l in out.splitlines() if l.startswith("ESITO=")), "NON MISURATO: " + out[-120:])
    print(f"  {label:48s} -> {riga:28s} atteso: {atteso}")

print("\n### FIX-17a — il tetto di budget e' un ramo sempre-vero?\n")
B = '''
    import tempfile, pathlib, json, time
    import core.monetization as m
    d = pathlib.Path(tempfile.mkdtemp(prefix="uj-b-"))
    m.DEFAULT_USAGE_PATH = d / "usage.jsonl"
    now = time.time()
    with (d / "usage.jsonl").open("w") as f:
        for i in range(5000):
            f.write(json.dumps({"ts": now, "event": "llm_call", "units": 1}) + "\\n")
    b = m.get_llm_budget()
    print("ESITO= spent=" + str(b["spent_usd_est"]) + " cap=" + str(b["soft_cap_usd"]) + " ok=" + str(b["ok"]))
'''
out = run(B, {})
print("  " + next((l for l in out.splitlines() if l.startswith("ESITO=")), "NON MISURATO: " + out[-140:]))
print("  atteso: ok=False con spesa stimata sopra il tetto (prima il tetto era 0 e 'ok' era sempre True)")

print("\n### FIX-13 / S-19 — embed() con budget esaurito\n")
E = '''
    import tempfile, pathlib, json, time
    import core.monetization as m
    d = pathlib.Path(tempfile.mkdtemp(prefix="uj-e-"))
    m.DEFAULT_USAGE_PATH = d / "usage.jsonl"
    now = time.time()
    with (d / "usage.jsonl").open("w") as f:
        for i in range(5000):
            f.write(json.dumps({"ts": now, "event": "llm_call", "units": 1}) + "\\n")
    import cloud_bridge
    r = cloud_bridge.embed(["testo"])
    print("ESITO= ritorno=" + repr(r)[:40] + " tentativi_di_rete=" + str(len(_hits)))
'''
out = run(E, {"MODEL_PROVIDER": "openai", "OPENAI_API_KEY": "sk-fake"})
print("  " + next((l for l in out.splitlines() if l.startswith("ESITO=")), "NON MISURATO: " + out[-140:]))
print("  atteso: nessun tentativo di rete — il budget esaurito deve fermare la chiamata")
print("\n" + "=" * 78)
