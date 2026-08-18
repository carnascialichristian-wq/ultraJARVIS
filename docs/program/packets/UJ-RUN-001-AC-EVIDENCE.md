# UJ-RUN-001 — evidenza per criterio di accettazione

| Campo | Valore |
|---|---|
| Task | `UJ-RUN-001` |
| Card | `UJ-CARD-RUN-001-CLAUDE` |
| Mission | `UJ-MISSION-M0-COUNCIL-001` |
| Owner | CLAUDE |
| Reviewer designato | GEMINI |
| Packet | `docs/program/packets/UJ-RESP-RUN-001-CLAUDE.json` |
| `source_commit_sha` | `01d7d3016175a46c17a50f4f3d26ce0490a23704` |
| Peso accettato | **0 / 13, invariato** |
| Prodotto | Claude Code in remote execution environment, nessuna API a consumo |

## Perché questo file esiste, e non è dentro il packet

Il gate `prompts/handoffs/CLAUDE_RUN_UJ-RUN-001_REQUEST_20260818.md` chiede:

> *"Per ogni criterio inserisci path, SHA previsto/finale e un controllo concreto."*

`schemas/response-packet.schema.json` ha `additionalProperties: false` e **non espone
alcun campo per criterio**: i suoi `required` si fermano a `verification`, che è una
quaterna piatta `checks_run / passed / failed / not_run`. Aggiungere un campo
`acceptance_criteria` al packet lo farebbe **fallire la validazione**, quindi la
richiesta del gate non è soddisfacibile dentro il packet.

Il vincolo è nello schema, non nella richiesta. Riporto la mappatura qui e la cito dal
packet in `handoff.resume_point`. **Segnalazione a CHATGPT, proprietario dello schema:**
se la mappatura per criterio è attesa nel packet, allo schema serve un campo; altrimenti
il gate va corretto per puntare a un documento accanto. Oggi le due cose si contraddicono.

---

## AC-01 — contratti provider-neutral

**Testo:** *AgentManifest, TeamSpec, Supervisor, DepthGuard e RunLedger sono contratti
provider-neutral.*

| Artefatto | SHA-256 dei byte finali |
|---|---|
| `docs/architecture/RUNTIME_BLUEPRINT.md`<br>`bc0fcc4bf577dc97abe8af5725c4aa85b01e2f2980073b619d6f3fdfeda88480` |
| `packages/contracts/src/runtime/agent-manifest.ts`<br>`0401bf8c364cad5e6f8d430c84a4dc1b66e3b5420e7e2834e88e2a891ebb5b26` |
| `packages/contracts/src/runtime/team-spec.ts`<br>`d5a6e5adb50d0cdff3d920ce7dd20dacbef8d8012659f129723d64411653f9ff` |
| `packages/contracts/src/runtime/supervisor.ts`<br>`d9d4078c69fd1dfede055571c546d0b3ca092bd14a1807eab6eb16d99dd72779` |
| `packages/contracts/src/runtime/depth-guard.ts`<br>`515b8a9f36fa3fae9594552d30a58bc33bf52d155d6b29fe45e7f01bdcca19b7` |
| `packages/contracts/src/runtime/run-ledger.ts`<br>`e40c5004152b7bdcb150b26effff634f73a9356f45fe25605b8b2d58959314a7` |

**Controllo concreto — eseguito:**

```bash
grep -rniE 'anthropic|openai|\bgpt-|bedrock|vertex|azure|\bclaude\b|\bgemini\b|\bgrok\b' \
  packages/contracts/src/runtime/*.ts | grep -vcE ':[0-9]+: \*|owner:|reviewer:'
```

**Esito: `0`.** Nessun identificatore di vendor in posizione normativa. Le uniche
occorrenze nel file sono negli header di paternità (`Task: UJ-RUN-001 (CLAUDE)`,
`reviewer: "GEMINI"`), che sono metadati di programma, non vincoli di runtime.

Il controllo è **falsificabile**: introdurre `providerId: "openai"` in un tipo lo fa
passare da 0 a 1.

**Nota di metodo.** È stato proprio questo scan a scoprire il difetto corretto in questa
sessione: su `depth-guard.ts` restituiva `binary file matches` invece di una riga.

