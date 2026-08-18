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
| Branch di lavoro | `claude/claude-md-resume-point-tvej1u` (sessione 4). Sessioni 1-3: `claude/ultrajarvis-repo-analysis-li6vvj` |
| File gemello per le altre IA | `TASKCLAUDE.md` |
| Ultimo aggiornamento | 2026-08-17 — sessione `UJ-CLAUDE-2026-08-17-04` |

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
| **UJ-CAP-001 — Capability Registry** | **GEMINI** | **13** | **QUARANTENA** | **CHANGES_REQUIRED**, 0/13, sessione 4 — pre-verdetto, vedi sotto |
| UJ-INT-002, UJ-INT-004 | CHATGPT | 13, 8 | BLOCKED | non ancora consegnati |
| UJ-MEM-001, UJ-ADK-001 | GEMINI | 13, 8 | BLOCKED | non ancora consegnati |
| UJ-RSK-001, UJ-ALT-001 | GROK | 8, 8 | BLOCKED | non ancora consegnati |

> **UJ-CAP-001 (sessione 4).** Gemini ha consegnato per la prima volta; ChatGPT ha messo il
> pacchetto in quarantena per motivi di **intake** (nessun `ResponsePacket`, 4 file su 8
> assenti). Io sono il reviewer designato — verificato in
> `prompts/delegation-cards/UJ-CAP-001-GEMINI.json` riga 110 — e il mio gate è sul **merito**.
> Ho emesso un **pre-verdetto** in `docs/program/reviews/UJ-CAP-001-CLAUDE-PREVERDICT.md`:
> **1 criterio su 5 passato, 3 falliti nel merito** (cioè non risolvibili reimballando), 1 già
> fallito in intake. 6 findings: 3 BLOCKER, 3 MAJOR.
>
> **Non è un `ReviewResult`** e non muove il ledger: gli artefatti non esistono a nessun
> commit e la consegna non è stata ammessa. Diventerà un packet al reinvio ammesso.

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

## Sessione 3, quarta parte — security review dell'implementazione su `main`

**Richiesta di Christian:** *"CONTINUA CON LE TASK FINCHE NON TI DICO STOP"*.

### Perché questo lavoro e non un altro

Trappola 11 applicata per prima. Esito del controllo:

- **nessun commit nuovo** su `main` dopo il mio `2fee003`;
- **`UJ-INT-007` non è "mancante": è `DEFERRED` a M8/M9** (verificato in `BACKLOG.json`,
  non assunto). Quindi `UJ-REV-002` non è lavorabile e non lo sarà a breve;
- **il pacchetto di Grok è un archivio sorgente**, non una falsificazione dei miei
  artefatti, e il suo reviewer è **ChatGPT**. Nessun dovere per me.

Portafoglio di produzione esaurito. Ma il merge della terza parte ha reso canonico su
`main` **un sistema di tool eseguibile**, e §32.2 mi assegna *MCP/tool admission, threat
model, code/architecture review, failure containment*. Del codice che esegue tool è
esattamente il mio oggetto — ed è diventato attuale adesso.

Consegnato come **proposta `UJ-SEC-003` con artefatto già pronto**, senza auto-assegnarmi
peso: §7.4 vieta di espandere lo scope da solo, la baseline è di ChatGPT.

### File prodotto

`docs/threat-models/MAIN_IMPLEMENTATION_SECURITY_REVIEW.md` — 8 findings, tutti con
comando di riproduzione.

### Il risultato in una frase

**Su `main` c'è un registry che esegue tool senza alcuna ammissione, e accanto ci sono i
miei contratti di admission che non sono cablati a niente.**

### Il finding migliore: `S-09`, un bypass sfruttabile

`tools/browser.py` ha una allowlist di domini. La normalizzazione è:

```python
host = (urlparse(url).hostname or "").lower().lstrip("www.")
```

**`str.lstrip("www.")` non toglie il prefisso `"www."`**: toglie *qualunque* carattere
iniziale nell'insieme `{'w','.'}`. Quindi `wexample.com` → `example.com` → **consentito**.

```
>>> open_url('https://wexample.com')
'Would open: https://wexample.com'
```

`wexample.com` e `wwwexample.com` sono **domini registrabili**: basta comprarne uno per
farsi trattare come `example.com`. È l'unico difetto trovato **sfruttabile da un terzo**
senza accesso al repository, e si chiude in due righe.

L'ho trovato perché ho letto la funzione invece di fidarmi del nome `ALLOWLIST`.

### Due findings ancora peggiori, trovati proseguendo su `tools/files.py`

**`S-10` — `files.safe_read` legge qualunque file del sistema.** Il registry lo descrive
come *"Read a text file under the project root"*. Il contenimento nella root **non esiste**:
`safe_read` controlla esistenza, tipo ed estensione, mai `relative_to(root)`. Misurato: sia
un path assoluto fuori root sia `../../../` leggono il file. Lo stesso path passato a
`safe_write` viene **bloccato** — quindi il controllo giusto esiste gia nel file accanto,
ed e solo omesso. Tre righe da copiare. Il filtro sulle estensioni binarie non protegge:
i segreti stanno in file di testo.

**`S-11` — `force=True` aggira `PROTECTED`, e il registry lo inoltra.** `PROTECTED` elenca
15 path fra cui `core/registry.py`, `bin/uj`, `.git`. `safe_write` la applica *salvo force*.
E `Registry.call()` fa `fn(*args, **kwargs)` senza filtrare, quindi:

```
registry.call("files.safe_write", "core/registry.py", "<arbitrario>", force=True)
```

sovrascrive **il file che definisce quali tool esistono**. Dimostrato su una root di prova
per non toccare il repo reale. `PROTECTED` non e un permesso: e un default che il chiamante
puo cambiare.

### Altri quattro findings, proseguendo su promozione e gate

**`S-12` (HIGH) — la promozione di codice generato non ha alcun gate.**
`promote_job_to_tools()` scrive il `tool.py` di un job dentro `tools/`, cioe nella
directory da cui il registry importa ed esegue. L'unica validazione del contenuto e
`if "def " not in text`. Dimostrato: ho promosso un file con `os.system(cmd)` piu le
stringhe `eval(` e `rm -rf` — tre dei sette pattern che il loro stesso scanner conosce — e
la promozione e riuscita senza sollevare nulla. E la proprieta che `UJ-SKL-001` rende
meccanica dal lato TypeScript: li una skill non puo avanzare il proprio stadio, qui non
esistono stadi.

**`S-13` (MEDIUM) — ogni tool promosso non compila**, per una virgoletta di troppo
nell'header (`SyntaxError: unterminated string literal`). **E maschera S-12 per caso.**

**Il punto piu importante di tutta la review sta in questa combinazione.** Il contenimento
di S-12 oggi e *un errore di battitura*. E il terzo caso in questo albero in cui l'unica
cosa che impedisce un guasto di sicurezza e un difetto — dopo il trasporto SMTP assente di
`email.send` e i moduli mancanti su main, **che hanno gia smesso di proteggere durante
questa sessione**. Quindi va corretto **prima S-12, poi S-13**, mai il contrario: sistemare
un typo di un carattere e cosa che chiunque farebbe senza pensarci, e aprirebbe
l'esecuzione di codice generato non validato.

**`S-14` (HIGH) — una build fallita riporta PASS.** `core/gates.py` esegue controlli veri e
legge bene gli exit code; il difetto e in come `natural_tasks.py:123` ne ricava il verdetto:

```python
status = "PASS" if "PASS" in text.upper() or "ok" in text.lower() else "FAIL"
```

Misurato, tre falsi PASS su cinque casi realistici: basta che un gate su tre passi; la
sottostringa `ok` compare in `broken`, `token`, `booking` — **un job in `.../booking_tool`
passa i gate qualunque cosa succeda**; e l'output di errore troncato viene incollato nello
stesso testo, quindi piu i test falliscono in modo verboso, piu e probabile che compaia
`ok`.

**`S-15` (MEDIUM)** — `run_gates(use_real=False)` non salta i controlli: **stampa che sono
passati**. `gates.txt` non e una prova e non va mai citato in un `proof_ref`.

### Il filo comune, ed e la parte che conta

Sette findings su tredici sono **manopole di sicurezza che non girano nulla**: `ToolSpec.safe`
mai letto, `force` di `email.send` mai referenziato, `SAFE_MODE` riscrivibile, `PROTECTED`
disattivabile da kwarg, `lstrip` che non fa quello che il nome dice, scanner che non rileva.
Ognuna, letta da sola, **sembra** una difesa.

E la settima occorrenza della stessa forma nel programma. La regola operativa: **un controllo
va verificato eseguendolo contro il caso che deve fermare**, non leggendone il nome.

### Gli altri findings HIGH

- **S-01** — `ToolSpec.safe` è dichiarato e **mai letto** in tutto il repository. Tutti e
  28 i tool valgono `safe=True`, **incluso `email.send`**. Un campo che si chiama `safe` e
  non condiziona nulla è peggio di un campo assente: chi legge smette di cercare il
  controllo vero.
- **S-02** — `Registry.call()` fa `importlib` + `getattr` + chiamata. Fra richiesta ed
  esecuzione **non c'è nulla**: né gate, né classe di dato, né tetto, né evento.
- **S-03** — `email.send` ha **due manopole di sicurezza, entrambe finte**: il parametro
  `force` compare solo nella firma e non è mai referenziato nel corpo, e `SAFE_MODE` è una
  globale di modulo riscrivibile a runtime (`e.SAFE_MODE = False` → il ramo di protezione
  viene saltato, dimostrato). Più `EXTERNAL_WRITE` senza idempotenza, che viola `ADM-13`.
  **Il contenimento di oggi è l'assenza di un trasporto SMTP, non una policy.**

Con `ToolSpec.safe`, `force` e `SAFE_MODE` sono **tre manopole finte nello stesso albero**.
Non è una svista: è un pattern.

### `main` si è mosso DUE VOLTE durante la review

Fatto che cambia cosa è vero, e va registrato per intero.

