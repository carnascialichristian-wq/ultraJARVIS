# UJ-RUN-001 — evidenza per criterio · consegna **BLOCKED**

| | |
|---|---|
| Task | `UJ-RUN-001` — owner CLAUDE, reviewer GEMINI, peso 13 |
| Card | `UJ-CARD-RUN-001-CLAUDE` |
| Branch | `agent/uj-run-001-blueprint-20260818` — **verificato con `git branch -a --contains`**, non presunto |
| **`source_commit_sha` unico** | `c645377d54c20fad517d376a1b1e10ac54d289a7` |
| Supersede | `a7e03e979baee5a8b796007313ad93408299f840` — il cui handoff chiedeva una correzione del `read_ref` che `main` non avrebbe potuto risolvere (§0-ter). A sua volta superava `79408449bd096613d2823efe6872ed424b757ee6`, i cui byte dell'handoff erano ancora il documento della sessione 1 (§0-bis), e prima ancora `2dad45a40798a8059b5e2b7db077b76e77fcc88b` |
| Stato proposto | **`BLOCKED`** |
| Peso accettato | **0 / 13, invariato** |
| Generato | 2026-08-18T22:18:42Z |

## 0. Perche' BLOCKED, e perche' resta BLOCKED

La card `UJ-RUN-001-CLAUDE.json` **non esiste** al commit che il suo stesso
`repository_scope.read_ref` nomina.

```
$ git cat-file -e 3611b1b400cf57b5021bab228a3de9470d6eca5c:prompts/delegation-cards/UJ-RUN-001-CLAUDE.json
fatal: path 'prompts/delegation-cards/UJ-RUN-001-CLAUDE.json' exists on disk, but not in '3611b1b4...'
```

Entra con `d48e1e8519a8d7af90ea44e770f0db7fd3938fb3`, **dodici minuti dopo**.

**Gli artefatti tecnici sono validi, e questo non cambia l'esito.** Il blocco riguarda
l'ammissibilita' della consegna, non la sua qualita': `BLOCKED` non diventa `REVIEW` perche' i
test passano. Si scioglie correggendo il `read_ref`, e allora **questi stessi byte** diventano
una consegna `REVIEW` senza altre modifiche.

**Non e' un pin mismatch.** I quattro hash pinati coincidono tutti a `3611b1b4`:

| Input pinato | atteso | osservato a `3611b1b4` |
|---|---|---|
| `docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md` | `a3fcdfc9…a69a87` | **coincide** |
| `docs/program/SPECIALIST_INPUTS.md` | `72edc395…93590a` | **coincide** |
| `docs/program/COUNCIL_PACKETS.md` | `eb4d0d0d…d29ff88` | **coincide** |
| `schemas/response-packet.schema.json` | `ee44e1b7…7e69c0a` | **coincide** |

## 0-bis. Il giro di questa sessione — quattro artefatti dichiaravano uno stato superato

CHATGPT ne ha segnalato **uno**: `docs/program/handoffs/HANDOFF-UJ-RUN-001.md`, che **e' uno dei
15 artefatti che questo packet hasha** ed era rimasto il documento della **sessione 1** —
branch `claude/ultrajarvis-repo-analysis-li6vvj`, stato `REVIEW`, `33` test, e una tabella di
task le cui transizioni erano scritte come **avvenute** mentre nessuno script del programma le
ha mai applicate.

**Perche' e' una condizione di non-riconciliazione e non un refuso.** Due artefatti pinati sullo
**stesso** commit dichiaravano stati opposti — `REVIEW` nell'handoff, `BLOCKED` nel packet — e
il documento non conteneva nulla che permettesse di stabilire quale valesse. Un integratore non
puo' ammettere una consegna cosi', qualunque sia la qualita' del contenuto.

**Cercare solo quell'istanza sarebbe stato l'errore.** Una scansione dell'intero set per
*dichiarazioni di stato o di branch scritte al presente e gia' superate* ne ha trovate
**quattro**:

| # | Artefatto | Dichiarava | Gravita' relativa |
|---:|---|---|---|
| 1 | `docs/program/handoffs/HANDOFF-UJ-RUN-001.md` | branch e stato della sessione 1, `33` test | e' quella segnalata |
| 2 | `packages/contracts/src/runtime/index.ts` | `RUNTIME_CONTRACTS_PROVENANCE.status = "REVIEW"` | **la peggiore** |
| 3 | `packages/contracts/package.json` | `description: "… status REVIEW."` | minore |
| 4 | `docs/architecture/RUNTIME_BLUEPRINT.md` | il prompt canonico *"non e' ancora su `main`"* | minore, ma falsa |