---

## AC-02 — semantiche binary-testable

**Testo:** *Checkpoint, cancellation, retry, idempotency, loop, replay e failure
containment sono binary-testable.*

| Artefatto | SHA-256 dei byte finali |
|---|---|
| `packages/contracts/src/runtime/checkpoint.ts`<br>`21df12f40d2ffe93e672ed95a13d3ca1125fcd0dad05abfd967b41b2d9612fce` |
| `packages/contracts/src/runtime/supervisor.ts`<br>`d9d4078c69fd1dfede055571c546d0b3ca092bd14a1807eab6eb16d99dd72779` |
| `tests/contracts/runtime-invariants.test.mjs`<br>`0f9afe37ab686a02d80d0092bf081fcb4daec1195c32d59e55679c91a9cbabf0` |

**Controllo concreto — eseguito:** `node --test tests/contracts/runtime-invariants.test.mjs`
→ **36/36 pass, exit 0**. Copertura per semantica, per nome di test:

| Semantica | Test |
|---|---|
| retry | *no aggressive retry on rate limit, and none at all on quota exhaustion* · *a denied policy is never retried* · *a timeout is retried only when the operation is idempotent* · *an unknowable outcome is never retried automatically* |
| idempotency | *the idempotency key is stable across attempts of the same logical work* · *the key encoding is injective: shifted field boundaries do not collide* · *different payloads produce different keys* |
| loop | *T-LP-1* · *T-LP-2* · *MEASURED: one cosmetic token defeats the similarity threshold* · *the structural signal is the one that holds* · *genuinely different work is not flagged* · **nuovo:** *MEASURED: the tool-cycle key is injective* |
| cancellation | *T-KS-1: the kill switch reaches HALTED from every non-terminal state* |
| replay / integrità ledger | *T-LG-1: an intact chain verifies* · *rewriting a past event is detected* · *re-hashing the edited event still breaks the following link* |
| failure containment | *the state machine denies by default: unlisted moves are not legal* |
| checkpoint | `checkpoint.ts` + suite `recovery.test.mjs` (9/9) |

**Ciò che NON è dimostrato, dichiarato:** crash injection, spawn concorrente, liveness
del supervisor e corruzione di checkpoint **non sono coperti**. Richiedono un runtime che
non esiste: restano specificati e pendenti per M2/M3 sotto `UJ-RCV-001`. Sono in
`verification.not_run` del packet, non fra i passati.

---

## AC-03 — tool access default-deny, mai ereditato implicitamente

**Testo:** *Tool access è default-deny e non viene ereditato implicitamente.*

| Artefatto | SHA-256 dei byte finali |
|---|---|
| `packages/contracts/src/runtime/depth-guard.ts`<br>`515b8a9f36fa3fae9594552d30a58bc33bf52d155d6b29fe45e7f01bdcca19b7` |
| `packages/contracts/src/runtime/supervisor.ts`<br>`d9d4078c69fd1dfede055571c546d0b3ca092bd14a1807eab6eb16d99dd72779` |
| `tests/contracts/runtime-invariants.test.mjs`<br>`0f9afe37ab686a02d80d0092bf081fcb4daec1195c32d59e55679c91a9cbabf0` |

**Controllo concreto — eseguito.** Sei test, ciascuno un tentativo di ottenere più del
padre, tutti respinti:

| Test | Cosa tenta |
|---|---|
| `T-TA-1: a tool the parent does not hold is rejected` | prendere un tool assente nel padre |
| `TA-3/TA-10: a version bump is not a near-match, it is an escalation` | passare `v1.0.0` → `v1.1.0` come se fosse lo stesso tool |
| `T-TA-2: a higher data class than the parent is rejected` | alzare la classe di dato |
| `autonomy and side-effect ceilings are enforced` | alzare autonomia o side effect |
| `a child may not reserve more provider calls than the parent has` | superare il budget del padre |
| `the state machine denies by default: unlisted moves are not legal` | una transizione non elencata |

L'ultimo è il criterio in senso stretto: la macchina **nega ciò che non è esplicitamente
permesso**, invece di cadere in un ramo permissivo (`supervisor.ts` riga 75).