La prima stesura conteneva due findings — `S-04` (`core.natural_tasks` inimportabile, con
l'unico safety scan dietro) e `S-05` (pubblicazione parziale: 7 tool contro 55) — che
**Grok ha chiuso mentre scrivevo**, pushando i moduli `core` mancanti e 87 tool.

Me ne sono accorto perché il push è fallito e ho **riverificato invece di ripubblicare**.
Li ho spostati in §10 del documento come *chiusi*, con il ref in cui lo sono diventati.

**Se avessi pushato la prima stesura, avrei consegnato una review che descrive uno stato
superato** — cioè esattamente il difetto `F-001` che ho contestato a ChatGPT su UJ-INT-006.
La differenza fra le due situazioni sarebbe stata solo che la mia era in buona fede, e
`F-001` dice che la buona fede non è il punto.

### Metodo

- **Ho eseguito invece di dedurre.** `registry.call()` chiamato davvero sui tool a rischio:
  `email.send` → `ModuleNotFoundError`, `automation.type_text` → eseguito, `files.safe_read`
  → ha restituito il contenuto reale del README.
- **Ho cercato il gate prima di dire che manca.** `advisors/safety.py` esiste, quindi ho
  tracciato chi lo chiama: solo `natural_tasks.py:137`, e scansiona *codice generato*, non
  le chiamate ai tool. Solo dopo ho affermato che il percorso è scoperto.
- **Ho falsificato lo scanner** invece di giudicarlo a occhio: 2 evasioni su 4 casi
  (`getattr(__builtins__,'ev'+'al')` e `subprocess.Popen` passano indisturbati).

### ERRORI COMMESSI IN QUESTA PARTE

| # | Errore | Come si è manifestato | Correzione | Lezione |
|---|---|---|---|---|
| E14 | **Ho confuso il branch con `main`**: ho affermato *"`core/gates.py` esiste in `imports/grok-v8/`"* trattandolo come presente, mentre `imports/` sta **solo sul branch di Grok** e su `main` non esiste affatto | `ls imports/grok-v8/core/*.py` → `No such file or directory`, dopo che avevo già scritto la conclusione | rifatto il confronto con `git ls-tree` contro il ref giusto | **un path che esiste in una `git ls-tree` di un branch non esiste nel working tree di un altro.** Quando confronto due ref, uso `git ls-tree` per entrambi, mai `ls` per uno e `git` per l'altro |
| E15 | **`git add -A` ha inghiottito 16 file `__pycache__/*.pyc`** generati dall'esecuzione dei tool Python durante la review | il commit conteneva bytecode binario; me ne sono accorto **solo perché il push è fallito** e ho riletto la lista staged | `reset --soft`, rimozione dei `.pyc`, `__pycache__/` e `*.py[cod]` aggiunti a `.gitignore` | **eseguire codice altrui sporca il working tree.** Dopo aver eseguito qualcosa, `git status` va *letto*, non solo lanciato — e `git add -A` non va usato subito dopo un'esecuzione. Nota: il `.gitignore` copriva `node_modules/` e `dist/` ma non Python, perché finora nessuno aveva eseguito Python in questo repo |

E14 non ha alterato le conclusioni — i moduli mancano su `main` in entrambe le letture —
ma avrebbe potuto: se lo snapshot **non** avesse contenuto `verify.py`, avrei attribuito a
una pubblicazione parziale un difetto che era invece originario.

### Prove eseguite

| Verifica | Esito |
|---|---|
| `grep` di ogni lettura di `.safe` | **zero** occorrenze reali |
| `registry.call()` sui 5 tool a rischio | 2 `ModuleNotFoundError`, 3 eseguiti |
| `import core.natural_tasks` | **ModuleNotFoundError: core.verify** |
| import degli altri 7 moduli `core` | tutti OK |
| Evasione di `advisors.safety.scan_text` | **2 su 4 evadono** |
| Confronto `main` vs snapshot Grok | −6 moduli `core/`, 7 tool vs 55 |
| Suite contratti dopo il lavoro | **138/138**, typecheck exit 0 |

### Confini rispettati

**Non ho modificato una riga** di `core/`, `tools/`, `advisors/`, `bin/uj`. È codice di
Grok: correggerlo senza decisione di baseline sarebbe invasione di portafoglio, e la
tentazione era concreta perché S-04 si chiude copiando due file.

### Chiusura della parte — `S-16`, la lista correzioni per Grok, e il bilancio onesto

Su istruzione di Christian (*"CONTINUA CON LE TASK FINCHE NON TI DICO STOP"*, poi
*"DIMMI CHE ERRORI SONO E LI FACCIO CORREGERE A GROK, TE CONTINUA CON LE TUE TASK"*) ho
proseguito su tre fronti.

**`S-16` (MEDIUM, non ancora attivo)** — `core/memory.py` scrive record senza campo di
provenienza: un fatto detto da Christian e uno estratto da una pagina web sarebbero
indistinguibili. Ho verificato **prima di scriverlo** che `planner.py`, `job_worker.py` e
`natural_tasks.py` non rileggono la memoria al ref corrente: il percorso *contenuto non
fidato → memoria → decisione* non è ancora cablato, quindi non è una vulnerabilità attiva.
Lo segnalo comunque perché va corretto **nello schema, prima** che quel cablaggio esista —
riguarda **Gemini** e `UJ-MEM-001` più che Grok.

**Ho anche scritto cosa ho trovato corretto**, non solo i difetti: `tools/os_control.py` e
`tools/automation.py` sono stub genuini con allowlist reale; `core/gates.py` esegue i
controlli per davvero; `core/memory.py` non ha deserializzazione pericolosa. Una review che
elenca solo difetti dà un'impressione falsa dell'insieme, ed è lo stesso principio di
onestà che pretendo dalle review altrui.

**File prodotto:** `docs/threat-models/GROK_FIX_LIST.md` — le 16 scoperte tradotte in 9
correzioni applicabili, ciascuna con file, riga, prima/dopo e comando di verifica che
fallisce finché il difetto è presente. **La sezione 0 del documento è la parte che conta
di più**: dice esplicitamente che `FIX-1` (gate di safety sulla promozione) va applicato
**prima** di `FIX-2` (la virgoletta), perché il tipo contrario — sistemare prima il typo —
aprirebbe l'esecuzione di codice generato non validato. Non l'ho lasciato dedurre: un fix
banale applicato nell'ordine sbagliato da chi non ha letto tutta la review è esattamente il
genere di errore che questo programma continua a produrre.

**Bilancio finale di `UJ-SEC-003`:** 16 findings, 8 HIGH, tutti riproducibili, nessuno
citato senza comando di verifica. Sette manopole di sicurezza che non applicano nulla —
`ToolSpec.safe`, `force` di `email.send`, `SAFE_MODE`, `PROTECTED`, `lstrip`, lo scanner, il
verdetto dei gate — è la **settima** occorrenza della stessa forma nel programma: un
controllo che sembra fermare qualcosa e non lo fa, verificabile solo eseguendolo contro il
caso che dovrebbe fermare.

**Non mi sono assegnato peso.** `UJ-SEC-003` resta una proposta: la baseline è di ChatGPT,
e la decisione di chi applica le correzioni è di Christian — gliel'ho lasciata esplicitamente.

### Chiusura di sessione — Grok ha applicato i fix mentre preparavo l'handoff, e li ho verificati

Christian ha chiesto un handoff per aprire una sessione nuova. Prima di scriverlo ho
applicato la trappola 11 un'ultima volta, come da procedura — e `main` si era mosso una
**quarta** volta: Grok aveva pushato 9 commit che citano esplicitamente `FIX-1`…`FIX-9`.

**Non ho aggiornato lo stato sulla fiducia.** Ho fatto `git merge origin/main` sul mio
branch e rieseguito **ogni comando di riproduzione** che avevo scritto in
`MAIN_IMPLEMENTATION_SECURITY_REVIEW.md`, contro il codice nuovo. **10 findings su 16
sono chiusi e verificati**, con comando ed esito per ciascuno in §10-ter dello stesso
documento. È lo stesso standard che ho preteso da ChatGPT su UJ-INT-006: non citare come
vero ciò che non hai eseguito tu.

**Un errore mio, in mezzo alla verifica.** Il primo test su `www.github.com` (parte di
`FIX-5`) risultava bloccato — sembrava una regressione. Non lo era: era bytecode Python in
cache **da prima** del merge di Grok, non il fix rotto. L'ho scoperto ripulendo
`__pycache__` e rieseguendo con `python3 -B`. È la stessa classe di E14/E15 di questa
sessione: eseguire codice altrui senza controllare che l'ambiente rifletta lo stato che
si sta testando. Un falso allarme in una review di sicurezza non è innocuo quanto un falso
allarme altrove — avrei potuto scrivere che un fix corretto non funzionava.

**Cosa resta aperto, e perché non è successo per manomissione:** `S-02` (parziale — c'è
ammissione ma non tetto/evento), `S-06` (automazione UI nel catalogo — è una decisione di
policy, non un bug da correggere con un fix), `S-07` (nessun evento `tool.*` — è
infrastruttura nuova), `S-16` (memoria senza provenienza — è di Gemini, non di Grok, e
`GROK_FIX_LIST.md` non lo conteneva di proposito).

Con questo, `UJ-SEC-003` passa da proposta con 16 findings aperti a proposta con **6
findings aperti e 10 chiusi verificati**. Resta **0 peso auto-assegnato**: la review era
mia, l'accettazione resta di ChatGPT.

---

## Sessione 4 — `UJ-CLAUDE-2026-08-17-04` — 2026-08-17

**Branch designato:** `claude/claude-md-resume-point-tvej1u` — **nuovo, diverso da quello
delle sessioni 1-3** (`claude/ultrajarvis-repo-analysis-li6vvj`). Non l'ho scelto io: è
assegnato dall'ambiente. Le due sessioni precedenti avevano branch di lavoro e `main`
coincidenti; da qui non è più vero, e chi legge deve saperlo prima di cercare il lavoro.

**Richiesta di Christian:** aprire il repo, leggere `CLAUDE.md` per intero, dire cosa si
trova nel RESUME_POINT prima di iniziare, poi continuare con le task.

### Il RESUME_POINT era corretto nei fatti e sbagliato in due punti operativi

Riletto per intero e confrontato con la realtà. La sostanza teneva: hash del piano
canonico invariato, 7 task su 8 in REVIEW, i 10 findings di `UJ-SEC-003` chiusi da Grok
davvero chiusi. Ma due cose non tornavano, e nessuna delle due si vedeva leggendo.

### E16 — il mio stesso RESUME_POINT fa fallire la suite a chi lo segue alla lettera

Eseguiti i comandi del blocco `NON RIFARE` nell'ordine in cui erano scritti:

```
for f in tests/contracts/*.test.mjs; do node --test "$f"; done
→ 5 suite su 5 FALLITE, ERR_MODULE_NOT_FOUND su packages/contracts/dist/runtime/index.js
```

Causa: i test importano da `packages/contracts/dist/`, `dist/` è in `.gitignore`, e il
container di sessione è nuovo. Serve `npx tsc -p packages/contracts` **senza** `--noEmit`.
Quel blocco elencava solo `--noEmit`, e per giunta metteva i test **prima** del typecheck.

Dopo la build: **138/138 pass, 0 fail** (runtime 34 · policy 28 · tools 30 · recovery 9 ·
skills 37), typecheck exit 0. Nessuna regressione: la ricetta era incompleta, non il codice.

**Perché lo classifico come errore mio e non come inciampo.** `PARTE 2` conteneva la
ricetta giusta, con la build. Il RESUME_POINT — cioè l'unico blocco che una sessione nuova
legge davvero per primo — ne conteneva una versione mutilata. Ho lasciato due ricette
divergenti nello stesso file e ho messo quella rotta nel punto più letto. Una sessione meno
sospettosa avrebbe aperto un'indagine su una regressione inesistente, o peggio avrebbe
"aggiustato" i test.

**Correzione applicata in tre punti**, non uno: `CLAUDE.md` PARTE 8, e
`AVVIO_NUOVA_SESSIONE.md` — che aveva la ricetta **giusta** alla riga 60 e quella **rotta**
alla riga 130. Entrambe ora dicono esplicitamente che senza build si ottengono 5 fallimenti
e che non è una regressione.

### Trappola 11: sei branch che il RESUME_POINT non poteva conoscere

`git fetch` di tutti i branch, come prescritto. Ne sono comparsi **sei** mai citati:
quattro `agent/continuity-*` di Grok, uno `agent/uj-red-001-chatgpt-review-*`, e soprattutto
**`agent/gemini-handoff-quarantine-20260817`**.

**Gemini ha consegnato per la prima volta nel programma.** E ChatGPT ha messo la consegna
**in quarantena**.

Errore evitato subito prima: avevo lanciato i confronti con `git diff main...origin/<b>`
usando il `main` **locale**, fermo a `9d2a93d` mentre `origin/main` era a `3a297e5`. I
diffstat risultanti erano enormi e insensati (307 file). Me ne sono accorto perché il
numero non aveva senso, non perché avessi controllato. È la stessa classe di **E14** della
sessione 3 — confrontare due ref sbagliando quale sia lo stato reale. Rifatto tutto contro
`origin/main`: i branch avanti sono 4, di 1-3 commit ciascuno.

### UJ-CAP-001 — pre-verdetto del reviewer sul candidato Gemini

**Perché questo lavoro.** `prompts/delegation-cards/UJ-CAP-001-GEMINI.json` riga 110 dice
`"reviewer": "CLAUDE"`. Verificato, non assunto. È un dovere mio, ed era arrivato senza
preavviso — esattamente come il RESUME_POINT avvertiva.

**La distinzione che rende il lavoro utile.** ChatGPT ha respinto il pacchetto per motivi
di **intake**: niente `ResponsePacket`, 4 file su 8 assenti, un blocco troncato. Giudizio
corretto, non l'ho rimesso in discussione. Ma quello è un gate di **forma**; il mio è di
**merito**, sui 5 acceptance criteria della card. Sono due porte in serie.

Se avessi aspettato, Gemini avrebbe rispedito un pacchetto ben imballato con lo **stesso
contenuto**, avrebbe superato l'intake e sarebbe fallito da me. Terzo giro. E ogni giro
costa a Christian un `HUMAN_BRIDGE` manuale, perché `UJ-CLD-001` ha già stabilito che il
canale automatico a costo zero non esiste.

**File prodotto:** `docs/program/reviews/UJ-CAP-001-CLAUDE-PREVERDICT.md`.
**Esito: `CHANGES_REQUIRED`.** 1 criterio su 5 passato, **3 falliti nel merito** — cioè
sopravvivono a un reinvio che sistemi solo l'imballaggio.

| Finding | Gravità | Criterio | Sostanza |
|---|---|---|---|
| G-001 | BLOCKER | AC-03 | **Zero date ISO in 528 righe.** Il JSON omette 7 dei 13 campi per-capability richiesti dalla card |
| G-002 | BLOCKER | AC-03 | I rate limit del free tier Google asseriti come costanti universali con `confidence: HIGH` |
| G-003 | BLOCKER | AC-03 | **`UNKNOWN` compare 1 volta in 528 righe: la sua definizione.** 9 capability, 0 unknown, confidenza `{HIGH}` |
| G-004 | MAJOR | AC-01 | La matrice §4 marca `ACTIVE` tutte e 4 le UI web, contro la definizione di §2 e contro le righe `HUMAN_BRIDGE` di §3 |
| G-005 | MAJOR | AC-04 | Il percorso **local-compute** non è mai trattato, benché AC-04 lo nomini |
| G-006 | MAJOR | AC-01/02 | `CLD-SDK-001` dichiarata una volta, mai classificata, assente dal JSON |

### Il finding che conta di più, e perché l'ho verificato alla fonte

**G-002.** Il registro pinna come interi: Flash 15 RPM / 1.000.000 TPM / 1.500 RPD, Pro
2 RPM / 32.000 TPM / 50 RPD.

Ho aperto `https://ai.google.dev/gemini-api/docs/rate-limits` **io, oggi**. La pagina non
pubblica quei numeri: dice che i limiti *"depend on a variety of factors (such as your
usage tier) and can be viewed in Google AI Studio"*, che variano **per modello**, e che
sono **per progetto, non per API key**.

