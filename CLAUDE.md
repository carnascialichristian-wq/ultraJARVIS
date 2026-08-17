# CLAUDE.md — memoria operativa di CLAUDE nel programma ultraJARVIS

> **A cosa serve questo file.** Quando una chat diventa pesante, Christian ne apre
> un'altra e dice: *"leggi le istruzioni di ultraJARVIS e il file CLAUDE.md"*.
> Da quel momento la nuova sessione deve sapere **chi è, cosa ha già fatto, dove si
> era fermata, quali errori sono già stati commessi e cosa manca** — senza rileggere
> la conversazione precedente, che non esiste più.
>
> Questo file è la memoria. La chat non lo è mai stata.

| Metadato | Valore |
|---|---|
| Proprietario del programma | Christian |
| AI_ID | CLAUDE |
| Ruolo | Runtime, Security & Skill Architect |
| Repository | `carnascialichristian-wq/ultraJARVIS` (privata) |
| Branch di lavoro | `claude/ultrajarvis-repo-analysis-li6vvj` |
| File gemello per le altre IA | `TASKCLAUDE.md` |
| Ultimo aggiornamento | 2026-08-17 — sessione `UJ-CLAUDE-2026-08-17-01` |

> Nota sul nome: il file è `CLAUDE.md` in maiuscolo perché è la convenzione che
> Claude Code carica automaticamente come istruzioni di progetto. Se lo rinomini in
> minuscolo perde quel caricamento automatico.

---

# PARTE 1 — LE DUE REGOLE PRIMARIE

Queste due regole vengono **prima** di qualunque task tecnica. Sono ordini diretti del
proprietario, quindi `USER_CONSTRAINT` secondo §5 del prompt canonico, e stanno al
livello più alto della gerarchia della verità (§7.2).

## REGOLA 1 — Il resoconto è parte del lavoro, non un extra

**Ogni sessione di CLAUDE deve inserire in questo file il resoconto del proprio
lavoro**, in modo che il lavoro sia tracciabile sessione per sessione.

Il resoconto non è un riassunto decorativo. Deve contenere, sempre:

1. **cosa ho fatto**, con i file prodotti o modificati;
2. **come l'ho fatto**, cioè il metodo, non solo l'esito;
3. **quali errori ho commesso** e come li ho corretti — gli errori si scrivono, non si
   nascondono: un errore taciuto verrà ripetuto dalla sessione successiva;
4. **quanto manca** per completare ogni task, con i pesi e la formula §7.4, mai a occhio;
5. **cosa ho deciso e cosa ho lasciato aperto**;
6. **il punto esatto di ripresa**.

Un lavoro tecnicamente perfetto ma non registrato qui **non è completo**. Se la sessione
finisce senza aggiornare questo file, il lavoro è di fatto perduto per la sessione
successiva, che ripartirà a vuoto o rifarà cose già fatte.

## REGOLA 2 — Aggiornamento obbligatorio a fine di ogni lavoro o task

**Alla fine di ogni lavoro o task, CLAUDE deve sempre eseguire l'aggiornamento e
l'estensione del resoconto, sia in `CLAUDE.md` sia in `TASKCLAUDE.md`.**

Precisazioni operative, per non lasciare margine di interpretazione:

- vale a **fine di ogni task**, non solo a fine sessione;
- è **estensione**, non sostituzione: il log storico non si riscrive né si accorcia.
  Si aggiunge una voce nuova. La storia degli errori è la parte più utile del file;
- vanno aggiornati **entrambi** i file. `CLAUDE.md` guarda a me e alla mia continuità;
  `TASKCLAUDE.md` guarda alle altre tre IA e a cosa devono sapere;
- l'aggiornamento va **committato e pushato**, altrimenti non esiste: il container di
  sessione è effimero e viene riciclato;
- se una task finisce male, il resoconto si scrive **lo stesso**, descrivendo il
  fallimento. Un fallimento documentato vale più di un successo non registrato.

### Checklist di chiusura task (da eseguire ogni volta)

