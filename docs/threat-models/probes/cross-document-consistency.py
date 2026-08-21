"""Cerca valori DIVERGENTI dello stesso fatto fra i documenti di CLAUDE.

    python3 docs/threat-models/probes/cross-document-consistency.py [ref-base]

PERCHE' ESISTE
--------------
La riconciliazione di UJ-RUN-001 e' costata SEI giri di consegna, e la causa era
sempre la stessa: lo stesso fatto scritto in piu' documenti, aggiornato in uno
solo. Un artefatto che dichiara "REVIEW" accanto a uno che dichiara "BLOCKED"
non e' ammissibile a prescindere dalla qualita' del contenuto.

AVVERTENZA — PRODUCE CANDIDATI, NON VERDETTI
--------------------------------------------
La maggior parte dei disallineamenti che segnala sono LEGITTIMI:
  - le voci del Session Log sono STORIA e devono restare come sono. "138 test"
    in una voce di sessione 3 e' corretto anche se oggi sono 140;
  - "311 unita'" e' la baseline §38 del piano canonico, un dato FISSO: non e' il
    totale corrente del backlog (340).
Ogni riga va letta nel suo contesto prima di correggere qualcosa. In questa
sessione, su sette fatti controllati, uno solo era davvero scaduto.
"""
import collections, pathlib, re, subprocess, sys

BASE = sys.argv[1] if len(sys.argv) > 1 else "origin/main"
files = subprocess.run(["git", "diff", "--name-only", f"{BASE}..HEAD"],
                       capture_output=True, text=True).stdout.split()
docs = [f for f in files
        if f.endswith(".md") and pathlib.Path(f).exists()
        and pathlib.Path(f).name not in ("gpt.md", "taskgpt.md", "grok.md", "taskgrok.md")]

CHECKS = {
    "conteggio suite":    r'\b(1[0-9]{2})\s*/\s*\1\s*pass',
    "peso accettato mio": r'0\s*/\s*76\b',
    "totale programma":   r'\b(3[0-9]{2})\s+unit',
    "card esistenti":     r'(\d+)\s+card\s+esist',
}

def council_task_set_check():
    """L'insieme dei task serviti dal Council e' scritto in CINQUE posti.

    Due nel validatore di ChatGPT (cardPaths, expectedTargets), due campi nella
    mission (assigned_task_ids, delegation_card_ids), piu' il file di ogni card.
    Aggiungerne uno richiede di modificarli tutti, e una modifica parziale
    produce errori che sembrano difetti della card e non della sincronia.
    Misurato il 2026-08-19: i quattro insiemi coincidevano.
    """
    import json
    try:
        val = pathlib.Path("scripts/validate-council-packets.mjs").read_text(encoding="utf-8")
        mis = json.loads(pathlib.Path(
            "prompts/council/missions/UJ-MISSION-M0-COUNCIL-001.json").read_text(encoding="utf-8"))
    except FileNotFoundError:
        print("  --          insieme task del Council: file non presenti in questo albero")
        return
    sets = {
        "cardPaths (validatore)":       set(re.findall(r"prompts/delegation-cards/(UJ-[A-Z]+-\d+)-", val)),
        "expectedTargets (validatore)": set(re.findall(r'\["(UJ-[A-Z]+-\d+)",\s*"[A-Z]+"\]', val)),
        "assigned_task_ids (mission)":  set(mis.get("assigned_task_ids", [])),
        "delegation_card_ids (mission)": {re.sub(r"UJ-CARD-(.+)-[A-Z]+$", r"UJ-\1", x)
                                          for x in mis.get("delegation_card_ids", [])},
    }
    ref = next(iter(sets.values()))
    if all(s == ref for s in sets.values()):
        print(f"  ok          insieme task del Council: {len(ref)} task, coerente in 4 sedi")
    else:
        print("  DA LEGGERE  insieme task del Council: le quattro sedi NON coincidono")
        for name, s in sets.items():
            print(f"      {name:<32} {sorted(s)}")


print(f"documenti confrontati: {len(docs)}  (base {BASE})\n")
for name, pat in CHECKS.items():
    hits = collections.defaultdict(set)
    for d in docs:
        for m in re.finditer(pat, pathlib.Path(d).read_text(encoding="utf-8", errors="replace")):
            v = m.group(1) if m.groups() else m.group(0)
            # Normalizza gli spazi: "0 / 76" e "0/76" sono lo stesso fatto, e una
            # sonda che segnala la spaziatura come divergenza viene ignorata.
            hits[re.sub(r"\s+", "", v)].add(pathlib.Path(d).name)
    if len(hits) > 1:
        print(f"  DA LEGGERE  {name}: {len(hits)} valori diversi")
        for v, ds in sorted(hits.items()):
            print(f"      {v:<8} in {len(ds)} doc: {sorted(ds)[:3]}")
    elif hits:
        v = next(iter(hits))
        print(f"  ok          {name}: '{v}' coerente in {len(hits[v])} documenti")
    else:
        print(f"  --          {name}: nessuna occorrenza")

council_task_set_check()