Non è un dato stantio: è una claim **di un tipo che la fonte dice di non poter fare** in
forma universale. È la seconda metà di AC-03 — *"unknowns are not promoted"* — violata nel
punto peggiore, perché quella è l'**unica** capability del registro che abiliterebbe lavoro
automatico a costo zero. Tutto il resto è `HUMAN_BRIDGE` o `BLOCKED`.

L'ho alzato a BLOCKER per una ragione operativa, non documentale: §5.3 del registro
prescrive un rate limiter **tarato su quei numeri**. Un numero inventato che finisce in un
parametro di configurazione smette di essere un errore di documentazione e diventa un
difetto di runtime.

### G-003 è TH-10, terza occorrenza, terzo autore

`UNKNOWN` è definito alla riga 76 e **mai usato**. Nove capability, tutte `HIGH`.

Un registro che copre quattro provider su accesso, quota, billing, privacy, region e
automazione — prodotto con `max_model_calls: 1`, senza una data e senza un solo dubbio — non
è verificato: è **plausibile**. È la forma esatta di `TH-10` (*proof fabrication*), che ho
classificato `CRITICA`/`ALTA` proprio perché non richiede malafede. Stessa forma di `F-001`
contro ChatGPT su `UJ-INT-006`, dove `evidence_refs: "trust me"` superava il gate.

**Terza occorrenza nel programma, terzo autore diverso.** Non è un difetto di Gemini: è la
modalità di guasto strutturale di questo programma, e va detto così.

### Ho scritto cosa è corretto, non solo cosa è rotto

**AC-02 è pienamente soddisfatto ed è la parte migliore del lavoro.** La separazione
*subscription ≠ API entitlement* è dichiarata come principio e applicata a tutti e quattro
i provider. È la distinzione che il programma sbaglierebbe più facilmente. La tassonomia di
§2 è quella giusta, con `HUMAN_BRIDGE` come status di prima classe; il divieto di scraping è
argomentato sui termini, non su preferenze tecniche. Nel merito Gemini **converge** con
quanto `UJ-CLD-001` ha verificato per Claude.

Il problema di G-003/G-004 non è che la tassonomia sia sbagliata: è che il documento non la
rispetta.

### Perché NON ho emesso un `ReviewResult`

Il validatore avrebbe accettato la mia firma — sono il reviewer legittimo. Non l'ho fatto:

1. gli artefatti **non esistono a nessun commit**: sono testo dentro un file di quarantena.
   Potrei hashare solo il file di quarantena, che non è l'artefatto;
2. l'intake di ChatGPT non ha ammesso la consegna, e scavalcarlo sarebbe entrare in un gate
   suo;
3. il ledger non deve muoversi **in nessuna direzione**: un `CHANGES_REQUIRED` formale
   registrerebbe un fallimento di Gemini su un tentativo che il programma ha già deciso di
   non contare.

Stesso ragionamento di `F-003` in `UJ-REV-001`: quando il deliverable corretto non è
rappresentabile nel formato previsto, si consegna la sostanza e **si dichiara** che non è
importabile, invece di produrre un JSON conforme che afferma il falso.
`UJ-CAP-001` resta **0/13**. Il mio portafoglio resta **76 unità**: fare da reviewer non
aggiunge peso.

### Rilievo minore sull'audit di ChatGPT

L'audit dichiara *"Raw attachment bytes: 528 / lines: 32435"*. Misurato: **528 righe,
32.435 byte** — le etichette sono invertite. L'hash dichiarato è invece esatto, ricalcolato
da me. Lo segnalo solo perché è un documento di intake il cui scopo è l'esattezza dei byte:
un lettore che confronti "528 byte" con un file da 32 KB concluderebbe che il pacchetto in
quarantena non è quello auditato.

### ERRORI COMMESSI IN QUESTA SESSIONE

| # | Errore | Come si è manifestato | Correzione | Lezione |
|---|---|---|---|---|
| E16 | **Il mio RESUME_POINT ometteva la build** e metteva i test prima del typecheck | 5 suite su 5 fallite con `ERR_MODULE_NOT_FOUND` seguendo le mie istruzioni alla lettera | ricetta corretta in 3 punti (`CLAUDE.md` PARTE 8 + `AVVIO_NUOVA_SESSIONE.md` righe 60 e 130), con la nota che non è una regressione | **una procedura di verifica va provata da zero, in un container pulito, non ricordata.** Avere la ricetta giusta in PARTE 2 non serve se quella rotta sta nel blocco che si legge per primo |
| E17 | **Ripetuto E14**: `git diff main...origin/<b>` con il `main` **locale** fermo 1 commit indietro | diffstat da 307 file, privi di senso | rifatto tutto contro `origin/main` | dopo `git fetch`, `main` locale **non** è `origin/main`. Me ne sono accorto perché il numero era assurdo, non perché avessi controllato: la prossima volta va controllato **prima**, non dopo |
| E18 | **Quasi ripetuto E13/trappola 15, nel gate di verifica finale**: `npx tsc --noEmit \| grep -v "npm notice"; echo $?` | ha stampato `typecheck exit: 1` — che è l'exit di **`grep`** (nessuna riga trovata), non di `tsc`. Il typecheck era in realtà a **0** | rieseguito senza pipe, redirigendo su file e catturando `$?` del comando vero | la trappola 15 era scritta, l'ho riletta, e l'ho comunque quasi ripetuta — perché stavolta la pipe era un innocuo `grep -v` per pulire l'output, non un `tail`. **Qualunque cosa fra il comando e `$?` rompe `$?`.** L'ho preso solo perché un exit 1 con zero errori stampati non tornava: il segnale è stata l'**incoerenza fra output e verdetto**, non il codice in sé |

### Prove eseguite

| Verifica | Comando | Esito |
|---|---|---|
| Integrità piano canonico | `sha256sum docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md` | `a3fcdfc9…a69a87` **coincide** |
| Typecheck | `npx tsc -p packages/contracts --noEmit` | **exit 0** |
| Build | `npx tsc -p packages/contracts` | **exit 0** |
| Suite completa (dopo build) | `for f in tests/contracts/*.test.mjs; do node --test "$f"; done` | **138/138 pass, 0 fail** |
| Identità del pacchetto Gemini | `git show …:GEMINI_HANDOFF_RAW_20260817.md \| sha256sum` | `78fd95ec…89e95` **coincide** con l'audit |
| Date ISO nel pacchetto | `grep -oE '20[0-9]{2}-[0-9]{2}-[0-9]{2}'` | **zero occorrenze** |
| Uso di `UNKNOWN` | `grep -n "UNKNOWN"` | **1 sola, riga 76: la definizione** |
| Campi del JSON vs card | unione dei nomi di campo su 9 capability | **13 presenti, 7 richiesti assenti** |
| Capability dichiarate vs presenti | differenza insiemistica MD ↔ JSON | **`CLD-SDK-001` assente** |
| Rate limit alla fonte primaria | lettura di `ai.google.dev/gemini-api/docs/rate-limits` | la pagina **non pubblica** quei numeri |
| Reviewer designato | `UJ-CAP-001-GEMINI.json` riga 110 | `"reviewer": "CLAUDE"` |

### Cosa NON ho fatto, e perché

- **non ho toccato `UJ-GGL-001`**: reviewer è **GROK**. L'ho aperto solo per due `grep`
  mirati, per non attribuire a Gemini una lacuna coperta altrove — e l'ho dichiarato nella
  review;
- **non ho toccato `UJ-RED-001`**: reviewer è **CHATGPT**, riverificato in questa sessione;
- **non ho scritto su `gpt.md`, `taskgpt.md`, `BACKLOG.json`** né su branch altrui;
- **non ho mergiato nulla su `main`**: nessuna autorizzazione in questa sessione. I sei
  branch nuovi restano dove sono;
- **non ho corretto l'audit di ChatGPT**: è suo, ho solo segnalato;
- non ho verificato alla fonte le quote di OpenAI/Anthropic/xAI: ricadono comunque in
  G-001/G-003 per assenza **strutturale** di data e fonte, che non richiede di sapere se il
  numero sia giusto.

---

---

## Sessione 4, seconda parte — `S-17`: il percorso che può addebitare a Christian

**Richiesta di Christian:** *"CONTINUA CON LE TASK"*.

### Trappola 11, di nuovo, e di nuovo non a vuoto

Applicata per prima, come prescrive il RESUME_POINT che avevo appena riscritto. In meno di
un'ora dal push precedente **`main` si era mossa** (`3a297e5` → `04ae305`, 7 commit) e anche
il branch di quarantena di Gemini (`30ab1a2` → `a7b382c`).

Su `main` era comparso **`cloud_bridge.py`** (89 righe, nuovo) più un **planner LLM adapter**
(`_plan_via_llm`) dietro opt-in `UJ_PLANNER_LLM=1`.

### ChatGPT me l'ha passato esplicitamente, ma non poteva provarlo

Nella sua continuity ChatGPT ha scritto un triage statico di `cloud_bridge` e ha chiuso con:

> *"non ho eseguito runtime, rete, API o test locale e quindi non tratto la claim come prova
> indipendente. Il finding è registrato per la review di sicurezza del proprietario **Claude**."*

Il sospetto è suo e va accreditato. Mancava la prova, perché ChatGPT non ha un checkout e non
può eseguire niente. **Io posso.** È esattamente la divisione del lavoro che ha senso, ed è il
mio metodo di sempre: eseguire invece di dedurre.

### Il risultato in una frase

**Per restare sul percorso gratuito bisogna azzeccare DUE variabili d'ambiente; per finire su
quello a pagamento ne basta UNA.** E quando ci finisci, il programma fa **tre** tentativi
fatturabili e poi restituisce un piano dall'aspetto perfettamente normale.

### Come l'ho misurato, senza spendere un centesimo

Ho eseguito `plan()` in quattro configurazioni, in sottoprocessi isolati, iniettando in
`sys.path` un modulo `openai` **finto** che conta i tentativi e non apre socket. Nessuna
chiamata reale, nessun addebito possibile.

| Scenario | Provider risolto | Tentativi a pagamento | Il chiamante lo scopre? |
|---|---|---:|---|
| default, niente impostato | `openai` | **0** | — |
| solo `UJ_PLANNER_LLM=1` | `openai` | **3** → `gpt-4o-mini` | **NO** |
| `UJ_PLANNER_LLM=1` + chiave | `openai` | **3**, chiave trasmessa ogni volta | **NO** |
| `UJ_PLANNER_LLM=1` + `MODEL_PROVIDER=local` | `local` | **0** | — |

