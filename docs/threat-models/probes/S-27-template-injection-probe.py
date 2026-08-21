#!/usr/bin/env python3
"""S-27 — l'iniezione prompt -> codice generato e' contenuta solo PER CASO.

Il percorso a template (`code_for_prompt`, ramo senza UJ_WRITER_LLM) incastona il
prompt e il title nell'header del modulo generato. Un prompt costruito puo' tentare
di chiudere la docstring e iniettare codice. Misura, in un worktree al ref, se
riesce — e PERCHE' oggi non riesce.

Payload BENIGNI: chiudono la docstring e provano a scrivere un file marcatore in una
directory temporanea. Nessuna rete, nessun comando di sistema, niente fuori dai temp.

Due barriere accidentali attese, entrambe da verificare, non da assumere:
  1. i frammenti `\"\"\"` creano una stringa non terminata (come S-13);
  2. `from __future__ import annotations` DEVE stare in cima: qualunque codice
     iniettato prima rompe la compilazione.

ATTENZIONE (E38/E39): worktree materializzato, `git -C`, atexit.
"""

from __future__ import annotations

import atexit, os, shutil, subprocess, sys, tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
TARGET_REF = os.environ.get("TARGET_REF", "origin/main")

DRIVER = r'''
import os, sys
from pathlib import Path
W, T = Path(sys.argv[1]), Path(sys.argv[2]); sys.path.insert(0, str(W)); os.chdir(T)
from core.planner import plan
from core.code_templates import code_for_prompt

def genera(payload):
    p = plan(payload)
    return (
        f'"""Auto-generated module for: {p.title}\n\n'
        f"Original prompt:\n{payload}\n\n"
        "Produced by NaturalTaskRunner (controlled write).\n"
        '"""\n\n'
        "from __future__ import annotations\n\n\n"
        f"{code_for_prompt(payload, p.title)}\n\n"
        'if __name__ == "__main__":\n    print(run())\n'
    )

casi = {
    "quote sbilanciate": 'fai qualcosa """\nimport pathlib; pathlib.Path(%r).write_text("A")\n"""' % str(T / "a.txt"),
    "quote bilanciate":  "helper\n" + '"""\n' + "import pathlib as _p; _p.Path(%r).write_text('B')\n" % str(T / "b.txt") + '"""',
    "iniezione via title": ('x"""; import pathlib as _p; _p.Path(%r).write_text("C")  #' % str(T / "c.txt")),
}

for nome, payload in casi.items():
    src = genera(payload)
    print("=== %s ===" % nome)
    try:
        code = compile(src, "tool.py", "exec")
        print("   compila: SI")
        try:
            exec(code, {})
            eseguiti = [n for n in ("a.txt", "b.txt", "c.txt") if (T / n).exists()]
            print("   ESEGUITO. marcatori creati:", eseguiti or "nessuno")
        except Exception as e:
            print("   compila ma non esegue:", type(e).__name__, str(e)[:60])
    except SyntaxError as e:
        print("   compila: NO (contenuto per caso) ->", str(e)[:70])
'''


def main() -> int:
    sha = subprocess.run(["git", "rev-parse", TARGET_REF], cwd=REPO,
                         capture_output=True, text=True, check=True).stdout.strip()
    work = Path(tempfile.mkdtemp(prefix="s27-worktree-"))
    tmp = Path(tempfile.mkdtemp(prefix="s27-scratch-"))
    def _c():
        subprocess.run(["git", "worktree", "remove", "--force", str(work)], cwd=REPO, capture_output=True)
        shutil.rmtree(work, ignore_errors=True); shutil.rmtree(tmp, ignore_errors=True)
    atexit.register(_c)
    subprocess.run(["git", "worktree", "add", "--detach", str(work), sha], cwd=REPO, capture_output=True, check=True)
    (tmp / "driver.py").write_text(DRIVER, encoding="utf-8")
    print(f"ref misurato : {TARGET_REF} @ {sha[:12]}\n")
    p = subprocess.run([sys.executable, "-B", str(tmp / "driver.py"), str(work), str(tmp)],
                       capture_output=True, text=True)
    print(p.stdout, end="")
    if p.stderr.strip():
        print("--- stderr ---\n" + p.stderr, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
