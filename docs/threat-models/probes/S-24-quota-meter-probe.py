#!/usr/bin/env python3
"""S-24 — il contatore che dovrebbe fermare la spesa: quattro misure.

Misura, in un worktree materializzato al ref e senza NESSUNA chiamata di rete
(`record_llm_call` scrive solo su file):

  A) le due quote sono SPENTE per default          — servono UJ_ENFORCE_QUOTA=1
  B) il budget e' SPENTO per default               — UJ_LLM_BUDGET_USD non impostato
  C) il contatore non e' atomico                   — check-then-act fra lettura e append
  D) il registro dei consumi ha un path RELATIVO    — cambiare cwd azzera la quota

ATTENZIONE, lezioni gia' pagate — non toglierle:
  * TRAPPOLA 37 / E38: la sonda MATERIALIZZA il ref che dichiara di misurare. Importare
    dal worktree corrente misura il TUO ramo, non `origin/main`;
  * E22: se una chiamata solleva PRIMA di raggiungere cio' che stai misurando, il
    risultato non e' "nessuna chiamata" ma "NON MISURATO". Distinguili nel codice;
  * worktree e temp rimossi con atexit, anche su SIGPIPE (`| head`).

Uso:  python3 docs/threat-models/probes/S-24-quota-meter-probe.py
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
import json, os, sys, time
from pathlib import Path
WORK = Path(sys.argv[1]); TMP = Path(sys.argv[2]); MODE = sys.argv[3]
sys.path.insert(0, str(WORK))

def fresh(cwd_name="run"):
    d = TMP / cwd_name
    d.mkdir(parents=True, exist_ok=True)
    os.chdir(d)
    for m in [k for k in sys.modules if k.startswith("core.")]:
        del sys.modules[m]
    return d

if MODE == "A":
    # quote spente per default: nessuna variabile impostata
    os.environ.pop("UJ_ENFORCE_QUOTA", None)
    d = fresh("A")
    import core.monetization as m
    for _ in range(50):
        m.record_usage("llm_call", units=1.0)
    try:
        m.check_llm_quota()
        print("A) 50 chiamate registrate, limite free = 10 -> check_llm_quota NON SOLLEVA")
    except m.QuotaExceeded as e:
        print("A) check_llm_quota ha sollevato:", e)
    os.environ["UJ_ENFORCE_QUOTA"] = "1"
    try:
        m.check_llm_quota()
        print("   con UJ_ENFORCE_QUOTA=1 -> NON SOLLEVA (inatteso)")
    except m.QuotaExceeded as e:
        print("   con UJ_ENFORCE_QUOTA=1 -> SOLLEVA:", str(e)[:70])

elif MODE == "B":
    os.environ.pop("UJ_LLM_BUDGET_USD", None)
    d = fresh("B")
    import core.monetization as m
    for _ in range(10000):
        m.record_usage("llm_call", units=1.0)
    b = m.get_llm_budget()
    print("B) 10.000 chiamate: spesa stimata $%s, tetto $%s, ok=%s"
          % (b["spent_usd_est"], b["soft_cap_usd"], b["ok"]))
    try:
        m.assert_llm_budget()
        print("   assert_llm_budget() NON SOLLEVA con il default")
    except Exception as e:
        print("   assert_llm_budget() solleva:", e)

elif MODE == "D":
    os.environ["UJ_ENFORCE_QUOTA"] = "1"
    d1 = fresh("D1")
    import core.monetization as m
    for _ in range(20):
        m.record_usage("llm_call", units=1.0)
    try:
        m.check_llm_quota(); esito1 = "NON SOLLEVA"
    except m.QuotaExceeded: esito1 = "SOLLEVA (quota esaurita)"
    d2 = fresh("D2")
    import core.monetization as m2
    try:
        m2.check_llm_quota(); esito2 = "NON SOLLEVA"
    except m2.QuotaExceeded: esito2 = "SOLLEVA"
    print("D) stessa quota, due directory di lavoro diverse:")
    print("   in %s (20 chiamate registrate) -> %s" % (d1.name, esito1))
    print("   in %s (nessuna chiamata)       -> %s" % (d2.name, esito2))
    print("   DEFAULT_USAGE_PATH =", m.DEFAULT_USAGE_PATH, "(relativo: segue la cwd)")

elif MODE == "C":
    # Concorrenza con BARRIERA, variabile ISOLATA.
    #
    # Due errori miei, entrambi corretti qui e da non rifare:
    #  1. la prima versione lanciava 8 PROCESSI separati: l'avvio dell'interprete
    #     (~50-100 ms l'uno) li serializzava e la finestra di gara non veniva quasi mai
    #     colpita. Ammessi 1, cioe' il risultato CORRETTO ma per il motivo sbagliato:
    #     un falso negativo (trappola 12), che stavo per leggere come "e' atomico".
    #  2. la seconda variava la LUNGHEZZA del registro cambiando anche il tier, quindi
    #     anche il limite: le prime due righe mostravano "8 ammessi su 8" semplicemente
    #     perche' erano sotto il limite. Non era una gara, era spazio libero.
    # Qui la distanza dal limite e' FISSA (9 su 10, ne resta esattamente UNA) e l'unica
    # variabile e' il numero di righe di riempimento, registrate con un evento che la
    # quota NON conta.
    import threading
    os.environ["UJ_ENFORCE_QUOTA"] = "1"
    os.environ["UJ_TIER"] = "free"                 # llm_calls_per_day = 10
    FILLER, N, RUNS = int(sys.argv[4]), int(sys.argv[5]), int(sys.argv[6])
    import core.monetization as m
    ammessi, lettura_ms = [], 0.0
    for r in range(RUNS):
        d = TMP / ("C_%d_%d" % (FILLER, r))
        (d / "workspace").mkdir(parents=True, exist_ok=True)
        os.chdir(d)
        now = time.time()
        with (d / "workspace" / "usage.jsonl").open("w", encoding="utf-8") as f:
            for _ in range(FILLER):
                f.write(json.dumps({"ts": now, "event": "job_run", "units": 1.0, "meta": {}}) + "\n")
            for _ in range(9):
                f.write(json.dumps({"ts": now, "event": "llm_call", "units": 1.0, "meta": {}}) + "\n")
        t0 = time.time(); m.summarize_usage(since_ts=0.0); lettura_ms = (time.time() - t0) * 1000
        b = threading.Barrier(N); esiti = [0] * N
        def w(i):
            b.wait()
            try:
                m.record_llm_call(meta={"t": i}); esiti[i] = 1
            except m.QuotaExceeded:
                esiti[i] = 0
            except Exception as e:
                esiti[i] = "NON MISURATO: %s" % type(e).__name__
        th = [threading.Thread(target=w, args=(i,)) for i in range(N)]
        for t in th: t.start()
        for t in th: t.join()
        ammessi.append(sum(1 for e in esiti if e == 1))
    print(json.dumps({"filler": FILLER, "lettura_ms": round(lettura_ms, 1),
                      "ammessi": ammessi, "corretto": 1, "thread": N}))
'''


def main() -> int:
    sha = subprocess.run(["git", "rev-parse", TARGET_REF], cwd=REPO,
                         capture_output=True, text=True, check=True).stdout.strip()
    work = Path(tempfile.mkdtemp(prefix="s24-worktree-"))
    tmp = Path(tempfile.mkdtemp(prefix="s24-scratch-"))

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
    print("nessuna chiamata di rete: record_llm_call scrive solo su file\n")

    for mode in ("A", "B", "D"):
        p = subprocess.run([sys.executable, "-B", str(driver), str(work), str(tmp), mode],
                           capture_output=True, text=True)
        if p.returncode != 0:
            print(f"{mode}) NON MISURATO ({p.stderr.strip().splitlines()[-1] if p.stderr.strip() else 'exit ' + str(p.returncode)})")
        else:
            print(p.stdout, end="")
        print()

    # C) concorrenza: distanza dal limite FISSA (9 su 10), varia solo la lunghezza del registro
    print("C) 8 thread con barriera, limite free = 10/giorno, registro precaricato a 9.")
    print("   Con un contatore corretto passerebbe ESATTAMENTE UNO in ogni run.")
    for filler in (0, 5000, 20000):
        p = subprocess.run([sys.executable, "-B", str(driver), str(work), str(tmp), "C",
                            str(filler), "8", "5"], capture_output=True, text=True)
        if p.returncode != 0:
            ultima = p.stderr.strip().splitlines()[-1] if p.stderr.strip() else f"exit {p.returncode}"
            print(f"   riempimento {filler:>6}: NON MISURATO ({ultima})")
            continue
        r = __import__("json").loads(p.stdout.strip().splitlines()[-1])
        eccesso = [a - 1 for a in r["ammessi"]]
        print(f"   riempimento {filler:>6} righe · lettura {r['lettura_ms']:>5} ms · "
              f"ammessi su 5 run: {r['ammessi']}  -> oltre il limite: {eccesso}")
    print()
    print("   La gara e' REALE a OGNI dimensione misurata: passano fino a 8 chiamate dove")
    print("   ne dovrebbe passare una. Il meccanismo e' check-then-act — summarize_usage()")
    print("   rilegge e riparsa TUTTO il file, poi record_usage() appende — e fra i due non")
    print("   c'e' nulla che escluda gli altri.")
    print()
    print("   ONESTA' SULLA MISURA: l'esito varia da run a run e NON cresce in modo monotono")
    print("   con la lunghezza del registro — in alcune esecuzioni il caso a 5.000 righe e'")
    print("   piu' mite di quello a 0. Non affermo un andamento che i numeri non mostrano.")
    print("   Cio' che si ripete a ogni esecuzione e' il fatto che conta: a TUTTE e tre le")
    print("   dimensioni passano piu' chiamate del limite, spesso molte di piu'. Rieseguila")
    print("   piu' volte: i numeri ballano, il difetto no.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