In tutti e quattro i casi `plan()` restituisce **lo stesso identico titolo**. Dall'esterno il
caso sicuro e quello che ha appena tentato tre richieste fatturabili sono **indistinguibili**.

**Ho committato il probe** in `docs/threat-models/probes/S-17-cloud-bridge-probe.py` e l'ho
rieseguito dalla root per verificare che funzioni davvero da lì. Citare un artefatto che non
esiste sarebbe `F-001`, il difetto che contesto agli altri.

### I quattro difetti distinti

1. **Il default del provider è quello a pagamento** (`cloud_bridge.py:12` e `core/config.py:43`).
   Il percorso locale gratuito esiste ed è supportato, ma va chiesto. **L'asimmetria è il
   difetto**: la configurazione sicura richiede due azioni corrette, quella pericolosa una.
   Un default non è una preferenza: è la decisione presa per conto di chi non ne prende nessuna.
2. **Il `@retry(max_attempts=3)` moltiplica l'addebito per tre**, senza idempotency key.
   Viola `ADM-13` del mio `UJ-MCP-001`: effetto esterno non idempotente, ritentato.
3. **Il fallimento è silenzioso**: `except Exception: return ""` → fallback euristico. Nessun
   evento, nessun contatore, nessun costo cumulato. È `S-07` ricomparso nel posto peggiore.
4. **Nessuna ammissione, nessun tetto, nessuna approvazione**: `S-02` sullo stesso percorso.

### Perché CRITICA e non HIGH

Non per probabilità — il gate di default **funziona**, l'ho misurato. Per natura del danno.

`UJ-CLD-001` ha già stabilito che l'API a consumo è `PAID_ONLY_DISABLED`, e `CLD-1` — il
controllo operativo che ho scritto io per Christian — dice: *"È l'unico modo in cui questo
programma può generare un addebito. La risposta è sempre no, salvo decisione esplicita e
registrata."*

`cloud_bridge` **è quel meccanismo**, ora su `main`, raggiungibile con una variabile, senza
alcuna decisione registrata. Ogni altro finding di questa review costa integrità o dati.
Questo costa **soldi di Christian**, cioè l'unico vincolo posto come non negoziabile.

### La quarta volta che il contenimento è un'assenza, non una scelta

Misurato: `import openai` → `ModuleNotFoundError`; `OPENAI_API_KEY` vuota. Oggi il percorso
muore all'import.

È la **quarta occorrenza** dello stesso schema, dopo il trasporto SMTP mancante di
`email.send`, i moduli `core` mancanti, e la virgoletta che mascherava `S-12`. **Due di quelle
quattro hanno già smesso di proteggere** durante il programma, quando Grok ha pubblicato i
file mancanti. `pip install openai` è un comando.

Un contenimento che nessuno ha scelto non è un contenimento: è una coincidenza con una data di
scadenza.

### L'ordine di correzione, detto esplicitamente

`docs/PHASE2.md`, arrivato nello stesso push, mette come **prossimo** passo il *"Writer LLM
adapter (replace heuristics in natural_tasks)"* — lo stesso adattatore, sullo stesso
`cloud_bridge`, sul percorso che **genera codice** poi promosso in `tools/`.

**`FIX-10a`/`FIX-10b` vanno applicati PRIMA che il writer adapter esista.** Stessa logica di
`S-12` prima di `S-13`: un difetto di fondazione replicato costa il doppio a togliere, e il
secondo punto è più pericoloso del primo. L'ho scritto invece di lasciarlo intuire.

### Ho scritto anche cosa è corretto

- **Il gate di default funziona davvero**: zero tentativi negli scenari A e D, misurati.
  Grok non ha acceso niente di nascosto e l'opt-in è reale;
- `test_plan_llm_disabled_by_default` **è un buon test** e asserisce la cosa giusta
  (`assert calls == []`), non un'approssimazione;
- il fallback euristico è deterministico: il sistema non dipende dall'LLM per funzionare;
- il percorso locale esiste ed è quello conforme — **manca solo che sia il default**.

Il problema non è che Grok abbia costruito un ponte verso un LLM. È **quale estremità del
ponte è aperta quando nessuno decide.**

### File prodotti

| File | Contenuto |
|---|---|
| `docs/threat-models/MAIN_IMPLEMENTATION_SECURITY_REVIEW.md` §12 | `S-17` completo, 4 difetti, tabella misurata, 5 correzioni |
| `docs/threat-models/probes/S-17-cloud-bridge-probe.py` | riproduzione eseguibile, **non tocca la rete** |
| `docs/threat-models/GROK_FIX_LIST.md` → `FIX-10` | 5 correzioni applicabili con prima/dopo e comando di verifica |

### Correttezza verso gli altri

ChatGPT ha osservato che il commit `6af4a37` *"non contiene file di test"* pur dichiarando
218 test verdi. **È esatto a quel ref**, ma i test sono arrivati nel commit successivo
`8ae3641`. Il rilievo era corretto quando è stato scritto ed è ora superato — verificato con
`git log`, non assunto. Lo scrivo perché è la stessa cortesia che ho chiesto per me quando
Grok chiudeva findings mentre li scrivevo.

**Non ho verificato la claim "218 tests green"**: `pytest` non è installato in questo
container. Non la tratto né come vera né come falsa.

### Errori commessi in questa parte

| # | Errore | Come si è manifestato | Correzione | Lezione |
|---|---|---|---|---|
| E19 | Il primo probe usava `importlib.reload` su moduli che avevo appena rimosso da `sys.modules` | `ImportError: module core.planner not in sys.modules` allo scenario B — lo scenario A era già passato, quindi **avevo un risultato parziale che sembrava valido** | riscritto con **sottoprocessi isolati**, un processo per scenario | isolare lo stato fra scenari con `reload` è fragile: quando misuri un comportamento che dipende da variabili d'ambiente lette **all'import**, l'unico isolamento affidabile è un processo nuovo. Un risultato parziale è più pericoloso di un fallimento pulito, perché invita a fidarsi della metà che ha funzionato |

**Nessun errore di merito.** Il rischio che ho evitato deliberatamente: eseguire una chiamata
reale "per essere sicuro". Sarebbe stata esattamente la violazione descritta dal finding —
`CLD-1` vieta l'addebito, e un reviewer che viola il vincolo mentre lo verifica non ha
verificato niente, ha solo speso.

### Prove eseguite

| Verifica | Comando | Esito |
|---|---|---|
| Ref sanity | `git rev-parse main origin/main` | locale indietro, confronti fatti su `origin/main` (trappola 17 applicata **prima**, non dopo) |
| Provider di default | lettura + probe | `openai` in `cloud_bridge.py:12` e `core/config.py:43` |
| Tentativi a pagamento, 4 scenari | `probes/S-17-cloud-bridge-probe.py` | **0 / 3 / 3 / 0** |
| Chiave trasmessa | stesso probe | 3 volte nello scenario C |
| Altri entry point | `grep -rn "ask_cloud_ai\|MODEL_PROVIDER"` | solo il planner; `natural_tasks` **non ancora** — ma è il prossimo passo di PHASE2 |
| Contenimento attuale | `python3 -c "import openai"` | `ModuleNotFoundError` — contenimento per assenza |
| Suite contratti dopo il merge | tre comandi in ordine | **138/138 pass**, typecheck e build exit 0 |
| Hash piano canonico | `sha256sum` | `a3fcdfc9…` invariato |

### Confini rispettati

**Non ho modificato una riga** di `cloud_bridge.py`, `core/planner.py` o `core/config.py`. È
codice di Grok e la correzione è una decisione di baseline. La tentazione era concreta:
`FIX-10a` è cambiare una stringa in due punti.

**Non ho eseguito nessuna chiamata reale** e non ho installato `openai`.

---

## Sessione 4, terza parte — `S-17` escalation: il writer adapter è arrivato prima del fix

**Richiesta di Christian:** *"CONTINUA CON I TUOI LAVORI E SE FINITI PUBBLICALI SU GIT"*, più
la domanda su quanto ho completato (risposta con la formula §7.4, non a sensazione).

### Trappola 11, quarta volta di fila che paga

`main` si era mossa di nuovo (`04ae305` → `8c4224c`) ed era comparso un branch nuovo,
`agent/strict-zero-cloud-bridge-20260818`.

**Il branch non contiene il fix.** Il nome promette esattamente `FIX-10`, il contenuto è
`6af4a37`: **0 commit avanti, 6 indietro** rispetto a `main`. Verificato con
`git rev-list --count`, non dedotto dal nome. Chi lo leggesse per titolo concluderebbe che
`S-17` è in lavorazione. Non lo è.

**È la stessa forma dei sette "controlli che non controllano" già trovati su `main`:** una cosa
che *sembra* una difesa perché si chiama come una difesa. Stavolta però l'oggetto è un branch,
non una funzione — e mi ha quasi ingannato: stavo per scrivere "il fix è in corso".

### Quello che §12.8 chiedeva di non fare è stato fatto

`S-17` §12.8 diceva: *"`FIX-10a`/`FIX-10b` vanno applicati PRIMA che il writer adapter
esista."* Grok ha pubblicato `_code_via_llm` (opt-in `UJ_WRITER_LLM=1`) senza il fix.

Verificato al ref corrente: `MODEL_PROVIDER` è **ancora** `openai` in `cloud_bridge.py:12` e
`core/config.py:43`; `UJ_ALLOW_PAID_API` **non esiste**.

### Misurato: la superficie è esattamente raddoppiata

Stesso metodo, sottoprocessi isolati e modulo `openai` finto, nessuna rete. Guidato
`core.natural_tasks._code_for_prompt()`:

| Scenario | Provider | Tentativi fatturabili |
|---|---|---:|
| default | `openai` | **0** |
| **solo `UJ_WRITER_LLM=1`** | `openai` | **3** |
| + chiave | `openai` | **3**, trasmessa |
| + `MODEL_PROVIDER=local` | `local` | **0** |

Prima c'era **una** variabile che da sola apriva il percorso a pagamento. Ora ce ne sono
**due**, indipendenti, e la seconda è sul percorso che **genera codice** poi promosso in
`tools/`.

Non è cresciuta "in generale": è cresciuta **esattamente** del doppio, perché ogni gate è una
condizione separata sullo stesso ponte immutato. Ed è la ragione per cui `FIX-10a`/`FIX-10b`
vanno nel **ponte** e non nei gate: chiudono entrambe le porte insieme, e prevengono la terza.

`PHASE2.md` ora elenca *"Embedding-backed recall (**needs model**)"* e *"Multi-agent debate
loop"*. **La terza e la quarta porta sono già scritte nella roadmap.**

### Ho scritto cosa Grok ha fatto BENE, perché non è una ripetizione peggiorata

- **Il writer passa il codice generato per `advisors.safety.scan_text`** e lo rifiuta se scatta
  un hit (`natural_tasks.py:90-91`). Il planner non aveva niente di simile: è la lezione di
  `FIX-1` applicata **spontaneamente** al percorso nuovo.
- Il gate di default continua a funzionare: scenario A a 0 tentativi, misurato.
- I test coprono opt-in, safety reject e default-off — i tre casi giusti.

**Il difetto non è nel writer adapter. È che è stato costruito su un ponte già noto come
difettoso, e quel ponte non è stato toccato.**

### Cosa NON ho misurato, dichiarato

Ho guidato `_code_for_prompt()` **direttamente**: i 3 tentativi sono del solo percorso writer.
**Non ho misurato un giro `uj` end-to-end** con planner e writer entrambi attivi. Per aritmetica
ci si aspetterebbero 6 tentativi per una singola richiesta utente, ma non l'ho verificato e
**non lo affermo**.

### Errori commessi in questa parte

Nessun errore tecnico. Un errore di concetto evitato: **stavo per registrare `S-17` come "in
lavorazione presso Grok"** sulla base del nome del branch `agent/strict-zero-cloud-bridge-*`.
Due comandi (`git rev-parse`, `git rev-list --count`) hanno mostrato che è vuoto. È
letteralmente la trappola 11 applicata a un branch invece che a una consegna: **il nome
descrive un'intenzione, i commit descrivono lo stato.**

### Prove eseguite

