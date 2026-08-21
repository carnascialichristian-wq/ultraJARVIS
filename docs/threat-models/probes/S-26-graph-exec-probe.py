#!/usr/bin/env python3
"""S-26 — `execute_graph` esegue codice generato SENZA il gate di safety.

`promote_job_to_tools` e' stato indurito da FIX-1 con `advisors.safety.scan_text`.
`execute_graph` — che il codice non lo copia, lo ESEGUE — non ha nessun gate.

Misura, in un worktree materializzato al ref, tutto dentro directory temporanee:

  A) un modulo il cui codice contiene i pattern che il vostro stesso scanner
     riconosce viene ESEGUITO senza che nulla lo fermi;
  B) `advisors.safety.scan_text` LO RILEVA — quindi il gate esiste, e' solo assente
     da questo percorso;
  C) i nomi dei moduli in `deps.json` non sono validati: `../fuori.py` esce dalla
     job dir (path traversal);
  D) `sys.path.insert(0, job_dir)` e `sys.modules[stem] = mod` permettono a un
     modulo generato di prendere il posto di un modulo atteso.

Il "carico" delle prove e' innocuo per costruzione: scrive un file marcatore in una
directory temporanea. NESSUNA rete, nessuna scrittura fuori dai temp, nessun comando
di sistema eseguito.

ATTENZIONE, lezioni gia' pagate — non toglierle:
  * TRAPPOLA 37 / E38: la sonda MATERIALIZZA il ref che dichiara di misurare;
  * E22: un esito inatteso stampa `NON MISURATO (<errore>)`;
  * E39: `git -C <worktree>`, MAI `git --work-tree=<worktree>`;
  * worktree e temp rimossi con atexit, anche su SIGPIPE.

Uso:  python3 docs/threat-models/probes/S-26-graph-exec-probe.py
      TARGET_REF=<ref> python3 ...   (default: origin/main)
"""

from __future__ import annotations

import atexit
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
TARGET_REF = os.environ.get("TARGET_REF", "origin/main")

DRIVER = r'''
import json, sys
from pathlib import Path
WORK = Path(sys.argv[1]); TMP = Path(sys.argv[2])
sys.path.insert(0, str(WORK))
from core.graph_exec import execute_graph, GraphError

MARK = TMP / "eseguito.txt"

# --- A) codice con i pattern che lo scanner conosce, eseguito senza gate ---------
job = TMP / "job_a"; job.mkdir(parents=True, exist_ok=True)
sospetto = (
    "import os\n"
    "# pattern che advisors.safety.scan_text riconosce:\n"
    "_ = 'eval(' , 'subprocess', 'rm -rf'\n"
    "open(%r, 'w').write('il modulo e stato eseguito')\n"
    "def run():\n"
    "    return 'run() chiamata'\n"
) % str(MARK)
(job / "tool.py").write_text(sospetto, encoding="utf-8")
(job / "deps.json").write_text(json.dumps({"modules": ["tool.py"], "edges": []}), encoding="utf-8")

print("=== A) modulo con pattern sospetti: viene eseguito? ===")
try:
    out = execute_graph(job)
    print("   esito execute_graph :", {k: out[k] for k in ("ok", "order", "result")})
    print("   marcatore scritto   :", MARK.exists(), "->", MARK.read_text() if MARK.exists() else "-")
except Exception as e:
    print("   NON MISURATO (%s: %s)" % (type(e).__name__, e))

# --- B) lo scanner lo avrebbe rilevato? -----------------------------------------
print()
print("=== B) advisors.safety.scan_text riconosce quel codice? ===")
try:
    from advisors.safety import scan_text
    hits = scan_text(sospetto)
    print("   hit dello scanner   :", hits)
    print("   -> il gate ESISTE, e' solo ASSENTE da execute_graph")
except Exception as e:
    print("   NON MISURATO (%s: %s)" % (type(e).__name__, e))

# --- C) path traversal dai nomi in deps.json ------------------------------------
print()
print("=== C) i nomi dei moduli in deps.json sono validati? ===")
job_c = TMP / "job_c"; job_c.mkdir(parents=True, exist_ok=True)
fuori = TMP / "fuori.py"
MARK_C = TMP / "eseguito_fuori.txt"
fuori.write_text("open(%r,'w').write('modulo FUORI dalla job dir eseguito')\n" % str(MARK_C), encoding="utf-8")
(job_c / "deps.json").write_text(json.dumps({"modules": ["../fuori.py"], "edges": []}), encoding="utf-8")
try:
    out = execute_graph(job_c, entry="nessuno.py")
    print("   esito               :", {k: out[k] for k in ("ok", "loaded")})
    print("   marcatore fuori dir :", MARK_C.exists(), "->", MARK_C.read_text() if MARK_C.exists() else "-")
except GraphError as e:
    print("   rifiutato: GraphError: %s" % e)
except Exception as e:
    print("   NON MISURATO (%s: %s)" % (type(e).__name__, e))

# --- D) sys.path / sys.modules --------------------------------------------------
print()
print("=== D) inquinamento di sys.path e sys.modules ===")
print("   job dir in sys.path[0]      :", sys.path[0] == str(job) or sys.path[0] == str(job_c))
print("   'tool' registrato in sys.modules:", "tool" in sys.modules)
print("   sys.path[:3]                :", sys.path[:3])
'''


def main() -> int:
    sha = subprocess.run(["git", "rev-parse", TARGET_REF], cwd=REPO,
                         capture_output=True, text=True, check=True).stdout.strip()
    work = Path(tempfile.mkdtemp(prefix="s26-worktree-"))
    tmp = Path(tempfile.mkdtemp(prefix="s26-scratch-"))

    def _cleanup() -> None:
        subprocess.run(["git", "worktree", "remove", "--force", str(work)],
                       cwd=REPO, capture_output=True, text=True)
        shutil.rmtree(work, ignore_errors=True)
        shutil.rmtree(tmp, ignore_errors=True)

    atexit.register(_cleanup)
    subprocess.run(["git", "worktree", "add", "--detach", str(work), sha],
                   cwd=REPO, capture_output=True, text=True, check=True)

    driver = tmp / "driver.py"
    driver.write_text(DRIVER, encoding="utf-8")

    print(f"ref misurato : {TARGET_REF} @ {sha[:12]}")
    print("tutto in directory temporanee, nessuna rete, nessun comando di sistema\n")

    p = subprocess.run([sys.executable, "-B", str(driver), str(work), str(tmp)],
                       capture_output=True, text=True)
    if p.returncode != 0:
        ultima = p.stderr.strip().splitlines()[-1] if p.stderr.strip() else f"exit {p.returncode}"
        print(f"NON MISURATO ({ultima})")
        print(p.stdout, end="")
        return 1
    print(p.stdout, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