Il test *rejection reports every violated invariant, not only the first* impedisce che un
rifiuto mascheri le violazioni successive.

---

## AC-04 — schemi e checklist completi per la review

**Testo:** *Gli schemi proposti e la checklist di integrazione sono completi per la review
ChatGPT/Gemini.*

| Artefatto | SHA-256 dei byte finali |
|---|---|
| `docs/architecture/RUNTIME_BLUEPRINT.md`<br>`bc0fcc4bf577dc97abe8af5725c4aa85b01e2f2980073b619d6f3fdfeda88480` |
| `docs/threat-models/RUNTIME_THREAT_NOTES.md`<br>`b84a9a721c5544df9ad1b84e48760a2382783eed3556a7b0c60ba2a6d34bdb60` |
| `docs/program/handoffs/HANDOFF-UJ-RUN-001.md`<br>`5b943a125bddfb70659daadceda7609527fed464d1ff9f1fb26c88887e7c5e45` |
| `packages/contracts/src/runtime/index.ts`<br>`08e06bde8eb51ab1ac9636a1bebfae12c6bd373643ba1c77180b1da64b85de1a` |
| `packages/contracts/src/runtime/common.ts`<br>`86baa7e4050a252f5d4650be35753585ae4f1bd3733691a8b4ba31ef70919c51` |
| `packages/contracts/src/runtime/envelopes.ts`<br>`1e3f94558b69abd2852f2c8d5af3691db4d31a9ca947ae7d093581ec4a483b79` |
| `packages/contracts/package.json`<br>`3c085ad42466251192a5ecfa7ee71750bd6825d4f5cb6fa56df0c257c4f3980a` |
| `packages/contracts/tsconfig.json`<br>`d438c3e078c5acc567c703f7d1c119d17d9b135810acd22cd0b5c8013415a5fe` |

**Controllo concreto — eseguito:** `§13` del blueprint contiene **54 voci** di checklist
distribuite su quattro sottosezioni — 13.1 conformità ai vincoli, 13.2 completezza rispetto
a §39.2, 13.3 test obbligatori prima di considerare implementato il runtime, 13.4 sei
domande a cui il reviewer deve rispondere. `§11` elenca dodici scenari di fallimento
nominati (S1…S12), `§12` sei ADR proposti e non decisi (`ADR-RUN-01`…`ADR-RUN-06`).

Le domande di §13.4 sono lasciate **aperte** invece che chiuse con una risposta
rassicurante, e la n. 4 riporta l'evasione del loop detector come **misurata e riuscita**.
Un reviewer che volesse bocciare questo deliverable trova le munizioni già scritte dentro
il deliverable stesso.

---

## AC-05 — ResponsePacket valido, ogni artefatto hashato, REVIEW proposto, peso invariato

| Artefatto | SHA-256 dei byte finali |
|---|---|
| `docs/program/packets/UJ-RESP-RUN-001-CLAUDE.json` | validato, vedi sotto |

**Controllo concreto — eseguito:**

```bash
node scripts/validate-response-packet.mjs docs/program/packets/UJ-RESP-RUN-001-CLAUDE.json
```

**Esito: exit 0.**

```
ResponsePacket validation: PASS
- task            : UJ-RUN-001 (CLAUDE)
- status proposed : READY -> REVIEW
- accepted weight : 0 -> 0 / 13 (unchanged)
- artifacts       : 15 cited, all hashes verified at 01d7d3016175
```

Il validatore **ricalcola** i 15 sha256 dai byte al commit dichiarato: non rilegge il
numero scritto nel packet. Il peso accettato resta `0/13` e nessuna approvazione è
attribuita a GEMINI.

---

## Rilievi sul gate stesso

Tre incoerenze, riportate perché il gate chiede di non inventare e di dichiarare ciò che
non torna. **Nessuna delle tre è bloccante**, e nessuna è stata aggirata in silenzio.

### R-1 — la card non esiste al commit al quale il gate ordina di leggerla

Il gate elenca fra gli input obbligatori *"al commit di lettura della card
`3611b1b4…`"* anche `prompts/delegation-cards/UJ-RUN-001-CLAUDE.json`. Verificato:

```
$ git cat-file -e 3611b1b4:prompts/delegation-cards/UJ-RUN-001-CLAUDE.json
fatal: path ... exists on disk, but not in '3611b1b4'
```

La card è stata introdotta da `d48e1e85` (*UJ-INT-006 add M0 council mission and cards*),
**dodici minuti dopo** `3611b1b4`. L'incoerenza è nella prosa del gate, non nella card: il
campo `input_artifacts` della card elenca correttamente **quattro** artefatti e non se
stessa. `repository_scope.read_ref` della card è `3611b1b4`, quindi il gate ha ripreso quel
ref e ci ha aggiunto un quinto input che a quel ref non poteva esistere.

**Non ho restituito BLOCKED**, perché il gate riserva quel verdetto al caso *"un pin non
corrisponde"* e i quattro hash **pinati** corrispondono tutti a `3611b1b4`:

| Input | SHA-256 atteso | osservato a `3611b1b4` |
|---|---|---|
| `docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md` | `a3fcdfc9…a69a87` | **coincide** |
| `docs/program/SPECIALIST_INPUTS.md` | `72edc395…93590a` | **coincide** |
| `docs/program/COUNCIL_PACKETS.md` | `eb4d0d0d…d29ff88` | **coincide** |
| `schemas/response-packet.schema.json` | `ee44e1b7…3b7e69c0a` | **coincide** |

La card l'ho letta al ref dove esiste, `8411f23f3e57e4b4f0263068b68e3f41de7842fe1bef0188aeb3ab88cc8b251e`,
identica su `origin/main` e sul branch di lavoro.

### R-2 — il gate dice `path`, lo schema dice `ref`

Il gate chiede *"artifacts con path relativo, SHA-256 dei byte finali, media type e data
class"*. Lo schema definisce il campo come **`ref`**, e con `additionalProperties: false`
un artifact che porti `path` **fallisce la validazione**. Ho seguito lo schema, che è
l'artefatto pinato e con hash verificato. Segnalato a CHATGPT come divergenza di lessico.

### R-3 — `source_commit_sha` non è raggiungibile da `main`

Il commit dichiarato vive sul branch di lavoro, pubblicato come
`origin/claude/claude-md-resume-point-tvej1u`, **non su `origin/main`**. È conforme alla
card, che vieta `direct_main_write`, ma chi congela i byte deve fetchare quel ref: da
`main` da solo il commit non si risolve.

---

## Ciò che ho cambiato mentre verificavo, e perché lo dico qui

Riverificare non è rileggere. Lo scan di AC-01 ha stampato `binary file matches` su
`depth-guard.ts` invece di una riga: il file conteneva **un byte NUL**, usato come
separatore nella chiave k-gram del rilevatore di cicli.

È la **seconda occorrenza dell'errore E6**, corretto in sessione 1 nel file accanto
(`checkpoint.ts`) e lasciato qui. Due conseguenze, entrambe misurate:

1. **Falsi positivi.** `ToolId` è una stringa branded senza validazione a runtime, quindi
   il separatore può comparire dentro un nome di tool. La sequenza
   `["a","b\0c","x","a\0b","c","x"]` segnalava un ciclo **inesistente**, perché le
   finestre 0 e 3 si codificano identiche.
2. **Invisibilità.** Il NUL rendeva `depth-guard.ts` **binario** per git e per grep. Il
   file è stato fuori da ogni audit testuale del repository per quattro sessioni.

Correzione: l'encoding length-prefixed è ora un helper unico, `encodeInjective` in
`common.ts`, usato sia da `buildIdempotencyKey` sia da `hasToolCycle`. `checkpoint.ts`
produce byte identici, e il test di iniettività preesistente lo dimostra.

Due test di regressione. Il primo è stato **provato contro il codice vecchio prima di
essere accettato**: `expected: false, actual: true`. Il secondo asserisce che nessun
sorgente dei contratti runtime contenga un NUL, così la lezione è fissata
meccanicamente e non da un commento.

Suite: **da 138 a 140**, `fail 0`, typecheck e build a exit 0.

Questo è il motivo per cui `source_commit_sha` e quattro dei quindici hash differiscono
dal packet emesso in sessione 4.
