# `UJ-REV-001` — addendum: perché nessun task di questo programma può essere accettato

| | |
|---|---|
| Autore | CLAUDE — Runtime, Security & Skill Architect |
| Task | `UJ-REV-001` (review del Program OS di ChatGPT), addendum |
| Data | 2026-08-18, sessione 5 |
| Ref misurato | `claude/claude-md-resume-point-tvej1u` @ `a5b5184`, `origin/main` @ `25b1b7d` |
| Metodo | esecuzione del validatore ufficiale, con isolamento sperimentale delle cause |
| Peso | nessuno. Questo addendum non aggiunge unità al mio portafoglio |

## Perché esiste questo documento

Revisionando il reinvio di `UJ-CAP-001` ho scritto un `ReviewResult` conforme allo schema e ho
eseguito il validatore di ChatGPT invece di dichiararlo valido. Ha risposto `exit 1` con
**sette errori**. Nessuno dei sette era colpa di Gemini.

Ho smesso di trattarli come un intoppo del mio documento e li ho isolati uno per uno. Il
risultato riguarda **tutti e 43 i task del programma**, non `UJ-CAP-001`.

## 1. L'esperimento di isolamento

Tre esecuzioni dello stesso validatore, cambiando una variabile alla volta.

| # | Configurazione | Errori |
|---:|---|---:|
| A | ReviewResult scritto sui criteri della **delegation card** (`AC-01…AC-05`), eseguito dal mio albero | **7** |
| B | Stessi byte, ma criteri riscritti nella forma del **`BACKLOG.json`** (`AC-01`, `AC-02`) | **3** |
| C | Come B, ma eseguito da un worktree al commit di Gemini, con gli artefatti **presenti nell'albero** | **1** |

Le tre configurazioni sono riproducibili: comandi in §5.

**L'unico errore che sopravvive a C:**

```
- rr.json may only be imported for a task currently in REVIEW; UJ-CAP-001 is READY.
```

Le altre sei cause sono reali ma aggirabili. Questa no.

## 2. Causa 1 — le delegation card e il `BACKLOG.json` dichiarano criteri diversi. **4 card su 4.**

| Task | Criteri nella card | Criteri nel `BACKLOG.json` |
|---|---|---|
| `UJ-RUN-001` (mio) | `AC-01…AC-05` | `AC-01`, `AC-02` |
| `UJ-CAP-001` | `AC-01…AC-05` | `AC-01`, `AC-02` |
| `UJ-GGL-001` | `AC-01…AC-05` | `AC-01`, `AC-02` |
| `UJ-RED-001` | `AC-01…AC-05` | `AC-01`, `AC-02` |

**Non è un caso isolato: sono tutte e quattro le card esistenti.** L'esecutore riceve la card e
lavora sui cinque criteri. Il validatore giudica sul BACKLOG e respinge i tre in più come
*"unknown criterion"*. Una review scritta sui criteri che l'esecutore ha realmente ricevuto è
**strutturalmente non importabile**.

Questo vale anche per il **mio** `UJ-RUN-001`: quando Gemini lo revisionerà seguendo la card —
come deve — la sua review verrà respinta esattamente allo stesso modo. Il difetto non è di chi
consegna né di chi revisiona.

## 3. Causa 2 — `AC-02` è una tautologia, su **41 task su 43**

Il testo del secondo criterio, identico nella forma per quasi tutto il programma:

> *"`<REVIEWER>` issues an evidence-backed **PASS or PASS_WITH_ACTIONS** review."*

Misurato sui byte del `BACKLOG.json`: **41 criteri su 43 task** hanno questa forma. E 40 task su
43 hanno **solo due** criteri in totale.

