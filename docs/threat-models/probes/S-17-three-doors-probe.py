"""S-17 quarta verifica: quante porte a pagamento esistono su main, e cosa le tiene chiuse.

Riproduzione, dalla root del repository:
    python3 docs/threat-models/probes/S-17-three-doors-probe.py

La sonda NON tocca la rete e NON puo' generare un addebito: i moduli `openai` e
`requests` sono sostituiti da stub che REGISTRANO il tentativo e sollevano. Se una
riga della tabella dice "A PAGAMENTO", significa che il codice ha costruito ed
emesso la richiesta, non che l'ha eseguita.

Lezioni gia' pagate, incorporate qui:
  - E19: ogni scenario gira in un SOTTOPROCESSO isolato. Le variabili d'ambiente
    sono lette all'import, quindi importlib.reload non isola abbastanza.
  - E22: ogni scenario riporta se il modulo si e' CARICATO. Senza questo controllo
    "nessuna chiamata" e "il modulo non si importa" sono indistinguibili, ed e' un
    falso negativo che ho gia' consegnato una volta.
  - E23: cloud_bridge viene sfrattato da sys.modules fra uno scenario e l'altro,
    perche' PROVIDER e' una costante di modulo valutata una volta sola.
"""
import json, os, shutil, subprocess, sys, tempfile, pathlib

# IL REF SI MATERIALIZZA, NON SI PRESUME.
# Prima stesura di questa sonda: importava dal worktree corrente dichiarando di
# misurare origin/main. Il worktree corrente e' il ramo CLAUDE, che porta gia' il
# fix STRICT_ZERO, quindi ogni riga diceva "nessuna chiamata" — un falso negativo
# su un finding CRITICO. E' la trappola 36: ref giusto per i DATI, ref sbagliato
# per il CODICE ESEGUITO. Il percorso attraversa cinque moduli, quindi serve un
# worktree, non un `git show` di un file solo.
# Accetta sia TARGET_REF (convenzione delle sonde S-22..S-27) sia UJ_PROBE_REF
# (nome storico di questa sonda). Una sessione futura che segue la convenzione nuova
# passerebbe TARGET_REF e, senza questo alias, misurerebbe origin/main per sbaglio —
# ci sono cascato io stesso: trappola 37.
TARGET_REF = os.environ.get("TARGET_REF") or os.environ.get("UJ_PROBE_REF", "origin/main")


def _materialise_worktree() -> str:
    d = tempfile.mkdtemp(prefix="uj-three-doors-")
    wt = str(pathlib.Path(d) / "wt")
    subprocess.run(["git", "worktree", "add", "--detach", wt, TARGET_REF],
                   check=True, capture_output=True)
    # Pulizia via atexit: pipare l'output in `head` manda SIGPIPE e lo script muore
    # prima dell'ultima riga, lasciando un worktree orfano. Gia' successo una volta.
    import atexit
    atexit.register(lambda: subprocess.run(["git", "worktree", "remove", "--force", wt],
                                           capture_output=True))
    return wt


REPO = _materialise_worktree()
_HEAD = subprocess.run(["git", "-C", REPO, "rev-parse", "HEAD"],
                       capture_output=True, text=True).stdout.strip()

CHILD = r'''
import json, os, sys, types, pathlib
REPO, REF, DOOR = sys.argv[1], sys.argv[2], sys.argv[3]
sys.path.insert(0, REPO)

attempts = []

# --- stub openai: registra e solleva. Nessun socket. -------------------------
class _Resp:
    pass
def _mk_openai():
    m = types.ModuleType("openai")
    class OpenAI:
        def __init__(self, **kw):
            attempts.append({"provider": "openai", "phase": "client", "key_passed": bool(kw.get("api_key"))})
            class _C:
                class completions:
                    @staticmethod
                    def create(**k):
                        attempts.append({"provider": "openai", "phase": "chat", "model": k.get("model")})
                        raise RuntimeError("probe: nessuna rete")
            class _E:
                @staticmethod
                def create(**k):
                    attempts.append({"provider": "openai", "phase": "embeddings", "model": k.get("model")})
                    raise RuntimeError("probe: nessuna rete")
            self.chat = _C(); self.embeddings = _E()
    m.OpenAI = OpenAI
    return m

def _mk_requests():
    m = types.ModuleType("requests")
    def post(url, **kw):
        attempts.append({"provider": "http", "phase": "post", "url": url})
        raise RuntimeError("probe: nessuna rete")
    m.post = post
    return m

sys.modules["openai"] = _mk_openai()
sys.modules["requests"] = _mk_requests()

loaded = False
err = None
try:
    # E23: sfratta il ponte, PROVIDER e' valutato all'import
    for mod in [k for k in list(sys.modules) if k == "cloud_bridge" or k.startswith("core.")]:
        sys.modules.pop(mod, None)

    if DOOR == "planner":
        from core.planner import plan
        loaded = True
        plan("scrivi un tool che somma due numeri")
    elif DOOR == "writer":
        from core.nt_helpers import _code_via_llm
        loaded = True
        _code_via_llm("somma due numeri", "sommatore")
    elif DOOR == "embedding":
        from core.memory import embed_texts
        loaded = True
        embed_texts(["ricordo di prova"])
    elif DOOR == "embed_direct":
        from cloud_bridge import embed
        loaded = True
        embed(["ricordo di prova"])
except Exception as e:
    err = f"{type(e).__name__}: {e}"

print(json.dumps({"loaded": loaded, "attempts": attempts, "err": err}))
'''

