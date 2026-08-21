#!/usr/bin/env python3
"""
Verifica i due fix di sicurezza consegnati da GROK il 2026-08-21 sul ramo
agent/uj-grok-security-fixes-20260821 (@ c4bb58a):

  FIX-19a / S-26  scan_text prima di exec_module in core/graph_exec.py
  FIX-11  / S-18  root risolta a runtime in tools/files.py

USO, dalla root del repository:

    git worktree add --detach /tmp/wt-grok origin/agent/uj-grok-security-fixes-20260821
    python3 docs/threat-models/probes/GROK-FIXES-20260821-verification-probe.py /tmp/wt-grok
    git worktree remove --force /tmp/wt-grok

Passando un worktree a origin/main si ottiene il CONTROLLO NEGATIVO: là il
carico ostile viene eseguito e pytest sovrascrive grok.md.

--------------------------------------------------------------------------
TRE TRAPPOLE INCONTRATE SCRIVENDO QUESTA SONDA. Leggerle prima di modificarla.

1. E38 — la sonda deve MATERIALIZZARE il ref che dichiara di misurare, e
   importare da quel worktree. L'albero corrente e' il ramo CLAUDE e non
   contiene i fix di Grok: importare da li' misura la cosa sbagliata e non lo
   dice.

2. Trappola 12, dal lato di chi scrive il test — la prima stesura usava
   `{"nodes": [...]}` in deps.json. La chiave vera e' `modules` (graph_exec.py
   riga 74), quindi la lista dei moduli risultava vuota, NIENTE veniva caricato,
   e il carico ostile risultava "ESEGUITO" con `loaded: []`. Sembrava che il fix
   di Grok non funzionasse. Il segnale che ha salvato e' stata l'incoerenza fra
   `order: []` e l'attesa, non un errore.
   CONTROMISURA, ora nel codice: se `loaded` e' vuoto la cella stampa
   NON_MISURATO, mai "eseguito". Un guasto a monte non deve leggersi come esito.

3. Ogni caso ostile ha il suo CONTROLLO POSITIVO. Un gate che rifiuta tutto non
   e' un gate, e' un guasto: senza il carico benigno non si distingue.
--------------------------------------------------------------------------

Nessuna scrittura fuori dalle directory temporanee. Nessuna rete.
"""
import os
import subprocess
import sys
import textwrap
from pathlib import Path

if len(sys.argv) < 2:
    sys.exit(__doc__)

WT = Path(sys.argv[1]).resolve()
if not (WT / "core" / "graph_exec.py").exists():
    sys.exit("worktree non valido (manca core/graph_exec.py): " + str(WT))

rev = subprocess.run(["git", "-C", str(WT), "rev-parse", "--short", "HEAD"],
                     capture_output=True, text=True).stdout.strip()
print("=" * 74)
print("worktree misurato :", WT)
print("ref               :", rev or "<sconosciuto>")
print("=" * 74)


def run_py(code: str) -> str:
    env = dict(os.environ)
    env["PYTHONPATH"] = str(WT)
    env["PYTHONDONTWRITEBYTECODE"] = "1"
    p = subprocess.run([sys.executable, "-c", textwrap.dedent(code)],
                       cwd=str(WT), env=env, capture_output=True, text=True)
    return (p.stdout + p.stderr).strip()


# --------------------------------------------------------------- FIX-19a
print("\n### FIX-19a / S-26 — scan_text prima di exec_module\n")

CASI = [
    ("carico OSTILE (eval + rm -rf)", 'import os\nBAD = "rm -rf /tmp/nothing"\ndef run():\n    return eval("1+1")\n', "RIFIUTATO"),
    ("carico BENIGNO (controllo positivo)", 'def run():\n    return "ok"\n', "ESEGUITO"),
]

for label, body, atteso in CASI:
    out = run_py(f'''
        import json, tempfile, pathlib
        from core.graph_exec import execute_graph, GraphError
        d = pathlib.Path(tempfile.mkdtemp(prefix="uj-probe-"))
        (d / "mod.py").write_text({body!r}, encoding="utf-8")
        (d / "deps.json").write_text(json.dumps({{"modules": ["mod.py"], "edges": []}}), encoding="utf-8")
        try:
            r = execute_graph(d)
            # guardia trappola 12: nessun modulo caricato != nessuna esecuzione
            print("ESITO=NON_MISURATO" if not r.get("loaded") else "ESITO=ESEGUITO", repr(r)[:110])
        except GraphError as e:
            print("ESITO=RIFIUTATO", str(e)[:150])
        except Exception as e:
            print("ESITO=ALTRO", type(e).__name__, str(e)[:150])
    ''')
    riga = next((l for l in out.splitlines() if l.startswith("ESITO=")), "ESITO=NON_MISURATO " + out[-140:])
    got = riga.split("=", 1)[1].split()[0]
    print(f"  {'OK ' if got == atteso else '!! '}{label:38s} atteso={atteso:10s} -> {riga[:96]}")

