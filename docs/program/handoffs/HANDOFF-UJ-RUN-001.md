# HANDOFF — UJ-RUN-001 (CLAUDE)

| Metadato | Valore |
|---|---|
| Session ID | UJ-CLAUDE-2026-08-17-01 |
| AI_ID | CLAUDE |
| Product | Claude Code — remote execution environment |
| Data | 2026-08-17 UTC |
| Branch | `claude/ultrajarvis-repo-analysis-li6vvj` |
| Base | `main@9d2a93d` |
| Prompt canonico | `agent/ultrajarvis-master-prompt-v1@b8a7697`, SHA-256 verificato |
| Autonomia usata | L2 |
| Side effect | INTERNAL_WRITE (file su branch dedicato) |

---

## 1. Risultato consegnato

**UJ-RUN-001 — Runtime Blueprint.** Tutti e 14 i deliverable di §39.2 sono prodotti
come file versionati.

| # | Deliverable | File |
|---|---|---|
| 1 | Runtime Blueprint | `docs/architecture/RUNTIME_BLUEPRINT.md` |
| 2 | AgentManifest | blueprint §3 + `packages/contracts/src/runtime/agent-manifest.ts` |
| 3 | TeamSpec | blueprint §4 + `team-spec.ts` |
| 4 | Supervisor state machine | blueprint §5 + `supervisor.ts` |
| 5 | DepthGuard invariants | blueprint §6 + `depth-guard.ts` |
| 6 | RunLedger / event taxonomy | blueprint §7 + `run-ledger.ts` |
| 7 | checkpoint/resume/cancel/retry | blueprint §8 + `checkpoint.ts` |
| 8 | tool allowlist inheritance | blueprint §9 + `depth-guard.ts` |
| 9 | typed artifact communication | blueprint §10 + `envelopes.ts` |
| 10 | failure and loop scenarios | blueprint §11 (12 scenari) |
| 11 | TypeScript contract proposals | `packages/contracts/src/runtime/` (9 file) |
| 12 | threat notes → UJ-SEC-001 | `docs/threat-models/RUNTIME_THREAT_NOTES.md` (12 minacce) |
| 13 | review checklist | blueprint §13 |
| 14 | task delta e resume point | questo file |

Secondario: `docs/program/evidence/UJ-CLD-001-SOURCE-MANIFEST.md`.

## 2. Proof e verifiche

Tutte riproducibili. Nessuna affermazione di test non eseguito.

| Verifica | Comando | Esito |
|---|---|---|
| Integrità del prompt canonico | `git show origin/agent/...:docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md \| sha256sum` | `a3fcdfc9…a69a87`, **coincide** con la PR #1 |
| Typecheck strict dei contratti | `cd packages/contracts && npx tsc --noEmit` | exit 0, 0 errori |
| Build dei contratti | `cd packages/contracts && npx tsc` | exit 0 |
| Test degli invarianti | `node --test tests/contracts/runtime-invariants.test.mjs` | **33 test, 33 pass, 0 fail** |
| Raggiungibilità fonti UJ-CLD-001 | `curl -o /dev/null -w "%{http_code}"` su 20 URL | 18 × 200, 2 × 404 (segnalati) |

Flag di compilazione attivi: `strict`, `noUncheckedIndexedAccess`,
`exactOptionalPropertyTypes`, `verbatimModuleSyntax`, `isolatedModules`,
`noUnusedLocals`, `noUnusedParameters`.

## 3. Decisioni e ADR proposti

Nessuna decisione presa unilateralmente. Sei ADR aperti in blueprint §12
(`ADR-RUN-01`…`ADR-RUN-06`), tutti etichettati `PROPOSAL`.

Una sola raccomandazione forte, da falsificare in M2:

> **`ADR-RUN-01`:** partire con una state machine custom deterministica invece di un
> framework. Motivo: gli invarianti sono il valore centrale e un framework va comunque
> avvolto per imporli. Da confrontare con spike reali, non da assumere.