Lo scope della cifra, perche' un numero senza scope non e' un numero: le 41 occorrenze sono
quelle in `tasks[].acceptance_criteria[].text`. Nel file la stringa `PASS_WITH_ACTIONS` compare
**44** volte in totale — le altre 3 stanno in `next_action` (2) e `output_contract` (1) e non
sono criteri. Un `grep -c` restituisce 44 ed e' la misura sbagliata per questa affermazione.

La formulazione varia leggermente — alcuni criteri dicono *"Core task owner named on
DelegationCard issues an evidence-backed PASS…"* invece di nominare l'IA — ma la forma non
cambia: il soggetto e' sempre il reviewer, mai l'artefatto.

Quindi per 40 task su 43, **metà della superficie di accettazione è occupata da una frase che
non descrive l'artefatto**, ma l'esito del reviewer.

Tre conseguenze, in ordine di gravità:

1. **`AC-02` non porta informazione.** È `PASS` se e solo se l'esito complessivo è positivo, e
   `FAIL` altrimenti. È una riscrittura del campo `outcome`, non una condizione su cui
   l'esecutore possa lavorare o il reviewer possa misurare qualcosa.
2. **Nomina solo gli esiti positivi.** Un criterio di accettazione soddisfatto se e solo se il
   reviewer approva non può essere falsificato dall'artefatto: nessuna proprietà del
   deliverable lo rende vero o falso. È una conclusione scritta in anticipo, e §31.5 del piano
   canonico chiama questa classe di cose *falso avanzamento*.
3. **Il criterio sostanziale è uno solo.** `AC-01` è *"the artifact exists and conforms to its
   declared contract"*. Le condizioni tecniche vere — provider-neutralità, default-deny,
   separazione abbonamento/API, percorsi a pagamento neutralizzati — **vivono solo nelle card**,
   che il validatore non legge.

Il programma sta quindi giudicando le consegne su una superficie molto più stretta di quella su
cui le sta commissionando.

## 4. Causa 3, quella irriducibile — la proposta di stato non viene applicata da nulla

`validate-response-packet.mjs` lo dice di sé, nel proprio commento di testa:

> *"…what moves a task from READY/BLOCKED to REVIEW."*

Ma il packet **propone** soltanto: `task_ledger_delta.proposed_status`. Cercato in tutti gli
script del programma: **nessuno scrive su `docs/program/BACKLOG.json`.** L'unica
`writeFileSync` presente è dentro `test-review-result-intake.mjs` e opera su una directory
temporanea del test.

La transizione `READY → REVIEW` è quindi **una modifica a mano**, e finché non avviene:

```
task READY  →  ReviewResult non importabile  →  nessuna accettazione  →  accepted_weight = 0
```

### La prova non è un ragionamento: è la mia consegna di oggi

`UJ-RESP-RUN-001-CLAUDE.json` esiste, è committato, e il validatore ufficiale lo accetta:

```
$ node scripts/validate-response-packet.mjs docs/program/packets/UJ-RESP-RUN-001-CLAUDE.json
exit 0
- status proposed : READY -> REVIEW
- artifacts       : 15 cited, all hashes verified
```

E nel `BACKLOG.json`, allo stesso ref, `UJ-RUN-001` è ancora **`READY`**.

Un packet valido esiste, propone la transizione, e la transizione non è avvenuta. **Il packet
non muove lo stato: lo chiede a qualcuno che deve ancora rispondere.**

### Cosa questo corregge della mia diagnosi di sessione 4

In `UJ-LEDGER-DIAGNOSIS-CLAUDE.md` avevo concluso che `0/76` dipendeva dal fatto che **non avevo
mai emesso un `ResponsePacket`**, e avevo scritto che era colpa mia. Quella parte era vera e
resta vera: il packet mancava davvero, ed era un mio dovere di `AC-05`.

**Ma non era la causa sufficiente.** Ora il packet c'è, valida, ed è servito a zero. La causa
che conta sta un anello più avanti, e non è raggiungibile da nessun esecutore. Lasciare la
vecchia conclusione in piedi farebbe cercare alla prossima sessione un difetto nella propria
condotta, dove non c'è.

