#!/usr/bin/env python3
"""S-25 — `core/billing.handle_webhook` non verifica la firma: la ispeziona.

Misura, in un worktree materializzato al ref e SENZA nessuna chiamata di rete
(`handle_webhook` scrive solo su file e non contatta Stripe):

  A) con un segreto configurato, un webhook SENZA header di firma e' accettato;
  B) un header di firma inventato e' accettato purche' contenga "t=" oppure "v1=";
  C) l'unico caso rifiutato e' un header che non somiglia a una firma;
  D) il segreto non entra in nessun calcolo: zero occorrenze di hmac/compare_digest.

ATTENZIONE, lezioni gia' pagate — non toglierle:
  * TRAPPOLA 37 / E38: la sonda MATERIALIZZA il ref che dichiara di misurare;
  * E22: un esito inatteso stampa `NON MISURATO (<errore>)`, mai un silenzio che si
    legge come sicurezza;
  * E39: si usa `git -C <worktree>`, MAI `git --work-tree=<worktree>`, che scrive
    nell'indice del repository principale;
  * worktree e temp rimossi con atexit, anche su SIGPIPE.

NESSUNA chiamata a Stripe: `handle_webhook` non ne fa. Le funzioni che ne farebbero
(`create_customer`, `create_checkout_session`) NON vengono invocate da questa sonda.

Uso:  python3 docs/threat-models/probes/S-25-billing-webhook-probe.py
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
import json, os, sys
from pathlib import Path
WORK = Path(sys.argv[1]); TMP = Path(sys.argv[2])
sys.path.insert(0, str(WORK))
os.chdir(TMP)
os.environ["STRIPE_WEBHOOK_SECRET"] = "whsec_un_segreto_che_nessuno_usa"
import core.billing as b

falso = {
    "type": "checkout.session.completed",
    "data": {"object": {"metadata": {"tier": "team"}}},   # il tier piu' alto
}

casi = [
    ("nessun header di firma",            ""),
    ("header inventato con t=",           "t=1"),
    ("header inventato con v1=",          "v1=deadbeef"),
    ("firma plausibile ma falsa",         "t=1755600000,v1=" + "0" * 64),
    ("header che NON somiglia a firma",   "ciao"),
]

print("segreto configurato:", os.environ["STRIPE_WEBHOOK_SECRET"])
print()
for nome, header in casi:
    try:
        r = b.handle_webhook(falso, sig_header=header)
        esito = "ACCETTATO" if r.get("ok") else "rifiutato"
        tier = (r.get("suggested_env") or {}).get("UJ_TIER")
        print("  %-32s -> %-10s  tier suggerito: %s" % (nome, esito, tier))
    except Exception as e:
        print("  %-32s -> NON MISURATO (%s: %s)" % (nome, type(e).__name__, e))

print()
src = (WORK / "core" / "billing.py").read_text(encoding="utf-8")
print("  occorrenze di 'hmac'           :", src.count("hmac"))
print("  occorrenze di 'compare_digest' :", src.count("compare_digest"))
print("  righe in cui compare 'secret'  :",
      [i + 1 for i, l in enumerate(src.splitlines()) if "secret" in l and "STRIPE" not in l.upper() or "secret =" in l])
print()
print("  path del registro eventi       :", b.DEFAULT_EVENTS, "(relativo: segue la cwd)")
print("  scritto davvero in             :", (Path.cwd() / b.DEFAULT_EVENTS).resolve())
'''


def main() -> int:
    sha = subprocess.run(["git", "rev-parse", TARGET_REF], cwd=REPO,
                         capture_output=True, text=True, check=True).stdout.strip()
    work = Path(tempfile.mkdtemp(prefix="s25-worktree-"))
    tmp = Path(tempfile.mkdtemp(prefix="s25-scratch-"))

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
    print("nessuna chiamata di rete: handle_webhook non contatta Stripe\n")

    p = subprocess.run([sys.executable, "-B", str(driver), str(work), str(tmp)],
                       capture_output=True, text=True)
    if p.returncode != 0:
        ultima = p.stderr.strip().splitlines()[-1] if p.stderr.strip() else f"exit {p.returncode}"
        print(f"NON MISURATO ({ultima})")
        return 1
    print(p.stdout, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