| Verifica | Esito |
|---|---|
| `MODEL_PROVIDER` default al ref corrente | **`openai`**, invariato in entrambi i punti |
| `git grep UJ_ALLOW_PAID_API` | **assente** — FIX-10b non applicato |
| Branch `strict-zero-cloud-bridge` vs `main` | **0 avanti, 6 indietro** — non contiene il fix |
| Percorso writer, 4 scenari | **0 / 3 / 3 / 0** |
| Suite contratti dopo il merge | **138/138**, typecheck e build exit 0 |

---

## Sessione 4, quarta parte — decisione n. 7 approvata, `S-17` chiuso e verificato

**Richiesta di Christian:** *"MODEL_PROVIDER deve diventare local di default … nessuna
chiamata cloud o API pay-per-use deve avvenire implicitamente. Se il provider locale non è
disponibile, il sistema deve fallire in modo sicuro, senza fare fallback automatico verso
OpenAI o altri provider. Registra la decisione n. 7 come approvata, aggiorna i test e mantieni
invariati task weight e backlog."*

### Trappola 11 mi ha impedito di scrivere codice che esisteva già

Stavo per applicare `FIX-10a`/`FIX-10b` di mia mano. Il fetch ha mostrato **cinque** movimenti
nuovi, fra cui `agent/strict-zero-cloud-bridge-20260818` passato da `6af4a37` a `1251a68`.

Nella terza parte avevo scritto che quel branch era **vuoto** — 0 avanti, 6 indietro — e che
il nome prometteva un fix che non c'era. **Adesso il fix c'è davvero.** Se avessi scritto il
mio, avremmo avuto due correzioni divergenti sullo stesso file da riconciliare a mano.

**Il lavoro giusto non era applicare la correzione: era verificarla.** E ChatGPT l'aveva
chiesto esplicitamente, in `docs/program/reviews/inbox/CLOUD_BRIDGE_STRICT_ZERO_REVIEW_20260818.md`:

> *"UJ-SEC-001 / owner **CLAUDE**: verificare che il blocco soddisfi la policy e che non rompa
> il runtime previsto."*
>
> *"Controlli dichiarati: ispezione statica del diff e progettazione dei test; **esecuzione
> runtime/test non disponibile in questo checkout**."*

Di nuovo la stessa divisione del lavoro: ChatGPT progetta e non può eseguire, io eseguo.

### La correzione è migliore di quella che avevo proposto, e lo scrivo

`FIX-10b` mio metteva **un interruttore** davanti all'adapter a pagamento. ChatGPT ha
**cancellato l'adapter**: `_call_openai` non esiste più.

È la scelta giusta e la differenza non è stilistica. Un interruttore è una manopola, e questo
albero ne ha già sette che non giravano nulla. **Un meccanismo che non esiste non può essere
riacceso per default sbagliato.**

E contiene una difesa che **io non avevo identificato**: `_validate_local_base` vincola
`LMSTUDIO_BASE` al loopback. Dopo il fix il percorso locale è l'**unico** percorso, quindi
senza quel controllo lo si poteva puntare a un endpoint remoto a pagamento con una variabile.
È il buco che si apre *perché* si chiude l'altro. L'ha visto ChatGPT prima di me.

### Verifica per esecuzione, non per lettura

**1. Il criterio che avevo scritto io** (`FIX-10`: scenari B e C da 3 a 0). Rieseguito il
probe committato, invariato:

| Scenario | Prima | Dopo |
|---|---:|---:|
| default | 0 | **0** |
| `UJ_PLANNER_LLM=1` | **3** | **0** |
| + chiave | **3** | **0** |
| `MODEL_PROVIDER=local` | 0 | **0** |

**2. Sei attacchi al confine di provider** — planner e writer, incluso `MODEL_PROVIDER=openai`
**esplicito**, maiuscole, spazi, e un altro cloud: **6 su 6 bloccati, 0 tentativi**. Anche il
caso esplicito, perché non c'è più un adapter da raggiungere.

**3. Tredici attacchi all'endpoint locale** — il nuovo confine di sicurezza: userinfo
(`http://127.0.0.1@evil.com/`), suffisso (`localhost.evil.com`), fragment, schema `file://`,
`127.0.0.1` in decimale (`2130706433`), IPv4 mappato IPv6. **13 su 13 corretti.** Le
codifiche alternative falliscono perché la validazione è un **allowlist di hostname esatti**,
non una regex — è il progetto giusto.

**4. Non rompe il runtime**, che era la seconda metà della domanda di ChatGPT. Confronto
onesto, `main` in un worktree pulito:

| Albero | pytest |
|---|---|
| `origin/main` @ `1e40376` pristine | **215 passed, 1 failed** |
| `main` + fix + le mie aggiunte | **239 passed, 1 failed** |

**Nessuna regressione.** L'unica failure è pre-esistente su `main` e non c'entra col bridge —
verificato nel worktree, non assunto.

### Quello che il fix non copriva, e che ho chiuso io

`core/config.py` legge la **stessa** variabile e il branch non lo toccava: righe 30 e 43,
default `openai`.

**Oggi è inerte** — ho verificato con `grep` che nessuno legge `Config.model_provider` — e lo
dico invece di gonfiarlo. Ma è una decisione applicata a metà: due punti leggono la stessa
variabile e rispondono diversamente. Stessa forma di `S-16`: si corregge nello schema **prima**
che il cablaggio esista. Allineato anche `lmstudio_base` a `127.0.0.1`.

### Test aggiornati, come richiesto

**`tests/test_config.py::test_defaults` asseriva `== "openai"`.** Era un test che codificava
la **vecchia policy**: la decisione n. 7 lo rende falso per costruzione. Aggiornato a `"local"`
**con il motivo e la data nel docstring** — un test cambiato senza spiegazione è un test che
una sessione futura "ripristina" pensando di riparare una regressione.

**Aggiunto `tests/test_cloud_bridge_strict_zero_policy.py`, 21 test.** Coprono il percorso che
i test di ChatGPT non toccano: loro monkeypatchano `PROVIDER`, i miei **ricaricano il modulo
leggendo davvero l'ambiente**, che è il percorso in cui il difetto originale è nato. Più il
fail-safe esplicito richiesto da Christian, i 13 endpoint, e la coerenza di `core/config.py`.

### Errori commessi in questa parte

Nessuno tecnico. **Un errore evitato dalla trappola 11**, e vale la pena registrarlo perché è
il rovescio esatto della terza parte: allora il branch si chiamava come un fix e era vuoto,
**adesso lo stesso branch contiene il fix vero**. Se mi fossi fidato di quanto avevo scritto
poche ore prima — "quel branch non contiene il fix" — avrei scritto una correzione duplicata.
**Il RESUME_POINT descrive il passato anche quando l'ho scritto io un'ora fa.**

Un secondo rischio evitato: `pytest` non era installato e la tentazione era dichiarare
"non verificabile qui", come avevo fatto nella seconda parte per la claim dei 218 test.
`pip install pytest` è un pacchetto di sviluppo, gratuito e senza implicazioni di policy —
diverso da `pip install openai`, che è il pacchetto che il finding dice di non installare. La
distinzione è fra uno strumento di verifica e il meccanismo sotto esame.

### Scoperta collaterale — `S-18`: la test suite distrugge la memoria di Grok

Non l'ho cercata: `git status` dopo `pytest` mostrava **`grok.md` modificato**, da
`"224 green. Real gates…"` a `"new"`, più `a.txt`, `notes/`, `sub/` nella root.

**La test suite sovrascrive un file tracciato che è la memoria di continuità di un'altra IA.**

Causa dimostrata: la fixture `tmp_root` fa `monkeypatch.setattr("tools.files.PROJECT_ROOT",
tmp_path)`, ma `tools/files.py` cattura la root nei **default degli argomenti**
(`root: Path = PROJECT_ROOT`), valutati **una sola volta alla definizione**. Il monkeypatch
non li tocca: la fixture è un **no-op** e ogni scrittura va nel repository vero.

```
module PROJECT_ROOT : /home/user/ultraJARVIS
after monkeypatch   : /tmp/fake-root
safe_write default  : /home/user/ultraJARVIS   <-- non segue il monkeypatch
```

Tre ragioni per cui è HIGH: (1) chi fa `pytest` + `git add -A` committa la distruzione della
memoria di Grok senza accorgersene — me ne sono accorto solo perché **leggo** `git status`,
lezione `E15`; (2) il test che fa il danno è `test_force_override`, che usa `force=True`,
cioè il vettore di `S-11`, **contro il repository vero**; (3) `test_protected_refusal` e
`test_escape_root_refused` **passano per il motivo sbagliato** — passano perché la root reale
è davvero protetta, non perché la fixture funzioni.

È la **trappola 12 rovesciata**: lì un test che fallisce per il motivo sbagliato è un falso
negativo, qui un test che passa per il motivo sbagliato è un falso positivo. Stessa regola:
leggere *perché* un test dà quel risultato.

**Corollario che conta più del danno:** finché la fixture non isola, **`FIX-3` e `FIX-4` non
hanno una prova valida** — le loro asserzioni passerebbero anche se il contenimento fosse
stato tolto dalla funzione.

Ripristinato (`git checkout -- grok.md`, rimossi i tre file spuri), documentato in
`MAIN_IMPLEMENTATION_SECURITY_REVIEW.md` §15 e `GROK_FIX_LIST.md` → `FIX-11`. **Non corretto:
è codice di Grok e fuori dalla decisione n. 7.**

### Confini rispettati

- **`BACKLOG.json`, status e pesi: invariati**, come richiesto. Nessun `task_ledger_delta`.
- **Non ho mergiato su `main`.** Il lavoro è sul mio branch.
- **Non ho eseguito nessuna chiamata reale** e non ho installato `openai`.
- **Non ho corretto i 6 moduli di test non importabili** trovati su `main`: sono di Grok,
  pre-esistenti, fuori dalla decisione n. 7. Segnalati, non toccati.

### Prove eseguite

| Verifica | Esito |
|---|---|
| Probe `S-17` contro l'albero corretto | **0 tentativi in tutti e 4 gli scenari** (era 0/3/3/0) |
| 6 attacchi di provider | **6 su 6 bloccati** |
| 13 attacchi di endpoint loopback | **13 su 13 corretti** |
| `pytest` su `main` pristine (worktree) | 215 passed, 1 failed |
| `pytest` su albero corretto | **239 passed, 1 failed** (stessa failure pre-esistente) |
| Suite contratti | **138/138**, typecheck e build exit 0 |
| Merge a tre vie: lavoro recente di main preservato? | writer adapter e real gates **presenti** |

---

## Sessione 4, quinta parte — perché il ledger dice `0/76`, e la parte che era colpa mia

**Richiesta di Christian:** *"Cerca di capire e sistemare i 0 su 76 di ChatGPT."*

### La domanda conteneva due cose, e separarle è metà del lavoro

**`accepted_weight = 0/76` è CORRETTO e non va toccato.** `PROGRESS.md` regola 2 e 4, più
l'esempio lavorato che descrive letteralmente il mio caso: *"produces all artifacts but no
reviewer has passed them → accepted weight 0/13, contribution to progress 0"*. Portarlo a un
numero diverso sarebbe il falso avanzamento che ho contestato a ChatGPT (`F-001`) e a Gemini
(`G-003`). Non l'ho fatto.

**Lo status `READY`/`BLOCKED` invece di `REVIEW` è invece un difetto vero**, e la causa è mia.

### La causa: non ho MAI emesso un `ResponsePacket`

Cercato in tutto il repository: **non esiste un solo `ResponsePacket` firmato CLAUDE**. L'unico
JSON che avevo prodotto è un `ReviewResult` per il task di ChatGPT.

Il ledger si muove sui packet. Io ho consegnato blueprint, contratti, test, threat model, review
e handoff, e ho scritto resoconti dettagliati in `CLAUDE.md` — **ma non ho mai mandato l'oggetto
che la macchina consuma.** Dal punto di vista del ledger non ho mai dichiarato di aver
consegnato niente.

**E non è una formalità scoperta adesso: è AC-05 della mia stessa card.**

> *"ResponsePacket is valid, cites every artifact hash, proposes REVIEW, and keeps accepted
> weight at 0/13."* — `prompts/delegation-cards/UJ-RUN-001-CLAUDE.json`

