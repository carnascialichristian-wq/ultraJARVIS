"""Riverifica meccanica dei findings S-01..S-20 contro un ref.

    python3 docs/threat-models/probes/findings-status-audit.py [ref]

AVVERTENZA, LETTA PRIMA DI FIDARSI DELL'OUTPUT
----------------------------------------------
QUESTO SCRIPT PRODUCE CANDIDATI, NON VERDETTI. Alla prima esecuzione ha dato tre
risultati sbagliati, tutti nella direzione peggiore — "aperto" dove era chiuso:

  S-11  cercavo allowed_kwargs / _filter, e FIX-4 lo implementa come
        PRIVILEGED_KWARGS & set(kwargs)
  S-14  il pattern pescava `assert "ok" in result.lower()` in nt_runner.py:206,
        che e' una stringa di TEMPLATE — codice generato, non un verdetto di gate
  S-03  vedevo `SAFE_MODE =` a livello di modulo e non che send() non lo usa,
        perche' chiama _safe_mode() live a ogni invocazione

Un audit statico di findings di sicurezza sbaglia con la stessa sicurezza con cui
azzecca: e' la stessa forma che questi findings denunciano, un controllo che
sembra un controllo. OGNI riga marcata APERTO o PARZIALE va riletta nel codice
prima di essere pubblicata o consegnata a qualcuno.

Trappola 37: il ref si MATERIALIZZA in un worktree, non si presume dal cwd.
"""
import ast, inspect, os, pathlib, re, subprocess, sys, tempfile

REF = sys.argv[1] if len(sys.argv) > 1 else "origin/main"
d = tempfile.mkdtemp(prefix="uj-audit-")
WT = str(pathlib.Path(d) / "wt")
subprocess.run(["git", "worktree", "add", "--detach", WT, REF], check=True, capture_output=True)
# La pulizia va registrata SUBITO e via atexit: pipando l'output in `head` il
# SIGPIPE uccide lo script prima dell'ultima riga e lascia un worktree orfano.
# Successo gia' capitato una volta.
import atexit
atexit.register(lambda: subprocess.run(["git", "worktree", "remove", "--force", WT],
                                       capture_output=True))
HEAD = subprocess.run(["git", "-C", WT, "rev-parse", "HEAD"], capture_output=True, text=True).stdout.strip()
R = pathlib.Path(WT)

def read(p):
    f = R / p
    return f.read_text(encoding="utf-8", errors="replace") if f.exists() else None

def grepc(p, pat, flags=0):
    t = read(p)
    return 0 if t is None else len(re.findall(pat, t, flags))

res = []
def rec(fid, title, verdict, evidence):
    res.append((fid, title, verdict, evidence))

# ---- S-01: ToolSpec.safe e' letto da qualcuno? -----------------------------
reg = read("core/registry.py") or ""
reads_safe = bool(re.search(r'\.safe\b(?!\s*=)', reg)) or "spec.safe" in reg
rec("S-01", "ToolSpec.safe non letto",
    "CHIUSO" if reads_safe else "APERTO",
    f"core/registry.py legge .safe: {reads_safe}")

# ---- S-02: registry.call ha ammissione / tetto / evento? -------------------
call_src = ""
m = re.search(r'def call\(.*?(?=\n    def |\nclass |\Z)', reg, re.S)
if m: call_src = m.group(0)
has_gate  = bool(re.search(r'PermissionError|not .*\.safe|admission|_admit', call_src))
has_cap   = bool(re.search(r'budget|ceiling|quota|max_calls|rate', call_src, re.I))
has_event = bool(re.search(r'emit|event|ledger|audit', call_src, re.I))
rec("S-02", "registry.call senza ammissione/tetto/evento",
    "PARZIALE" if has_gate and not (has_cap and has_event) else ("CHIUSO" if has_gate and has_cap and has_event else "APERTO"),
    f"gate={has_gate} tetto={has_cap} evento={has_event}")

# ---- S-03: email.send force / SAFE_MODE ------------------------------------
em = read("tools/email.py") or ""
force_used = len(re.findall(r'\bforce\b', em)) > 1
safemode_global = bool(re.search(r'^SAFE_MODE\s*=', em, re.M))
rec("S-03", "email.send: force e SAFE_MODE finte",
    "CHIUSO" if (force_used and not safemode_global) else ("PARZIALE" if force_used else "APERTO"),
    f"force referenziato={force_used} SAFE_MODE globale riscrivibile={safemode_global}")

# ---- S-06: automazione UI nel catalogo -------------------------------------
n_auto = grepc("core/registry.py", r'automation\.')
rec("S-06", "automazione UI nel catalogo",
    "APERTO (policy)" if n_auto else "CHIUSO",
    f"riferimenti automation.* nel registry: {n_auto}")

# ---- S-07: eventi tool.* ---------------------------------------------------
n_ev = 0
for p in ["core/registry.py", "core/ledger.py", "core/events.py"]:
    n_ev += grepc(p, r'tool\.(called|returned|failed)')
rec("S-07", "nessun evento tool.*",
    "CHIUSO" if n_ev else "APERTO",
    f"occorrenze di tool.called/returned/failed: {n_ev}")

# ---- S-09: browser lstrip("www.") -----------------------------------------
br = read("tools/browser.py") or ""
bad_lstrip = 'lstrip("www.")' in br or "lstrip('www.')" in br
rec("S-09", 'browser: lstrip("www.") non toglie il prefisso',
    "APERTO" if bad_lstrip else "CHIUSO",
    f'lstrip("www.") presente: {bad_lstrip}')