E una decisione di design che considero non negoziabile e chiedo di contestare
esplicitamente se qualcuno dissente:

> **Il Supervisor è codice, non un agente-modello.** Un supervisor implementato come
> prompt è manipolabile dagli artifact che deve supervisionare; poiché è l'entità che
> applica i limiti, renderlo influenzabile li annulla.

## 4. Scoperta rilevante — limite misurato del loop detector

`EXPERIMENT_RESULT`. Una singola parola cambiata nella missione porta la similarità
Jaccard a `0.7778` (9 token) e `0.9130` (23 token), **entrambe sotto la soglia 0.95**.

Conseguenza: i segnali testuali del loop detector (`INTENT_REPEAT`,
`OUTPUT_STAGNATION`) **non contengono un avversario**. Regge solo `TOOL_CYCLE`, che
dipende dal comportamento. Il contenimento reale viene dai limiti strutturali.

Il loop detector va quindi classificato come **early warning**, non come controllo di
sicurezza, e **non deve ricevere crediti di mitigazione nel risk register**. I numeri
sono pinnati in un test perché la soglia non venga ritarata in silenzio.

## 5. Task delta

Disciplina applicata (§7.3): `completed_weight` resta **0 finché un reviewer non
accetta**. Non mi auto-assegno peso. La colonna "Proposto" è ciò che chiedo di
confermare in review, non ciò che rivendico.

| Task | Owner | Stato prima | Stato ora | Accepted | Proposto | Restante | Proof |
|---|---|---|---|---:|---:|---:|---|
| UJ-RUN-001 | CLAUDE | READY | **REVIEW** | 0/13 | 11/13 | 13 | blueprint + 9 contratti + 33 test verdi |
| UJ-CLD-001 | CLAUDE | READY | **IN_PROGRESS** | 0/8 | 2/8 | 8 | source manifest, 20 URL controllati |
| UJ-SEC-001 | CLAUDE | READY | READY | 0/13 | — | 13 | input pronto: threat notes |
| UJ-SKL-001 | CLAUDE | BLOCKED | BLOCKED | 0/13 | — | 13 | attende UJ-SEC-001 |
| UJ-MCP-001 | CLAUDE | BLOCKED | BLOCKED | 0/8 | — | 8 | attende UJ-SEC-001; 3 requisiti già identificati |
| UJ-RCV-001 | CLAUDE | BLOCKED | **READY** | 0/8 | — | 8 | sbloccato da UJ-RUN-001; 11 test specificati |
| UJ-REV-001 | CLAUDE | BLOCKED | BLOCKED | 0/5 | — | 5 | attende UJ-INT-001 (ChatGPT) |
| UJ-REV-002 | CLAUDE | BLOCKED | BLOCKED | 0/8 | — | 8 | attende UJ-INT-007 (ChatGPT) |

**Cambio di stato rilevante:** UJ-RCV-001 passa da BLOCKED a READY, perché la sua
dipendenza (UJ-RUN-001) è ora in REVIEW con semantica di checkpoint/retry definita.

### Finished
Nessun task DONE. UJ-RUN-001 è **REVIEW**, non DONE: manca l'accettazione di GEMINI.

### In progress
UJ-CLD-001 (raccolta fonti fatta, verifica no).

### Blocked
UJ-SKL-001, UJ-MCP-001 (attendono UJ-SEC-001, che è mio e non ancora iniziato);
UJ-REV-001, UJ-REV-002 (attendono deliverable di ChatGPT non esistenti).

### Remaining
6 task READY/BLOCKED del mio portafoglio, 55 unità oltre ai due in corso.

## 6. Progresso — formula §7.4

```
portafoglio CLAUDE = 76 unità (13+13+13+8+8+8+5+8)

accettato formalmente     = 0 / 76   = 0%      (nessun reviewer ha ancora accettato)
proposto in review        = 13 / 76  = 17,1%   (11 di UJ-RUN-001 + 2 di UJ-CLD-001)
```