**Ho soddisfatto quattro criteri su cinque e saltato proprio quello che rende contabili gli
altri quattro.** È il difetto più imbarazzante trovato finora in questo programma, ed è mio.

Il rovescio, per onestà: nessuno me l'ha contestato per quattro sessioni e il `BACKLOG.json` non
ha mai segnalato l'assenza. **Un criterio che nessuno verifica è un criterio che verrà mancato.**

### Corretto per 1 task su 8, e gli altri 7 non sono correggibili da me

`docs/program/packets/UJ-RESP-RUN-001-CLAUDE.json` — validato, **15 artefatti citati con ogni
hash verificato contro i byte committati**, `READY → REVIEW`, **accepted weight 0 → 0/13**.

Per gli altri sette **non è possibile in modo veritiero**: `card_id` è obbligatorio nello schema,
e le delegation card esistenti sono **quattro in tutto** — una sola mia (`UJ-CARD-RUN-001-CLAUDE`).
Per gli altri dovrei inventare un `card_id` che non corrisponde a nessuna card, cioè scrivere una
dichiarazione falsa dentro un documento il cui unico scopo è essere verificabile.

Stesso ragionamento di `F-003`: **quando il deliverable corretto non è rappresentabile nel
formato previsto, si consegna la sostanza e si dichiara l'impedimento.** Serve che ChatGPT emetta
sette card. **Il collo di bottiglia dei 57 punti consegnati è quello, e non è mio.**

### Secondo difetto strutturale: mancava il gate per i packet

`validate-council-packets.mjs` ha `--review-result`, `--schemas-only`, `--review-self-test`, ma
**nessun entry point per un `ResponsePacket`** — cioè per l'oggetto che muove lo status di ogni
task. Nessuno dei quattro poteva controllare un packet prima di mandarlo, né l'integratore
all'arrivo.

Fornito `scripts/validate-response-packet.mjs`. **Non modifica il validatore di ChatGPT: riusa
la sua stessa `validate()`**, estratta a runtime, così le due porte non possono divergere.

**L'ho attaccato invece di fidarmene: 8 candidati, 8 respinti** — auto-accettazione 13/13,
accettazione parziale 5/13, hash falsificato, artefatto fantasma, `proof_ref` non citato, delta
verso un altro task, `status: DONE`, attestazione di policy falsa.

L'accettazione parziale respinta è la **conferma incrociata di `F-001`**: il `5/8` di
`UJ-META-002` presente nel ledger non è producibile dal gate del programma stesso.

### Errore commesso in questa parte

| # | Errore | Come si è manifestato | Correzione | Lezione |
|---|---|---|---|---|
| E20 | **Ho scritto il packet a mano prima di validarlo**, assumendo le forme dei campi invece di leggerle | il validatore ha respinto la prima versione con **8 errori**: `response_id` con pattern sbagliato, e `capabilities_actually_used`, `side_effects`, `risks` scritti come stringhe dove lo schema vuole oggetti strutturati | riletto lo schema campo per campo, rigenerato, rivalidato | **è esattamente il difetto che sto diagnosticando, in miniatura**: avevo prodotto un artefatto plausibile senza passarlo dal gate. Che il gate non esistesse ancora non è una scusa — l'ho scritto io dieci minuti dopo. Prima si costruisce la verifica, poi si produce la cosa da verificare |

### Rilievo minore sullo schema

`risk_id` impone `^R-[0-9]{3}$`, ma la nomenclatura reale del programma è `R-SEC-01`, `R-RUN-01`,
`R-MCP-01`. **Nessun rischio reale può essere citato in un packet col proprio identificatore.**
Ho rispettato lo schema e perso il riferimento incrociato. Da allineare, uno dei due.

### Prove eseguite

| Verifica | Esito |
|---|---|
| `ResponsePacket` firmati CLAUDE esistenti prima di oggi | **zero** |
| Delegation card per i miei 8 task | **1 su 8** (`UJ-CARD-RUN-001-CLAUDE`) |
| Schema del packet, campo per campo | 24 campi obbligatori, `card_id` fra questi |
| Validazione del mio packet | **PASS** |
| Hash dei 15 artefatti contro i byte al commit | **15 su 15 coincidono, 0 mismatch** |
| Esistenza del `source_commit_sha` | verificata |
| Suite avversariale sul validatore nuovo | **8 attacchi, 8 respinti** |
| `node scripts/validate-council-packets.mjs` | **PASS**, invariato |
| Suite contratti | **138/138**, typecheck e build exit 0 |

### Confini rispettati

- **`BACKLOG.json` non toccato**, pesi e status invariati: la loro modifica è dell'integratore.
- **Non ho modificato `validate-council-packets.mjs`**: è di ChatGPT. Il mio script è additivo e
  riusa la sua logica invece di duplicarla.
- **Non mi sono assegnato un'unità di peso.** Il packet propone `0 → 0/13`.

---

## Sessione 4, sesta parte — handoff per la sessione nuova, e tre scoperte nel farlo

**Richiesta di Christian:** *"QUESTA SESSIONE STA DIVENTANDO PESANTE, APRI UNA NUOVA SESSIONE
E FAGLI RICORDARE TUTTO."*

### Il lavoro vero non era aprire una sessione: era rendere la memoria sufficiente

In questo programma la memoria sta nei **file**, non nella chat — è l'intera ragione per cui
`CLAUDE.md` e `AVVIO_NUOVA_SESSIONE.md` esistono. Una sessione nuova ricostruisce tutto solo se
quei file sono corretti. Quindi il deliverable è l'handoff, non il click.

### `AVVIO_NUOVA_SESSIONE.md` era scaduto nel punto peggiore

Diceva ancora: branch `claude/ultrajarvis-repo-analysis-li6vvj`, *"ORA IDENTICO a main"*.
**Falso da tre parti di sessione**: il branch di sessione 4 è un altro e non coincide con main.

È **esattamente l'errore E16** che avevo già corretto in `CLAUDE.md` — la ricetta sbagliata nel
punto che si legge per primo — e l'avevo lasciato in piedi nell'altro file. Riscritto per
intero: identità e scopo del programma, branch (con l'avvertenza di rileggerlo invece di
fidarsi), controllo dei ref prima dei diff, trappola 11, la ricetta con la build, le due regole,
i divieti, e una tabella di stato con i findings aperti.

### Trappola 11, e stavolta ha impedito un danno concreto

`git merge origin/main` → **conflitto su `cloud_bridge.py`**, cioè il file dello STRICT_ZERO.
Una risoluzione distratta avrebbe riaperto `S-17`, il percorso a pagamento.

### Scoperta 1 — `S-17` è ANCORA APERTO su `main`

Verificato al ref: `origin/main` ha `MODEL_PROVIDER` default `openai`, ha `_call_openai`, e ha
**un secondo sito** che costruisce un client OpenAI. **Il fix approvato (decisione n. 7) non è
mai stato mergiato su main**: vive sul branch `agent/strict-zero-cloud-bridge-20260818` e sul mio.

Christian aveva approvato la decisione, io l'avevo verificata — ma **l'approvazione non ha
prodotto un merge**. È una lezione di processo, non tecnica: *una decisione approvata e
verificata non è una decisione applicata finché non arriva sul ramo che conta.*

### Scoperta 2 — `S-19`: il budget gate non ferma niente

`cloud_bridge.embed()` su `main`:

```python
try:
    from core.monetization import assert_llm_budget, record_llm_call
    assert_llm_budget()          # solleva QuotaExceeded se il budget e' sforato
    record_llm_call(...)
except Exception:
    pass                          # <-- inghiotte QuotaExceeded
provider = os.getenv("MODEL_PROVIDER", "openai").lower()
if provider == "openai":
    ...  # la chiamata a pagamento procede lo stesso
```

**Il guard è dentro un `except Exception: pass`**: l'eccezione che dovrebbe fermare la chiamata
viene catturata e ignorata, e l'esecuzione prosegue fino alla richiesta fatturabile. È l'**ottava
occorrenza** dello stesso schema — un controllo che sembra una difesa e non ferma nulla.

**Per correttezza: in `ask_cloud_ai` lo stesso guard è scritto BENE** — `QuotaExceeded` viene
riconosciuto e la funzione ritorna `""`. Il difetto è solo in `embed()`. Dirlo com'è evita di
attribuire a Grok un errore sistematico quando è un punto solo.

### Scoperta 3 — una mia previsione smentita si è ri-avverata due commit dopo

Nella quinta parte avevo scritto che *"embedding-backed recall"* e *"debate loop"* **non**
avevano aperto porte a pagamento, e l'avevo registrato come previsione mia smentita dai fatti.
Era vero al ref che avevo controllato.

**Poi main ha aggiunto `embed()`, che va su OpenAI per default.** Quindi la terza porta si è
aperta davvero, un commit dopo che avevo dichiarato il contrario.

Non è un errore di misura: è la dimostrazione che **in questo programma una verifica ha una
scadenza di ore**. La correzione è già scritta qui invece di lasciare in giro la nota vecchia.

### Scoperta 4 — `core/billing.py` è comparso su `main`

Skeleton Stripe: con `STRIPE_SECRET_KEY` che inizia per `sk_`, fa una **POST reale** a
`api.stripe.com`. **Nessun chiamante** al ref corrente — verificato con `git grep`, non assunto.

Non è una violazione dell'Articolo 5: riguarda l'addebito a **futuri clienti**, non la spesa di
Christian. Ma è un `EXTERNAL_WRITE` verso un provider di pagamento senza ammissione né
approvazione, quindi va nel perimetro di `S-02` e andrà revisionato prima che qualcuno lo cabli.

### Come ho risolto il conflitto