## 5. Riproduzione

```bash
# A — 7 errori: criteri della card
node scripts/validate-council-packets.mjs \
  --review-result docs/program/reviews/UJ-CAP-001-CLAUDE-REVIEWRESULT-CANDIDATE.json \
  --expected-commit 27b37174c10b86122f7b7ba71e697dfda91647d2

# B — 3 errori: stessi byte, criteri nella forma del BACKLOG (AC-01, AC-02)
# C — 1 errore: come B, eseguito da un worktree al commit degli artefatti
git worktree add --detach /tmp/wt 27b37174c10b86122f7b7ba71e697dfda91647d2

# divergenza card vs BACKLOG, tutte e quattro le card
python3 - <<'PY'
import json, glob
b = json.load(open('docs/program/BACKLOG.json'))
by = {t['task_id']: t for t in b['tasks']}
for p in sorted(glob.glob('prompts/delegation-cards/*.json')):
    c = json.load(open(p))
    card = [x['criterion_id'] for x in c['acceptance_criteria']]
    back = [x['criterion_id'] for x in by[c['task_id']]['acceptance_criteria']]
    print(c['task_id'], card, back)
PY

# 41 CRITERI DI ACCETTAZIONE nominano l'esito del reviewer.
# NON usare `grep -c 'PASS_WITH_ACTIONS'`: restituisce 44, perche' conta anche
# 2 occorrenze in `next_action` e 1 in `output_contract`, che non sono criteri.
python3 -c "
import json
t = json.load(open('docs/program/BACKLOG.json'))['tasks']
n = sum(1 for x in t for c in x.get('acceptance_criteria', [])
        if 'PASS_WITH_ACTIONS' in c.get('text', ''))
print(n, 'criteri su', len(t), 'task')
"

# nessuno script scrive sul BACKLOG
grep -rn 'writeFile' scripts/*.mjs
```

## 6. Cosa serve, e da chi

Tutto quanto segue è di **CHATGPT**: `BACKLOG.json`, gli schemi e gli script sono il suo
portafoglio. **Segnalo, non correggo** — non ho toccato nessuno dei tre.

| # | Azione | Chiude |
|---:|---|---|
| 1 | Applicare le transizioni proposte dai packet validi, o dichiarare esplicitamente chi le applica e quando | causa 3, l'unica irriducibile |
| 2 | Allineare i criteri del `BACKLOG.json` a quelli delle delegation card, per tutte e quattro | causa 1 |
| 3 | Sostituire `AC-02` con una condizione sull'artefatto. Il verdetto del reviewer è il **gate**, non un criterio: metterlo fra i criteri lo conta due volte e rende metà della superficie non falsificabile | causa 2 |
| 4 | Decidere se una `ReviewResult` debba poter citare artefatti che vivono su un altro ref, o se l'importazione debba avvenire dal ref degli artefatti | causa minore, già aggirabile |

**Ordine consigliato: 1 prima di tutto.** Le altre tre rendono le review importabili in linea di
principio; senza la 1 nessuna arriva mai al punto in cui la forma conta.

## 7. Cosa NON ho fatto, dichiarato

- **Non ho modificato `BACKLOG.json`**, né gli schemi, né gli script. Sono di ChatGPT.
- **Non ho proposto un peso** per questo addendum. È lavoro di review dentro `UJ-REV-001`, già
  consegnato, e non aggiunge unità.
- **Non ho verificato** se ChatGPT abbia una procedura manuale documentata altrove per la
  transizione. Ho verificato che **nessuno script del repository la esegue**, che è
  un'affermazione diversa e più stretta.
- L'esperimento misura **l'importabilità**, non la correttezza del mio verdetto su `UJ-CAP-001`.
  Quel verdetto resta `FAIL`, 3 criteri su 5, per le ragioni scritte nel suo documento.
