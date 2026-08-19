# Percorso critico del programma — misurato, non stimato

| Campo | Valore |
|---|---|
| Autore | CLAUDE |
| Ref | `origin/main` @ `27b767309090adf77778575fe22840a1584355aa` |
| Data | 2026-08-19 |
| Effetto sul ledger | **nessuno.** Nessun peso proposto, nessuno status modificato |
| Perché esiste | ogni giro di questo programma costa a Christian un copia-incolla manuale. Se l'ordine è sbagliato, il costo è suo |

---

## 0. Il risultato in tre righe, e la prima corregge me

1. **`UJ-SEC-001` non è il task con più leva del programma.** L'ho scritto oggi a GROK
   (`TASKCLAUDE.md` §68) come *"la cosa con più leva che puoi fare oggi"*. Misurato: sblocca
   **21** unità, ed è **l'ultimo dei sei** che possono muoversi. È la chiave di volta **del mio
   portafoglio**, il che è vero e diverso.
2. **Il task con più leva è `UJ-CAP-001`: sblocca 55 unità.** Ne sono il reviewer, e oggi gli ho
   dato `FAIL`.
3. **Il miglior singolo giro è `UJ-RUN-001`: 34 unità per una sola review.**

---

## 1. Stato del programma, ricalcolato dal `BACKLOG.json`

| Stato | Task | Unità |
|---|---:|---:|
| `BLOCKED` | 18 | 160 |
| `READY` | 6 | 73 |
| `DEFERRED` | 5 | 44 |
| `REVIEW` | 3 | 29 |
| `PROPOSED` | 9 | 0 |
| `DONE` | 1 | 21 |
| `TRIAGED` | 1 | 13 |
| **totale** | **43** | **340** |

**Peso accettato: 26 su 340, il 7,6%.** E tutte e 26 le unità sono **task meta di ChatGPT**:
`UJ-META-001` (21/21, `DONE`) e `UJ-META-002` (5/8, quel peso parziale che il gate del programma
non sa produrre — `F-001` della mia review del Program OS).

**Zero unità di lavoro specialistico sono state accettate.** Non è una lamentela: è la misura
che spiega perché il percorso critico conta.

> Nota: il peso totale è **340**, non 311 come registrato nella mia memoria di sessione 1. La
> baseline è cresciuta di 29 unità. Rimisurato, non ricopiato.

---

## 2. Chi può muoversi adesso, e quanto sblocca ciascuno

Sei task sono `READY` e tre in `REVIEW`. «Sblocca» = somma dei pesi dei **dipendenti diretti
oggi `BLOCKED`**, che diventerebbero `READY` all'accettazione.

| Task | Peso | Owner | Reviewer | **Sblocca subito** | Dipendenti |
|---|---:|---|---|---:|---|
| **`UJ-CAP-001`** | 13 | GEMINI | **CLAUDE** | **55** | `INT-002`, `INT-005`, `INF-001`, `ADK-001`, `ALT-001` |
| **`UJ-RUN-001`** | 13 | CLAUDE | **GEMINI** | **34** | `INT-002`, `RCV-001`, `REV-003`, `ALT-001` |
| `UJ-GGL-001` | 13 | GEMINI | GROK | 29 | `INT-002`, `KNW-001`, `MED-001` |
| `UJ-RED-001` | 13 | GROK | CHATGPT | 29 | `INT-002`, `RSK-001`, `ALT-001` |
| `UJ-INT-001` | 13 | CHATGPT | GROK | 23 | `INT-003`, `REV-001`, `REV-003`, `REV-004` |
| `UJ-SEC-001` | 13 | CLAUDE | GROK | 21 | `SKL-001`, `MCP-001` |
| `UJ-CLD-001` | 8 | CLAUDE | GEMINI | 0 | — |
| `UJ-INT-006` | 8 | CHATGPT | CLAUDE | 0 | — |
| `UJ-META-002` | 8 | Christian | Christian | 0 | — |

Riproduzione: attraversare `dependencies` nel `BACKLOG.json` e sommare i pesi dei dipendenti
`BLOCKED`. Comando in §6.

---

## 3. Leva **per giro**, che è la metrica che conta davvero

Il numero grezzo inganna, perché non tutti i task sono a un giro di distanza. `UJ-CAP-001`
sblocca di più ma oggi è `FAIL` nella mia review: servono una correzione di Gemini **e** una mia
re-review, cioè **due** giri di HUMAN_BRIDGE.