def run(door, env):
    with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False) as f:
        f.write(CHILD); child = f.name
    e = dict(os.environ)
    for k in ("MODEL_PROVIDER", "UJ_PLANNER_LLM", "UJ_WRITER_LLM", "UJ_EMBEDDING", "OPENAI_API_KEY"):
        e.pop(k, None)
    e.update(env)
    e["PYTHONDONTWRITEBYTECODE"] = "1"
    # BUG GIA' COMMESSO QUI, DA NON RIFARE: env=e mancava, quindi lo scenario
    # veniva calcolato e mai applicato e tutte e dodici le celle misuravano la
    # stessa identica configurazione ambientale. Su un finding che riguarda i
    # soldi del proprietario avrebbe riportato "chiuso" dove e' aperto.
    p = subprocess.run([sys.executable, "-B", child, str(REPO), "main", door],
                       env=e, cwd=REPO,
                       capture_output=True, text=True, timeout=120)
    os.unlink(child)
    line = [l for l in p.stdout.splitlines() if l.startswith("{")]
    if not line:
        return {"loaded": False, "attempts": [], "err": (p.stderr or p.stdout)[-200:]}
    return json.loads(line[-1])

VERBOSE = os.environ.get("UJ_PROBE_VERBOSE") == "1"


def verdict(r):
    if VERBOSE:
        print(f"    [debug] loaded={r['loaded']} attempts={r['attempts']} err={r['err']}", file=sys.stderr)
    if not r["loaded"]:
        return "MODULO NON CARICATO"          # E22: non e' "nessuna chiamata"
    # Estensione della lezione E22: un errore PRIMA del ponte (firma sbagliata,
    # dipendenza assente) produce zero tentativi e si legge come sicurezza.
    if r["err"] and not r["attempts"]:
        return f"NON MISURATO ({r['err'][:40]})"
    paid = [a for a in r["attempts"] if a["provider"] == "openai" and a["phase"] != "client"]
    loop = [a for a in r["attempts"] if a["provider"] == "http"]
    if paid:
        return f"A PAGAMENTO ({len(paid)} tentativi)"
    if loop:
        return f"loopback ({len(loop)})"
    return "nessuna chiamata"

DOORS = [
    ("planner   (UJ_PLANNER_LLM)", "planner",   {"UJ_PLANNER_LLM": "1"}),
    ("writer    (UJ_WRITER_LLM)",  "writer",    {"UJ_WRITER_LLM": "1"}),
    ("embedding (UJ_EMBEDDING)",   "embedding", {"UJ_EMBEDDING": "1"}),
]

print(f"Sonda S-17 / quarta verifica — ref misurato: {TARGET_REF} @ {_HEAD[:12]}")
print("Nessuna chiamata di rete reale. 'A PAGAMENTO' = richiesta costruita ed emessa.\n")
print(f"{'porta':<28} | {'default (niente impostato)':<26} | {'solo il flag':<24} | {'flag + MODEL_PROVIDER=local'}")
print("-" * 28 + "-+-" + "-" * 26 + "-+-" + "-" * 24 + "-+-" + "-" * 28)
for label, door, flag in DOORS:
    a = verdict(run(door, {}))
    b = verdict(run(door, flag))
    c = verdict(run(door, {**flag, "MODEL_PROVIDER": "local"}))
    print(f"{label:<28} | {a:<26} | {b:<24} | {c}")

print()
print("Controllo incrociato — embed() guidata direttamente, senza il gate di memory:")
print(f"  default                      : {verdict(run('embed_direct', {}))}")
print(f"  MODEL_PROVIDER=local         : {verdict(run('embed_direct', {'MODEL_PROVIDER': 'local'}))}")

