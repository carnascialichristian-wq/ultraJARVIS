"""Copertura delle regole dei contratti CLAUDE: dichiarate / implementate / testate.

AVVERTENZA, gia' pagata oggi: uno script come questo produce CANDIDATI, non verdetti.
Ogni riga con un disallineamento va RILETTA nel codice prima di essere pubblicata:
in questa sessione tre euristiche simili hanno dato tre falsi positivi.
"""
import re, pathlib, collections

# NOTA, dopo un falso positivo: TH-SF-* e TH-* sono MODELLI DI MINACCIA, non
# insiemi di regole. Le loro mitigazioni hanno ID propri (SF-*, SF-PIPE-*), e la
# tracciabilita' vive nella colonna "Controlli" della tabella, non nei test.
# Contarli qui come "regole senza test" produce un allarme falso: e' successo.
DOCS = {
    "OV-":      ("docs/constitution/APPROVAL_POLICY.md", "packages/contracts/src/policy/approval.ts", "tests/contracts/approval-policy.test.mjs"),
    "ADM-":     ("docs/architecture/TOOL_PLANE.md", "packages/contracts/src/tools/tool-manifest.ts", "tests/contracts/tool-admission.test.mjs"),
    "SF-PIPE-": ("docs/architecture/SKILL_FORGE.md", "packages/contracts/src/skills/skill-forge.ts", "tests/contracts/skill-forge.test.mjs"),
    "SF-":      ("docs/architecture/SKILL_FORGE.md", "packages/contracts/src/skills/skill-forge.ts", "tests/contracts/skill-forge.test.mjs"),
}

def ids(path, pat):
    if not path: return set()
    p = pathlib.Path(path)
    if not p.exists(): return set()
    return set(re.findall(pat, p.read_text(encoding="utf-8", errors="replace")))

print(f"{'famiglia':<10} | {'doc':>4} | {'codice':>6} | {'test':>4} | scoperte")
print("-"*10 + "-+-" + "-"*4 + "-+-" + "-"*6 + "-+-" + "-"*4 + "-+-" + "-"*40)
for fam,(doc,code,test) in DOCS.items():
    pat = rf'\b{re.escape(fam)}\d+'
    d = ids(doc, pat)
    c = ids(code, pat) if code else set()
    t = ids(test, pat) if test else set()
    # scoperte = dichiarate nel documento (o nel codice) ma assenti dai test
    base = c if c else d
    miss = sorted(base - t) if test else ["(nessun file di test associato)"]
    print(f"{fam:<10} | {len(d):>4} | {len(c) if code else '-':>6} | {len(t) if test else '-':>4} | {', '.join(miss) if miss else 'nessuna'}")

# invarianti del runtime: i test hanno nomi, non ID. Conto i test e le sezioni PROVA.
bp = pathlib.Path("docs/architecture/RUNTIME_BLUEPRINT.md").read_text(encoding="utf-8")
prove = len(re.findall(r'^\|.*PROVA DA IMPLEMENTARE', bp, re.M))
pending = len(re.findall(r'^\|.*PENDING', bp, re.M))
rt = pathlib.Path("tests/contracts/runtime-invariants.test.mjs").read_text(encoding="utf-8")
ntest = len(re.findall(r'^test\(', rt, re.M))
print()
print(f"runtime   : {ntest} test eseguibili · {prove} prove DICHIARATE NON IMPLEMENTATE · {pending} PENDING in §13.3")