| Task | Sblocca | Giri necessari | **Per giro** | Che cosa serve |
|---|---:|---:|---:|---|
| **`UJ-RUN-001`** | 34 | **1** | **34** | GEMINI revisiona. PR #18 aperta, pacchetto pronto |
| `UJ-CAP-001` | 55 | 2 | 27,5 | GEMINI corregge 3 cose piccole → io re-revisiono |
| `UJ-GGL-001` | 29 | 1 | 29 | GROK revisiona |
| `UJ-RED-001` | 29 | 1 | 29 | CHATGPT revisiona |
| `UJ-INT-001` | 23 | 1 | 23 | GROK revisiona |
| `UJ-SEC-001` | 21 | 1 | 21 | GROK revisiona. Pacchetto consegnato oggi |

**Il miglior singolo atto è far revisionare `UJ-RUN-001` a Gemini.** È già ammissibile, ha una
PR aperta e un pacchetto con evidenza per criterio: costa a Gemini una lettura e a Christian un
solo inoltro.

---

## 4. L'ordine che raccomando, e il carico su ciascuno

Il vincolo vero non è la capacità delle IA: è **quanti inoltri manuali** Christian può fare. Le
prime due righe distribuiscono il lavoro su tre reviewer diversi, quindi possono partire insieme.

| # | Atto | Reviewer | Sblocca | Note |
|---:|---|---|---:|---|
| 1 | review di `UJ-RUN-001` | **GEMINI** | 34 | migliore rapporto leva/giro |
| 2 | review di `UJ-RED-001` | **CHATGPT** | 29 | in parallelo, reviewer diverso |
| 3 | review di `UJ-SEC-001` | **GROK** | 21 | in parallelo, reviewer diverso |
| 4 | 3 correzioni a `UJ-CAP-001` | GEMINI, poi CLAUDE | 55 | il più redditizio, ma a due giri |
| 5 | review di `UJ-GGL-001` | GROK | 29 | dopo la 3, stesso reviewer |
| 6 | review di `UJ-INT-001` | GROK | 23 | dopo la 5, stesso reviewer |

**I primi tre atti sono simultanei e nessuno dei tre reviewer si sovrappone.** Insieme sbloccano
**84 unità** con **tre inoltri**.

---

## 5. Il vincolo che rende tutto quanto sopra condizionale

**Nulla, in questo repository, applica una transizione di stato proposta.** Misurato tre volte,
su due task di due portafogli diversi:

```
UJ-RUN-001  status=READY  packet valido che propone REVIEW, gate PASS, 15/15 hash
UJ-CAP-001  status=READY  packet di GEMINI che propone REVIEW
```

E un `ReviewResult` è importabile **solo per un task in `REVIEW`**
(`validate-council-packets.mjs:347`). Quindi: **anche se tutte e sei le review venissero
consegnate domani, il ledger non registrerebbe nulla.**

A cui si aggiunge il secondo tetto: **il meccanismo delle delegation card è cablato a quattro
task** (`expectedTargets`, righe 443-447), e un task `BLOCKED` non può riceverne una per schema.

**Entrambi sono di CHATGPT e sono documentati con la correzione proposta:**
`docs/program/reviews/UJ-REV-001-ADDENDUM-LEDGER-IMPORT-PATH.md` e
`docs/program/reviews/UJ-REV-001-ADDENDUM-CARD-ISSUANCE-CEILING.md`.

**Ordine corretto:** l'anello delle transizioni **prima** delle sei review, altrimenti si
producono sei verdetti che nessun contatore può registrare. Se invece si vuole procedere in
parallelo, le review restano comunque utili — il giudizio esiste anche se il ledger non lo vede
— ma il numero di completamento resterà **26 su 340** qualunque cosa accada.

---

## 6. Riproduzione

```bash
git show origin/main:docs/program/BACKLOG.json > /tmp/b.json
python3 - /tmp/b.json <<'PY'
import json,sys,collections
b=json.load(open(sys.argv[1])); ts={t['task_id']:t for t in b['tasks']}
print("task",len(ts),"peso",sum(t['weight'] for t in ts.values()),
      "accettato",sum(t.get('completed_weight',0) for t in ts.values()))
for tid,t in ts.items():
    if t['status'] not in ('READY','REVIEW'): continue
    imm=[x for x in ts.values() if tid in (x.get('dependencies') or []) and x['status']=='BLOCKED']
    print(f"{tid:<12} peso {t['weight']:>2} rev {t['reviewer']:<9} sblocca {sum(x['weight'] for x in imm):>2}")
PY
```

---

## 7. Che cosa questo documento non fa

- **Non muove nulla nel ledger** e non propone pesi.
- **Non decide l'ordine**: la decisione è di Christian, che è quello che paga gli inoltri.
- **Non tiene conto della difficoltà di ciascuna review**, che non so misurare: tratta tutte le
  review come un giro, il che favorisce i task grandi. È un'approssimazione, e la dichiaro.
- **Non include i 9 task `PROPOSED`** (peso 0) né i 5 `DEFERRED` a M8-M10: non sono lavorabili
  adesso per decisione di baseline, non per un impedimento.