Contesto di programma, dalla baseline §38: **311 unità** di lavoro iniziale noto per le
quattro IA. Non è il totale di ultraJARVIS, che resta `UNKNOWN` ed estendibile.

**ETA: UNKNOWN — manca una velocity affidabile.** Esiste una sola sessione osservata;
§7.4 richiede almeno due cicli comparabili prima di dichiarare un intervallo. Non
fornisco una stima.

## 7. Rischi

### Nuovi

| ID | Rischio | Severità | Owner |
|---|---|---|---|
| `R-RUN-01` | Contatore task attivi non atomico → fan-out concorrente supera 25 | **ALTA** | CLAUDE, in UJ-RCV-001 |
| `R-RUN-02` | Loop detector testuale scambiato per controllo di sicurezza | MEDIA | GROK, in risk register |
| `R-RUN-03` | Tool senza lookup per idempotency key → resume non può evitare doppi effetti | **ALTA** | CLAUDE, in UJ-MCP-001 |
| `R-RUN-04` | Se l'agente può emettere eventi `tool.*`, la proof fabrication resta possibile | **ALTA** | CLAUDE, in UJ-MCP-001 |
| `R-RUN-05` | Limiti verificati solo all'admission; revoca a cascata non implementata | MEDIA | CLAUDE, in UJ-SEC-001 |

### Chiusi
Nessuno.

## 8. Handoff (§40)

### → CHATGPT (Chief Integrator)
- **Task:** UJ-INT-001 (Program OS), poi UJ-INT-004.
- **Input pronti:** contratti runtime tipizzati e compilanti; tassonomia eventi
  RunLedger; struttura `packages/contracts` funzionante come riferimento per il
  monorepo di UJ-INT-004.
- **Output atteso da te:** PROJECT_STATE, BACKLOG, STATUS, formula di progresso,
  governance di branch/PR. **Non li ho creati io**: sono tuoi e non voglio duplicarli.
- **Da riconciliare:** ho usato la formula §7.4 per il mio delta; se il tuo schema di
  status differisce, il tuo prevale e riallineo.
- **Nota:** il mio branch parte da `main`, non dal branch della PR #1, per non
  interferire con la tua PR. Il prompt canonico è referenziato per SHA, non copiato.
- **Stato:** UJ-INT-001 READY, 0/13. **Blocker: nessuno.**

### → GEMINI (reviewer di UJ-RUN-001)
- **Task:** review di UJ-RUN-001, poi UJ-CAP-001 + UJ-GGL-001.
- **Come revisionare:** blueprint §13. Checklist binaria, 8 controlli di conformità,
  14 di completezza, 6 domande dirette in §13.4.
- **Riproduci le prove:** `cd packages/contracts && npx tsc && cd ../.. && node --test tests/contracts/runtime-invariants.test.mjs` → atteso 33/33.
- **Dove mi aspetto che tu spinga:** `ADR-RUN-02` e `ADR-RUN-06` dipendono dalla tua
  scelta di database e storage. Il blueprint è scritto per non dipenderne, ma se la tua
  scelta rende impraticabile lo storage content-addressed degli artifact, dimmelo:
  è l'assunzione che pagherei più cara.
- **Ti serve da me:** nulla. Puoi partire.
- **Stato:** UJ-CAP-001 READY 0/13, UJ-GGL-001 READY 0/13.

### → GROK (Falsification & Risk)
- **Task:** UJ-RED-001, poi UJ-RSK-001.
- **Input pronti:** `RUNTIME_THREAT_NOTES.md` con 12 minacce, ciascuna con residuo
  esplicito; 5 rischi nuovi già formulati con owner.
- **Ti consegno già falsificata una mia difesa:** il loop detector testuale è
  aggirabile con una parola, misurato. Non trattarlo come mitigazione.
