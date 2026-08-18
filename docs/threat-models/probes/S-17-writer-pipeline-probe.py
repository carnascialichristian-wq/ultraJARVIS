"""S-17 §14: il writer LLM di nt_helpers su origin/main raggiunge un provider a pagamento?

Nessuna rete reale: `openai` e `requests` sono stub che REGISTRANO e sollevano.
"""
import importlib.util, os, pathlib, subprocess, sys, tempfile, types

ATTEMPTS = []

def stubs():
    rel = types.ModuleType("core.reliability")
    def retry(**kw):
        def deco(fn):
            def w(*a, **k):
                last = None
                for _ in range(kw.get("max_attempts", 1)):
                    try: return fn(*a, **k)
                    except Exception as e: last = e; ATTEMPTS.append(("RETRY", "attempt"))
                raise last
            return w
        return deco
    rel.retry = retry
    # nt_helpers importa anche safe_write: senza questo il modulo non si carica
    # affatto e la sonda riporta "nessuna chiamata" per il motivo sbagliato.
    rel.safe_write = lambda *a, **k: None
    core = types.ModuleType("core"); core.__path__ = []
    mon = types.ModuleType("core.monetization")
    class QuotaExceeded(Exception): pass
    mon.QuotaExceeded = QuotaExceeded
    mon.assert_llm_budget = lambda *a, **k: None
    mon.record_llm_call = lambda *a, **k: None
    req = types.ModuleType("requests")
    req.post = lambda url, **kw: (ATTEMPTS.append(("HTTP", url)), (_ for _ in ()).throw(RuntimeError("stub")))[0]
    oai = types.ModuleType("openai")
    class OpenAI:
        def __init__(self, **kw):
            ATTEMPTS.append(("OPENAI_CLIENT", "https://api.openai.com"))
            raise RuntimeError("stub: nessuna rete")
    oai.OpenAI = OpenAI
    adv = types.ModuleType("advisors"); adv.__path__ = []
    saf = types.ModuleType("advisors.safety")
    saf.scan_text = lambda body: []          # nessun rilievo: non deve mascherare il risultato
    for n, m in [("core",core),("core.reliability",rel),("core.monetization",mon),
                 ("requests",req),("openai",oai),("advisors",adv),("advisors.safety",saf)]:
        sys.modules[n] = m

def materialise(ref):
    d = pathlib.Path(tempfile.mkdtemp(prefix="uj-writer-"))
    for path in ("cloud_bridge.py", "core/nt_helpers.py"):
        blob = subprocess.run(["git","show",f"{ref}:{path}"], capture_output=True).stdout
        if not blob: return None
        t = d / pathlib.Path(path).name
        t.write_bytes(blob)
    return d

def load(p, n):
    # cloud_bridge legge MODEL_PROVIDER in una COSTANTE DI MODULO, valutata una
    # sola volta all'import. Se resta in sys.modules fra due scenari, il secondo
    # eredita il provider del primo e la misura e' falsa. Va sfrattato ogni volta.
    for k in list(sys.modules):
        if k.startswith("w_") or k == "cloud_bridge": del sys.modules[k]
    spec = importlib.util.spec_from_file_location(n, p)
    m = importlib.util.module_from_spec(spec); sys.modules[n] = m
    spec.loader.exec_module(m); return m

SCEN = [
    ("nessuna variabile (default)", {}),
    ("UJ_WRITER_LLM=1 DA SOLO", {"UJ_WRITER_LLM": "1"}),
    ("UJ_WRITER_LLM=1 + OPENAI_API_KEY", {"UJ_WRITER_LLM": "1", "OPENAI_API_KEY": "sk-test-not-real"}),
    ("UJ_WRITER_LLM=1 + MODEL_PROVIDER=local", {"UJ_WRITER_LLM": "1", "MODEL_PROVIDER": "local"}),
]
print(f"{'scenario':<38} | {'origin/main':<26} | {'branch CLAUDE':<26}")
print("-"*38 + "-+-" + "-"*26 + "-+-" + "-"*26)
for label, env in SCEN:
    row = []
    for ref in ("origin/main", "HEAD"):
        d = materialise(ref)
        if d is None: row.append("nt_helpers assente"); continue
        for k in ("UJ_WRITER_LLM","OPENAI_API_KEY","MODEL_PROVIDER","LMSTUDIO_BASE"): os.environ.pop(k, None)
        os.environ["LLM_VERBOSE"] = "0"; os.environ.update(env)
        stubs(); ATTEMPTS.clear()
        sys.path.insert(0, str(d))
        loaded = False
        try:
            m = load(str(d/"nt_helpers.py"), "w_nt")
            loaded = True
            m._code_via_llm("crea un tool che somma due numeri", "somma")
        except Exception as e:
            if not loaded:
                row.append(f"MODULO NON CARICATO: {type(e).__name__}")
                sys.path.remove(str(d)); continue
        finally:
            sys.path.remove(str(d))
        paid = sum(1 for k,_ in ATTEMPTS if k == "OPENAI_CLIENT")
        http = [u for k,u in ATTEMPTS if k == "HTTP"]
        remote = [u for u in http if not any(h in u for h in ("127.0.0.1","localhost","[::1]"))]
        if paid: row.append(f"A PAGAMENTO ({paid} tentativi)")
        elif remote: row.append(f"REMOTO ({len(remote)})")
        elif http: row.append(f"loopback ({len(http)})")
        else: row.append("nessuna chiamata")
    print(f"{label:<38} | {row[0]:<26} | {row[1]:<26}")