# ---- S-10: files.safe_read contenimento nella root -------------------------
fi = read("tools/files.py") or ""
mread = re.search(r'def safe_read\(.*?(?=\ndef |\Z)', fi, re.S)
read_src = mread.group(0) if mread else ""
contained = bool(re.search(r'relative_to|is_relative_to|_within|_inside', read_src))
rec("S-10", "safe_read legge fuori dalla root",
    "CHIUSO" if contained else "APERTO",
    f"safe_read verifica il contenimento: {contained}")

# ---- S-11: force=True aggira PROTECTED via registry ------------------------
mwrite = re.search(r'def safe_write\(.*?(?=\ndef |\Z)', fi, re.S)
write_src = mwrite.group(0) if mwrite else ""
force_bypass = bool(re.search(r'if\s+not\s+force.*is_protected|is_protected.*not\s+force', write_src, re.S))
# EURISTICA CORRETTA DOPO UN FALSO POSITIVO: cercavo forme come allowed_kwargs
# e non trovavo PRIVILEGED_KWARGS & set(kwargs), che e' come FIX-4 lo implementa.
kw_filtered = bool(re.search(r'PRIVILEGED_KWARGS|blocked\s*=.*set\(kwargs\)|Refusing to forward', call_src))
rec("S-11", "force=True aggira PROTECTED e il registry lo inoltra",
    "APERTO" if (force_bypass and not kw_filtered) else "MITIGATO",
    f"safe_write onora force={force_bypass} registry filtra kwargs={kw_filtered}")

# ---- S-12 / S-20: promozione, gate e safe= ---------------------------------
nt = ""
for p in ["core/nt_helpers.py", "core/nt_runner.py", "core/natural_tasks.py", "core/nt_pipeline.py"]:
    nt += (read(p) or "")
mprom = re.search(r'def promote_job_to_tools\(.*?(?=\ndef |\Z)', nt, re.S)
prom = mprom.group(0) if mprom else ""
has_scan = "scan_text" in prom
safe_literals = re.findall(r'safe\s*=\s*(\w+)', prom)
rec("S-12", "promozione senza gate di safety",
    "CHIUSO" if has_scan else "APERTO",
    f"scan_text nella promozione: {has_scan}")
rec("S-20", "la promozione cabla safe=True",
    "APERTO" if safe_literals == ["True"] else ("CHIUSO" if safe_literals else "N/D"),
    f"occorrenze di safe= nella promozione: {safe_literals}")

# ---- S-13: virgoletta nell'header dei tool promossi ------------------------
hdr = re.search(r'header\s*=\s*(?:f?""".*?"""|f?\'\'\'.*?\'\'\')', prom, re.S)
rec("S-13", "i tool promossi non compilano (virgoletta)",
    "N/D (verifica dinamica)" if not hdr else "DA ESEGUIRE",
    "header trovato" if hdr else "header non isolabile staticamente")

# ---- S-14: verdetto dei gate per sottostringa ------------------------------
# EURISTICA CORRETTA DOPO UN FALSO POSITIVO: il pattern generico pescava una
# stringa di TEMPLATE in nt_runner.py:206 (assert "ok" in result.lower()), che e'
# codice generato, non un verdetto di gate. Guardo solo dove il verdetto si forma.
allsrc = (read("core/gates.py") or "") + (read("core/natural_tasks.py") or "")
substr_verdict = bool(re.search(r'status\s*=\s*"PASS"\s+if\s+(?!.*code\s*==\s*0)', allsrc))
rec("S-14", "una build fallita riporta PASS",
    "APERTO" if substr_verdict else "CHIUSO",
    f"verdetto derivato da sottostringa: {substr_verdict}")

# ---- S-15: run_gates(use_real=False) stampa PASS ---------------------------
g = read("core/gates.py") or ""
fake_pass = bool(re.search(r'use_real\s*=\s*False|if\s+not\s+use_real', g))
rec("S-15", "run_gates(use_real=False) stampa PASS",
    "DA LEGGERE" if fake_pass else "CHIUSO",
    f"ramo use_real=False presente: {fake_pass}")

# ---- S-16: provenienza nei record di memoria -------------------------------
mem = read("core/memory.py") or ""
prov = bool(re.search(r'origin|provenance|source_label|originLabel|trust', mem))
rec("S-16", "memoria senza campo di provenienza",
    "CHIUSO" if prov else "APERTO",
    f"campo di provenienza nei record: {prov}")

# ---- S-18: tools.files cattura la root nei default -------------------------
kwdefault_root = bool(re.search(r'def safe_\w+\([^)]*\*[^)]*root:\s*Path\s*=\s*PROJECT_ROOT', fi, re.S)) \
                 or bool(re.search(r'root:\s*Path\s*=\s*PROJECT_ROOT', fi))
rec("S-18", "la test suite sovrascrive grok.md (root nei default)",
    "APERTO" if kwdefault_root else "CHIUSO",
    f"root catturata nei default di safe_*: {kwdefault_root}")

print(f"AUDIT dei findings — ref {REF} @ {HEAD[:12]}\n")
print(f"{'ID':<6} | {'stato':<22} | {'titolo':<48} | evidenza")
print("-"*6 + "-+-" + "-"*22 + "-+-" + "-"*48 + "-+-" + "-"*40)
for fid, title, verdict, ev in res:
    print(f"{fid:<6} | {verdict:<22} | {title[:48]:<48} | {ev}")

