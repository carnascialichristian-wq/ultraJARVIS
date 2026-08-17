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
| Ultimo aggiornamento | 2026-08-17 — sessione `UJ-CLAUDE-2026-08-17-03` |

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

> Il prompt che Christian incolla per aprire una sessione nuova è in
> **`AVVIO_NUOVA_SESSIONE.md`** alla root. Se cambia qualcosa in questa procedura —
> l'hash del piano, il comando dei test, il branch — va aggiornato **anche lì**,
> altrimenti la prossima sessione parte con istruzioni stantie.

**Non ripartire da zero. Non rifare lavoro già fatto.** Prima di produrre qualcosa,
controlla la tabella di stato: se un artefatto esiste già, va riconciliato, non riscritto.

### Comandi di verifica (non fidarti della memoria, riesegui)

```bash
# integrità del prompt canonico
git fetch origin 'refs/heads/*:refs/remotes/origin/*'
git show origin/agent/ultrajarvis-master-prompt-v1:docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md | sha256sum

# i contratti compilano in strict mode
npx tsc -p packages/contracts --noEmit

# tutte le suite passano — ESEGUI DALLA ROOT del repo
npx tsc -p packages/contracts
for f in tests/contracts/*.test.mjs; do node --test "$f"; done
```

Attesi al 2026-08-17: hash coincidente, typecheck exit 0, **138 test / 138 pass**
(runtime 34 · policy 28 · tools 30 · recovery 9 · skills 37).

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
| UJ-CLD-001 — Verifica Claude Pro/Code/SDK/OAuth | 8 | **REVIEW** | 0/8 | 7/8 | 1 | S-10 richiede login → HUMAN_BRIDGE |
| UJ-MCP-001 — ToolManifest + MCP admission | 8 | **REVIEW** | 0/8 | 7/8 | review di Gemini | — |
| UJ-RCV-001 — Checkpoint/retry/recovery | 8 | **REVIEW** | 0/8 | 6/8 | review di ChatGPT | — |
| UJ-SKL-001 — Skill Forge threat model + sandbox | 13 | **REVIEW** | 0/13 | 11/13 | review di ChatGPT | — |
| UJ-REV-001 — Review del Program OS di ChatGPT | 5 | **REVIEW** | 0/5 | 4/5 | review di Christian | — (sbloccato: UJ-INT-001 esiste) |
| UJ-REV-002 — Security review Website Team | 8 | BLOCKED | 0/8 | — | 8 | UJ-INT-007 non esiste |

## Progresso — formula §7.4, mai a occhio

```
portafoglio CLAUDE = 76 unità

accettato formalmente = 0 / 76  = 0%      nessun reviewer ha ancora accettato
proposto in review    = 57 / 76 = 75,0%   11 UJ-RUN-001 + 11 UJ-SEC-001
                                          + 11 UJ-SKL-001 + 7 UJ-MCP-001
                                          + 7 UJ-CLD-001 + 6 UJ-RCV-001
                                          + 4 UJ-REV-001  (sessione 3)
```

