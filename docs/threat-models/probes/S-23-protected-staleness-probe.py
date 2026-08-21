#!/usr/bin/env python3
"""S-23 — `PROTECTED` nomina il posto in cui il codice STAVA.

`core/natural_tasks.py` e' oggi un guscio di re-export di 26 righe: la logica e'
stata spostata in `core/nt_pipeline.py`, `core/nt_runner.py`, `core/nt_helpers.py`,
nessuno dei quali e' in `PROTECTED`. Fra questi c'e' `promote_job_to_tools`, cioe'
il gate di safety introdotto da FIX-1.

Misura, per esecuzione e non per lettura:
  A) quanti moduli di `core/` sono coperti da `PROTECTED`, in file e in righe;
  B) `tools.files.safe_write` rifiuta `core/registry.py` (protetto) e ACCETTA
     `core/nt_runner.py` (non protetto), che contiene il gate di promozione.

Nessuna scrittura tocca il repository reale: tutto avviene in una root finta
dentro una directory temporanea. Worktree e temp rimossi con `atexit`
(trappola 37: la sonda materializza il ref che dichiara di misurare).

Uso:  python3 docs/threat-models/probes/S-23-protected-staleness-probe.py
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


def main() -> int:
    sha = subprocess.run(["git", "rev-parse", TARGET_REF], cwd=REPO,
                         capture_output=True, text=True, check=True).stdout.strip()
    work = Path(tempfile.mkdtemp(prefix="s23-worktree-"))
    tmp = Path(tempfile.mkdtemp(prefix="s23-scratch-"))

    def _cleanup() -> None:
        subprocess.run(["git", "worktree", "remove", "--force", str(work)],
                       cwd=REPO, capture_output=True, text=True)
        shutil.rmtree(work, ignore_errors=True)
        shutil.rmtree(tmp, ignore_errors=True)

    atexit.register(_cleanup)
    subprocess.run(["git", "worktree", "add", "--detach", str(work), sha],
                   cwd=REPO, capture_output=True, text=True, check=True)

    print(f"ref misurato : {TARGET_REF} @ {sha[:12]}")
    print()

    driver = tmp / "driver.py"
    driver.write_text(
        "import sys, shutil\n"
        "from pathlib import Path\n"
        "WORK = Path(sys.argv[1]); TMP = Path(sys.argv[2])\n"
        "sys.path.insert(0, str(WORK))\n"
        "from tools.files import safe_write, is_protected, PROTECTED\n"
        "\n"
        "print('=== A) copertura di PROTECTED su core/ ===')\n"
        "mods = sorted((WORK / 'core').glob('*.py'))\n"
        "prot_f = prot_l = tot_f = tot_l = 0\n"
        "for m in mods:\n"
        "    rel = 'core/' + m.name\n"
        "    n = len(m.read_text(encoding='utf-8').splitlines())\n"
        "    tot_f += 1; tot_l += n\n"
        "    if rel in PROTECTED:\n"
        "        prot_f += 1; prot_l += n\n"
        "print('  moduli core/ : %d, righe %d' % (tot_f, tot_l))\n"
        "print('  protetti     : %d, righe %d' % (prot_f, prot_l))\n"
        "print('  NON protetti : %d, righe %d' % (tot_f - prot_f, tot_l - prot_l))\n"
        "shim = WORK / 'core' / 'natural_tasks.py'\n"
        "print('  core/natural_tasks.py e\\' PROTETTO ed e\\' lungo %d righe (guscio di re-export)'\n"
        "      % len(shim.read_text(encoding='utf-8').splitlines()))\n"
        "for name in ('nt_pipeline.py', 'nt_runner.py', 'nt_helpers.py'):\n"
        "    p = WORK / 'core' / name\n"
        "    n = len(p.read_text(encoding='utf-8').splitlines()) if p.exists() else -1\n"
        "    print('  core/%-16s protetto=%-5s righe=%d' % (name, 'core/' + name in PROTECTED, n))\n"
        "\n"
        "print()\n"
        "print('=== B) chi contiene promote_job_to_tools, ed e\\' protetto? ===')\n"
        "for m in mods:\n"
        "    if 'def promote_job_to_tools' in m.read_text(encoding='utf-8'):\n"
        "        rel = 'core/' + m.name\n"
        "        print('  definita in %s  ->  protetto=%s' % (rel, rel in PROTECTED))\n"
        "\n"
        "print()\n"
        "print('=== C) scrittura reale contro i due file, in una root finta ===')\n"
        "root = TMP / 'finta_root'\n"
        "shutil.copytree(WORK / 'core', root / 'core')\n"
        "for rel in ('core/registry.py', 'core/nt_runner.py'):\n"
        "    target = root / rel\n"
        "    before = target.read_text(encoding='utf-8')\n"
        "    try:\n"
        "        safe_write(target, '# SOVRASCRITTO\\n', root=root)\n"
        "        cambiato = target.read_text(encoding='utf-8') != before\n"
        "        print('  %-20s ACCETTATO, file cambiato=%s' % (rel, cambiato))\n"
        "    except Exception as e:\n"
        "        print('  %-20s rifiutato: %s: %s' % (rel, type(e).__name__, e))\n",
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