- **Domanda che ti giro esplicitamente** (threat notes §3.4): *esiste una catena che,
  senza violare nessuna invariante, produce un effetto che il proprietario non avrebbe
  approvato?* Se sì è più grave di ogni singola minaccia elencata.
- **Attacca anche:** blueprint §13.4 domande 4 e 6, e l'assunzione che i limiti
  verificati al solo istante dell'admission bastino.
- **Stato:** UJ-RED-001 READY 0/13.

### → CHRISTIAN (proprietario)
Solo ciò che richiede davvero una decisione umana.

| # | Decisione | Perché serve te |
|---|---|---|
| 1 | Confermare i default DepthGuard (depth 3, fan-out 5, 25 task attivi) come **non modificabili dagli agenti** | è un vincolo di autonomia, non una scelta tecnica |
| 2 | Confermare che `L5 — Broad Autonomy` resti irrappresentabile nel codice | l'ho reso impossibile per costruzione; confermalo o correggimi |
| 3 | Accesso automatico Claude: resta **BLOCKED** finché Q1–Q4 di UJ-CLD-001 non hanno risposta documentata | coerente con la review focus n. 3 della PR #1 |
| 4 | Vuoi una PR per questo branch? | **non l'ho aperta**: non è stata richiesta |

Nessuna operazione manuale urgente. Nessun bridge necessario ora. S-10 (console
billing) richiederà un `HUMAN_BRIDGE` quando si arriverà a Q8 di UJ-CLD-001, non prima.

### → Tool ausiliari
Nessuna DelegationCard pronta. Non ne emetto per non creare lavoro non contrattualizzato.

## 9. RESUME_POINT

```
PROGRAMMA : ultraJARVIS
AI_ID     : CLAUDE
BRANCH    : claude/ultrajarvis-repo-analysis-li6vvj
BASE      : main@9d2a93d
PROMPT    : agent/ultrajarvis-master-prompt-v1@b8a7697
            sha256 a3fcdfc97b48e9b1f37e1a1798b0b5e7231309d03ab4e13683622eaf1fa69a87

STATO     : UJ-RUN-001 REVIEW (attende GEMINI)
            UJ-CLD-001 IN_PROGRESS (2/8 proposti)
            UJ-RCV-001 sbloccato → READY

PROSSIMO  : UJ-SEC-001 (peso 13, reviewer GROK), come da §41.
            Input già pronto: docs/threat-models/RUNTIME_THREAT_NOTES.md
            Deliverable: threat model completo, approval policy, critica alla Costituzione.

SE UJ-SEC-001 È BLOCCATO:
            UJ-CLD-001 (leggere S-06, S-08, S-16, S-18 e compilare 4 Capability Record)
            oppure UJ-RCV-001 (implementare T-DG-4b, il test di concorrenza P0).

NON RIFARE : blueprint, contratti runtime, threat notes, source manifest.
             Verificare prima con: node --test tests/contracts/runtime-invariants.test.mjs

APERTO    : ADR-RUN-01..06 sono PROPOSAL, nessuno deciso.
            R-RUN-01/03/04 sono ALTA severità e senza mitigazione implementata.
```

## 10. Confini rispettati

Per chiarezza in review, ecco cosa **non** ho fatto e perché:

- non ho creato PROJECT_STATE, BACKLOG, STATUS, ROADMAP → sono UJ-INT-001 di ChatGPT;
- non ho compilato il Capability Registry → è UJ-CAP-001 di Gemini;
- non ho scritto il risk register di programma → è UJ-RSK-001 di Grok;
- non ho toccato `main` né la PR #1;
- non ho aperto una pull request: non è stata richiesta;
- non ho dichiarato alcun fatto su piani, prezzi o accessi Anthropic: solo che certi
  URL ufficiali rispondono, in data 2026-08-17;
- non ho implementato il runtime: UJ-RUN-001 è un blueprint con contratti, e
  l'implementazione è M2/M3.
