"""S-19: quando il budget e' esaurito, embed() procede lo stesso?"""

# ---------------------------------------------------------------------------
# Riproduzione, dalla root del repository:
#     python3 docs/threat-models/probes/S-19-embed-budget-gate-probe.py
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
class QuotaExceeded(Exception): pass

def stubs(quota_exhausted: bool):
    rel = types.ModuleType("core.reliability")
    def retry(**kw):
        def deco(fn):
            def w(*a, **k):
                last=None
                for _ in range(kw.get("max_attempts",1)):
                    try: return fn(*a,**k)
                    except Exception as e: last=e
                raise last
            return w
        return deco
    rel.retry = retry
    core = types.ModuleType("core"); core.__path__=[]
    mon = types.ModuleType("core.monetization"); mon.QuotaExceeded = QuotaExceeded
    def assert_llm_budget(*a, **k):
        if quota_exhausted: raise QuotaExceeded("budget esaurito")
    mon.assert_llm_budget = assert_llm_budget
    mon.record_llm_call = lambda *a, **k: None
    req = types.ModuleType("requests")
    def post(url, **kw):
        ATTEMPTS.append(("HTTP", url)); raise RuntimeError("stub")
    req.post = post
    oai = types.ModuleType("openai")
    class OpenAI:
        def __init__(self, **kw):
            ATTEMPTS.append(("OPENAI","https://api.openai.com")); raise RuntimeError("stub")
    oai.OpenAI = OpenAI
    for n,m in [("core",core),("core.reliability",rel),("core.monetization",mon),
                ("requests",req),("openai",oai)]: sys.modules[n]=m

def load(path,name):
    spec=importlib.util.spec_from_file_location(name,path)
    m=importlib.util.module_from_spec(spec); sys.modules[name]=m
    spec.loader.exec_module(m); return m

base = _materialise()
print(f"{'variante':<16} | {'embed() esiste':<15} | {'budget OK':<24} | {'BUDGET ESAURITO':<24}")
print("-"*16+"-+-"+"-"*15+"-+-"+"-"*24+"-+-"+"-"*24)
for vname, vfile in [("origin/main","main.py"),("v1 = v2","v1.py"),("branch CLAUDE","claude.py")]:
    row=[]
    exists=None
    for exhausted in (False, True):
        for k in ("MODEL_PROVIDER","OPENAI_API_KEY","LMSTUDIO_BASE"): os.environ.pop(k,None)
        os.environ["LLM_VERBOSE"]="0"
        stubs(exhausted); ATTEMPTS.clear()
        for k in list(sys.modules):
            if k.startswith("cbx_"): del sys.modules[k]
        m=load(base+vfile,"cbx_"+vfile[:-3])
        if not hasattr(m,"embed"):
            exists=False; row.append("n/d"); continue
        exists=True
        try: m.embed(["testo"])
        except Exception: pass
        paid=[u for k,u in ATTEMPTS if k=="OPENAI"]
        http=[u for k,u in ATTEMPTS if k=="HTTP"]
        if paid: row.append("CHIAMATA A PAGAMENTO")
        elif http: row.append("chiamata loopback")
        else: row.append("nessuna chiamata")
    print(f"{vname:<16} | {str(exists):<15} | {row[0]:<24} | {row[1]:<24}")
