#!/usr/bin/env python3
"""S-22 — due funzioni si chiamano `safe_write` e solo una contiene i path.

Riproduce, senza toccare il repository reale e senza rete:

  A) `core.reliability.safe_write` — quella importata come `guarded_write` dal
     percorso di build dei job — scrive FUORI da qualunque root;
  B) `tools.files.safe_write` — l'omonima indurita da FIX-3/FIX-4 — rifiuta lo
     stesso path;
  C) la catena che rende raggiungibile (A): `workspace/queue.jsonl` non e'
     PROTECTED, quindi una scrittura CONTENUTA dentro la root vi deposita un
     `output_dir` arbitrario, che `job_worker.process_one` inoltra a
     `build_and_run` senza validarlo.

ATTENZIONE, lezioni gia' pagate (trappole 37 e E38) — NON toglierle:

  * la sonda MATERIALIZZA il ref che dichiara di misurare in un worktree
    dedicato. Importare dal worktree corrente misura il TUO ramo, non
    `origin/main`, e la prima versione di una sonda precedente ha prodotto
    proprio cosi' una tabella che diceva il contrario del vero;
  * ogni esito inatteso stampa `NON MISURATO (<errore>)` invece di un silenzio
    che si leggerebbe come sicurezza;
  * il worktree e la directory temporanea vengono rimossi con `atexit`, anche
    se il processo muore per SIGPIPE (`| head`).

Uso:  python3 docs/threat-models/probes/S-22-uncontained-write-probe.py
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


def _run(*args: str) -> str:
    return subprocess.run(args, cwd=REPO, capture_output=True, text=True, check=True).stdout.strip()


def main() -> int:
    sha = _run("git", "rev-parse", TARGET_REF)
    work = Path(tempfile.mkdtemp(prefix="s22-worktree-"))
    tmp = Path(tempfile.mkdtemp(prefix="s22-scratch-"))

    def _cleanup() -> None:
        subprocess.run(["git", "worktree", "remove", "--force", str(work)],
                       cwd=REPO, capture_output=True, text=True)
        shutil.rmtree(work, ignore_errors=True)
        shutil.rmtree(tmp, ignore_errors=True)

    atexit.register(_cleanup)

    subprocess.run(["git", "worktree", "add", "--detach", str(work), sha],
                   cwd=REPO, capture_output=True, text=True, check=True)

    print(f"ref misurato : {TARGET_REF} @ {sha[:12]}")
    print(f"worktree     : {work}")
    print(f"scratch      : {tmp}")
    print()

    driver = tmp / "driver.py"
    driver.write_text(
        "import json, sys\n"
        "from pathlib import Path\n"
        "WORK = Path(sys.argv[1]); TMP = Path(sys.argv[2])\n"
        "sys.path.insert(0, str(WORK))\n"
        "\n"
        "root = TMP / 'finta_root'; root.mkdir(parents=True, exist_ok=True)\n"
        "(root / 'workspace').mkdir(parents=True, exist_ok=True)\n"
        "fuori = TMP / 'fuori'; fuori.mkdir(parents=True, exist_ok=True)\n"
        "vittima = fuori / 'vittima.txt'\n"
        "vittima.write_text('ORIGINALE')\n"
        "\n"
        "print('=== A) core.reliability.safe_write, cioe\\' guarded_write ===')\n"
        "try:\n"
        "    from core.reliability import safe_write as guarded_write\n"
        "    guarded_write(vittima, 'SOVRASCRITTO da core.reliability.safe_write')\n"
        "    print('  !! SCRITTO fuori da qualunque root:', vittima)\n"
        "    print('     contenuto ora:', repr(vittima.read_text()))\n"
        "except Exception as e:\n"
        "    print('  NON MISURATO (%s: %s)' % (type(e).__name__, e))\n"
        "\n"
        "print()\n"
        "print('=== B) tools.files.safe_write, la funzione OMONIMA indurita ===')\n"
        "vittima.write_text('ORIGINALE')\n"
        "try:\n"
        "    from tools.files import safe_write as hardened_write, is_protected\n"
        "except Exception as e:\n"
        "    print('  NON MISURATO (%s: %s)' % (type(e).__name__, e)); raise SystemExit(0)\n"
        "try:\n"
        "    hardened_write(vittima, 'tentativo', root=root)\n"
        "    print('  !! accettato, contenimento assente')\n"
        "except Exception as e:\n"
        "    print('  ok rifiutato: %s: %s' % (type(e).__name__, e))\n"
        "print('  contenuto dopo B:', repr(vittima.read_text()))\n"
        "\n"
        "print()\n"
        "print('=== C) la catena: queue.jsonl e\\' scrivibile e NON protetto ===')\n"
        "print('  is_protected(\"workspace/queue.jsonl\") =', is_protected('workspace/queue.jsonl', root=root))\n"
        "rec = {'prompt': 'x', 'output_dir': str(fuori / 'job_fuori_root'), 'ts': 0}\n"
        "try:\n"
        "    hardened_write(root / 'workspace' / 'queue.jsonl', json.dumps(rec) + chr(10), root=root)\n"
        "    print('  la scrittura CONTENUTA dentro la root e\\' stata accettata')\n"
        "except Exception as e:\n"
        "    print('  NON MISURATO (%s: %s)' % (type(e).__name__, e))\n"
        "letta = json.loads((root / 'workspace' / 'queue.jsonl').read_text().splitlines()[0])\n"
        "print('  output_dir che il worker inoltrerebbe:', letta['output_dir'])\n"
        "bersaglio = Path(letta['output_dir'])\n"
        "print('  Path(output_dir) e\\' dentro la root?',\n"
        "      str(bersaglio).startswith(str(root)))\n"
        "try:\n"
        "    bersaglio.mkdir(parents=True, exist_ok=True)\n"
        "    guarded_write(bersaglio / 'plan.md', '# scritto fuori root dal percorso di build')\n"
        "    print('  !! job_dir creata e plan.md scritto FUORI dalla root:', bersaglio / 'plan.md')\n"
        "except Exception as e:\n"
        "    print('  NON MISURATO (%s: %s)' % (type(e).__name__, e))\n",
        encoding="utf-8",
    )

    proc = subprocess.run([sys.executable, "-B", str(driver), str(work), str(tmp)],
                          capture_output=True, text=True)
    print(proc.stdout, end="")
    if proc.stderr.strip():
        print("--- stderr ---")
        print(proc.stderr, end="")
    return proc.returncode


if __name__ == "__main__":
    raise SystemExit(main())