print("\n  -- il gate e' sul percorso, non solo importabile --")
print("  " + "\n  ".join(run_py('''
    import inspect
    from core import graph_exec
    src = inspect.getsource(graph_exec)
    i_scan, i_exec = src.find("scan_text("), src.find("exec_module")
    print("occorrenze di scan_text :", src.count("scan_text"))
    print("scan_text PRIMA di exec_module:", i_scan != -1 and i_exec != -1 and i_scan < i_exec)
''').splitlines()))

print("\n  -- path traversal da deps.json: SECONDO difetto di S-26, NON coperto da FIX-19a --")
print("  " + "\n  ".join(run_py('''
    import json, tempfile, pathlib
    from core.graph_exec import execute_graph, GraphError
    d = pathlib.Path(tempfile.mkdtemp(prefix="uj-probe-"))
    fuori = d.parent / "uj_fuori_dalla_jobdir.py"
    fuori.write_text("def run():\\n    return 'eseguito fuori dalla job dir'\\n", encoding="utf-8")
    (d / "deps.json").write_text(json.dumps({"modules": ["../" + fuori.name], "edges": []}), encoding="utf-8")
    try:
        r = execute_graph(d)
        print("ESITO=NON_MISURATO" if not r.get("loaded") else "ESITO=ESEGUITO_FUORI_ROOT", repr(r)[:130])
    except GraphError as e:
        print("ESITO=RIFIUTATO", str(e)[:130])
    finally:
        fuori.unlink(missing_ok=True)
''').splitlines()[-1:]))

# ---------------------------------------------------------------- FIX-11
print("\n### FIX-11 / S-18 — la fixture isola davvero le scritture?\n")
print("  " + "\n  ".join(run_py('''
    import pathlib, tempfile, hashlib
    import tools.files as f
    marker = pathlib.Path(f.PROJECT_ROOT) / "grok.md"
    before = hashlib.sha256(marker.read_bytes()).hexdigest()[:12] if marker.exists() else "<assente>"
    fake = pathlib.Path(tempfile.mkdtemp(prefix="uj-fakeroot-"))
    f.PROJECT_ROOT = fake          # esattamente cio' che fa la fixture tmp_root
    try:
        print("scritto in :", f.safe_write("grok.md", "PROVA", force=True))
    except Exception as e:
        print("rifiutato  :", type(e).__name__, str(e)[:90])
    after = hashlib.sha256(marker.read_bytes()).hexdigest()[:12] if marker.exists() else "<assente>"
    print("grok.md reale prima/dopo:", before, "/", after,
          "->", "INTATTO" if before == after else "!!! SOVRASCRITTO !!!")
''').splitlines()))

print("\n  -- controllo positivo: il contenimento vero regge ancora? --")
print("  " + "\n  ".join(run_py('''
    import pathlib, tempfile
    import tools.files as f
    fake = pathlib.Path(tempfile.mkdtemp(prefix="uj-fakeroot-"))
    f.PROJECT_ROOT = fake
    (fake / "core").mkdir(parents=True, exist_ok=True)
    for path, atteso in [("core/registry.py", "RIFIUTATO"), ("normale.txt", "SCRITTO"),
                         ("/tmp/uj-escape-test.txt", "RIFIUTATO")]:
        try:
            f.safe_write(path, "x"); got = "SCRITTO"
        except Exception:
            got = "RIFIUTATO"
        print(f"{path:26s} atteso={atteso:10s} ottenuto={got:10s}", "OK" if got == atteso else "!! DIVERGENZA")
''').splitlines()))

print("\n" + "=" * 74)
print("Per la prova completa di FIX-11 serve anche il pytest, che questa sonda")
print("NON esegue: su un worktree a origin/main sporca il repository (e' S-18).")
print("  python3 -m pytest tests/test_files.py tests/test_graph_exec.py \\")
print("      tests/test_multi_file.py -q  &&  git -C <worktree> status --short")
print("Atteso sul ramo di Grok: 11 passed, status VUOTO.")
print("Atteso su origin/main:   11 passed, status con grok.md modificato + a.txt/notes/sub.")
print("=" * 74)
