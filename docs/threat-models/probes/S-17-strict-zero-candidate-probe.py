"""Sonda STRICT_ZERO: nessuna chiamata di rete reale, mai.

Ogni adapter di rete e' sostituito da uno stub che REGISTRA il tentativo e
solleva. Se una variante prova a raggiungere un endpoint a pagamento, la sonda
lo vede senza spendere nulla.
"""

# ---------------------------------------------------------------------------
# Riproduzione, dalla root del repository:
#     python3 docs/threat-models/probes/S-17-strict-zero-candidate-probe.py
# Le varianti sono estratte dai ref con `git show`: la sonda non dipende da file
# temporanei lasciati da una sessione precedente.
# ---------------------------------------------------------------------------
import pathlib, subprocess, tempfile

_REFS = {
    "main.py":   "origin/main",
    "v1.py":     "origin/agent/strict-zero-cloud-bridge-20260818",
    "v2.py":     "origin/agent/strict-zero-cloud-bridge-20260818-v2",
    "claude.py": "HEAD",
}

def _materialise() -> str:
    d = pathlib.Path(tempfile.mkdtemp(prefix="uj-strict-zero-")) / "variants"
    d.mkdir()
    for fname, ref in _REFS.items():
        blob = subprocess.run(["git", "show", f"{ref}:cloud_bridge.py"],
                              capture_output=True, check=True).stdout
        (d / fname).write_bytes(blob)
    return str(d) + "/"

import importlib.util, os, sys, types

ATTEMPTS = []

def _stub_modules():
    rel = types.ModuleType("core.reliability")
    def retry(**kw):
        def deco(fn):
            def wrapped(*a, **k):
                last = None
                for _ in range(kw.get("max_attempts", 1)):
                    try: return fn(*a, **k)
                    except Exception as e: last = e
                raise last
            return wrapped
        return deco
    rel.retry = retry
    core = types.ModuleType("core"); core.__path__ = []
    mon = types.ModuleType("core.monetization")
    class QuotaExceeded(Exception): pass
    mon.QuotaExceeded = QuotaExceeded
    mon.assert_llm_budget = lambda *a, **k: None
    mon.record_llm_call = lambda *a, **k: None

    req = types.ModuleType("requests")
    def post(url, **kw):
        ATTEMPTS.append(("HTTP", url)); raise RuntimeError("stubbed: nessuna rete")
    req.post = post
    oai = types.ModuleType("openai")
    class OpenAI:
        def __init__(self, **kw):
            ATTEMPTS.append(("OPENAI_CLIENT", "https://api.openai.com")); raise RuntimeError("stubbed")
    oai.OpenAI = OpenAI
    for n, m in [("core",core),("core.reliability",rel),("core.monetization",mon),
                 ("requests",req),("openai",oai)]:
        sys.modules[n] = m

def load(path, name):
    for k in list(sys.modules):
        if k.startswith("cb_"): del sys.modules[k]
    spec = importlib.util.spec_from_file_location(name, path)
    m = importlib.util.module_from_spec(spec); sys.modules[name] = m
    spec.loader.exec_module(m); return m

VARIANTS = [("origin/main", "main.py"), ("v1 = v2", "v1.py"), ("branch CLAUDE", "claude.py")]
ATTACKS = [
    ("default (nessuna variabile)", {}),
    ("MODEL_PROVIDER assente + OPENAI_API_KEY", {"OPENAI_API_KEY": "sk-test"}),
    ("MODEL_PROVIDER=openai esplicito", {"MODEL_PROVIDER": "openai"}),
    ("MODEL_PROVIDER=OpenAI (maiuscole)", {"MODEL_PROVIDER": "OpenAI"}),
    ("MODEL_PROVIDER=' openai ' (spazi)", {"MODEL_PROVIDER": " openai "}),
    ("MODEL_PROVIDER=local + base remota", {"MODEL_PROVIDER": "local", "LMSTUDIO_BASE": "http://evil.example.com:1234"}),
    ("MODEL_PROVIDER=local + base 169.254", {"MODEL_PROVIDER": "local", "LMSTUDIO_BASE": "http://169.254.169.254"}),
]
base = _materialise()
print(f"{'attacco':<42} | " + " | ".join(f"{n:<14}" for n, _ in VARIANTS))
print("-" * 42 + "-+-" + "-+-".join("-"*14 for _ in VARIANTS))
summary = {n: {"paid":0,"loop":0,"blocked":0} for n,_ in VARIANTS}
for label, env in ATTACKS:
    cells = []
    for vname, vfile in VARIANTS:
        for k in ("MODEL_PROVIDER","OPENAI_API_KEY","LMSTUDIO_BASE","LLM_VERBOSE"): os.environ.pop(k, None)
        os.environ["LLM_VERBOSE"] = "0"; os.environ.update(env)
        _stub_modules(); ATTEMPTS.clear()
        try:
            m = load(base + vfile, "cb_" + vfile[:-3])
            m.ask_cloud_ai("ciao")
        except Exception:
            pass
        paid = [u for k, u in ATTEMPTS if k == "OPENAI_CLIENT" or "api.openai.com" in u]
        remote = [u for k, u in ATTEMPTS if k == "HTTP" and not any(h in u for h in ("127.0.0.1","localhost","[::1]"))]
        if paid: cells.append("PAGAMENTO"); summary[vname]["paid"] += 1
        elif remote: cells.append("REMOTO"); summary[vname]["paid"] += 1
        elif ATTEMPTS: cells.append("loopback"); summary[vname]["loop"] += 1
        else: cells.append("bloccato"); summary[vname]["blocked"] += 1
    print(f"{label:<42} | " + " | ".join(f"{c:<14}" for c in cells))
print()
for n in summary:
    s = summary[n]
    print(f"{n:<16}: {s['paid']} percorsi a pagamento/remoti · {s['loop']} loopback · {s['blocked']} bloccati")