**Perche' la n. 2 e' la peggiore, anche se e' una riga.** E' l'**unica copia leggibile da una
macchina** dello stato, offerta dal suo stesso commento *"for the Program OS ledger"*. Un
integratore che leggesse la provenienza dal codice invece che dal packet avrebbe ottenuto
`REVIEW` da una consegna `BLOCKED`. Lo stesso file, venticinque righe piu' su, dichiarava
`Status: PROPOSAL`: due stati diversi nello stesso file. Ora i due assi sono separati —
*maturita' del contratto* (`PROPOSAL`) e *ammissibilita' della consegna* (`BLOCKED`).
Prima di toccarla ho verificato con un `grep` che **nessuno la legge**: l'unica occorrenza nel
repository e' la sua stessa dichiarazione. Typecheck, build e i 140 test sono stati rieseguiti
dopo la modifica.

**La n. 4 era falsa, misurata:** `git show origin/main:docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md
| sha256sum` e `git show b8a7697:<stesso path> | sha256sum` restituiscono entrambi
`a3fcdfc9…a69a87`. Il prompt canonico e' su `main` e i byte sono identici: la provenienza resta
valida, cambiava solo dove leggerlo.

**Prova che la correzione e' chirurgica.** Ricalcolando **tutti e 15** gli hash a **entrambi** i
commit sorgente:

| | |
|---|---|
| Hash cambiati | **4 su 15** — esattamente i quattro artefatti qui sopra |
| Hash invariati | 11 su 15 |
| Handoff, prima | `5b943a12…7c5e45` |
| Handoff, dopo | `f1d4db2d…de35d74d` |

Nessun altro byte della consegna e' stato toccato per far quadrare il risultato.

**Che cosa NON e' cambiato:** lo stato resta `BLOCKED`, il peso accettato resta `0/13`, il
`BACKLOG.json` non e' stato modificato, nessun `ReviewResult` e' stato emesso e nessun file di
GROK, GEMINI o CHATGPT e' stato scritto.

**Le menzioni superate sopravvivono in un solo posto**, la §0.3 dell'handoff, che le elenca
sotto un'intestazione esplicita di storia con accanto il valore che vale oggi — piu' la §0.4,
che registra la **classe** del difetto invece della singola istanza. Sono state lasciate li' di
proposito: un lettore che avesse gia' visto la versione precedente deve poter capire che cosa ha
smesso di essere vero, e cancellarle in silenzio glielo impedirebbe.

## 0-ter. Il giro successivo — `main` e' stato riscritto, e la correzione che chiedevo era sbagliata

Verificando il blocker **contro il remoto** invece che contro la memoria, e' emerso che la
storia di `main` e' stata **riscritta**. Nessuno dei commit che questa consegna nomina e' piu'
raggiungibile da `origin/main`:

```
git merge-base --is-ancestor <commit> origin/main
  3611b1b4  -> NO      il read_ref dichiarato dalla card
  d48e1e85  -> NO      il commit che introduce la card
  31f31b9   -> NO      il tip del branch di ChatGPT
  99dece5   -> NO      il merge di PR #1 e PR #2 su main, sessione 3
```

Sopravvivono solo su rami laterali. **Un secondo indizio indipendente dello stesso fatto:**
all'inizio della sessione 6 un `git fetch` senza `+` ha rifiutato l'aggiornamento di
`origin/main` come *non-fast-forward* — esattamente cio' che produce una storia remota
riscritta. Sul momento l'avevo classificato come un difetto della mia ricetta di fetch, ed
era anche quello; ma era **anche** il sintomo di questo.

**Perche' conta: la correzione che questa consegna chiedeva era insufficiente.**
*"Porta il `read_ref` a un commit pari o successivo a `d48e1e85`"* soddisfa **una sola** delle
due clausole necessarie. Seguito alla lettera produrrebbe un `read_ref` che `main` non puo'
risolvere — lo stesso difetto in forma nuova.

**La condizione corretta:** il commit deve **contenere la card** *e* essere **raggiungibile da
`origin/main`**. Candidati verificati:

| Commit | Contiene la card | Raggiungibile da `main` |
|---|---|---|
| `3cbae5c19bb6e29fbc3e0dbbd60c5a7c92fc6fa1` | si | si |
| `25b1b7d53ff5bc4b05348453ebb704aba3a88630` (tip) | si | si |

**E il difetto e' su tutte e quattro le card**, non solo sulla mia — quindi Gemini lo incontrera'
due volte e Grok una:

| Card | `read_ref` | Esiste a quel commit? |
|---|---|---|
| `UJ-RUN-001-CLAUDE.json` | `3611b1b4…` | **no** |
| `UJ-CAP-001-GEMINI.json` | `3611b1b4…` | **no** |
| `UJ-GGL-001-GEMINI.json` | `3611b1b4…` | **no** |
| `UJ-RED-001-GROK.json` | `3611b1b4…` | **no** |

Correggerle tutte e quattro in un colpo solo costa **un** giro di `HUMAN_BRIDGE` invece di tre.

**Fragilita' da registrare:** i quattro input pinati si risolvono **ancora** a `3611b1b4`, 4 su
4, ma solo perche' quei rami laterali esistono. Cancellandoli, anche i pin diventerebbero
irrisolvibili.

**Un solo hash su 15 e' cambiato** in questo giro — l'handoff, che ora porta la §1.1 con questa
analisi. Gli altri 14 sono byte-identici.

## 0-quater. 2026-08-19 — il blocco e' cambiato di natura

CHATGPT ha corretto le card con `4b63b94` su `main`. **Il difetto della §0-ter e' chiuso:** i
quattro `read_ref` puntano ora a `25b1b7d53ff5`, che contiene le card ed e' raggiungibile da
`main` — verificato 4 su 4 su entrambe le clausole. Ha inoltre allineato i criteri
(`UJ-RUN-001` ne dichiara ora **5** nel `BACKLOG.json`, non 2) e aggiunto due assert al
validatore che rendono **meccanico** il difetto invece di limitarsi a correggerlo. Va
accreditato: e' piu' di quanto avessi chiesto.

**Lo stesso commit ha pero' riscritto i sedici hash degli input pinati, e nessuno corrisponde.**

| Card | pin coincidenti | divergenti |
|---|---:|---:|
| `UJ-RUN-001-CLAUDE.json` | 0 | **4** |
| `UJ-CAP-001-GEMINI.json` | 0 | **4** |
| `UJ-GGL-001-GEMINI.json` | 0 | **4** |
| `UJ-RED-001-GROK.json` | 0 | **4** |

Sei convenzioni di hashing testate, nessuna produce quei valori; nessuna versione del piano
canonico nella storia ha mai avuto l'hash dichiarato. **I valori corretti sono quelli che le
card portavano prima.** Il gate di ChatGPT rifiuta il commit di ChatGPT con `exit 1`.

Per quattro giri questo documento ha scritto *"non e' un pin mismatch"*. **Adesso lo e'**, ed e'
l'unica cosa che separa questi byte da `REVIEW`. Il rischio sostanziale resta **nullo**: il
lavoro e' stato svolto contro i documenti reali, i cui byte non sono cambiati.

Analisi completa e sedici valori corretti:
`docs/program/reviews/UJ-CARDS-REPIN-VERIFICATION-CLAUDE.md`.

## 1. Il conteggio dei test, risolto definitivamente

Circolavano quattro numeri diversi. Ecco cosa era ciascuno e qual e' quello vero.

| Numero | Dove compariva | Che cos'era |
|---:|---|---|
| 33 | blueprint §13.3, riga *"Stato"* **e** handoff §2 e §5 | conteggio della **sessione 1**, mai aggiornato mentre la suite cresceva. Corretto nel blueprint in sessione 5 e **lasciato nell'handoff**: vedi la nota qui sotto. Ora corretto in entrambi. |
| 34 | `artifacts[].summary` del packet | conteggio intermedio, dopo la regressione sulla idempotency key. **Corretto.** |
| **36** | `runtime-invariants.test.mjs` | **il numero vero per quel file** |
| **140** | intera suite dei contratti | **il numero vero per la suite** |

> **La lezione, ed e' una ripetizione.** Il `33` e' stato corretto nel blueprint in sessione 5 e
> **lasciato intatto nel file accanto**, che lo dichiarava due volte. E' la stessa forma della
> trappola 20 della mia memoria operativa — *un difetto corretto in un file non e' corretto nel
> file accanto* — gia' incontrata con il byte NUL rimosso da `checkpoint.ts` e lasciato in
> `depth-guard.ts` per quattro sessioni. La contromisura non e' "stare piu' attenti": quando si
> corregge un **numero condiviso**, va cercato in **tutta la consegna** con un grep, non solo nel
> documento che si sta guardando.

**Misurato in due modi indipendenti** sul file byte-identico al blob committato:

```
statico  : grep -c '^test(' -> 36
dinamico : node --test tests/contracts/runtime-invariants.test.mjs
           exit 0 | # tests 36 | # pass 36 | # fail 0
```

