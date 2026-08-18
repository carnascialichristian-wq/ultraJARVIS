# UJ-RUN-001 — evidenza per criterio · consegna **BLOCKED**

| | |
|---|---|
| Task | `UJ-RUN-001` — owner CLAUDE, reviewer GEMINI, peso 13 |
| Card | `UJ-CARD-RUN-001-CLAUDE` |
| Branch | `agent/uj-run-001-blueprint-20260818` (pattern autorizzato dalla card) |
| **`source_commit_sha` unico** | `2dad45a40798a8059b5e2b7db077b76e77fcc88b` |
| Stato proposto | **`BLOCKED`** |
| Peso accettato | **0 / 13, invariato** |
| Generato | 2026-08-18T15:18:13Z |

## 0. Perché BLOCKED, e non REVIEW

La card `UJ-RUN-001-CLAUDE.json` **non esiste** al commit che il suo stesso
`repository_scope.read_ref` nomina.

```
$ git cat-file -e 3611b1b400cf57b5021bab228a3de9470d6eca5c:prompts/delegation-cards/UJ-RUN-001-CLAUDE.json
fatal: path 'prompts/delegation-cards/UJ-RUN-001-CLAUDE.json' exists on disk, but not in '3611b1b4...'
```

La card entra nella storia con `d48e1e8519a8d7af90ea44e770f0db7fd3938fb3`, **dodici minuti dopo**
`3611b1b4`. Il proprietario ha stabilito che una card non disponibile al `read_ref` produce
`BLOCKED` invece di procedere, e questa consegna lo rispetta.

**Non è un pin mismatch.** I quattro hash **pinati** coincidono tutti a `3611b1b4`:

| Input pinato | SHA-256 atteso | osservato a `3611b1b4` |
|---|---|---|
| `docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md` | `a3fcdfc9…a69a87` | **coincide** |
| `docs/program/SPECIALIST_INPUTS.md` | `72edc395…93590a` | **coincide** |
| `docs/program/COUNCIL_PACKETS.md` | `eb4d0d0d…d29ff88` | **coincide** |
| `schemas/response-packet.schema.json` | `ee44e1b7…7e69c0a` | **coincide** |

Il blocco riguarda **la disponibilità della card**, non i pin. Gli artefatti sono completi e
hashati a un solo commit, quindi **la stessa consegna può essere ammessa senza toccare un byte**
appena il `read_ref` è corretto.

## 1. Evidenza per criterio

Il gate chiede path, SHA e un controllo concreto per ciascun criterio. Lo schema
`response-packet` ha `additionalProperties: false` e **nessun campo per criterio**, quindi la
mappatura sta qui e il packet la cita da `handoff.resume_point`.

### AC-01 — contratti provider-neutral

| Artefatto | SHA-256 a `2dad45a40798` |
|---|---|
| `docs/architecture/RUNTIME_BLUEPRINT.md` | `a0be04069692d89399eefe183d489d8ad8bea472c232444676883331c23c2538` |
| `packages/contracts/src/runtime/agent-manifest.ts` | `0401bf8c364cad5e6f8d430c84a4dc1b66e3b5420e7e2834e88e2a891ebb5b26` |
| `packages/contracts/src/runtime/team-spec.ts` | `d5a6e5adb50d0cdff3d920ce7dd20dacbef8d8012659f129723d64411653f9ff` |
| `packages/contracts/src/runtime/supervisor.ts` | `d9d4078c69fd1dfede055571c546d0b3ca092bd14a1807eab6eb16d99dd72779` |
| `packages/contracts/src/runtime/depth-guard.ts` | `515b8a9f36fa3fae9594552d30a58bc33bf52d155d6b29fe45e7f01bdcca19b7` |
| `packages/contracts/src/runtime/run-ledger.ts` | `e40c5004152b7bdcb150b26effff634f73a9356f45fe25605b8b2d58959314a7` |

**Controllo eseguito:**

```bash
grep -rniE 'anthropic|openai|\bgpt-|bedrock|vertex|azure|\bclaude\b|\bgemini\b|\bgrok\b' \
  packages/contracts/src/runtime/*.ts | grep -vcE ':[0-9]+: \*|owner:|reviewer:'
```

**Esito: `0`.** Nessun identificatore di vendor in posizione normativa; le uniche occorrenze
sono negli header di paternità. Il controllo è falsificabile: introdurre `providerId: "openai"`
in un tipo lo porta da 0 a 1.

### AC-02 — semantiche binary-testable

| Artefatto | SHA-256 a `2dad45a40798` |
|---|---|
| `packages/contracts/src/runtime/checkpoint.ts` | `21df12f40d2ffe93e672ed95a13d3ca1125fcd0dad05abfd967b41b2d9612fce` |
| `tests/contracts/runtime-invariants.test.mjs` | `0f9afe37ab686a02d80d0092bf081fcb4daec1195c32d59e55679c91a9cbabf0` |

**Controllo eseguito**, conteggi letti file per file in questa sessione:

| Suite | pass | fail |
|---|---:|---:|
| `approval-policy.test.mjs` | 28 | 0 |
| `recovery.test.mjs` | 9 | 0 |
| **`runtime-invariants.test.mjs`** | **36** | **0** |
| `skill-forge.test.mjs` | 37 | 0 |
| `tool-admission.test.mjs` | 30 | 0 |
| **totale** | **140** | **0** |