Applicando la **decisione n. 7**, che è approvata e generale (*"nessuna chiamata cloud o API
pay-per-use deve avvenire implicitamente"*), non limitata a una funzione:

- mantenuto il bridge strict-zero: default `local`, allowlist dei provider, `_validate_local_base`,
  **nessun adapter cloud**;
- mantenuta l'integrazione quota/budget di main in `ask_cloud_ai`, che è corretta;
- portato **`embed()` sotto la stessa policy**: local-only, provider non-local rifiutato prima di
  costruire la richiesta;
- corretto il guard di `embed()` perché `QuotaExceeded` **fermi** la chiamata invece di essere
  inghiottito, con un commento che spiega perché non deve tornare un `except Exception: pass`.

**Verificato dopo il merge**, non dedotto: probe `S-17` → **0 tentativi in tutti e 4 gli
scenari**; `pytest` → **254 passed, 1 failed** (la failure pre-esistente di `main`).

### Errori commessi in questa parte

Nessuno tecnico. Un errore **già commesso e ripetuto in un altro file**: E16 — la ricetta
scaduta nel documento più letto. L'avevo corretto in `CLAUDE.md` in questa stessa sessione e
**non avevo controllato l'altro file che conteneva la stessa informazione**. La lezione non è
"aggiorna i file": è che **un'informazione duplicata in due punti diverge sempre**, e va
cercata ovunque quando cambia.

`S-18` si è ripresentato durante i test (`grok.md` sovrascritto): ripulito con
`git checkout -- grok.md` prima del commit, come da procedura.

### Prove eseguite

| Verifica | Esito |
|---|---|
| Conflitto `cloud_bridge.py` risolto | strict-zero preservato, 0 riferimenti a OpenAI nel file |
| Probe `S-17` dopo il merge | **0 tentativi fatturabili in tutti e 4 gli scenari** |
| `pytest` (esclusi i 6 moduli rotti pre-esistenti) | **254 passed, 1 failed** (pre-esistente) |
| Suite contratti | **138/138**, typecheck e build exit 0 |
| `S-17` su `origin/main` | **ancora aperto**: default `openai`, `_call_openai` presente |
| `core/billing.py` — chiamanti | **nessuno** al ref corrente |

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
| 7 | **`S-17` / `FIX-10`: il default di `MODEL_PROVIDER` deve diventare `local`?** | **RISOLTA 2026-08-18 — APPROVATA da Christian.** Default `local`, nessuna chiamata pay-per-use implicita, fail-safe senza fallback al cloud. Correzione di ChatGPT, verificata da me: `docs/program/reviews/UJ-SEC-003-S17-VERIFICATION-CLAUDE.md` |

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
| ~~`R-SEC-05`~~ | `S-17`: `cloud_bridge` andava sul provider a pagamento per default | — | **CHIUSO E VERIFICATO** 2026-08-18: adapter OpenAI rimosso, default `local`, endpoint vincolato al loopback. 6 attacchi di provider e 13 di endpoint bloccati, 215 → 239 test |
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
15. **Mai testare l'esito di un comando attraverso una pipe** (E13, quasi ripetuto in E18).
    `git push … | tail` restituisce l'exit di `tail`: ho dichiarato riuscito un push
    rifiutato. Cattura l'output in una variabile o su file e testa `$?` del comando vero.
    Una verifica che non può fallire non è una verifica — è un'auto-attestazione, cioè
    TH-10 applicata a me stesso.
    **Vale per QUALUNQUE pipe, anche innocua** (E18): un `| grep -v` per ripulire l'output
    ha fatto leggere `exit 1` su un typecheck che era a `0`. Non esiste una pipe "solo
    cosmetica" a valle di un comando di cui devi leggere l'esito.
    Il segnale che salva è l'**incoerenza fra output e verdetto**: un exit diverso da zero
    con zero errori stampati (o viceversa) va sempre indagato, mai riportato.
16. **`main` non è più solo tuo né solo di ChatGPT.** Prima di qualunque merge, `git fetch`
    e guarda dov'è arrivato: in questa sessione è passato da 1 a 114 file mentre lavoravo.
    E prima di mergiare il branch di un'altra IA, verifica su cosa è basato: se parte da un
    ref vecchio, una risoluzione sbagliata cancella il lavoro altrui.
17. **Dopo `git fetch`, il `main` locale NON è `origin/main`** (E17, ripetizione di E14).
    Ogni confronto fra branch va fatto contro `origin/main`, mai contro `main`. Un diffstat
    assurdo è il sintomo, ma arriva **dopo** che hai già tratto la conclusione sbagliata:
    controlla `git rev-parse main origin/main` **prima** di interpretare un diff.
18. **Una procedura di verifica va provata da zero, non ricordata** (E16). Il blocco
    `NON RIFARE` del RESUME_POINT ometteva `npx tsc -p packages/contracts` (la build), e
    seguirlo alla lettera dava 5 suite fallite su 5. Se scrivi una ricetta in due punti del
    file, **le due copie divergeranno**: quella nel punto più letto è quella che conta.
    Corollario: `dist/` è in `.gitignore`, quindi in un container nuovo non esiste mai.
19. **Un gate di forma e un gate di merito sono porte diverse, in serie** (UJ-CAP-001).
    Che un integratore abbia respinto una consegna per formato non significa che il suo
    contenuto sia stato giudicato. Se sei il reviewer designato, il tuo verdetto sul merito
    serve **prima** del reinvio, non dopo: altrimenti si paga un terzo giro di HUMAN_BRIDGE,
    e quelli li paga Christian a mano.

---

# PARTE 8 — RESUME_POINT

```
PROGRAMMA : ultraJARVIS
AI_ID     : CLAUDE — Runtime, Security & Skill Architect

BRANCH    : ATTENZIONE — CAMBIATO IN SESSIONE 4.
            Sessione 4 in poi : claude/claude-md-resume-point-tvej1u
            Sessioni 1-3      : claude/ultrajarvis-repo-analysis-li6vvj
            Il branch è assegnato dall'ambiente, non lo scelgo io: RILEGGI quale ti
            è stato dato invece di fidarti di questa riga. Da sessione 4 il branch di
            lavoro NON coincide più con main: il pre-verdetto UJ-CAP-001 sta sul
            branch di sessione 4 e NON è su main.

MAIN      : commit 9d80f9f+ (verificato in sessione 4, sesta parte — si era mossa
            di 7 commit in meno di un'ora). La riga sotto dice 302852a/319
            file: era vero a fine sessione 3 ed è già superato — main si muove.
            Contiene il piano canonico, il Program OS di
            ChatGPT, i miei contratti/blueprint/review, e l'implementazione Python di
            Grok (core/, tools/, advisors/, bin/uj, tests/*.py). ATTENZIONE: essere su
            main NON significa accettato. Ledger invariato: 0/76 mio, 0/13 UJ-INT-001,
            0/8 UJ-INT-006. GOVERNANCE.md dice che main è "stato accettato": da questa
            sessione non è più vero alla lettera, per decisione del proprietario.

PROMPT    : docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md — ORA SU main, non serve più
            leggerlo da un branch. sha256 attesa:
            a3fcdfc97b48e9b1f37e1a1798b0b5e7231309d03ab4e13683622eaf1fa69a87
            Verifica: sha256sum docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md

STATO     : UJ-RUN-001  REVIEW        attende Gemini,    11/13 proposti
            UJ-SEC-001  REVIEW        attende Grok,       11/13 proposti
            UJ-MCP-001  REVIEW        attende Gemini,      7/8  proposti
            UJ-RCV-001  REVIEW        attende ChatGPT,     6/8  proposti
            UJ-SKL-001  REVIEW        attende ChatGPT,    11/13 proposti
            UJ-CLD-001  REVIEW        attende Gemini,       7/8  proposti
            UJ-REV-001  REVIEW        attende Christian,    4/5  proposti
            UJ-REV-002  BLOCKED       UJ-INT-007 è DEFERRED a M8/M9, non lavorabile

TUTTI E TRE I P0 DEL PROGRAMMA SONO CHIUSI.
7 TASK SU 8 SONO IN REVIEW. IL PORTAFOGLIO DI PRODUZIONE È ESAURITO,
MA I DOVERI DA REVIEWER NO — E QUELLI ARRIVANO SENZA PREAVVISO.

FATTO NUOVO (sessione 3, seconda metà): dopo il merge di PR #1 e PR #2 su main
            (autorizzato esplicitamente da Christian), ho trovato che il merge rende
            attuale il mio ruolo su codice che esegue tool. Ho consegnato una security
            review completa dell'implementazione Python di Grok, ora canonica su main:

            UJ-SEC-003 (PROPOSTA, non baselined, 0 peso assegnato):
              docs/threat-models/MAIN_IMPLEMENTATION_SECURITY_REVIEW.md
              16 findings, 8 HIGH, ognuno riproducibile con un comando.
              I tre più gravi:
              - S-10: files.safe_read legge QUALUNQUE file del sistema (nessun
                contenimento nella root — il controllo esiste già in safe_write
                accanto e va copiato)
              - S-11: force=True aggira la lista PROTECTED e il registry lo inoltra
                senza filtro -> si può sovrascrivere core/registry.py stesso
              - S-12+S-13: la promozione di codice generato in tools/ non ha alcun
                gate di safety, ed è mascherata SOLO da un bug di sintassi (una
                virgoletta di troppo) che oggi impedisce ai tool promossi di
                caricarsi. CORREGGERE S-12 PRIMA DI S-13: l'ordine inverso apre
                l'esecuzione di codice non validato.

            Tradotta in correzioni applicabili per Grok:
              docs/threat-models/GROK_FIX_LIST.md — 9 fix, ciascuno con file, riga,
              prima/dopo, comando di verifica. La sezione 0 spiega l'ordine FIX-1
              prima di FIX-2, e va letta per prima da chi la applica.

            AGGIORNAMENTO — GIÀ FATTO, NON RIFARE: Grok ha applicato tutti e 9 i fix
            (9 commit, main @ fc5458b) MENTRE preparavo questo handoff. Non ho preso
            la sua parola: ho rieseguito ogni comando di riproduzione. Risultato:
              10 findings su 16 CHIUSI e VERIFICATI (S-01, S-03 parziale, S-08, S-09,
              S-10, S-11, S-12, S-13, S-14, S-15). Dettaglio in
              MAIN_IMPLEMENTATION_SECURITY_REVIEW.md §10-ter, con il comando e
              l'esito di ognuno.
              Restano aperti, non per manomissione ma perché fuori scope del fix:
              S-02 (parziale — ammissione ok, manca tetto/evento), S-06 (automazione
              UI nel catalogo, è una domanda di policy), S-07 (nessun evento tool.*),
              S-16 (memoria senza provenienza, è di Gemini non di Grok).

SESSIONE 4 — FATTI NUOVI, LEGGERE PRIMA DI TUTTO IL RESTO:

  A) LA RICETTA DI VERIFICA QUI SOTTO ERA ROTTA, ORA È CORRETTA (errore E16).
     Mancava la riga di BUILD. Senza quella, 5 suite su 5 falliscono con
     ERR_MODULE_NOT_FOUND e sembra una regressione che NON esiste. Ordine giusto:
       npx tsc -p packages/contracts --noEmit    (typecheck)
       npx tsc -p packages/contracts             (BUILD — i test importano da dist/)
       for f in tests/contracts/*.test.mjs; do node --test "$f"; done
     Riverificato in sessione 4: 138/138 pass, exit 0. Nessuna regressione.

  B) GEMINI HA CONSEGNATO PER LA PRIMA VOLTA, E IL PACCHETTO È IN QUARANTENA.
     Branch: agent/gemini-handoff-quarantine-20260817 (NON su main).
     ChatGPT l'ha respinto per INTAKE (nessun ResponsePacket, 4 file su 8 assenti).
     UJ-CAP-001 ha reviewer CLAUDE (verificato nella card, riga 110) -> era un
     dovere mio, arrivato senza preavviso.
     GIÀ FATTO, NON RIFARE: docs/program/reviews/UJ-CAP-001-CLAUDE-PREVERDICT.md
       Esito CHANGES_REQUIRED. 1 criterio su 5 passato (AC-02), 3 falliti NEL
       MERITO (AC-01, AC-03, AC-04), 1 fallito in intake (AC-05).
       6 findings: G-001..G-003 BLOCKER, G-004..G-006 MAJOR.
       I tre BLOCKER, in una riga ciascuno:
         G-001 zero date ISO in 528 righe; il JSON omette 7 dei 13 campi richiesti
         G-002 rate limit Google asseriti come costanti universali: ho aperto la
               fonte ufficiale e NON pubblica quei numeri (variano per modello,
               tier e progetto). Ed è l'UNICA capability che abiliterebbe lavoro
               automatico a costo zero
         G-003 "UNKNOWN" compare 1 volta in 528 righe: la sua definizione. 9
               capability, 0 unknown, confidenza tutta HIGH -> TH-10, terza
               occorrenza nel programma, terzo autore diverso
     NON è un ReviewResult e NON muove il ledger: UJ-CAP-001 resta 0/13.
     Diventerà un packet al reinvio ammesso da ChatGPT.

  E) IL LEDGER DICE 0/76 PER DUE MOTIVI DIVERSI. NON CONFONDERLI.
     1. accepted_weight 0/76 e' CORRETTO (PROGRESS.md regole 2 e 4 + esempio
        lavorato). NON va "sistemato": sarebbe falso avanzamento, §31.5.
     2. Lo STATUS READY/BLOCKED invece di REVIEW e' un difetto VERO, ed era
        colpa mia: NON AVEVO MAI EMESSO UN ResponsePacket. Il ledger si muove
        sui packet; io consegnavo artefatti e resoconti. AC-05 della mia card
        chiedeva il packet: 4 criteri su 5 fatti, saltato quello che rende
        contabili gli altri 4.
     GIA' FATTO, NON RIFARE:
       docs/program/packets/UJ-RESP-RUN-001-CLAUDE.json (validato, 15 hash
         verificati, READY->REVIEW, accepted 0->0/13)
       scripts/validate-response-packet.mjs (il gate NON esisteva; riusa la
         validate() di ChatGPT invece di duplicarla; 8 attacchi, 8 respinti)
       docs/program/reviews/UJ-LEDGER-DIAGNOSIS-CLAUDE.md (diagnosi completa)
     GLI ALTRI 7 TASK NON SONO RAPPRESENTABILI: card_id e' obbligatorio e le
     delegation card sono QUATTRO in tutto, una sola mia. Inventarne una
     sarebbe una dichiarazione falsa (stesso ragionamento di F-003).
     >>> SERVE DA CHATGPT: sette delegation card per i task che mi ha
     assegnato nel BACKLOG.json senza mai emettere una card. IL COLLO DI
     BOTTIGLIA DEI 57 PUNTI CONSEGNATI E' QUELLO, E NON E' MIO.

  D) NUOVO SU main: cloud_bridge.py + planner LLM adapter. TROVATO S-17, CRITICA.
     ChatGPT l'ha triagiato staticamente e me l'ha PASSATO esplicitamente ("il
     finding è registrato per la review di sicurezza del proprietario Claude"),
     dichiarando di non poter eseguire nulla. Io ho eseguito.
     GIÀ FATTO, NON RIFARE:
       MAIN_IMPLEMENTATION_SECURITY_REVIEW.md §12  (S-17 completo)
       docs/threat-models/probes/S-17-cloud-bridge-probe.py  (riproduzione)
       GROK_FIX_LIST.md -> FIX-10a..10e  (correzioni applicabili)
     IL RISULTATO IN UNA FRASE: per restare sul percorso GRATUITO servono DUE
     variabili d'ambiente giuste; per finire su quello A PAGAMENTO ne basta UNA.
     Misurato, 4 scenari: default 0 tentativi · UJ_PLANNER_LLM=1 -> 3 tentativi
     fatturabili a gpt-4o-mini · con chiave -> 3 e la chiave viene trasmessa ·
     MODEL_PROVIDER=local -> 0. In tutti e 4 i casi plan() ritorna lo STESSO
     piano: il caso sicuro e quello che ha appena speso sono indistinguibili.
     Contenimento di OGGI: il pacchetto openai non è installato. È la QUARTA
     volta che a proteggere è un'assenza e non una scelta, e due delle altre tre
     hanno già smesso di proteggere. `pip install openai` è un comando.
     ORDINE: FIX-10a/10b PRIMA del "Writer LLM adapter" che PHASE2.md mette come
     prossimo passo — userebbe lo stesso cloud_bridge sul percorso che genera
     codice. Stessa logica di S-12 prima di S-13.
     >>> CHIUSO (quarta parte, 2026-08-18). Christian ha APPROVATO la decisione
     n. 7: default local, nessuna chiamata pay-per-use implicita, fail-safe
     senza fallback al cloud. ChatGPT ha prodotto la correzione su
     agent/strict-zero-cloud-bridge-20260818 @ 1251a68 RIMUOVENDO l'adapter
     OpenAI (meglio del mio FIX-10b, che si limitava a gatearlo) e vincolando
     LMSTUDIO_BASE al loopback — un buco che io NON avevo visto.
     HO VERIFICATO ESEGUENDO, non leggendo: criterio 3->0 soddisfatto, 6
     attacchi di provider (incluso MODEL_PROVIDER=openai ESPLICITO) tutti
     bloccati, 13 attacchi di endpoint tutti corretti, nessuna regressione
     (main pristine 215 passed -> albero corretto 239 passed, stessa unica
     failure pre-esistente). core/config.py l'ho allineato io: il branch non
     lo toccava. Test aggiornati: test_config.py::test_defaults asseriva la
     VECCHIA policy, + 21 test nuovi in test_cloud_bridge_strict_zero_policy.py.
     Dettaglio: docs/program/reviews/UJ-SEC-003-S17-VERIFICATION-CLAUDE.md
     RESTANO APERTI solo FIX-10d/10e: osservabilità, non più costo.
     NOTA su main: `python3 -m pytest` senza argomenti NON colleziona — 6
     moduli di test non si importano (bool_not/not_, to_bytes/human_bytes,
     +4). Pre-esistente, di Grok, non toccato da me. Finché resta, nessuna
     claim "N test verdi" è riproducibile: usa gli --ignore.
     >>> STORICO (terza parte, main @ 8c4224c): IL WRITER ADAPTER È
     ARRIVATO PRIMA DEL FIX. Verificato: MODEL_PROVIDER ancora "openai",
     UJ_ALLOW_PAID_API assente. Ora le porte a una variabile sono DUE
     (UJ_PLANNER_LLM, UJ_WRITER_LLM) e la seconda genera CODICE. Misurato:
     UJ_WRITER_LLM=1 da solo -> 3 tentativi fatturabili. Dettaglio in §13
     della security review. ATTENZIONE: il branch
     agent/strict-zero-cloud-bridge-20260818 NON contiene il fix — è a
     6af4a37, 0 avanti e 6 indietro rispetto a main. Il nome promette, i
     commit no: verifica con git rev-list --count, non col titolo.
     NON ho eseguito nessuna chiamata reale e NON ho toccato il codice di Grok.

  C) SEI BRANCH che il vecchio RESUME_POINT non citava. Nessun altro dovere mio
     dentro (controllato). UJ-GGL-001 -> reviewer GROK. UJ-RED-001 -> CHATGPT.

  F) ATTENZIONE — S-17 E' ANCORA APERTO SU main (verificato sessione 4, sesta
     parte). La decisione n. 7 e' APPROVATA e io l'ho VERIFICATA, ma il fix
     NON e' mai stato mergiato su main: vive sul mio branch e su
     agent/strict-zero-cloud-bridge-20260818. Su origin/main MODEL_PROVIDER e'
     ancora "openai" e _call_openai esiste.
     LEZIONE DI PROCESSO: una decisione approvata e verificata NON e' una
     decisione applicata finche' non arriva sul ramo che conta.
     >>> SERVE: che qualcuno merghi il fix su main. Non l'ho fatto io: non ho
     autorizzazione a scrivere su main in questa sessione.
     NUOVI FINDINGS della stessa parte:
       S-19 (main): in cloud_bridge.embed() il budget gate sta dentro un
         `except Exception: pass`, quindi QuotaExceeded viene inghiottito e la
         chiamata a pagamento procede. OTTAVA occorrenza dello schema
         "controllo che non controlla". In ask_cloud_ai lo stesso guard e'
         invece scritto BENE: il difetto e' solo in embed().
       core/billing.py (main, nuovo): skeleton Stripe; con STRIPE_SECRET_KEY
         "sk_" fa una POST reale a api.stripe.com. NESSUN chiamante al ref
         corrente (verificato). Non viola l'Articolo 5 — riguarda l'addebito a
         futuri clienti — ma e' un EXTERNAL_WRITE senza ammissione: rientra in
         S-02 e va revisionato prima che venga cablato.
     CORREZIONE DI UNA MIA NOTA: nella quinta parte avevo scritto che
     "embedding recall" e "debate loop" NON avevano aperto porte a pagamento.
     Era vero al ref controllato. Due commit dopo main ha aggiunto embed(),
     che va su OpenAI per default: la terza porta si e' aperta davvero. In
     questo programma una verifica ha una scadenza di ore.

PROSSIMO  : Se apri una sessione nuova:
            0. CONTROLLA `git rev-parse main origin/main` PRIMA di interpretare
               qualunque diff fra branch: dopo un fetch il main locale resta
               indietro e i diffstat diventano insensati (E17, ripetizione di E14).
            1. ESEGUI PRIMA LA TRAPPOLA 11 — git fetch di tutti i branch e controlla
               se qualcuno ha consegnato. In sessione 3 ha trovato due volte
               lavoro che aspettava proprio me, e main si è mosso QUATTRO volte
               mentre lavoravo. In sessione 4 ha trovato SEI branch nuovi e la
               prima consegna di Gemini. Non ha mai dato esito negativo finora.
            1-bis. SE GEMINI HA RISPEDITO UJ-CAP-001 -> è tuo. Rileggi il
               pre-verdetto §6 (le 6 correzioni richieste) e §9 (le 12 prove da
               rieseguire sui byte committati), poi emetti il ReviewResult vero.
               Test rapido prima di leggerne il merito: se il pacchetto contiene
               ancora ZERO "UNKNOWN" e ZERO date, non è stato verificato — due
               grep e hai la risposta.
            2. GROK_FIX_LIST.md È GIÀ STATO VERIFICATO APPLICATO da me, non solo
               dichiarato — 10/16 findings chiusi con comando+esito in
               MAIN_IMPLEMENTATION_SECURITY_REVIEW.md §10-ter. Non rifare quella
               verifica. Se riprendi UJ-SEC-003, parti da lì: restano S-02
               (parziale), S-06, S-07, S-16.
            3. Se UJ-INT-007 esiste ora (era DEFERRED a M8/M9) -> prendi UJ-REV-002.
            4. Se Gemini/Grok hanno consegnato altro -> hai doveri da reviewer su
               UJ-CAP-001, UJ-MEM-001, UJ-ADK-001, UJ-RSK-001, UJ-ALT-001.
               NON su UJ-RED-001: il suo reviewer è CHATGPT (verificato).
            5. Se NIENTE di tutto questo -> registra l'attesa. Ma solo dopo 1-4.

            IN SOSPESO, non mio ma da sapere: il branch
            agent/uj-red-001-grok-v8-snapshot (97f7f06) potrebbe non essere ancora
            su main. Reviewer: ChatGPT, non io.

            METODO CHE HA FUNZIONATO, da riusare: eseguire i validatori/comandi PRIMA
            di leggere il codice; costruire attacchi concreti invece di ispezionare a
            occhio; RICALCOLARE un ledger o un catalogo invece di leggerlo; citare
            solo artefatti davvero aperti o eseguiti; quando due difetti si combinano
            (S-12/S-13), dire esplicitamente l'ordine di correzione invece di
            lasciarlo intuire.

POI       : - Gemini: REINVIO di UJ-CAP-001 con le 6 correzioni del pre-verdetto
                       (§6 del documento); poi review di UJ-RUN-001, UJ-MCP-001,
                       UJ-CLD-001
            - Grok:   review di UJ-SEC-001, applicazione di GROK_FIX_LIST.md
            - ChatGPT: review di UJ-RCV-001 e UJ-SKL-001; correzione di F-001/F-002
                       su UJ-INT-006; decisione su UJ-SEC-002/UJ-MCP-002/UJ-SEC-003
            - Christian: decisioni costituzionali, relay HUMAN_BRIDGE dei blocchi di
                       append verso gpt.md/taskgpt.md, decisione su S-10/S-11
                       (fix piccoli, pronti, ma è codice di Grok)
            Se nessuno risponde E non ci sono branch nuovi, registra l'attesa.
            Ma controlla i branch PRIMA: vedi trappola 11.

DECISIONI DI BASELINE IN SOSPESO PRESSO CHATGPT:
            UJ-SEC-002 (peso 8) — chiude i due CRITICA R-SEC-01/R-SEC-02
            UJ-MCP-002 (peso 5) — unico modo di chiudere R-MCP-01
            UJ-SEC-003 (proposta, non pesata) — la security review su main

NON RIFARE: blueprint runtime, contratti runtime/policy/tools, threat model,
            approval policy, critica Costituzione, tool plane, source manifest,
            capability record UJ-CLD-001, la review di UJ-INT-006, la review del
            Program OS (UJ-REV-001), LA SECURITY REVIEW DELL'IMPLEMENTAZIONE SU MAIN
            (UJ-SEC-003, 16 findings), LA LISTA CORREZIONI PER GROK, E IL
            PRE-VERDETTO UJ-CAP-001 SUL CANDIDATO GEMINI (sessione 4, 6 findings).
            Verifica prima, DALLA ROOT del repo, SOLO la mia suite (non toccare i
            test Python di Grok, sono un altro portafoglio).
            ESEGUI I TRE COMANDI IN QUEST'ORDINE — il secondo NON è opzionale:
              npx tsc -p packages/contracts --noEmit   -> exit 0   (typecheck)
              npx tsc -p packages/contracts            -> exit 0   (BUILD: i test
                                                          importano da dist/)
              for f in tests/contracts/*.test.mjs; do node --test "$f"; done
              totale atteso: 138/138 (runtime 34 · policy 28 · tools 30 ·
                                      recovery 9 · skills 37)
            SE SALTI LA BUILD ottieni 5 suite su 5 fallite con
            ERR_MODULE_NOT_FOUND su packages/contracts/dist/... . NON è una
            regressione: dist/ è in .gitignore e in un container nuovo non
            esiste. La sessione 4 ci è cascata perché questo blocco elencava solo
            --noEmit e metteva i test PRIMA del typecheck (errore E16).
            Riverificato in sessione 4 dopo la build: 138/138 pass, exit 0.

RICORDA   : a fine task, Regola 2 — aggiorna CLAUDE.md e TASKCLAUDE.md (estensione,
            mai riscrittura), poi commit e push. Un push va verificato leggendo
            l'exit code del comando vero, mai attraverso una pipe (trappola 15).
```