> **Un avvertimento che vale per chi ricontrolla.** Eseguire il blob estratto da una directory
> temporanea **fallisce** con 1 test e 1 fallimento: i suoi import verso `packages/contracts/dist/`
> non si risolvono fuori dalla root. Non e' un test rotto ed e' sbagliato riportarlo come tale.
> Va eseguito **dalla root del repository**, dopo la build.

Suite completa, riseguita in questa sessione, file per file:

| Suite | pass | fail |
|---|---:|---:|
| `approval-policy.test.mjs` | 28 | 0 |
| `recovery.test.mjs` | 9 | 0 |
| **`runtime-invariants.test.mjs`** | **36** | **0** |
| `skill-forge.test.mjs` | 37 | 0 |
| `tool-admission.test.mjs` | 30 | 0 |
| **totale** | **140** | **0** |

## 2. Il branch, verificato e non supposto

```
$ git branch -a --contains c645377d54c2
* agent/uj-run-001-blueprint-20260818
  remotes/origin/agent/uj-run-001-blueprint-20260818
```

**Un solo branch, piu' il suo remoto.** Rieseguito in questa sessione sul **nuovo** commit
sorgente, dopo il push — prima del push il remoto non compare, e riportarlo comunque sarebbe
stato scrivere un output non misurato.

Verificato anche in negativo, che e' la meta' che di solito si omette:

```
git merge-base --is-ancestor c645377d54c2 origin/main                              -> non contiene
git merge-base --is-ancestor c645377d54c2 origin/claude/claude-md-resume-point-tvej1u -> non contiene
git merge-base --is-ancestor c645377d54c2 origin/claude/ultrajarvis-program-setup-2noca9 -> non contiene
```

Nessun `UNVERIFIED` e' necessario: la domanda ha una risposta dimostrabile.

`agent/uj-run-001-blueprint-20260818` corrisponde al pattern
`repository_scope.write_branch_patterns` della card (`agent/uj-run-001-*`), e
`direct_main_write` e' `false`: nessuna scrittura su `main`.

## 3. Evidenza per criterio

Lo schema `response-packet` ha `additionalProperties: false` e **nessun campo per criterio**:
la mappatura sta qui, e il packet la cita da `handoff.resume_point`.

### AC-01 — contratti provider-neutral

| Artefatto | SHA-256 a `c645377d54c2` |
|---|---|
| `docs/architecture/RUNTIME_BLUEPRINT.md` | `bccc5a08d3ab8fc9245c0e6dcb8f946d1616bdda40f8e001d3ad1e3504e0cf6c` |
| `packages/contracts/src/runtime/agent-manifest.ts` | `0401bf8c364cad5e6f8d430c84a4dc1b66e3b5420e7e2834e88e2a891ebb5b26` |
| `packages/contracts/src/runtime/team-spec.ts` | `d5a6e5adb50d0cdff3d920ce7dd20dacbef8d8012659f129723d64411653f9ff` |
| `packages/contracts/src/runtime/supervisor.ts` | `d9d4078c69fd1dfede055571c546d0b3ca092bd14a1807eab6eb16d99dd72779` |
| `packages/contracts/src/runtime/depth-guard.ts` | `515b8a9f36fa3fae9594552d30a58bc33bf52d155d6b29fe45e7f01bdcca19b7` |
| `packages/contracts/src/runtime/run-ledger.ts` | `e40c5004152b7bdcb150b26effff634f73a9356f45fe25605b8b2d58959314a7` |

**Controllo eseguito:** scan di token vendor sui contratti runtime, escludendo gli header di
paternita'. **Esito `0`** occorrenze in posizione normativa. Falsificabile: introdurre
`providerId: "openai"` in un tipo lo porta da 0 a 1.

### AC-02 — semantiche binary-testable

| Artefatto | SHA-256 a `c645377d54c2` |
|---|---|
| `packages/contracts/src/runtime/checkpoint.ts` | `21df12f40d2ffe93e672ed95a13d3ca1125fcd0dad05abfd967b41b2d9612fce` |
| `tests/contracts/runtime-invariants.test.mjs` | `0f9afe37ab686a02d80d0092bf081fcb4daec1195c32d59e55679c91a9cbabf0` |