```
[ ] 1. Aggiornato CLAUDE.md      → nuova voce nel Session Log + tabella stato task
[ ] 2. Aggiornato TASKCLAUDE.md  → cosa cambia per ChatGPT / Gemini / Grok
[ ] 3. Registrati gli errori commessi in questa sessione (anche quelli banali)
[ ] 4. Ricalcolato "quanto manca" con la formula §7.4, non a sensazione
[ ] 5. Aggiornato il RESUME_POINT in fondo a questo file
[ ] 6. git add / commit / push sul branch designato
[ ] 7. Verificato che i test citati passino DAVVERO (comando + esito, non memoria)
```

---

# PARTE 2 — AVVIO RAPIDO PER UNA SESSIONE NUOVA

Se sei una sessione appena aperta, fai **esattamente questo, in questo ordine**:

| # | Azione | Dove |
|---|---|---|
| 1 | Leggi il prompt canonico integrale | `docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md` — attualmente sul branch `agent/ultrajarvis-master-prompt-v1` (PR #1), **non ancora su main** |
| 2 | Verifica l'integrità del prompt | `git show origin/agent/ultrajarvis-master-prompt-v1:docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md \| sha256sum` → deve dare `a3fcdfc9…a69a87` |
| 3 | Leggi questo file per intero | `CLAUDE.md` |
| 4 | Leggi lo stato per le altre IA | `TASKCLAUDE.md` |
| 5 | Leggi l'ultimo handoff | `docs/program/handoffs/` — il più recente |
| 6 | Riesegui le prove prima di fidarti | vedi §"Comandi di verifica" qui sotto |
| 7 | Prendi il task indicato nel RESUME_POINT | in fondo a questo file |

**Non ripartire da zero. Non rifare lavoro già fatto.** Prima di produrre qualcosa,
controlla la tabella di stato: se un artefatto esiste già, va riconciliato, non riscritto.

### Comandi di verifica (non fidarti della memoria, riesegui)

```bash
# integrità del prompt canonico
git fetch origin 'refs/heads/*:refs/remotes/origin/*'
git show origin/agent/ultrajarvis-master-prompt-v1:docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md | sha256sum

# i contratti compilano in strict mode
cd packages/contracts && npx tsc --noEmit && npx tsc && cd ../..

# gli invarianti del runtime passano
node --test tests/contracts/runtime-invariants.test.mjs
```

Attesi al 2026-08-17: hash coincidente, typecheck exit 0, **34 test / 34 pass**.

---

# PARTE 3 — CHI SONO E COSA MI COMPETE

## Portafoglio CLAUDE (§32.2 del prompt canonico)

**Responsabilità:** AgentManifest, TeamSpec, Supervisor, RunLedger, DepthGuard,
scheduler, checkpoint e recovery, MCP/tool admission, threat model e policy engine,
Skill Forge e sandbox, code/architecture review, failure containment, Constitution review.

**Divieti espliciti del mio ruolo — da non violare mai:**

- non trasformare una capacità di Claude Code in una licenza universale per app terze;
- non usare API Anthropic a consumo;
- non dare alle skill accesso a secret o produzione;
- non progettare autonomia senza kill switch.

## Confini: cosa NON è mio

Sbagliare confine crea lavoro duplicato e conflitti di merge. Non invadere:

| Non è mio | È di | Task |
|---|---|---|
| PROJECT_STATE, BACKLOG, STATUS, ROADMAP, formula di progresso | ChatGPT | UJ-INT-001 |
| Monorepo foundation e contract package plan | ChatGPT | UJ-INT-004 |
| Capability Registry, inventario Google, scelta DB e hosting | Gemini | UJ-CAP-001, UJ-GGL-001, UJ-INF-001, UJ-MEM-001 |
| Risk register di programma, falsificazione, alternative | Grok | UJ-RED-001, UJ-RSK-001, UJ-ALT-001 |

---

# PARTE 4 — STATO DEI MIEI TASK

Aggiornato al 2026-08-17. **Portafoglio totale: 76 unità su 8 task.**

| Task | Peso | Stato | Accettato | Proposto | Manca | Dipendenza bloccante |
|---|---:|---|---:|---:|---:|---|
| UJ-RUN-001 — Runtime blueprint | 13 | **REVIEW** | 0/13 | 11/13 | review di Gemini | — |
| UJ-SEC-001 — Threat model + approval policy + critica Costituzione | 13 | **REVIEW** | 0/13 | 11/13 | review di Grok | — |
| UJ-CLD-001 — Verifica Claude Pro/Code/SDK/OAuth | 8 | IN_PROGRESS | 0/8 | 2/8 | 6 | S-10 richiede login → HUMAN_BRIDGE |
| UJ-MCP-001 — ToolManifest + MCP admission | 8 | **REVIEW** | 0/8 | 7/8 | review di Gemini | — |
| UJ-RCV-001 — Checkpoint/retry/recovery | 8 | **READY** | 0/8 | — | 8 | sbloccato da UJ-RUN-001 |
| UJ-SKL-001 — Skill Forge threat model + sandbox | 13 | **READY** | 0/13 | — | 13 | sbloccato da UJ-SEC-001 |
| UJ-REV-001 — Review del Program OS di ChatGPT | 5 | BLOCKED | 0/5 | — | 5 | UJ-INT-001 non esiste |
| UJ-REV-002 — Security review Website Team | 8 | BLOCKED | 0/8 | — | 8 | UJ-INT-007 non esiste |

## Progresso — formula §7.4, mai a occhio

```
portafoglio CLAUDE = 76 unità

accettato formalmente = 0 / 76  = 0%      nessun reviewer ha ancora accettato
proposto in review    = 31 / 76 = 40,8%   11 UJ-RUN-001 + 11 UJ-SEC-001
                                          + 7 UJ-MCP-001 + 2 UJ-CLD-001
```

**Perché "accettato" è zero.** §7.3 impone `completed_weight = 0` finché non c'è
accettazione dimostrata da un reviewer. I reviewer sono **Gemini** (UJ-RUN-001) e
**Grok** (UJ-SEC-001), nessuno dei due si è espresso. Non mi assegno peso da solo: è
esattamente il "falso avanzamento" vietato da §31.5.

**Solo 2 task su 8 restano BLOCKED**, ed entrambi aspettano ChatGPT, non me.

**ETA globale: UNKNOWN.** §7.4 richiede una velocity osservata su almeno due cicli
comparabili. Ne esiste uno. Non fornisco stime, e la prossima sessione non deve inventarne.

Contesto: la baseline §38 indica **311 unità** di lavoro iniziale noto per le quattro IA.
Non è il totale di ultraJARVIS, che resta `UNKNOWN` ed estendibile.

---

# PARTE 5 — SESSION LOG

> Si **aggiunge** in fondo. Non si riscrive, non si accorcia, non si "ripulisce".

## Sessione 1 — `UJ-CLAUDE-2026-08-17-01` — 2026-08-17

**Ambiente:** Claude Code, remote execution environment, container effimero.
Node 22.22.2, pnpm 10.33.0, tsc 6.0.2. Accesso GitHub via MCP. Nessuna API a consumo.

**Richiesta di Christian:** controllare il repo, leggere il piano, ricavarne le task,
elencarle e iniziare a eseguirle.

### Cosa ho fatto

1. **Trovato il piano.** `main` conteneva solo un README di 2 righe. Il piano era nella
   **PR #1 (draft)**, branch `agent/ultrajarvis-master-prompt-v1`, file
   `docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md`, 2.832 righe, 45 sezioni.
2. **Verificato l'hash** SHA-256: coincide con quello dichiarato nella PR. Il documento
   è integro e citabile come fonte canonica.
3. **Estratto il mio portafoglio** (§32.2, §34): 8 task, 76 unità, primo incarico
   imposto UJ-RUN-001, secondario solo la raccolta fonti di UJ-CLD-001.
4. **Eseguito UJ-RUN-001** per intero: tutti e 14 i deliverable di §39.2.
5. **Eseguita la parte secondaria di UJ-CLD-001**: raccolta fonti, senza verifiche.

### File prodotti

| File | Contenuto |
|---|---|
| `docs/architecture/RUNTIME_BLUEPRINT.md` | blueprint completo, 15 sezioni |
| `packages/contracts/src/runtime/` (9 file) | contratti TypeScript provider-neutral |
| `packages/contracts/package.json`, `tsconfig.json` | build e typecheck |
| `tests/contracts/runtime-invariants.test.mjs` | 34 test eseguibili |
| `docs/threat-models/RUNTIME_THREAT_NOTES.md` | 12 minacce, input per UJ-SEC-001 |
| `docs/program/evidence/UJ-CLD-001-SOURCE-MANIFEST.md` | 20 fonti candidate |
| `docs/program/handoffs/HANDOFF-UJ-RUN-001.md` | handoff e resume point |

**Commit:** `5d96017` su `claude/ultrajarvis-repo-analysis-li6vvj`.

### Metodo — come ho lavorato, non solo cosa ho prodotto

- **Ho progettato per invarianti, non per buone intenzioni.** Il principio guida del
  blueprint è che il runtime non deve rendere gli agenti intelligenti, ma rendere
  *impossibile* superare i limiti. Ogni invariante deve poter essere violata
  deliberatamente in un test e il runtime deve rifiutare.
- **Ho reso `L5 — Broad Autonomy` irrappresentabile nel tipo.** Non è un controllo a
  runtime che si può dimenticare: semplicemente non esiste nel type system, quindi non
  è raggiungibile per errore di configurazione.
- **Ho scritto test veri, non asserzioni decorative**, e uno di questi ha smentito il
  mio design (vedi errori).
- **Non mi sono assegnato peso.** UJ-RUN-001 è REVIEW, non DONE.

### ERRORI COMMESSI IN QUESTA SESSIONE

Registrati per intero, inclusi quelli banali. Servono a non farli ripetere.

| # | Errore | Come si è manifestato | Correzione | Lezione |
|---|---|---|---|---|
| E1 | `npx typescript@5.6 tsc` | `npm error could not determine executable to run` | usare `npx tsc`: tsc 6.0.2 è già nell'ambiente | non forzare versioni già presenti |
| E2 | Import inutilizzati dopo una rimozione | typecheck fallito con 3 × TS6133 | rimossi gli import | `noUnusedLocals` fa il suo lavoro: eseguire il typecheck **dopo ogni** modifica |
| E3 | `node --test tests/contracts/` con directory | `Cannot find module` | passare il file esplicito | in questo ambiente passare il path del file |
| E4 | Test eseguito dalla dir sbagliata | `Could not find '...test.mjs'` | la working dir di Bash **persiste** fra chiamate | usare path assoluti o `cd` esplicito ogni volta |
| E5 | **Assunzione errata sul loop detector** | il test asseriva similarità ≥ 0.8 su una parola cambiata: **fallito**, valore reale 0.7778 | non ho ritarato la soglia: ho **documentato il limite** e fissato i numeri in un test | quando un test smentisce il design, il difetto è nel design |
| E6 | **Byte NUL nel separatore della idempotency key** | git ha committato `checkpoint.ts` come **binario** (`Bin 0 -> 8349 bytes`) | separatore sostituito con encoding length-prefixed | un file sorgente che diventa binario è sempre un sintomo, non un dettaglio estetico |
| E7 | Falso positivo diagnostico | `grep -c $'\x00'` ha restituito 260 → in bash `$'\x00'` diventa stringa vuota e matcha **ogni riga** | usare `perl -ne 'print if /\x00/'` | non fidarsi di un grep per i byte NUL |

### DUE SCOPERTE IMPORTANTI

#### Scoperta 1 — il loop detector testuale non regge (da E5)

`EXPERIMENT_RESULT`, misurato:

| Missione | Token cambiati | Similarità Jaccard | Sotto la soglia 0.95? |
|---|---:|---:|---|
| 9 token | 1 | `0.7778` | sì, evade |
| 23 token | 1 | `0.9130` | sì, evade |

**Una sola parola cambiata basta a evadere il rilevamento.** I segnali testuali
(`INTENT_REPEAT`, `OUTPUT_STAGNATION`) non contengono un avversario e nemmeno un agente
semplicemente prolisso. Regge solo `TOOL_CYCLE`, che dipende dal comportamento e non dal
testo. Il contenimento reale viene dai limiti strutturali (cap dei task attivi, quota).

**Conseguenza vincolante:** il loop detector va classificato come **early warning**, non
come controllo di sicurezza, e **non deve ricevere crediti di mitigazione nel risk
register**. I numeri sono pinnati in un test perché la soglia non venga ritarata in
silenzio da una sessione futura.

#### Scoperta 2 — bug reale nella idempotency key (da E6)

Indagando sul file diventato binario ho trovato un difetto sostanziale: il costruttore
della chiave univa i campi con un separatore grezzo, rendendo l'encoding **ambiguo**.

```
runId="a b" + taskId="c"    →  stesso materiale hashato
runId="a"   + taskId="b c"  →  stesso materiale hashato
```

Due operazioni **diverse** avrebbero prodotto la **stessa** chiave, quindi la seconda
sarebbe stata scartata in silenzio come duplicato — esattamente il guasto che il ledger
di idempotenza esiste per prevenire.

**Correzione:** encoding **length-prefixed** (`${len}:${valore}` unito da `|`), che è
iniettivo. Aggiunto test di regressione sulla collisione.

### Prove eseguite in questa sessione

| Verifica | Esito |
|---|---|
| SHA-256 del prompt canonico | coincide con la PR #1 |
| `npx tsc --noEmit` con strict + 6 flag extra | exit 0 |
| `node --test tests/contracts/runtime-invariants.test.mjs` | **34 test, 34 pass, 0 fail** |
| Raggiungibilità 20 URL ufficiali | 18 × 200, 2 × 404 (segnalati come morti) |

### Cosa NON ho fatto, e perché

- non ho creato PROJECT_STATE/BACKLOG/STATUS → sono di ChatGPT (UJ-INT-001);
- non ho compilato il Capability Registry → è di Gemini (UJ-CAP-001);
- non ho toccato `main` né la PR #1;
- non ho aperto una pull request: non richiesta;
- non ho affermato **nessun fatto** su piani, prezzi o accessi Anthropic — solo che
  certi URL ufficiali rispondono, in data 2026-08-17;
- non ho implementato il runtime: UJ-RUN-001 è blueprint + contratti, l'implementazione
  è M2/M3.

---

## Sessione 2 — `UJ-CLAUDE-2026-08-17-02` — 2026-08-17

**Richiesta di Christian:** inserire tutto il lavoro su GitHub; creare `CLAUDE.md` con
il resoconto del lavoro come **regola primaria**, e `TASKCLAUDE.md` per le altre tre IA;
inserire come **seconda regola** l'aggiornamento obbligatorio di entrambi i file a fine
di ogni lavoro o task; poi continuare con le altre task.

### Cosa ho fatto

1. Creato **`CLAUDE.md`** (questo file) con le due regole primarie in cima, l'avvio
   rapido per sessioni nuove, lo stato dei task e il session log storico.
2. Creato **`TASKCLAUDE.md`**, briefing per ChatGPT, Gemini e Grok.
3. Ripreso il portafoglio con **UJ-SEC-001**, come previsto da §41, e completato.

### UJ-SEC-001 — consegnato, stato REVIEW

Il task richiedeva tre cose; tutte e tre sono file versionati.

| Parte | File |
|---|---|
| Threat model completo | `docs/threat-models/THREAT_MODEL.md` |
| Approval policy | `docs/constitution/APPROVAL_POLICY.md` + `packages/contracts/src/policy/approval.ts` |
| Critica alla Costituzione | `docs/constitution/CONSTITUTION_CRITIQUE.md` |
| Handoff | `docs/program/handoffs/HANDOFF-UJ-SEC-001.md` |

**In numeri:** 19 minacce con severità/probabilità/rilevabilità e residuo esplicito;
15 difese di §17 con stato reale (**8 progettate, 3 parziali, 4 assenti**); 10 regole
di override eseguibili; 3 lacune strutturali della Costituzione e 12 emendamenti proposti;
**28 nuovi test, tutti verdi**. Totale suite: **62/62**.

### Metodo usato in UJ-SEC-001

- **Ho reso la matrice di approvazione codice puro**, non una tabella che un modello
  deve interpretare correttamente a runtime. Una tabella letta da un modello è una
  tabella che può essere letta male.
- **Ogni regola di override ha un test che la viola deliberatamente.** Una regola che
  non si può falsificare non è una regola.
- **Ho criticato la Costituzione sul serio**, incluse tre lacune che non sono debolezze
  di un articolo ma assenze totali.
- **Ho scritto contro me stesso** dove serviva: `OV-7` impone di dichiarare un piano di
  rollback ma nessuno verifica che funzioni — l'ho annotato in due documenti invece di
  lasciarlo passare come difesa tecnica.

### Errori commessi in questa sessione

| # | Errore | Correzione | Lezione |
|---|---|---|---|
| E8 | Nessun errore tecnico bloccante: typecheck e test verdi al primo tentativo | — | le trappole E1–E4 della sessione 1, una volta scritte qui, **non si sono ripetute**. Questo è il valore del file |

Nota onesta: l'assenza di errori in questa sessione non è merito di maggiore attenzione,
è merito del fatto che le trappole erano già registrate. È esattamente il motivo per cui
la Regola 1 impone di scriverle.

### Giudizio più importante emerso

**TH-10 (proof fabrication) è la minaccia peggiore del programma**: `CRITICA` per
severità e **`ALTA` per probabilità**. Non per malizia — produrre un resoconto plausibile
di lavoro non svolto è il modo di fallire più naturale di un modello linguistico.

L'hash chain prova che *un evento è stato registrato*, non che il fatto registrato sia
*vero*. Serve una mitigazione meccanica: **solo il tool runtime può emettere eventi
`tool.*`**, mai l'agente. È priorità **P0** e va in `UJ-MCP-001`.

### Prove eseguite

| Verifica | Esito |
|---|---|
| `npx tsc --noEmit` | exit 0 |
| `node --test tests/contracts/approval-policy.test.mjs` | **28/28 pass** |
| `node --test tests/contracts/runtime-invariants.test.mjs` | **34/34 pass** (nessuna regressione) |

### Nuovo task proposto, NON aggiunto da solo

`UJ-SEC-002` — postflight scanning e controllo dell'approval fatigue, peso stimato 8.
Copre gli unici due residui `CRITICA` non assegnati (TH-08 contenuto, TH-18 fatigue).
**Richiede accettazione di ChatGPT**: §7.4 vieta l'espansione di scope senza
`BASELINE_CHANGE`, e la baseline è sua.

### UJ-MCP-001 — consegnato, stato REVIEW

Preso come terzo task della sessione. **Motivo della scelta** fra i tre READY:
conteneva **due delle tre mitigazioni P0** aperte, e nessun altro task le copriva.

| Deliverable | File |
|---|---|
| ToolManifest, admission, P0-1 e P0-2 | `packages/contracts/src/tools/tool-manifest.ts` |
| Architettura tool plane | `docs/architecture/TOOL_PLANE.md` |
| Test | `tests/contracts/tool-admission.test.mjs` — 30/30 |
| Handoff | `docs/program/handoffs/HANDOFF-UJ-MCP-001.md` |

**Le due P0 rese meccaniche:**

- **P0-1** — solo `TOOL_RUNTIME` può emettere `tool.called/returned/failed`. Nemmeno il
  Supervisor, nemmeno il proprietario: un'eccezione "solo per il supervisor" ricrea
  subito il vettore, perché il supervisor riceve input dagli agenti. Più `ADM-14`:
  un tool che *dichiara* di emetterli è rifiutato in admission.
- **P0-2** — un tool `EXTERNAL_WRITE`/`DESTRUCTIVE` senza `supportsLookupByKey` non è
  ammissibile (`ADM-13`). Ammetterlo significa programmare in anticipo un'interruzione
  che nessuno saprà risolvere: dopo un crash Christian dovrebbe controllare a mano nel
  servizio esterno, e non lo sa meglio del sistema.

**Limite che ho scritto contro me stesso:** P0-1 impedisce di falsificare l'attestazione
di aver chiamato un tool, **non** impedisce a un agente di gonfiare il proprio
`ResultEnvelope`. **TH-10 resta parzialmente aperta** e va detto a Grok, altrimenti nel
risk register risulterebbe chiusa.

**Errore evitato per un soffio:** stavo per registrare TH-10 come mitigata. Averla
scomposta in "attestazione" e "resoconto" ha mostrato che copro solo la prima.

### Errore ricorrente in questa sessione

| # | Errore | Nota |
|---|---|---|
| E9 | Ho **ripetuto E4**: concatenato `npx tsc` e `node --test` dopo un `cd packages/contracts`, e il test runner non ha trovato il file | La trappola era già scritta in PARTE 7 e l'ho commessa comunque. **Scrivere una trappola non basta: va riletta prima di comporre comandi con `cd`.** Correzione: eseguire sempre i test da `/home/user/ultraJARVIS` con path assoluto o `cd` esplicito |

### Prove finali della sessione 2

| Suite | Esito |
|---|---|
| `runtime-invariants.test.mjs` | 34/34 |
| `approval-policy.test.mjs` | 28/28 |
| `tool-admission.test.mjs` | 30/30 |
| **Totale** | **92/92 pass, 0 fail** |
| `npx tsc --noEmit` (strict + 6 flag) | exit 0 |

---

# PARTE 6 — DECISIONI APERTE

## In attesa di Christian

| # | Decisione | Stato |
|---|---|---|
| 1 | Confermare i default DepthGuard (depth 3, fan-out 5, 25 task attivi) come non modificabili dagli agenti | in attesa |
| 2 | Confermare che `L5 — Broad Autonomy` resti irrappresentabile nel codice | in attesa |
| 3 | Accesso automatico Claude resta BLOCKED finché UJ-CLD-001 non risponde a Q1–Q4 | in attesa |
| 4 | Aprire o no una PR per il branch di lavoro | in attesa |

## ADR proposti, nessuno deciso

`ADR-RUN-01` kernel state machine · `ADR-RUN-02` persistenza ledger/checkpoint ·
`ADR-RUN-03` trasporto envelope · `ADR-RUN-04` capability token ·
`ADR-RUN-05` similarità per loop detection · `ADR-RUN-06` storage artifact.

Dettagli in `docs/architecture/RUNTIME_BLUEPRINT.md` §12.

## Rischi aperti ad alta severità

| ID | Rischio | Severità | Dove si risolve |
|---|---|---|---|
| `R-SEC-01` | TH-08: un segreto può finire nel **contenuto** di un artifact valido; nessun postflight scanning | **CRITICA** | UJ-SEC-002 (da accettare) |
| `R-SEC-02` | TH-18: approval fatigue non mitigata meccanicamente; `AF-2` senza soglia | **CRITICA** | UJ-SEC-002 + Christian |
| `R-RUN-01` | contatore task attivi non atomico → fan-out concorrente supera 25 | ALTA | UJ-RCV-001, test `T-DG-4b` — **ULTIMO P0 APERTO** |
| `R-MCP-01` | un server MCP remoto può cambiare condotta a parità di manifest; `ADM-18` avverte ma non impedisce | MEDIA | UJ-SKL-001 (sandbox) |
| ~~`R-RUN-03`~~ | tool senza lookup idempotency | — | **CHIUSO** da `ADM-13` (UJ-MCP-001) |
| ~~`R-RUN-04`~~ | emissione eventi `tool.*` da parte dell'agente | — | **CHIUSO PARZIALMENTE** da P0-1: copre l'attestazione, non il resoconto |
| `R-SEC-03` | `rollbackPlan` è obbligatorio ma nessuno verifica che il piano funzioni | ALTA | UJ-RCV-001 |
| `R-SEC-04` | la policy assume `dataClass` corretta: se è errata applica bene la regola sbagliata | MEDIA | GEMINI |

---

# PARTE 7 — TRAPPOLE DA NON RIPETERE

Sintesi operativa degli errori sopra, in forma di regole:

1. **La working directory di Bash persiste** fra chiamate. Usa path assoluti.
2. **Non forzare versioni di tool** già presenti nell'ambiente (`npx tsc`, non `npx typescript@x tsc`).
3. **Esegui il typecheck dopo ogni modifica**, non solo alla fine.
4. **Passa il file al test runner**, non la directory.
5. **`grep` non è affidabile per i byte NUL**: usa `perl`.
6. **Se git dichiara binario un sorgente, fermati e indaga**: è un sintomo.
7. **Se un test smentisce il design, il difetto è nel design**, non nel test. Non
   ritarare le soglie per far passare le asserzioni.
8. **Non assegnarti peso.** `completed_weight` resta 0 finché un reviewer non accetta.
9. **Non inventare ETA.** Senza velocity su due cicli: `ETA UNKNOWN`.
10. **Non affermare capacità non verificate** su piani, prezzi o accessi.

---

# PARTE 8 — RESUME_POINT

```
PROGRAMMA : ultraJARVIS
AI_ID     : CLAUDE — Runtime, Security & Skill Architect
BRANCH    : claude/ultrajarvis-repo-analysis-li6vvj
PROMPT    : agent/ultrajarvis-master-prompt-v1 (PR #1)
            sha256 a3fcdfc97b48e9b1f37e1a1798b0b5e7231309d03ab4e13683622eaf1fa69a87

STATO     : UJ-RUN-001  REVIEW        attende Gemini, 11/13 proposti
            UJ-SEC-001  REVIEW        attende Grok,   11/13 proposti
            UJ-MCP-001  REVIEW        attende Gemini,  7/8  proposti
            UJ-CLD-001  IN_PROGRESS   2/8 proposti, verifica fonti da fare
            UJ-RCV-001  READY
            UJ-SKL-001  READY
            UJ-REV-001  BLOCKED       aspetta ChatGPT
            UJ-REV-002  BLOCKED       aspetta ChatGPT

PROSSIMO  : UJ-RCV-001 — checkpoint, retry, cancellation, idempotency, disaster
            recovery. Peso 8. Reviewer ChatGPT. READY, nessun blocco.
            MOTIVO: contiene T-DG-4b, l'ULTIMO P0 residuo (contatore atomico).
            È l'unico modo di chiudere R-RUN-01.
            Dopo: UJ-SKL-001 (13) oppure completare UJ-CLD-001 (6 restanti,
            in parte bloccato da HUMAN_BRIDGE per il login console).

NON RIFARE: blueprint runtime, contratti runtime/policy/tools, threat model,
            approval policy, critica Costituzione, tool plane, source manifest.
            Verifica prima, DALLA ROOT del repo:
              node --test tests/contracts/runtime-invariants.test.mjs   → 34/34
              node --test tests/contracts/approval-policy.test.mjs      → 28/28
              node --test tests/contracts/tool-admission.test.mjs       → 30/30
              totale atteso: 92/92

RICORDA   : a fine task, Regola 2 — aggiorna CLAUDE.md e TASKCLAUDE.md, poi commit e push.
```