Copertura per semantica: retry (4 test) · idempotency (3, incluso il test di iniettività) ·
loop (6, incluso `MEASURED: the tool-cycle key is injective`) · cancellation (`T-KS-1`) ·
replay e integrità del ledger (`T-LG-1` ×3) · failure containment (default-deny della macchina
a stati) · checkpoint (`recovery.test.mjs`, 9).

### AC-03 — tool access default-deny, mai ereditato implicitamente

| Artefatto | SHA-256 a `2dad45a40798` |
|---|---|
| `packages/contracts/src/runtime/depth-guard.ts` | `515b8a9f36fa3fae9594552d30a58bc33bf52d155d6b29fe45e7f01bdcca19b7` |
| `packages/contracts/src/runtime/supervisor.ts` | `d9d4078c69fd1dfede055571c546d0b3ca092bd14a1807eab6eb16d99dd72779` |

**Controllo eseguito:** sei test, ognuno un tentativo di ottenere più del padre, tutti respinti
— `T-TA-1` (tool non posseduto), `TA-3/TA-10` (bump di versione come escalation), `T-TA-2`
(classe di dato più alta), ceiling di autonomia e side effect, budget di provider, e *the state
machine denies by default: unlisted moves are not legal*.

### AC-04 — schemi e checklist completi per la review

| Artefatto | SHA-256 a `2dad45a40798` |
|---|---|
| `docs/threat-models/RUNTIME_THREAT_NOTES.md` | `b84a9a721c5544df9ad1b84e48760a2382783eed3556a7b0c60ba2a6d34bdb60` |
| `docs/program/handoffs/HANDOFF-UJ-RUN-001.md` | `5b943a125bddfb70659daadceda7609527fed464d1ff9f1fb26c88887e7c5e45` |
| `packages/contracts/src/runtime/index.ts` | `08e06bde8eb51ab1ac9636a1bebfae12c6bd373643ba1c77180b1da64b85de1a` |
| `packages/contracts/src/runtime/common.ts` | `86baa7e4050a252f5d4650be35753585ae4f1bd3733691a8b4ba31ef70919c51` |
| `packages/contracts/src/runtime/envelopes.ts` | `1e3f94558b69abd2852f2c8d5af3691db4d31a9ca947ae7d093581ec4a483b79` |
| `packages/contracts/package.json` | `3c085ad42466251192a5ecfa7ee71750bd6825d4f5cb6fa56df0c257c4f3980a` |
| `packages/contracts/tsconfig.json` | `d438c3e078c5acc567c703f7d1c119d17d9b135810acd22cd0b5c8013415a5fe` |

**Controllo eseguito:** copertura contro i 24 punti richiesti, **contata** e non stimata.
Cinque avevano zero occorrenze — decomposizione dei task, selezione e assegnazione degli agenti,
demo end-to-end, fallback locale a costo zero — e due erano deboli (conflitti 1, HUMAN_BRIDGE 2).
Le sezioni **16-22** le chiudono; la §22 mappa tutti e 24 i punti a una sezione.

### AC-05 — ResponsePacket · **NON SODDISFATTO**

`AC-05` chiede un packet valido che **proponga `REVIEW`**. Questo packet è valido e ogni
artefatto è hashato, ma propone **`BLOCKED`**, quindi **`AC-05` non è soddisfatto**.

```
$ node scripts/validate-response-packet.mjs docs/program/packets/UJ-RESP-RUN-001-CLAUDE.json
exit 0
- status proposed : READY -> BLOCKED
- accepted weight : 0 -> 0 / 13 (unchanged)
- artifacts       : 15 cited, all hashes verified at 2dad45a40798
```

Dichiararlo soddisfatto proponendo `REVIEW` significherebbe aggirare la condizione di blocco
invece di segnalarla.

## 2. Ciò che NON è dimostrato, dichiarato

- **Le 24 prove specificate nelle sezioni 16-22 non sono implementate.** Sono marcate
  `PROVA DA IMPLEMENTARE` nel documento e **nessuna è stata eseguita**.
- **La demo end-to-end minima della §21 NON è stata eseguita.** È specificata. Dichiararla
  completata sarebbe falso avanzamento.
- Crash injection, spawn concorrente, liveness del supervisor e corruzione di checkpoint
  richiedono un runtime che non esiste: restano M2/M3 sotto `UJ-RCV-001`.

## 3. Rilievi che restano aperti e non sono miei

1. Il gate dice `path`, lo schema dice `ref`; con `additionalProperties: false` un artifact con
   `path` fallisce la validazione. Ho seguito lo schema.
2. Il gate chiede la mappatura per criterio **dentro** il packet, e lo schema non ha alcun campo
   per criterio. È il motivo per cui esiste questo documento.
3. `UJ-RUN-001` dichiara **cinque** criteri nella card e **due** nel `BACKLOG.json`. Misurato
   eseguendo il validatore: una review scritta sui cinque criteri assegnati viene respinta come
   *"unknown criterion"*. Vale per tutte e quattro le card del programma.
4. Nessuno script del repository applica una transizione di stato proposta: nessuno scrive su
   `BACKLOG.json`. **Non ho modificato il BACKLOG né il peso accettato.**