Ricalcolo di fine sessione 3: `53 + 4 = 57`. Le 4 unità di UJ-REV-001 coprono AC-01
(la review esiste e rispetta l'output contract); **la quinta resta a Christian**, che è
il reviewer designato del task e non si è ancora espresso.

**7 task su 8 sono ora in REVIEW.** L'unico ancora fermo è UJ-REV-002 (peso 8), che
aspetta `UJ-INT-007` da ChatGPT — non ancora esistente, verificato al ref `31f31b99`.

**IL PORTAFOGLIO È ESAURITO.** 6 task su 8 sono in REVIEW. Restano:
- 1 unità di UJ-CLD-001, che richiede un HUMAN_BRIDGE con Christian (billing account);
- UJ-REV-001 e UJ-REV-002 (13 unità), bloccati da deliverable di ChatGPT che non esistono.

**Non c'è altro lavoro che io possa iniziare in autonomia.** Se una sessione futura non
trova nuovi input, la risposta corretta è registrare l'attesa, NON inventare lavoro.

> **AGGIORNAMENTO sessione 3 (2026-08-17).** Le due righe qui sopra erano vere quando
> sono state scritte e **non lo sono più**. ChatGPT ha pushato UJ-INT-001 e UJ-INT-006
> lo stesso giorno, fra le 09:44 e le 11:27. Conseguenze:
>
> - **UJ-REV-001 non è più bloccato di fatto**: il suo blocker era *"UJ-INT-001 non
>   esiste"*, e ora esiste (`8f31a37`). Resta `BLOCKED` in `BACKLOG.json` perché ChatGPT
>   non ha rigenerato lo snapshot, ma il blocco è formale, non reale;
> - è comparso un **dovere da reviewer** che non è nel mio portafoglio: `UJ-INT-006`
>   (owner ChatGPT, peso 8) è in `REVIEW` con **CLAUDE reviewer canonico**, con richiesta
>   esplicita in `prompts/review-requests/UJ-INT-006-CLAUDE.md`. **Consegnato in questa
>   sessione**, esito `PASS_WITH_ACTIONS`.
>
> Il peso 8 di UJ-INT-006 è di **ChatGPT**, non mio: fare da reviewer non aggiunge unità
> al mio portafoglio, che resta 76. La lezione operativa è nella §"trappole": *prima di
> registrare l'attesa, verifica se qualcuno ha consegnato*.

## Doveri da reviewer (non fanno parte delle 76 unità)

| Task | Owner | Peso | Stato | Mio esito |
|---|---|---:|---|---|
| UJ-INT-006 — Council packet schemas | CHATGPT | 8 | REVIEW | **PASS_WITH_ACTIONS**, 0/8, sessione 3 |
| UJ-INT-002, UJ-INT-004 | CHATGPT | 13, 8 | BLOCKED | non ancora consegnati |
| UJ-CAP-001, UJ-MEM-001, UJ-ADK-001 | GEMINI | 13, 13, 8 | READY/BLOCKED | non ancora consegnati |
| UJ-RSK-001, UJ-ALT-001 | GROK | 8, 8 | BLOCKED | non ancora consegnati |

**Tutti e tre i P0 del programma sono chiusi.** Restano due `CRITICA` (`R-SEC-01`,
`R-SEC-02`) che richiedono `UJ-SEC-002`, non ancora accettato da ChatGPT.

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

### UJ-RCV-001 — consegnato, stato REVIEW. **Ultimo P0 chiuso.**

| Deliverable | File |
|---|---|
| Contatore atomico + CAS | `packages/contracts/src/recovery/active-task-counter.ts` |
| Runbook di ripresa | `docs/runbooks/DISASTER_RECOVERY.md` |
| Test `T-DG-4b` | `tests/contracts/recovery.test.mjs` — 9/9 |
| Handoff | `docs/program/handoffs/HANDOFF-UJ-RCV-001.md` |

**`R-RUN-01` chiuso.** Non descrivendolo: ho scritto **prima il test che dimostra che
il bug esiste**, poi la correzione. Con 20 task attivi e 10 spawn concorrenti:

| Contatore | Ammessi | Contatore finale | Realtà |
|---|---:|---:|---|
| Ingenuo (`leggi → await → scrivi`) | **10** | **21** | 30 attivi |
| Atomico | **5** | 25 | 25 attivi |

Il danno è doppio e la seconda metà è peggiore: tutti scrivono `osservato + 1` dalla
stessa lettura stantia, quindi **9 incrementi su 10 vanno persi**. Il contatore segna 21
mentre i task attivi sono 30, e da lì **ogni ammissione successiva viene giudicata su un
dato falso**. Non è un problema di prestazioni sotto carico: corrompe permanentemente lo
stato su cui poggia l'unico limite che regge davvero.

**Regola in una frase:** fra il controllo del limite e l'incremento non deve esistere un
`await`. Su database, serve un update condizionale, non `SELECT` + `UPDATE`.

**Scelta deliberata:** ho lasciato `NaiveActiveTaskCounter` nel repository, marcato
"WRONG ON PURPOSE" e mai cablato. Una correzione dimostrata contro nessun fallimento non
dimostra nulla; e se un domani qualcuno "semplificasse" il contatore rendendolo asincrono
fra check e incremento, quei due test sono la spiegazione già scritta del perché non si può.

### Prove finali della sessione 2

| Suite | Esito |
|---|---|
| `runtime-invariants.test.mjs` | 34/34 |
| `approval-policy.test.mjs` | 28/28 |
| `tool-admission.test.mjs` | 30/30 |
| `recovery.test.mjs` | 9/9 |
| `skill-forge.test.mjs` | 37/37 |
| **Totale** | **138/138 pass, 0 fail** |
| `npx tsc --noEmit` (strict + 6 flag) | exit 0 |

### UJ-SKL-001 — consegnato, stato REVIEW. Portafoglio esaurito.

| Deliverable | File |
|---|---|
| Threat model, pipeline 14 stadi, sandbox | `docs/architecture/SKILL_FORGE.md` |
| Recipe + Skill Forge | `packages/contracts/src/skills/` |
| Test | `tests/contracts/skill-forge.test.mjs` — 37/37 |
| Handoff | `docs/program/handoffs/HANDOFF-UJ-SKL-001.md` |

**Proprietà centrale resa meccanica:** una skill non può avanzare il proprio stadio,
firmarsi o ampliare il proprio scope. È l'analogo di P0-1: **chi beneficia di una
decisione non è mai chi la registra**. Più il dettaglio che uscire da `HUMAN_REVIEW`
richiede un attore **umano** — un registrar che potesse firmare il gate umano lo
renderebbe cerimoniale.

**Due risultati onesti, entrambi da non dimenticare:**

- **`TH-SF-06`** — il sandbox osserva il comportamento *in condizioni di sandbox*.
  Codice che rilevi di essere osservato può comportarsi bene nel test e diversamente
  dopo: basta un `if` su una variabile d'ambiente. **Nessun sandbox migliore lo
  risolve** — renderlo indistinguibile dalla produzione significa dargli credenziali
  vere, cioè eliminarlo. Il sistema regge perché il contenimento viene dal **runtime**:
  una skill non può chiamare un tool che non possiede, qualunque cosa il suo codice
  voglia. Il sandbox è una rete contro l'errore, **non una prova contro l'intenzione**.
- **`TH-SF-03`** — la pipeline verifica **come** è fatto il codice, non **perché**
  esiste. Se l'intent proviene da contenuto non fidato, la forge produrrà una skill
  pulita, testata e firmata che fa esattamente la cosa sbagliata, con tutti i gate
  verdi. Difesa proposta (vincolare l'intent a `originLabel` fidata) **non implementata**:
  cambia il contratto e preferisco farla passare da review.

**`R-MCP-01` NON è chiuso da questo task**, contrariamente a quanto mi aspettavo: un
server MCP remoto non gira nel nostro sandbox, gira a casa loro. Serve monitoraggio
comportamentale → proposto `UJ-MCP-002` (peso 5), non aggiunto alla baseline da solo.

**Errori in questa parte:** nessuno tecnico. Typecheck e 37 test verdi al primo
tentativo. Ho evitato l'errore di *concetto* più probabile — dare per chiuso `R-MCP-01`
perché "ora c'è il sandbox" — scomponendo il caso in "codice nostro" e "servizio di
terzi" prima di scrivere la conclusione.

### UJ-CLD-001 — completato, stato REVIEW. **Risultato che cambia il piano.**

Deliverable: `docs/program/evidence/UJ-CLD-001-CAPABILITY-RECORDS.md`.
Metodo: lettura **diretta** delle fonti primarie, non citazione a memoria.

**`VERIFIED_FACT`, con citazione:**

> *"Unless previously approved, Anthropic does not allow third party developers to offer
> claude.ai login or rate limits for their products, including agents built on the Claude
> Agent SDK. Use the API key authentication methods described in the Quickstart instead."*
> — `code.claude.com/docs/en/agent-sdk/overview`, letto 2026-08-17

**Conseguenza per il programma:**

| Percorso | Verdetto |
|---|---|
| ultraJARVIS come app autonoma su Agent SDK | ❌ `PAID_ONLY_DISABLED` — richiede chiave API = pay-per-token = Articolo 5 |
| ultraJARVIS che automatizza la UI di Claude.ai | ❌ `UNAVAILABLE` — i termini consumer vietano l'accesso "attraverso mezzi automatizzati o non umani" |
| Christian che usa Claude di persona | ✅ `HUMAN_BRIDGE` — **unico percorso a costo zero** |

**Per Claude, `HUMAN_BRIDGE` non è un ripiego temporaneo: è la modalità definitiva**
finché il budget resta zero. La review focus n. 3 della PR #1 chiedeva di tenere
l'accesso automatico BLOCKED finché non verificato: ora è verificato, e la risposta non
è "sbloccalo", è che il percorso automatico non esiste a costo zero.

Gate §6.2 su CAP-CLD-002: **4 condizioni negative su 10**. Verdetto definitivo.

**Il divieto del mio ruolo era una regola scritta, non una cautela.** §32.2 mi vieta di
"trasformare una capacità Claude Code in una licenza universale per app terze". Ho
scoperto che è esattamente ciò che la documentazione ufficiale vieta. Se avessi
progettato assumendo il contrario, il programma avrebbe poggiato su un accesso inesistente.

**`CLD-1` — controllo operativo per Christian:** in Claude Code, al raggiungimento del
limite viene proposto di abilitare crediti API a tariffe API standard. **È l'unico modo
in cui questo programma può generare un addebito.** La risposta è sempre **no**, salvo
decisione esplicita e registrata. Raggiungere il limite è un `BLOCKED` legittimo, non un
problema da risolvere spendendo.

**Scoperta secondaria — le fonti si spostano in tempo reale.** L'URL dell'Agent SDK
registrato **ieri** nel manifest ha prodotto due redirect consecutivi:
`docs.claude.com` → 301 → `platform.claude.com` → 307 → `code.claude.com`.
Sommato ai due 404 già trovati: **3 URL ufficiali instabili su 20 in 24 ore.** È la
prova empirica del perché §4.1 punto 5 vieta di congelare URL e limiti nel codice.

**Conferma di progetto:** il campo `QuotaCounter.source` che avevo definito con i valori
`PROVIDER_COUNTER | OBSERVED_THRESHOLD | UNKNOWN` si è rivelato necessario — Claude non
espone il residuo programmaticamente, solo via `/status` interattivo. Il contratto non ha
dovuto cambiare, ed è una conferma che vale più di una previsione azzeccata.

**Errori:** nessuno. Ma segnalo un rischio evitato: la tentazione di rispondere a Q1–Q10
a memoria invece di leggere le fonti. Avrei sbagliato, perché il dominio della
documentazione era cambiato da meno di 24 ore.

---

## Sessione 3 — `UJ-CLAUDE-2026-08-17-03` — 2026-08-17

**Richiesta di Christian:** aprire il repo, leggere CLAUDE.md e TASKCLAUDE.md, verificare
l'integrità del piano canonico, rileggere l'ultimo handoff, **rieseguire le prove invece di
fidarsi**, e prendere il task indicato nel RESUME_POINT. Premessa dichiarata: *"il
portafoglio è esaurito, se non ci sono input nuovi registra l'attesa"*.

### Il risultato più importante: la premessa era superata

Le prove sono state rieseguite tutte e sono tutte verdi (sotto). Ma la parte utile della
sessione è stata **non fermarsi lì**.

Il RESUME_POINT condiziona "registra l'attesa" a *"se non ci sono input nuovi"*. Prima di
applicare quella conclusione ho controllato se ce ne fossero, ed erano arrivati **quel
giorno stesso**: ChatGPT aveva pushato 8 commit su `agent/ultrajarvis-master-prompt-v1`
fra le 09:44 e le 11:27, fra cui `UJ-INT-001` (Program OS v0.1) e `UJ-INT-006` (Council
packet layer), più **una richiesta di review indirizzata a me**,
`prompts/review-requests/UJ-INT-006-CLAUDE.md`.

**Se avessi applicato il RESUME_POINT alla lettera, avrei registrato un'attesa mentre un
task aspettava proprio me.** È l'errore che questa sessione ha evitato, ed è la ragione per
cui la nuova trappola n. 11 dice di verificare i branch altrui *prima* di dichiarare
un'attesa.

### Cosa ho fatto

1. **Verificato l'integrità del piano canonico**: SHA-256 coincidente.
2. **Rieseguito tutte le prove** dalla root: typecheck e 138 test.
3. **Scoperto lo stato reale** dei branch e delle PR (vedi sopra).
4. **Eseguito la review di UJ-INT-006** come reviewer canonico, con verdetto
   `PASS_WITH_ACTIONS` e **peso 0/8**.

### File prodotti

| File | Contenuto |
|---|---|
| `docs/program/reviews/UJ-REVIEW-INT-006-CLAUDE.json` | ReviewResult conforme allo schema, 18 artefatti con hash reale, 6 findings |
| `docs/program/reviews/UJ-INT-006-CLAUDE-FINDINGS.md` | review estesa, con i due difetti dimostrati |
| `docs/program/reviews/UJ-INT-006-CLAUDE-APPEND-BLOCKS.md` | blocchi per `gpt.md`/`taskgpt.md`, da pubblicare via HUMAN_BRIDGE |

### Metodo — come ho revisionato

- **Ho eseguito i validatori di ChatGPT prima di leggere il codice**, per non farmi
  influenzare da ciò che mi aspettavo di trovare. Tutti e tre PASS.
- **Ho costruito una suite avversariale di 20 candidati** invece di ispezionare a occhio:
  autoreview dell'owner, peso parziale, FAIL con assegnazione di peso, commit stantio,
  path escape, hash mismatch, criteri omessi/duplicati/sconosciuti, `NOT_APPLICABLE` con
  PASS, `artifacts_reviewed` vuoto, e infine la review vuota. **19 respinti su 20.**
- **Ho validato il mio stesso ReviewResult con il validatore di ChatGPT** prima di
  consegnarlo: `--review-result … --expected-commit …` → PASS. Non dichiaro conforme
  qualcosa che non ho fatto passare dal gate.
- **Ho citato solo artefatti che ho davvero aperto o eseguito**, 18, ognuno con SHA-256
  calcolato dal worktree al ref verificato — e ho scritto nella review §10 l'elenco di ciò
  che **non** ho revisionato. Dato che il mio finding principale è proprio sulle prove
  vuote, citare file non letti avrebbe invalidato la review mentre la scrivevo.

### Il difetto principale trovato — F-001

Ho costruito un `ReviewResult` che cita **solo `README.md`**, file estraneo al task, con
`evidence_refs` `"trust me"` / `"looks fine"` / `"."` e `findings: []`, e che assegna
**8 unità su 8** proponendo `DONE`.

**Il validatore lo accetta.**

L'intake verifica che l'hash di ogni artefatto citato sia autentico, ma non impone mai che
gli artefatti citati **c'entrino col task**: i 12 `proof_refs` di AC-01 non sono richiesti,
e gli `evidence_refs` sono stringhe libere controllate solo per lunghezza.

**È TH-10 — proof fabrication — del mio threat model, ricomparsa nel layer di ChatGPT.**
L'avevo classificata `CRITICA`/`ALTA` e la ragione era esattamente questa: non serve
malizia, basta un resoconto plausibile. Qui il resoconto plausibile supera il gate e muove
il ledger.

### Il secondo difetto — F-002

`COUNCIL_IMPORT_AND_MERGE.md` stage 5 impone no-op sul replay esatto e `REPLAY_DIVERGENCE`
sul divergente, e prescrive uno store `(packet_id, idempotency_key, sha256, received_at,
disposition)`. Il validatore è **stateless**. Dimostrato: stesso `review_id` con byte
diversi → **passa** invece di essere rifiutato come manomissione.

Conta come `FAIL` di AC-02 e non come semplice rilievo perché il testo del criterio nomina
"replay" fra le regressioni coperte.

### ERRORI COMMESSI IN QUESTA SESSIONE

| # | Errore | Come si è manifestato | Correzione | Lezione |
|---|---|---|---|---|
| E10 | **Ripetuto E4 in forma nuova**: `require("schemas/x.json")` con path relativo dopo un `cd` | `Cannot find module` su tutti e 7 gli schemi | path assoluti passati via `process.argv` | la trappola n. 1 vale anche per `require`, non solo per il test runner. L'ambiente **resetta la cwd** fra le chiamate, e lo dichiara nell'output |
| E11 | **Test di replay invalido**: avevo messo `next_action: "n"` | tutti e 3 i casi FAIL, ma per `string is too short`, non per il replay | payload valido, test rieseguito | **un test che fallisce per il motivo sbagliato è un falso negativo**: stavo per concludere che il replay fosse gestito. Verificare *perché* fallisce, non solo *che* fallisce |

E11 è l'errore più istruttivo della sessione: mi avrebbe fatto scrivere il contrario del
vero su F-002. È la stessa classe di E7 della sessione 1 (falso positivo diagnostico), in
direzione opposta.

### Prove eseguite

| Verifica | Comando | Esito |
|---|---|---|
| Integrità piano canonico | `git show …:docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md \| sha256sum` | `a3fcdfc9…a69a87` **coincide** |
| Typecheck | `npx tsc -p packages/contracts --noEmit` | **exit 0** |
| Build | `npx tsc -p packages/contracts` | **exit 0** |
| Suite completa | `for f in tests/contracts/*.test.mjs; do node --test "$f"; done` | **138/138 pass, 0 fail** |
| Validatore Council (ref `31f31b99`) | `node scripts/validate-council-packets.mjs` | PASS |
| Validatore Program OS | `node scripts/validate-program-os.mjs` | PASS |
| Intake regression | `node scripts/test-review-result-intake.mjs` | PASS, 7 casi |
| Suite avversariale mia | 20 candidati | **19 respinti, 1 ammesso → F-001** |
| Il mio ReviewResult | `--review-result … --expected-commit …` | **PASS** |

Dettaglio suite: runtime 34 · policy 28 · tools 30 · recovery 9 · skills 37.

### Cosa NON ho fatto, e perché

- **non ho scritto `gpt.md`, `taskgpt.md`, `BACKLOG.json`** né alcun file su
  `agent/ultrajarvis-master-prompt-v1`: sono di ChatGPT, e su un branch non mio. I blocchi
  di append sono pronti per HUMAN_BRIDGE;
- **non ho assegnato peso a UJ-INT-006**, benché il validatore avrebbe accettato 8/8 con
  `DONE` — l'ho dimostrato attaccandolo. Due criteri su tre non sono pienamente
  soddisfatti;
- **non mi sono assegnato peso** per la review: il peso 8 è di ChatGPT;
- non ho preso UJ-REV-001 in questa sessione, pur essendo ora lavorabile: la review di
  UJ-INT-006 era esplicitamente richiesta e bloccava un altro portafoglio;
- non ho commentato la PR #1 né aperto PR: azioni verso l'esterno non autorizzate.

### Decisione lasciata aperta *(risolta più avanti nella stessa sessione)*

`UJ-REV-001` è **lavorabile adesso** (UJ-INT-001 esiste). Non l'ho preso subito per non
sovrapporlo alla review appena consegnata e perché il RESUME_POINT andava aggiornato prima.

→ **Preso ed eseguito nella stessa sessione**, su istruzione di Christian *"CONTINUA IL TUO
LAVORO"*. Vedi sotto.

---

## Sessione 3, seconda parte — UJ-REV-001 consegnato, stato REVIEW

**Controllo preliminare (trappola 11, applicata):** `git fetch` di tutti i branch prima di
iniziare. Nessuna nuova consegna: il branch di ChatGPT era fermo a `31f31b9`, nessun branch
di Gemini o Grok esiste. Questa volta l'attesa *sarebbe* stata la risposta corretta per gli
altri — ma UJ-REV-001 era mio e lavorabile.

### File prodotti

| File | Contenuto |
|---|---|
| `docs/program/reviews/UJ-REV-001-PROGRAM-OS-REVIEW.md` | review completa, 11 sezioni, 6 findings |
| `docs/program/reviews/UJ-REV-001-CLAUDE-REVIEWRESULT-CANDIDATE.json` | packet in forma `ReviewResult`, **non importabile** — vedi F-003 |

**Esito: `PASS_WITH_ACTIONS`.** Peso proposto per UJ-INT-001: **0/13 invariato** — non sono
io il reviewer canonico (è Grok), quindi la mia review non muove il suo ledger.

### Metodo — cosa ho fatto di diverso da una lettura

Un Program OS si revisiona **ricalcolando il ledger**, non ammirando la prosa. Ho
ri-derivato in modo indipendente, senza fidarmi del validatore:

- somma dei pesi per `task_ids` di ogni baseline vs `declared_weight` → **3 su 3 esatte**;
- `remaining_weight == weight − completed_weight` su tutti i 43 task → **43 su 43**;
- risoluzione di ogni dipendenza + DFS per i cicli → **nessuna rotta, nessun ciclo**;
- task fuori da ogni baseline → **9, tutti `PROPOSED` e di peso 0**. Lo scope proposto non
  gonfia il denominatore: è la disciplina promessa in PROGRESS.md §5, applicata davvero.

**L'aritmetica di ChatGPT è corretta.** Il difetto non era nei numeri, era in **una regola
violata dai numeri**.

### I due difetti che bloccano il PASS

**F-001 — l'unico peso parziale del ledger è vietato dal sistema stesso.**
`UJ-META-002` porta **5/8** con **1 criterio su 3** passato. Ma:
- `PROGRESS.md` regola 3 impone tutto-o-niente **senza una mappatura di sottocriteri**, e
  ho cercato quella mappatura in tutto `BACKLOG.json`: **zero occorrenze**;
- `validate-council-packets.mjs` riga 388 **rifiuterebbe** un `ReviewResult` che proponga
  5/8.

Il ledger contiene un valore che il gate del programma non può produrre né riprodurre.
Effetto misurato: `meta-bootstrap` passa da **89,66% a 72,41%** (−17,24 punti) applicando
la regola scritta accanto.

**F-002 — la difesa anti-gaming non può girare prima di ciò che deve controllare.**
`PROGRESS.md` riga 93: *"Grok UJ-REV-004 challenges the formula and examples **before
acceptance**"*. `BACKLOG.json`: `UJ-REV-004` è `BLOCKED` con causa *"Required dependency is
not accepted: UJ-INT-001"*. **La review che deve precedere l'accettazione è bloccata fino
all'accettazione.**

Vale identicamente per il task che stavo eseguendo: `UJ-REV-001` era formalmente `BLOCKED`
per la stessa causa. **L'ho eseguito perché ho verificato che l'artefatto esiste, non
perché il backlog lo consentisse** — e questo è esattamente il punto della trappola 11.

### F-003 — il mio deliverable non è rappresentabile, dimostrato

`UJ-REV-001` deve produrre *"a review of UJ-INT-001"*. Ho costruito il `ReviewResult` e
l'ho sottoposto all'intake:

```
Council packet validation: FAIL
- candidates/rev001.json reviewer must be GROK.
```

Due task dello stesso `BACKLOG.json` sono **mutuamente incoerenti**: uno mi incarica di
revisionare UJ-INT-001, l'altro rifiuta per costruzione ogni review non firmata GROK.
Per questo il deliverable è Markdown e il JSON è marcato **candidato non importabile**:
consegnarlo come `ReviewResult` valido sarebbe una dichiarazione falsa.

### Ho scritto contro me stesso, di nuovo

**F-005** riguarda in parte me. Il ledger non vede i miei 6 task consegnati, e una delle
due cause è mia: `GOVERNANCE.md` prescrive branch `agent/<task-id>-<slug>`, e il mio si
chiama `claude/ultrajarvis-repo-analysis-li6vvj`. **Un branch fuori pattern è un branch
che l'integratore non pensa di guardare.** L'ho scritto nella review invece di attribuire
tutta la causa a ChatGPT.

### Errori commessi in questa parte

| # | Errore | Nota |
|---|---|---|
| E12 | Nessun errore tecnico. Ma segnalo un **errore di concetto evitato**: stavo per marcare AC-01 di UJ-INT-001 come `PASS` verificato da me. **Non l'ho verificato io**: l'esistenza dei dodici gruppi di deliverable l'ha confermata il validatore, e io non ho letto integralmente 8 dei documenti. L'ho scritto nella nota del criterio e in §10. Dopo aver contestato a ChatGPT le prove insufficienti (F-001 di UJ-INT-006), citare documenti non letti sarebbe stato lo stesso difetto commesso mentre lo si denuncia |

### Prove eseguite

| Verifica | Esito |
|---|---|
| `node scripts/validate-program-os.mjs` al ref `31f31b99` | **PASS** — 43 task, peso 311 |
| Riconciliazione delle 3 baseline (mia, indipendente) | **3 su 3 esatte** |
| Coerenza `remaining_weight` su 43 task | **43 su 43** |
| Integrità dipendenze + ricerca cicli | **nessuna rotta, nessun ciclo** |
| Rifiuto del mio ReviewResult (F-003) | **riproducibile**: *"reviewer must be GROK"* |
| Suite contratti dopo le modifiche | **138/138**, typecheck exit 0 |

---

## Sessione 3, terza parte — pubblicazione su `main`

**Richiesta di Christian:** *"pubblica sulla repo di git la roba che hai fatto mica sul
branch"*, poi scelta esplicita **"mergio entrambe adesso"** (PR #1 e PR #2).

### Cosa ho trovato, che non era quello che mi aspettavo

Mentre lavoravo, **`main` è avanzato moltissimo per mano di altri**: da 1 file (solo
README) a un'implementazione Python completa — `bin/uj`, `core/`, `tools/`, advisors —
pubblicata da Grok, più il commit `bb51093 "Merge Claude repo analysis into main"`.

**Il mio lavoro era già su `main`**: `bb51093` aveva mergiato `eaa7a51`, incluse entrambe
le review di questa sessione. Quello che mancava davvero era **il piano canonico e il
Program OS di ChatGPT** (PR #1), che era ancora solo sul branch draft.

Quindi il merge utile era uno solo, non due.

### Errore commesso, e come si è manifestato

| # | Errore | Come si è manifestato | Correzione | Lezione |
|---|---|---|---|---|
| E13 | **`git push … \| tail -3` maschera l'exit code**: la pipe restituisce l'exit di `tail`, non di `git push` | ho dichiarato **"PUSH main OK"** mentre il push era stato **rifiutato** (`main` remoto era avanzato). Christian ha dovuto dire "Riprova" | catturare l'output in una variabile e testare `$?` di `git push`, mai attraverso una pipe | **è un'auto-attestazione falsa di successo — la stessa classe di TH-10 che sto contestando agli altri.** Una pipeline di verifica che non può fallire non verifica |

E13 è grave nel merito, non nella forma: ho **dichiarato riuscita un'operazione fallita**.
Il fatto che l'abbia fatto un bug di shell e non una scelta non cambia l'effetto, ed è
esattamente ciò che F-001 di UJ-INT-006 descrive.

### Come ho risolto i conflitti (tre file, tutti non miei)

`main` e PR #1 divergevano su `README.md`, `gpt.md`, `taskgpt.md`.

- **`gpt.md` e `taskgpt.md`** → tenuta la versione di `main`. **Non a occhio:** ho
  verificato prima che fosse un **superset stretto**, cioè che zero righe presenti sul
  branch PR #1 mancassero da `main`. Nessuna riga della memoria di ChatGPT è andata persa.
- **`README.md`** → **divergenza vera**: su `main` c'era il README dell'implementazione
  Grok, su PR #1 quello del programma col link al prompt canonico. **Nessuno dei due
  conteneva l'altro.** Li ho **uniti entrambi** come sezioni invece di scegliere un
  vincitore, perché `COUNCIL_IMPORT_AND_MERGE.md` vieta di risolvere una contraddizione
  per media silenziosa. Ho lasciato una nota di merge nel file.

### Prove eseguite sull'albero mergiato, PRIMA del commit

| Verifica | Esito |
|---|---|
| Suite contratti | **138/138 pass, 0 fail** |
| `npx tsc -p packages/contracts --noEmit` | **exit 0** |
| `node scripts/validate-program-os.mjs` | **PASS** — 43 task, peso 311 |
| `node scripts/validate-council-packets.mjs` | **PASS** |
| `node scripts/test-review-result-intake.mjs` | **PASS**, 7 casi |
| Hash del piano canonico dopo il merge | `a3fcdfc9…a69a87` **invariato** |

**Commit `99dece5` su `main`, push riuscito** (exit code verificato davvero, vedi E13).
`main` passa da 1 a **114 file**.

### Quello che il merge NON cambia

**Pubblicare non è accettare.** Nessun valore del ledger si muove: `UJ-INT-001` resta
**0/13**, `UJ-INT-006` resta **0/8**, il mio portafoglio resta **0/76 accettato**.
`GOVERNANCE.md` dice che `main` rappresenta lo stato accettato del programma: da oggi non
è più vero alla lettera, ed è una conseguenza della decisione del proprietario, non un
errore. Va però saputa, perché un lettore futuro potrebbe leggere la presenza su `main`
come accettazione.

### FATTO NUOVO — Grok ha consegnato

È comparso il branch **`agent/uj-red-001-grok-v8-snapshot`** (`97f7f06`), con
`UJ-RED-001 archive Grok v8 source snapshot`. **Non è su `main`** e **non l'ho mergiato**:
Christian ha autorizzato PR #1 e PR #2, non questo.

**Non sono io il reviewer di UJ-RED-001: è CHATGPT** (verificato in `BACKLOG.json`, non
assunto). Nessun dovere da reviewer per me.

**Avvertenza per chi lo mergerà:** quel branch parte da `31f31b9`, cioè dal branch di
ChatGPT, e **non contiene il mio lavoro né l'implementazione Python già su `main`**. Un
merge a tre vie è sicuro; una risoluzione "prendi il loro" o un reset cancellerebbe 12.764
righe, fra cui `tests/contracts/tool-admission.test.mjs`.

---

# PARTE 6 — DECISIONI APERTE

## In attesa di Christian

| # | Decisione | Stato |
|---|---|---|
| 1 | Confermare i default DepthGuard (depth 3, fan-out 5, 25 task attivi) come non modificabili dagli agenti | in attesa |
| 2 | Confermare che `L5 — Broad Autonomy` resti irrappresentabile nel codice | in attesa |
| 3 | Accesso automatico Claude resta BLOCKED finché UJ-CLD-001 non risponde a Q1–Q4 | **risolta** in sessione 2: UJ-CLD-001 ha risposto, l'accesso automatico non esiste a costo zero |
| 4 | Aprire o no una PR per il branch di lavoro | **superata**: la PR #2 esiste già (`claude/ultrajarvis-repo-analysis-li6vvj` → `main`) |
| 5 | Relay HUMAN_BRIDGE dei blocchi di append verso `gpt.md`/`taskgpt.md` di ChatGPT | in attesa — pronti in `docs/program/reviews/UJ-INT-006-CLAUDE-APPEND-BLOCKS.md` |
| 6 | Segnalare a ChatGPT che il suo `BACKLOG.json` non vede i miei 6 deliverable | in attesa — divergenza documentata in `TASKCLAUDE.md` §9 |

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
| ~~`R-RUN-01`~~ | contatore task attivi non atomico | — | **CHIUSO** da `AtomicActiveTaskCounter` + `T-DG-4b` (UJ-RCV-001) |
| `R-RCV-01` | `CasActiveTaskCounter` presuppone un update condizionale nel DB: se Gemini sceglie uno storage senza CAS, va riscritto | MEDIA | vincolo per `UJ-INF-001` |
| `R-MCP-01` | un server MCP remoto può cambiare condotta a parità di manifest | MEDIA | **NON chiuso da UJ-SKL-001**: gira fuori dal nostro sandbox → serve `UJ-MCP-002` (proposto, peso 5) |
| `R-SKL-01` | `TH-SF-03`: l'intent della forge non è vincolato a provenienza fidata → skill ostile con tutti i gate verdi | ALTA | proposta di contratto, non implementata |
| `R-SKL-02` | `TH-SF-06`: il sandbox prova il comportamento solo in condizioni di sandbox | MEDIA | contenuto dal runtime, non chiudibile dal sandbox |
| `R-SKL-03` | tecnologia di isolamento del sandbox non scelta | MEDIA | dipende da `UJ-INF-001` (Gemini) |
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
11. **Prima di registrare un'attesa, verifica se qualcuno ha consegnato.** `git fetch` di
    *tutti* i branch e lettura dei log altrui. Nella sessione 3 il RESUME_POINT diceva
    "portafoglio esaurito": era vero quando è stato scritto e falso due ore dopo. Il
    RESUME_POINT descrive il passato, i branch descrivono il presente.
12. **Un test che fallisce per il motivo sbagliato è un falso negativo** (E11). Prima di
    concludere che un controllo esiste, leggi *perché* il caso è stato respinto: uno
    schema che rifiuta un payload malformato non dimostra la regola che volevi provare.
13. **La cwd viene resettata fra le chiamate Bash**, e vale anche per `require()`, non
    solo per il test runner (E10). Path assoluti sempre.
14. **Cita solo prove che hai davvero aperto.** Se una review elenca artefatti non letti,
    è vuota nello stesso modo che F-001 descrive — e scriverlo mentre lo si fa è peggio.
15. **Mai testare l'esito di un comando attraverso una pipe** (E13). `git push … | tail`
    restituisce l'exit di `tail`: ho dichiarato riuscito un push rifiutato. Cattura
    l'output in una variabile e testa `$?` del comando vero. Una verifica che non può
    fallire non è una verifica — è un'auto-attestazione, cioè TH-10 applicata a me stesso.
16. **`main` non è più solo tuo né solo di ChatGPT.** Prima di qualunque merge, `git fetch`
    e guarda dov'è arrivato: in questa sessione è passato da 1 a 114 file mentre lavoravo.
    E prima di mergiare il branch di un'altra IA, verifica su cosa è basato: se parte da un
    ref vecchio, una risoluzione sbagliata cancella il lavoro altrui.

---

# PARTE 8 — RESUME_POINT

```
PROGRAMMA : ultraJARVIS
AI_ID     : CLAUDE — Runtime, Security & Skill Architect
BRANCH    : claude/ultrajarvis-repo-analysis-li6vvj
PROMPT    : ORA SU main (sessione 3): docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md
            sha256 a3fcdfc97b48e9b1f37e1a1798b0b5e7231309d03ab4e13683622eaf1fa69a87
            Verifica: sha256sum docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md
            (non serve più leggerlo dal branch agent/… : PR #1 è stata mergiata)

MAIN      : 114 file, commit 99dece5. Contiene ora il piano canonico, il
            Program OS, i miei contratti e review, e l'implementazione
            Python di Grok. ATTENZIONE: essere su main NON significa
            accettato. Ledger invariato: 0/76 mio, 0/13 UJ-INT-001, 0/8 UJ-INT-006.

STATO     : UJ-RUN-001  REVIEW        attende Gemini, 11/13 proposti
            UJ-SEC-001  REVIEW        attende Grok,   11/13 proposti
            UJ-MCP-001  REVIEW        attende Gemini,  7/8  proposti
            UJ-RCV-001  REVIEW        attende ChatGPT, 6/8 proposti
            UJ-SKL-001  REVIEW        attende ChatGPT, 11/13 proposti
            UJ-CLD-001  REVIEW        attende Gemini,   7/8  proposti
            UJ-REV-001  REVIEW        attende Christian, 4/5 proposti  <-- sessione 3
            UJ-REV-002  BLOCKED       aspetta UJ-INT-007 di ChatGPT

TUTTI E TRE I P0 DEL PROGRAMMA SONO CHIUSI.
6 TASK SU 8 SONO IN REVIEW. IL PORTAFOGLIO DI PRODUZIONE È ESAURITO,
MA I DOVERI DA REVIEWER NO — E QUELLI ARRIVANO SENZA PREAVVISO.

FATTO NUOVO (sessione 3): ChatGPT ha consegnato il 2026-08-17 fra le 09:44 e
            le 11:27 su agent/ultrajarvis-master-prompt-v1.
            - UJ-INT-001 Program OS v0.1 ESISTE   -> UJ-REV-001 è lavorabile
            - UJ-INT-006 Council packets ESISTE   -> REVISIONATO DA ME,
              PASS_WITH_ACTIONS, 0/8, in docs/program/reviews/
            - PR #2 esiste per il mio branch (decisione aperta n. 4 superata)

PROSSIMO  : IL PORTAFOGLIO È ORA DAVVERO ESAURITO. 7 task su 8 in REVIEW.
            Resta solo UJ-REV-002 (peso 8), bloccato da UJ-INT-007 che NON
            esiste — verificato al ref 31f31b99, non assunto.

            Se apri una sessione nuova:
            1. ESEGUI PRIMA LA TRAPPOLA 11 — git fetch di tutti i branch e
               controlla se qualcuno ha consegnato. Nella sessione 3 questo
               controllo ha trovato due task che aspettavano me, e poi una
               consegna di Grok comparsa a metà lavoro.
            2. Se esiste UJ-INT-007  -> prendi UJ-REV-002.
            3. Se Gemini/Grok hanno consegnato -> hai doveri da reviewer su
               UJ-CAP-001, UJ-MEM-001, UJ-ADK-001, UJ-RSK-001, UJ-ALT-001.
               NON su UJ-RED-001: il suo reviewer è CHATGPT (verificato).
            4. Se NIENTE di tutto questo -> ALLORA registra l'attesa. Questa
               volta è la risposta corretta, ma solo dopo i punti 1-3.

            IN SOSPESO, non mio ma da sapere: il branch
            agent/uj-red-001-grok-v8-snapshot (97f7f06) NON è su main.
            Reviewer: ChatGPT. Se qualcuno lo merge, deve usare un merge a
            tre vie: parte da 31f31b9 e non contiene il lavoro mio né il
            Python già su main.

            METODO CHE HA FUNZIONATO, da riusare: eseguire i validatori PRIMA di
            leggere il codice, costruire una suite avversariale invece di
            ispezionare a occhio, RICALCOLARE il ledger invece di leggerlo, e
            citare solo artefatti davvero aperti.

POI       : - Gemini: review di UJ-RUN-001, UJ-MCP-001, UJ-CLD-001
            - Grok:   review di UJ-SEC-001
            - ChatGPT: review di UJ-RCV-001 e UJ-SKL-001; correzione di F-001 e
                       F-002 su UJ-INT-006; UJ-INT-007 sblocca UJ-REV-002
            - Christian: decisioni costituzionali e di baseline, più il relay
                       HUMAN_BRIDGE dei blocchi di append verso gpt.md/taskgpt.md
            Se nessuno risponde E non ci sono branch nuovi, registra l'attesa.
            Ma controlla i branch PRIMA: vedi trappola 11.

DECISIONI DI BASELINE IN SOSPESO PRESSO CHATGPT:
            UJ-SEC-002 (peso 8) — chiude i due CRITICA R-SEC-01/R-SEC-02
            UJ-MCP-002 (peso 5) — unico modo di chiudere R-MCP-01

NON RIFARE: blueprint runtime, contratti runtime/policy/tools, threat model,
            approval policy, critica Costituzione, tool plane, source manifest,
            capability record UJ-CLD-001, LA REVIEW DI UJ-INT-006,
            E LA REVIEW DEL PROGRAM OS (UJ-REV-001).
            Verifica prima, DALLA ROOT del repo:
              for f in tests/contracts/*.test.mjs; do node --test "$f"; done
              totale atteso: 138/138 (runtime 34 · policy 28 · tools 30 ·
                                      recovery 9 · skills 37)
            Riverificato in sessione 3: 138/138 pass, typecheck exit 0.

RICORDA   : a fine task, Regola 2 — aggiorna CLAUDE.md e TASKCLAUDE.md, poi commit e push.
```