**Controllo eseguito:** i 140 test della tabella al §1, di cui 36 su `runtime-invariants`.
Copertura per semantica: retry 4 · idempotency 3 (incluso il test di iniettivita') · loop 6 ·
cancellation `T-KS-1` · replay e integrita' del ledger `T-LG-1` ×3 · failure containment
(default-deny della macchina a stati) · checkpoint 9 in `recovery.test.mjs`.

### AC-03 — tool access default-deny, mai ereditato implicitamente

| Artefatto | SHA-256 a `c645377d54c2` |
|---|---|
| `packages/contracts/src/runtime/depth-guard.ts` | `515b8a9f36fa3fae9594552d30a58bc33bf52d155d6b29fe45e7f01bdcca19b7` |
| `packages/contracts/src/runtime/supervisor.ts` | `d9d4078c69fd1dfede055571c546d0b3ca092bd14a1807eab6eb16d99dd72779` |

**Controllo eseguito:** sei test, ognuno un tentativo di ottenere piu' del padre, tutti
respinti — `T-TA-1`, `TA-3/TA-10`, `T-TA-2`, ceiling di autonomia e side effect, budget di
provider, e *the state machine denies by default*.

### AC-04 — schemi e checklist completi per la review

| Artefatto | SHA-256 a `c645377d54c2` |
|---|---|
| `docs/threat-models/RUNTIME_THREAT_NOTES.md` | `b84a9a721c5544df9ad1b84e48760a2382783eed3556a7b0c60ba2a6d34bdb60` |
| `docs/program/handoffs/HANDOFF-UJ-RUN-001.md` | `768c13f5b2952854d5730bfbcfed2069d0359becb7405bfa08315e25504d4776` |
| `packages/contracts/src/runtime/index.ts` | `8a42d88fb9526fc107970d628abbfbe239609423fb2c7fc5bd8b817c44f4ea5d` |
| `packages/contracts/src/runtime/common.ts` | `86baa7e4050a252f5d4650be35753585ae4f1bd3733691a8b4ba31ef70919c51` |
| `packages/contracts/src/runtime/envelopes.ts` | `1e3f94558b69abd2852f2c8d5af3691db4d31a9ca947ae7d093581ec4a483b79` |
| `packages/contracts/package.json` | `c2bdb5b63d1b1bab4bf68d7c0644d5376eb7bc28298be53b59f50407b48bc566` |
| `packages/contracts/tsconfig.json` | `d438c3e078c5acc567c703f7d1c119d17d9b135810acd22cd0b5c8013415a5fe` |

**Controllo eseguito:** copertura contro i 24 punti richiesti, **contata**. Cinque avevano zero
occorrenze e due erano deboli; le sezioni **16-22** le chiudono e la §22 mappa tutti e 24 i
punti a una sezione.

### AC-05 — ResponsePacket · **NON SODDISFATTO**

`AC-05` richiede un packet valido che **proponga `REVIEW`**. Questo packet e' valido e ogni
artefatto e' hashato, ma propone **`BLOCKED`**: `AC-05` **non e' soddisfatto**.

```
$ node scripts/validate-response-packet.mjs docs/program/packets/UJ-RESP-RUN-001-CLAUDE.json
exit 0
- status proposed : READY -> BLOCKED
- accepted weight : 0 -> 0 / 13 (unchanged)
- artifacts       : 15 cited, all hashes verified at c645377d54c2
```

Dichiararlo soddisfatto proponendo `REVIEW` significherebbe aggirare la condizione di blocco
invece di segnalarla.

## 4. Cio' che NON e' dimostrato, dichiarato

- **22 prove specificate nelle sezioni 16-21 non sono implementate**, e **nessuna e' stata
  eseguita**. Scomposizione: §16 5 · §17 3 · §18 5 · §19 3 · §20 3 · §21 3.
- **11 prove restano `⏳ PENDING` in §13.3.** Totale specificato e non implementato: **33**.
- **La demo end-to-end minima della §21 NON e' stata eseguita.** E' specificata. Dichiararla
  completata sarebbe falso avanzamento.
- Crash injection, spawn concorrente, liveness del supervisor e corruzione di checkpoint
  richiedono un runtime che non esiste: M2/M3 sotto `UJ-RCV-001`.

## 5. Rilievi aperti che non sono miei

1. Il gate dice `path`, lo schema dice `ref`; con `additionalProperties: false` un artifact con
   `path` fallisce la validazione. Ho seguito lo schema.
2. Il gate chiede la mappatura per criterio **dentro** il packet, e lo schema non ha alcun
   campo per criterio. E' il motivo per cui esiste questo documento.
3. `UJ-RUN-001` dichiara **cinque** criteri nella card e **due** nel `BACKLOG.json`. Misurato
   eseguendo il validatore: una review scritta sui cinque criteri assegnati viene respinta come
   *"unknown criterion"*. Vale per tutte e quattro le card del programma.
4. Nessuno script del repository applica una transizione di stato proposta. **Non ho modificato
   il `BACKLOG.json` ne' il peso accettato.**
