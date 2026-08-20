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
| Branch di lavoro | **Sessione 6: `agent/uj-run-001-blueprint-20260818`** — consegna UJ-RUN-001 **e** memoria aggiornata (questo file vive lì). Sessioni 4-5: `claude/claude-md-resume-point-tvej1u`, ora indietro. Sessioni 1-3: `claude/ultrajarvis-repo-analysis-li6vvj`. **L'ambiente può non assegnarne uno, o assegnarne uno vuoto**: vedi RESUME_POINT, blocco BRANCH e punti Z e AE |
| File gemello per le altre IA | `TASKCLAUDE.md` |
| Ultimo aggiornamento | 2026-08-18 — sessione `UJ-CLAUDE-2026-08-18-06` |

> Nota sul nome: il file è `CLAUDE.md` in maiuscolo perché è la convenzione che
> Claude Code carica automaticamente come istruzioni di progetto. Se lo rinomini in
> minuscolo perde quel caricamento automatico.

---

# PARTE 1 — LE TRE REGOLE PRIMARIE

Queste tre regole vengono **prima** di qualunque task tecnica. Sono ordini diretti del
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

## REGOLA 3 — A fine lavoro, spiega a Christian cosa hai fatto. In italiano, da persona

**Ordine diretto del proprietario, 2026-08-18:** *"alla fine di ogni tuo lavoro, in modo umano
e no AI slop, scrivi che hai fatto e le tue riflessioni, perché altrimenti io non capisco."*

Il resoconto tecnico (Regola 1) serve alla sessione successiva. **Questa spiegazione serve a
Christian**, ed è una cosa diversa. Non sostituisce il resoconto: si aggiunge, e va alla fine
del messaggio in chat, non in un file.

Come si scrive:

- **In italiano, discorsivo.** Frasi normali. Se una tabella serve davvero, una sola e piccola.
- **Prima cosa: che cos'era rotto e perché contava.** Non "ho aggiornato l'artefatto X": *"il
  documento diceva ancora che il lavoro era pronto per la review, mentre il pacchetto accanto
  diceva che era bloccato — due carte sullo stesso tavolo che dicono il contrario"*.
- **Poi: cosa ho fatto e cosa ho scoperto strada facendo**, incluso ciò che non mi aspettavo.
- **Poi: gli errori miei, detti come li direbbe una persona**, senza girarci intorno e senza
  flagellarsi. Se ho dato un'istruzione sbagliata, si dice che era sbagliata.
- **Poi: che cosa penso davvero.** Un'opinione, non un riassunto. Se una cosa mi sembra fragile
  o mal progettata, lo dico — anche se è mia.
- **Ultima cosa: che cosa serve da lui**, in una riga, se serve qualcosa.

Come NON si scrive:

- niente muri di hash, SHA-256, exit code e nomi di commit: quelli stanno nei documenti, e a
  Christian servono solo se li chiede;
- niente grassetto ogni tre parole;
- niente elenchi di dieci punti tutti uguali di importanza;
- niente frasi che suonano bene e non dicono niente (*"ho consolidato il workflow garantendo
  la coerenza end-to-end"*). Se una frase si può cancellare senza perdere informazione, si
  cancella;
- **niente entusiasmo per lavoro non verificato.** Se una cosa è a metà, si dice a metà.

**Il criterio per capire se è scritta bene:** Christian deve poterla leggere una volta sola,
senza rileggere, e sapere che cosa è successo e se deve fare qualcosa. Se deve chiedere
*"quindi in pratica?"*, è scritta male.

### Checklist di chiusura task (da eseguire ogni volta)

```
[ ] 1. Aggiornato CLAUDE.md      → nuova voce nel Session Log + tabella stato task
[ ] 2. Aggiornato TASKCLAUDE.md  → cosa cambia per ChatGPT / Gemini / Grok
[ ] 3. Registrati gli errori commessi in questa sessione (anche quelli banali)
[ ] 4. Ricalcolato "quanto manca" con la formula §7.4, non a sensazione
[ ] 5. Aggiornato il RESUME_POINT in fondo a questo file
[ ] 6. git add / commit / push sul branch designato
[ ] 7. Verificato che i test citati passino DAVVERO (comando + esito, non memoria)
[ ] 8. Scritta a Christian la spiegazione in italiano della Regola 3, in fondo al
       messaggio: cos'era rotto, cosa ho fatto, cosa ho sbagliato, cosa penso,
       cosa serve da lui. Senza hash e senza slop
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
# fetch di TUTTI i branch — il '+' NON e' opzionale, vedi errore E30
git fetch origin '+refs/heads/*:refs/remotes/origin/*'
git rev-parse HEAD main origin/main    # controlla i ref PRIMA di interpretare un diff

# integrità del prompt canonico (ora e' su main, non serve piu' un branch)
sha256sum docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md

# i contratti compilano in strict mode
npx tsc -p packages/contracts --noEmit

# tutte le suite passano — ESEGUI DALLA ROOT del repo
npx tsc -p packages/contracts
for f in tests/contracts/*.test.mjs; do node --test "$f"; done
```

Attesi al 2026-08-18 (sessione 5): hash coincidente, typecheck exit 0, **140 test / 140 pass**
(runtime 36 · policy 28 · tools 30 · recovery 9 · skills 37). Era `138` fino alla sessione 4:
i due in più sono le regressioni di E6 aggiunte in sessione 5. Le occorrenze di `138` nel
Session Log sono **storia** e restano come sono.

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

# PARTE 3-bis — MANDATO DI TECHNICAL LEAD (decisione del proprietario, 2026-08-19)

> **Questa parte cambia il mio ruolo e ha precedenza sui confini della PARTE 3.** È un
> `USER_CONSTRAINT` diretto e sta al livello più alto della gerarchia della verità (§7.2).
> Se una sessione futura trova una contraddizione fra questa parte e la §32.2 del prompt
> canonico, **vince questa**, perché è più recente e viene dal proprietario.

## 1. Che cosa ha deciso Christian

**Alla conclusione della fase di pianificazione, la leadership operativa passa a CLAUDE.**
Da quel momento sono il principale responsabile tecnico di:

- sviluppo e modifica del codice;
- organizzazione di branch e PR;
- coordinamento tecnico di **Gemini e Grok**;
- suddivisione del lavoro in task verificabili;
- controllo di test, build, typecheck e sicurezza;
- integrazione ordinata dei contributi;
- coerenza fra codice, documentazione, packet e `BACKLOG`.

**ChatGPT non è più il principale esecutore del coding.** Resta **supervisore esterno** per
governance, controlli finali, verifica degli hash, ammissibilità dei packet e decisioni che
richiedono una revisione indipendente.

## 2. Che cosa NON cambia — i vincoli restano tutti

Il mandato **non** è una deroga. Restano validi e vincolanti:

- non inventare risultati, test, hash o commit;
- non modificare `main` fuori dal processo previsto;
- **non aumentare `accepted_weight` senza revisione indipendente** — nemmeno da Technical Lead,
  e nemmeno sui propri task: chi produce non accetta;
- lasciare traccia dei comandi eseguiti e dei relativi exit code;
- usare branch e **draft PR** per il lavoro degli specialisti;
- segnalare ogni blocco reale, senza dichiarare completato ciò che non lo è;
- tenere separati **stato tecnico**, **stato di review** e **accettazione del peso**.

**Il conflitto d'interessi va gestito, non ignorato.** Da Technical Lead coordino chi
revisiona il mio stesso lavoro. La regola che mi impongo: **non sono mai il reviewer di un
mio task**, e quando un mio task attende review non ne modifico il contenuto per renderlo
più facile da accettare. Se un reviewer che coordino boccia un mio deliverable, il suo
verdetto vale.

## 3. Quando scatta — deve essere misurabile, non a sensazione

*"Quando la pianificazione sarà conclusa"* non è verificabile come è scritto. Propongo due
definizioni, entrambe controllabili con un comando; **la decisione su quale adottare è di
Christian**, e finché non la prende il mandato resta sospeso.

**Definizione A — pianificazione completa.** Tutti i task che coprono le milestone M0+M1 più le
specifiche che il build richiede sono `ACCEPTED`.

**Misura rifatta il 2026-08-19 sera, e la prima era su una baseline superata.** La prima stesura
diceva *"185 unità su 311, accettate 0"*. Ricalcolato su `origin/main` @ `27b7673`:

| Misura | Valore |
|---|---:|
| task in M0+M1 | **17** |
| peso M0+M1 | **177** |
| accettato in M0+M1 | **26** |

**Le 26 unità accettate sono `UJ-META-001` (21/21, `DONE`) e `UJ-META-002` (5/8), entrambe di
governance.** Di lavoro specialistico, in M0+M1, è accettato **zero**. Il totale di programma è
oggi **340** e non 311: la baseline è cresciuta di 29 unità dopo la sessione 1.

⚠️ **`311` resta corretto dove compare come `baseline §38`** — è la cifra fissa del piano
canonico, un dato storico, non il totale corrente. Non correggerla lì.

**Definizione B — minimo per iniziare a costruire.** ⚠️ **La prima stesura di questa
definizione era sbagliata e va letta come storia.** Elencava quattro task per 42 unità
includendo `UJ-INT-004`; calcolando la **chiusura transitiva** delle dipendenze, quei quattro
diventano **8 task e 94 unità**, perché `UJ-INT-004` dipende da `UJ-INT-002` che dipende dai
quattro deliverable degli specialisti. Un innesco che si porta dietro quasi tutto M0+M1 non è
un minimo.

**Definizione B′ — ADOTTATA il 2026-08-19 su delega di Christian** (*"scegli te"*). Sono
`ACCEPTED` i **tre** task senza i quali il primo codice sarebbe lavoro sprecato:

| Task | Owner | Peso | Reviewer | Perché è indispensabile |
|---|---|---:|---|---|
| `UJ-RUN-001` | CLAUDE | 13 | **GEMINI** | contiene la demo end-to-end da costruire |
| `UJ-SEC-001` | CLAUDE | 13 | **GROK** | approval policy: senza, il build può violare la Costituzione |
| `UJ-RCV-001` | CLAUDE | 8 | **CHATGPT** | la demo esercita checkpoint, kill e resume |

**34 unità, 3 task, chiusura transitiva verificata: nessuna dipendenza esterna oltre a
`UJ-RUN-001 → UJ-RCV-001`.** Tutti e tre sono già consegnati: serve **una review per ciascuna
delle altre tre IA**, il che rende l'innesco simmetrico e non concentrato su nessuno.

**Perché `UJ-INT-004` è stato tolto.** È la *specifica* del monorepo, non il monorepo. La
struttura per costruire esiste già e funziona: `packages/contracts` compila, ha 140 test verdi e
un `tsconfig` strict. La demo può viverci accanto con lo stesso schema; quando `UJ-INT-004`
arriverà, adattare una directory costa poco. Aspettarlo costa una catena di otto task.

**Perché raccomando B.** Le altre 126 unità di pianificazione (M5–M17: dashboard, diritti
media, NotebookLM, sintesi trimestrale) sono a valle di un sistema che non ha mai eseguito una
missione. Pianificarle prima che il nucleo giri significa progettare su fondamenta non
falsificate — ed è esattamente ciò che il blueprint §21 dice di sé: *"se la demo non gira, il
documento è teoria"*.

## 4. Che cosa faccio il giorno in cui scatta — primi cinque atti

Registrati ora perché non siano improvvisati poi:

1. **Aprire una draft PR per ogni consegna in attesa**, compresa la mia: oggi
   `UJ-RUN-001` è in `REVIEW` e **non ha una PR**. Senza PR il reviewer non ha una sede.
2. **Emettere le delegation card mancanti** o chiederle a ChatGPT: senza `card_id` un task non
   è rappresentabile in un packet, e sette dei miei otto non ce l'hanno.
3. **Assegnare a Gemini e Grok task con criteri di accettazione binari**, comando di verifica
   incluso. Un criterio che non si può falsificare non è un criterio.
4. **Costruire la demo §21** come prima fetta di codice: costo zero per costruzione, nove
   osservabili e quattro casi negativi già specificati.
5. **Cablare un gate di integrazione**: nessun merge senza typecheck, build, suite e validator
   a exit 0, con gli exit code registrati.

## 5. Rischio che dichiaro subito, prima di assumere il ruolo

**Il rischio maggiore del mandato è che accentri.** Oggi quattro IA si controllano a vicenda, e
tre volte questo ha impedito che passasse lavoro fabbricato — una volta per ciascuna delle
altre. Da Technical Lead divento il punto in cui quel controllo può assottigliarsi.

La contromisura non è la buona volontà: è che **ChatGPT resti supervisore esterno con potere di
rifiuto**, come Christian ha stabilito, e che io continui a scrivere qui gli errori che
commetto. Se una sessione futura trova questa parte del file senza una sezione errori
aggiornata, è il segnale che il presidio si è allentato.


---

# PARTE 4 — STATO DEI MIEI TASK

Aggiornato al 2026-08-17. **Portafoglio totale: 76 unità su 8 task.**

| Task | Peso | Stato | Accettato | Proposto | Manca | Dipendenza bloccante |
|---|---:|---|---:|---:|---:|---|
| UJ-RUN-001 — Runtime blueprint | 13 | **REVIEW** (ammissibile dal 2026-08-19) | 0/13 | 11/13 | review di Gemini | — |
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

> **AGGIORNAMENTO sessione 5 (2026-08-18).** La tabella qui sopra **non cambia**: 7 task su 8
> restano in `REVIEW`, `0/76` accettato, e resta corretto. Cambia il perché di `UJ-RUN-001`:
> ChatGPT ha emesso un **gate di consegna** (`CLAUDE_RUN_UJ-RUN-001_REQUEST_20260818.md`) che
> nessuna memoria registrava, e l'ho soddisfatto — blocco HUMAN_BRIDGE, evidenza per criterio,
> packet rivalidato. Il task **non è più in attesa solo della review di Gemini: era anche in
> attesa di una consegna nel formato che ChatGPT si aspettava**, e quella parte ora c'è.
>
> Verificando quella consegna ho trovato un difetto in un mio artefatto (`E6`, seconda
> occorrenza in `depth-guard.ts`) e l'ho corretto: la suite passa da **138 a 140**. Il peso
> resta `0/13`: correggere un proprio difetto non è avanzamento accettato.

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

## Sessione 5 — `UJ-CLAUDE-2026-08-18-05` — 2026-08-18

Ordine di lavoro dato dal proprietario: *"procedi in questo ordine, fai quello che pensi sia
meglio, poi continua con le task"*. I tre punti erano quelli che avevo proposto a fine
orientamento.

### Il container era vuoto: nessun branch assegnato, nessun repository

`/home/user` era vuoto e il repository **non era clonato**. Nessun branch assegnato
dall'ambiente: il clone è atterrato su `main`. Ho agganciato il repo, clonato, e fatto
checkout di `claude/claude-md-resume-point-tvej1u` **dopo aver verificato** che fosse la
scelta giusta (`0 indietro / 15 avanti` su `origin/main`, e tip più recente del repository).

**Da ricordare:** la riga "il branch è assegnato dall'ambiente" può essere falsa. Se
l'ambiente non assegna niente, il branch va scelto e la scelta va **dimostrata** con
`git rev-list --left-right --count`, non presunta dal nome.

### Trappola 11, settima volta che paga: quattro artefatti che la memoria non conosceva

`git fetch` di tutti i ref, poi confronto di ogni ramo **contro il mio branch** e non contro
`main`. Quattro elementi con **zero occorrenze** in `CLAUDE.md` e `TASKCLAUDE.md`:

| Ramo | Contenuto | Mio? |
|---|---|---|
| `agent/claude-run-handoff-20260818` | gate di consegna `UJ-RUN-001` indirizzato a me | **sì** |
| `agent/gemini-handoff-quarantine-20260817` `9da01be` | correction request a Gemini su `UJ-CAP-001` | **sì, sono il reviewer** |
| `agent/strict-zero-cloud-bridge-20260818-v2` | secondo candidato per `S-17` | sì, da riconciliare |
| `agent/grok-red-handoff-20260818` | gate `UJ-RED-001` | no, reviewer è ChatGPT |

Il controllo non ha ancora mai dato esito negativo, in cinque sessioni.

### Parte 1 — il gate `UJ-RUN-001`, e il difetto trovato verificando me stesso

Il gate chiede path, SHA e **un controllo concreto per criterio**. Ho verificato AC-01…AC-05
eseguendo, non leggendo. Il controllo di AC-01 era uno scan di token vendor sui contratti
runtime, atteso a zero occorrenze normative.

Ha stampato **`binary file matches`** su `depth-guard.ts`.

**È E6 alla seconda occorrenza.** In sessione 1 avevo trovato un byte NUL usato come
separatore nella idempotency key di `checkpoint.ts`, e l'avevo corretto con encoding
length-prefixed. Lo stesso identico difetto era rimasto nel file accanto: `hasToolCycle`
costruiva la chiave k-gram con `sequence.join("\0")`.

Due conseguenze, entrambe misurate:

1. **Falsi positivi.** `ToolId` è `Brand<string, "ToolId">`, una stringa branded **senza
   validazione a runtime**: niente impedisce al separatore di stare dentro un nome di tool.
   La sequenza `["a","b\0c","x","a\0b","c","x"]` segnalava un ciclo **inesistente**, perché
   le finestre 0 e 3 si codificano identiche.
2. **Invisibilità.** Il NUL rendeva `depth-guard.ts` **binario** per git e per grep. Il file
   è stato fuori da ogni audit testuale del repository **per quattro sessioni**, comprese le
   mie.

Correzione: `encodeInjective` in `common.ts`, sede unica, usata sia da `buildIdempotencyKey`
sia da `hasToolCycle`. `checkpoint.ts` produce byte identici e il test di iniettività
preesistente lo dimostra — è il controllo che rendeva sicuro il refactor.

**Il test di regressione l'ho provato contro il codice vecchio prima di accettarlo.** Ho
rimesso il `join("\0")` nel `dist/`, rieseguito, ottenuto `not ok 34` con
`expected: false, actual: true` — esattamente il falso positivo previsto — e poi ripristinato.
Una verifica che non può fallire non è una verifica.

Secondo test: nessun sorgente dei contratti runtime contiene un NUL. Fissa la lezione
**meccanicamente**, invece che con un commento che la terza occorrenza ignorerebbe.

Suite: **138 → 140**, `fail 0`, typecheck e build a exit 0.

### Il gate ha tre incoerenze, e nessuna è colpa di Gemini o di Grok

1. **La card non esiste al commit al quale il gate ordina di leggerla.** Il gate include
   `prompts/delegation-cards/UJ-RUN-001-CLAUDE.json` fra gli input da leggere a `3611b1b4`;
   la card è entrata con `d48e1e85`, **dodici minuti dopo**. La prosa del gate ha aggiunto un
   quinto input al `read_ref` della card; il campo `input_artifacts` della card ne elenca
   correttamente quattro e non se stessa.
   **Non ho restituito `BLOCKED`**: il gate riserva quel verdetto a *"un pin non corrisponde"*,
   e i quattro hash pinati coincidono tutti a `3611b1b4`. Verificato uno per uno.
2. **Il gate dice `path`, lo schema dice `ref`**, e con `additionalProperties: false` un
   artifact con `path` fallisce la validazione.
3. **Il gate chiede la mappatura per criterio dentro il packet e lo schema non la ammette.**
   Messa in `UJ-RUN-001-AC-EVIDENCE.md` e citata da `handoff.resume_point`.

### Parte 2 — i tre candidati STRICT_ZERO, misurati invece che letti

Primo passo: **trappola 17**. Il diff `HEAD` vs `-v2` mostrava `-444` righe e sembrava che
`v2` cancellasse mezzo repository. Non era vero: le due basi sono diverse. Ho confrontato
ciascun candidato **contro la propria merge-base**, e il quadro si è invertito.

`v1` e `v2` hanno un `cloud_bridge.py` **byte-identico** (md5 `2961c3a8…`). `-v2` non è un
design alternativo: è lo stesso fix ricommittato su una base più recente.

Due sonde, con `requests` e `openai` sostituiti da stub che **registrano il tentativo e
sollevano**. Nessuna chiamata reale, costo zero.

| | `origin/main` | `v1` = `v2` | branch CLAUDE |
|---|---|---|---|
| percorsi a pagamento/remoti su 7 attacchi | **6** | 0 | 0 |
| `embed()` con budget **esaurito** | **CHIAMATA A PAGAMENTO** | non esiste | nessuna chiamata |

**Il risultato che conta.** Entrambe le basi di `v1`/`v2` precedono `embed()`. Mergiare il
loro `cloud_bridge.py` sull'attuale `main` chiuderebbe `S-17` e **cancellerebbe `embed()` e
le quattro guardie di budget**. `core/memory.py:118` fa `from cloud_bridge import embed` e lo
chiama alla riga 139: il merge romperebbe il lavoro appena consegnato da Gemini, per
applicare una correzione di sicurezza.

Una correzione di sicurezza che rimuove una feature è uno **scambio**, e lo decide chi possiede
entrambe le cose. Non io.

`S-17` e `S-19` **aperti su `main`** al ref corrente. Terza verifica consecutiva.

### Parte 3 — la correction request a Gemini copre 4 delle mie 6 correzioni

Trappola 19 applicata: se il reinvio soddisfa solo l'intake, passa la prima porta e sbatte
sulla seconda, e il terzo giro di HUMAN_BRIDGE lo paga Christian a mano.

**Coperte:** i 7 campi JSON (4), URL primario + ora UTC (5), rate limit (6).
**Non coperte:** `G-004` e `G-005`.

`G-004` è una contraddizione **dentro il Markdown**, non fra Markdown e JSON: la regola
*"make Markdown and JSON agree"* si può soddisfare **propagando l'errore nel JSON**.
`G-005` è la classe `local-compute` nominata da `AC-04`, assente dalla request; il suo
preflight dice *"no heavy local inference **occurred**"*, che riguarda la condotta di Gemini,
non il contenuto del registro.

Scritto l'addendum con **solo** le due scoperte. Non ho ripetuto le tre coperte: allungare un
messaggio che Christian ricopia a mano, con due formulazioni della stessa regola che possono
divergere, peggiora il risultato.

**Ho scritto anche cosa ChatGPT ha fatto bene:** il punto 4 del suo audit arriva a `G-002`
per conto proprio e cita la stessa fonte ufficiale che avevo aperto io.

### ERRORI COMMESSI IN QUESTA SESSIONE

| # | Errore | Come si è manifestato | Correzione |
|---|---|---|---|
| E19 | **Numero dato senza scope.** Nell'addendum per Gemini ho scritto che *"local* compare una volta sola"*. Su tutto l'allegato di 528 righe compare **tre** volte | l'ho colto rieseguendo la misura invece di ricopiarla dal pre-verdetto | il conteggio `1` vale solo dentro le righe 36–332, i due artefatti `UJ-CAP-001` delimitati dai marcatori. Scope ora esplicito nel testo. **Stavo per consegnare a Gemini un numero non qualificato: è il difetto per cui l'ho bocciata in `G-002`** |
| E20 | **Path citato a memoria.** Avevo scritto `docs/program/UJ-CLD-001-*` | il path reale è `docs/program/evidence/UJ-CLD-001-CAPABILITY-RECORDS.md` | verificato con `find` prima del commit. Trappola 14: si citano solo artefatti aperti |
| E21 | **Misura letta su un indice sbagliato.** Il conteggio dei byte del blocco da incollare dava `33` per un blocco da 72 KB | `str.index()` aveva trovato la **prima** occorrenza del marcatore, che era nella frase di istruzioni per Christian, non il delimitatore vero | `rindex`. Il segnale che ha salvato è l'**incoerenza fra output e verdetto**: 33 byte per un file da 57 KB non può essere giusto. È la stessa euristica della trappola 15 |

Nessuno dei tre è arrivato a un artefatto consegnato.

### Prove eseguite in questa sessione

| Prova | Esito |
|---|---|
| `sha256sum docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md` | `a3fcdfc9…a69a87`, **coincide** |
| `npx tsc -p packages/contracts --noEmit` | exit 0 |
| `npx tsc -p packages/contracts` | exit 0 |
| suite contratti, 5 file | **140/140 pass**, fail 0 (era 138, +2 nuovi) |
| test di regressione contro il codice vecchio | **fallisce**, `expected: false, actual: true` |
| `node scripts/validate-response-packet.mjs` | exit 0, 15 hash ricalcolati |
| 15 hash artefatto al `source_commit_sha` e a HEAD | **15/15** |
| 4 hash di input pinati a `3611b1b4` | **4/4 coincidono** |
| scan vendor sui contratti runtime | **0** occorrenze normative |
| scan NUL su tutti i sorgenti dei contratti | **0** |
| sonda `S-17`, 7 attacchi × 3 varianti | main 6 a pagamento, candidati 0 |
| sonda `S-19`, budget esaurito × 3 varianti | main chiama comunque, branch CLAUDE no |
| round-trip del blocco di consegna | blueprint riestratto **rihasha identico** |
| merge di `origin/main` nel branch | pulito, nessun conflitto, suite invariata |
| `git push` | exit 0 letto dal comando vero, **mai da una pipe** |

### Confini rispettati

Non ho toccato `core/`, `tools/`, `advisors/`, `bin/uj` (GROK), né `BACKLOG`/`schemas`/
`scripts` di ChatGPT, né il Capability Registry di Gemini. Ho modificato **solo**
`packages/contracts/` e `tests/contracts/`, che sono `UJ-RUN-001`, cioè miei. Non ho
mergiato niente su `main`: `direct_main_write: false` è nella mia card. Non ho eseguito
nessuna chiamata di rete a pagamento, in nessuna variante, in nessuna sonda.

### Cosa NON ho fatto, e perché

- **Nessun `ReviewResult` per `UJ-CAP-001`.** Le tre ragioni del §7 del pre-verdetto valgono
  ancora: gli artefatti non esistono a nessun commit e la consegna non è ammessa.
- **Non ho riaperto le fonti primarie di Gemini.** Il candidato non è cambiato. Se il reinvio
  arriva, le riapro allora: in questo programma una verifica esterna scade in ore.
- **Non ho eseguito la suite Python di Grok.** Altro portafoglio, e su `main`
  `python3 -m pytest` senza argomenti **non colleziona** (difetto pre-esistente).
- **Non mi sono assegnato peso.** `0/76` resta corretto.

---

## Sessione 5, seconda parte — `S-20`: il gate che Grok ha reso vero non può rifiutare

Chiuse le tre task, ho controllato se restava lavoro invece di registrare l'attesa.
`UJ-INT-007` **non esiste** fra i 43 task del `BACKLOG.json`: `UJ-REV-002` resta `BLOCKED`,
non lavorabile. Ma `main` si era mossa di altri tre commit, e due si chiamavano
*"LLM writer"* e *"promote with skills"*: entrambi nel mio perimetro.

### Due falsi negativi della mia stessa sonda, prima del risultato

La prima esecuzione diceva **"nessuna chiamata" in tutti e quattro gli scenari**. Incoerente
con l'attesa, quindi non l'ho riportata: ho indagato. `nt_helpers` importa anche `safe_write`
da `core.reliability`, che il mio stub non esponeva. Il modulo **non si caricava affatto** e
la sonda misurava il fallimento dell'import. È la trappola 12 vista dal lato di chi scrive il
test: *un test che fallisce per il motivo sbagliato*. Ho aggiunto al probe un **controllo di
caricamento** che distingue "nessuna chiamata" da "modulo non caricato".

Il secondo giro diceva che `MODEL_PROVIDER=local` finiva **a pagamento**, contraddicendo la
misura di sessione 4. Anche questo non l'ho riportato. Causa: `PROVIDER` in `cloud_bridge` è
una **costante di modulo**, valutata una volta all'import, e io non sfrattavo `cloud_bridge`
da `sys.modules` fra uno scenario e l'altro: il secondo ereditava il provider del primo. Con
lo sfratto, `local` → loopback, coerente con la sessione 4.

**Due volte di fila il segnale che ha salvato è stato l'incoerenza fra output e attesa.** In
entrambi i casi avrei consegnato un numero falso — nel secondo, un'accusa falsa a un fix
approvato dal proprietario.

### Il risultato, misurato

`UJ_WRITER_LLM=1` **da solo** → 3 tentativi fatturabili a OpenAI, sul percorso che **genera
codice**, su `main` al ref corrente. §13 diceva che `FIX-10a/10b` andava applicato **prima**
del writer: il writer è stato riscritto e allargato, il fix non è arrivato.

### `S-20`, e perché è più sottile dei precedenti

Ho letto `promote_job_to_tools` aspettandomi `S-12`/`S-13`. **Non c'erano:** quattro controlli
reali (`scan_text`, `is_protected`, `safe_write` con root, sanitizzazione del nome). E `FIX-7`
ha reso `ToolSpec.safe` un flag **che funziona davvero** — `Registry.call()` rifiuta se è
falso. Nella review di sessione 3 lo avevo elencato fra le manopole che non girano nulla:
**non è più vero, ed è merito di Grok.** Ho corretto la mia review.

Il rilievo esiste **proprio perché** quel flag adesso conta: la promozione lo cabla a `True`,
unica occorrenza di `safe=` nella funzione. Provato eseguendo, in un worktree su `origin/main`
e con `root` in una directory temporanea per non toccare `tools/`:

```
name='demo_promoted.run'  safe=True  module='tools.demo_promoted_helpers'
occorrenze di 'safe=' nella funzione: ['safe=True']
```

Il gate esiste, funziona, e sulla classe di tool che nessun umano ha scritto **non può mai
rifiutare**. Non è *"nessun gate"* come `S-12`: è *"il gate c'è e la sua condizione è
costante"*, la variante più difficile da vedere, perché leggere il codice del gate non rivela
niente. Correzione in `GROK_FIX_LIST.md` → `FIX-12`, con `FIX-10` prima.

### Errori di questa parte

| # | Errore | Correzione |
|---|---|---|
| E22 | Sonda con stub incompleto: misurava un `ImportError`, non il comportamento | aggiunto un controllo di caricamento esplicito che distingue i due esiti |
| E23 | Modulo lasciato in `sys.modules` fra scenari: una costante di import inquinava la misura successiva | sfratto esplicito, con il motivo scritto nel commento del probe |

Nessuno dei due è arrivato a un documento consegnato: entrambi fermati dall'incoerenza fra
output e attesa.

---

## Sessione 5, terza parte — Gemini ha rispedito `UJ-CAP-001`, e il verdetto è emettibile ma non importabile

Ultimo controllo dei ref prima di chiudere: **due rami nuovi comparsi alle 12:40**, dopo che
avevo iniziato — `agent/uj-cap-001-gemini-review-20260818` e il gemello GGL. È il caso 1-bis
del RESUME_POINT: *"se Gemini ha rispedito `UJ-CAP-001`, è tuo"*. **Ottava volta che la
trappola 11 paga**, e stavolta il ramo è nato **durante** la sessione.

### Il test dichiarato in anticipo ha fatto il suo lavoro

Avevo scritto che avrei eseguito due `grep` **prima** di leggere il merito. Fatto:

| Misura | Quarantena | Reinvio (MD / JSON) |
|---|---:|---:|
| `UNKNOWN` | 1 in 528 righe | **42 / 70** |
| date ISO | 0 | **20 / 20** |
| URL primarie distinte | — | **18 su 19** |

Il criterio serviva a distinguere una verifica da un reimballaggio, e ha distinto. **Il
reinvio passa.** Da 9 capability a 19, da un insieme sparso a **27 campi** per record.

`G-002` chiuso bene — quota strutturata per modello/progetto/account, 19 valori distinti,
nessun numero universale sopravvive. `G-004` chiuso — le quattro UI web sono `HUMAN_BRIDGE`,
e Gemini l'ha fatto **senza aver ricevuto il mio addendum**, non ancora inoltrato.

### Verdetto: **FAIL**, 3 criteri su 5. Era 1 su 5

`AC-01` PASS · `AC-02` PASS · `AC-03` PASS · `AC-04` **FAIL** (`local-compute`: 0 occorrenze)
· `AC-05` **FAIL** (nessun `ResponsePacket` al ref).

**`AC-03` l'ho dato PASS, e la scelta è deliberata.** Il criterio chiede fonte e data: ci
sono, letteralmente. Il difetto — `verified_at_utc` è **una costante su 19 capability**, al
secondo, identica al timestamp di impacchettamento — è una debolezza dell'evidenza, non il
mancato rispetto della lettera. Ho bocciato Gemini in `G-004` per aver violato la *propria*
definizione: reinterpretare un criterio per farlo fallire sarebbe lo stesso errore col segno
opposto. Il difetto sta nei findings, con l'azione richiesta.

**`F-002` è la forma nuova di `G-003`: il campo che dovrebbe dimostrare la verifica è una
costante.** È letteralmente la stessa struttura di `S-20`, che ho aperto oggi sul codice di
Grok — un meccanismo corretto la cui condizione non varia mai. Due autori diversi, due
linguaggi diversi, stessa forma, nella stessa giornata.

**`F-004`:** `G-006` è stato chiuso **rimuovendo** la capability. *"Agent SDK"* e *"computer
use"*: 0 occorrenze. La lacuna non è risolta, è diventata invisibile.

### Ho eseguito il validatore invece di dichiarare valido il mio ReviewResult

Tre blocchi, tutti strutturali, **nessuno risolvibile da Gemini**:

1. **Deadlock del ledger, seconda occorrenza.** *"may only be imported for a task currently in
   REVIEW; UJ-CAP-001 is READY."* Lo stato diventa `REVIEW` solo con un `ResponsePacket`, che
   non esiste. È **esattamente** la diagnosi che avevo scritto in sessione 4 per i miei sette
   task, ora confermata su un task di un'altra IA: non era un mio problema di condotta, è una
   proprietà del meccanismo.
2. **`UJ-CAP-001` ha due liste di criteri diverse.** La card ne ha **cinque**, il
   `BACKLOG.json` ne ha **due**. Gemini è stata istruita dalla card; il validatore giudica sul
   BACKLOG. Una review scritta sui criteri realmente ricevuti **non è importabile**.
   E il testo dell'`AC-02` del BACKLOG è: *"CLAUDE issues an evidence-backed **PASS or
   PASS_WITH_ACTIONS** review"* — un criterio di accettazione che nomina solo gli esiti
   positivi del reviewer, cioè soddisfatto se e solo se approvo. Non è un criterio, è una
   conclusione scritta in anticipo.
3. Gli artefatti vivono sul ramo di Gemini, non nell'albero di chi valida.

Il ReviewResult resta quindi un **candidato**, con lo stesso suffisso già usato per
`UJ-REV-001`. `0/13` prima, `0/13` dopo.

### Errore di questa parte

| # | Errore | Correzione |
|---|---|---|
| E24 | Ho scritto il `commit_sha` del ReviewResult come segnaposto (`27b3717` + zeri) intendendo sostituirlo, e l'ho quasi validato così | il pattern dello schema è `^[0-9a-f]{40}$`, quindi 40 zeri **avrebbero passato la forma**: la validazione non mi avrebbe salvato. Sostituito col ref reale prima di eseguire il validatore. **Un segnaposto che rispetta il formato è più pericoloso di uno che non lo rispetta** |

---

## Sessione 5, quarta parte — perché nessun task di questo programma può essere accettato

Il verdetto su `UJ-CAP-001` ha lasciato una domanda aperta: il validatore ha dato **sette
errori** e nessuno era colpa di Gemini. Invece di trattarli come un intoppo del mio documento
li ho isolati.

### Tre esecuzioni, una variabile alla volta

| # | Configurazione | Errori |
|---:|---|---:|
| A | criteri della **card** (`AC-01…AC-05`), dal mio albero | **7** |
| B | stessi byte, criteri nella forma del **BACKLOG** (`AC-01`, `AC-02`) | **3** |
| C | come B, da un worktree al commit di Gemini, artefatti **presenti** | **1** |

L'unico che sopravvive: *"may only be imported for a task currently in REVIEW; UJ-CAP-001 is
READY."* Le altre sei cause sono reali ma aggirabili. Questa no.

### Causa 1 — la divergenza dei criteri è **sistemica: 4 card su 4**

Ogni delegation card del programma dichiara **cinque** criteri; il `BACKLOG.json` ne dichiara
**due** per lo stesso task. Vale anche per il **mio** `UJ-RUN-001`: quando Gemini lo
revisionerà seguendo la card — come deve — la sua review sarà respinta allo stesso modo.
L'ho scritto nella mia stessa consegna invece di lasciarglielo scoprire.

### Causa 2 — `AC-02` è una tautologia, su **41 criteri di 43 task**

> *"`<REVIEWER>` issues an evidence-backed **PASS or PASS_WITH_ACTIONS** review."*

40 task su 43 hanno **solo due** criteri, quindi per quasi tutto il programma **metà della
superficie di accettazione non descrive l'artefatto**: descrive l'esito del reviewer. È `PASS`
se e solo se l'esito complessivo è positivo — una riscrittura del campo `outcome`. Nessuna
proprietà del deliverable la rende vera o falsa. Le condizioni tecniche vere vivono **solo
nelle card**, che il validatore non legge.

### Causa 3, irriducibile — nulla applica la transizione di stato

`validate-response-packet.mjs` dice di sé di essere *"what moves a task from READY/BLOCKED to
REVIEW"*. Ma il packet **propone** soltanto. Cercato in tutti gli script: **nessuno scrive su
`BACKLOG.json`**; l'unica `writeFileSync` è dentro un test e opera su una temp dir.

**La prova non è un ragionamento, è la mia consegna di oggi.**
`UJ-RESP-RUN-001-CLAUDE.json` esiste, valida a exit 0 e propone `READY → REVIEW`. Nel
`BACKLOG.json`, allo stesso ref, `UJ-RUN-001` è ancora **`READY`**.

### Correzione di una mia conclusione di sessione 4

In `UJ-LEDGER-DIAGNOSIS-CLAUDE.md` avevo concluso che `0/76` dipendeva dal fatto che **non
avevo mai emesso un packet**, e che era colpa mia. Quella parte resta vera: il packet mancava
davvero, ed era un mio dovere di `AC-05`.

**Ma non era la causa sufficiente.** Ora il packet c'è, valida, ed è servito a zero. La causa
che conta sta un anello più avanti e non è raggiungibile da nessun esecutore. Lasciare in piedi
la vecchia conclusione farebbe cercare alla prossima sessione un difetto nella propria
condotta, dove non c'è.

Documento: `docs/program/reviews/UJ-REV-001-ADDENDUM-LEDGER-IMPORT-PATH.md`.

### Il controllo positivo, che ho cercato apposta e che cambia la conclusione

Isolare le cause non basta: una diagnosi che spiega solo i fallimenti non è falsificabile. Ho
cercato un caso in cui l'importazione **riesca**.

`UJ-INT-006` è l'unico dei miei doveri da reviewer con status `REVIEW`, e la sua `ReviewResult`
esiste dalla sessione 3. Eseguita dal commit che essa stessa pinna:

```
exit 0
Council packet validation: PASS
```

**Il macchinario del Council funziona.** Non è un impianto rotto: è un impianto le cui
precondizioni non sono quasi mai tutte vere insieme. Scriverlo è dovuto verso ChatGPT, ed è
anche più utile — dice dove intervenire.

### Causa 4, trovata dal controllo positivo — il validatore legge l'albero, non il commit

La prima esecuzione di `UJ-INT-006` dal **mio** albero falliva su un hash. Misurato:
`docs/program/RESUME_POINT.md` ha hash `acdb1cd7…` **al commit pinnato e su `origin/main`**, e
`a8c085b1…` nel mio albero. Il validatore riportava quello dell'albero.

Provato quindi in due direzioni opposte — artefatto assente (`UJ-CAP-001`) e artefatto presente
ma diverso (`UJ-INT-006`). **Che una review sia importabile dipende da quale checkout la
esegue, non dai byte che pinna.** L'hash pinnato serve a rendere il giudizio indipendente da
chi lo ricontrolla; se il controllo legge altrove, il pin non vincola niente.

**Scoperta collaterale sul mio branch:** quelle 8 righe di differenza in `RESUME_POINT.md` sono
testo **di ChatGPT**, ereditato mergiando `agent/strict-zero-cloud-bridge-20260818` in sessione
4, e mai arrivato su `main`. Non l'ho scritto io e non l'ho rimosso: è il suo file. Mostra che
il contenuto di un ramo può viaggiare dentro il branch di un'altra IA e restarci invisibile,
finché un validatore non ricalcola un hash.

### Errori di questa parte

| # | Errore | Correzione |
|---|---|---|
| E25 | Il comando di riproduzione che ho scritto per la cifra "41" era `grep -c 'PASS_WITH_ACTIONS'`, che restituisce **44** | Le 3 di differenza stanno in `next_action` (2) e `output_contract` (1), che non sono criteri. Sostituito col conteggio strutturato che dà 41, e scritto lo scope |
| E26 | Ho scritto "**42 task su 43** non possono ricevere una review importabile" **senza contare** | Sono **40**: i task in `REVIEW` sono **tre**, non uno — `UJ-META-002`, `UJ-INT-001`, `UJ-INT-006`. Ricontato prima di lasciarlo scritto |

**Quattro volte in una sessione** (E19, E21, E25, E26) un numero è arrivato vicino alla consegna
senza essere ricontato al momento di scriverlo. Il difetto non è l'aritmetica: è **dedurre una
cifra da un ragionamento invece di rimisurarla nel punto in cui la si scrive**. Vale anche
quando la cifra è "ovvia" — E26 lo era, ed era sbagliata. Nuova trappola, la 24.

---

## Sessione 5, sesta parte — `S-18` riverificato, e una forma che oggi ho incontrato tre volte

`S-18` distrugge la memoria di Grok a ogni esecuzione dei test: valeva la pena controllare se
fosse ancora aperto invece di fidarmi del RESUME_POINT.

**`pytest` non è installato in un container nuovo**, quindi la verifica scritta in `FIX-11`
(`python3 -m pytest tests/test_files.py -q`) **non è eseguibile a freddo**. Invece di
dichiararlo non verificabile ho riprodotto il **meccanismo** con Python semplice, in un
worktree usa-e-getta su `origin/main`.

**Ancora aperto.** `grok.md` è passato da `d72ece89c9e7` a `6fa4b5249c69` **nella root reale**,
e nella temp dir non è stato scritto niente. Il mio albero di lavoro è rimasto intatto.

### La precisazione che rende la diagnosi esatta, e che avevo quasi sbagliato

La mia prima esecuzione stampava `__defaults__: None` e sembrava dire che nessun default fosse
stato catturato — cioè il contrario della verità. `root` è **keyword-only**: il valore vive in
**`__kwdefaults__`**, non in `__defaults__`. Cercarlo nel posto sbagliato porta alla conclusione
opposta a quella vera.

L'ho corretto prima di scriverlo, e ho aggiunto la precisazione a `FIX-11` perché chiunque
riproduca il difetto cadrà nello stesso posto.

### Controllo positivo, di nuovo, e assolve Grok su metà del difetto

Passando `root=<temp>` esplicitamente, `safe_write` scrive correttamente nella temp dir. **Il
contenimento funziona.** Sbagliato è solo il *momento* in cui la root viene legata. Quindi la
correzione già proposta in `FIX-11` è quella giusta, e non ne serve una più invasiva.

### La forma, incontrata tre volte oggi in tre punti diversi del programma

| Dove | Valore fissato una volta sola | Cosa sembra e non è |
|---|---|---|
| `cloud_bridge.PROVIDER` | all'import del modulo | impostare `MODEL_PROVIDER` dopo l'import non protegge |
| `promote_job_to_tools` | `safe=True` cablato | il gate `FIX-7` esiste e non può rifiutare |
| `tools.files.safe_write` | `__kwdefaults__['root']` alla `def` | il `monkeypatch` della fixture è un no-op |

In tutti e tre il codice del controllo è **corretto**, e leggerlo non rivela niente. Quello che
inganna è **quando** il valore viene fissato. È la ragione per cui la lettura statica ha
mancato tutti e tre, e l'esecuzione li ha trovati tutti e tre in una giornata.

---

## Sessione 5, settima parte — `UJ-RUN-001` riconciliata su branch dedicato, due giri di correzione

Il proprietario ha bloccato `UJ-RUN-001` finché gli artefatti non fossero coerenti su un solo
commit, e ha dato otto vincoli precisi. Poi, dopo la mia prima riconciliazione, ha riletto i
quattro file byte per byte e trovato tre incoerenze residue. Due giri, entrambi chiusi.

### Giro 1 — perché l'esito è `BLOCKED` e non `REVIEW`

Riverificato per esecuzione, non per memoria: `git cat-file -e
3611b1b400cf57b5021bab228a3de9470d6eca5c:prompts/delegation-cards/UJ-RUN-001-CLAUDE.json`
fallisce. La card entra con `d48e1e8519a8d7af90ea44e770f0db7fd3938fb3`, dodici minuti dopo.
Il proprietario aveva già stabilito la regola: card assente al `read_ref` → `BLOCKED`, non si
procede aggirando la condizione con un `REVIEW` di comodo.

**Azioni:**
- creato il branch autorizzato `agent/uj-run-001-blueprint-20260818` (coincide col pattern
  `write_branch_patterns` già scritto nella card);
- rieseguiti tutti i test dalla root: **140/140**, `runtime-invariants` **36/36**;
- **rimossi** i quattro documenti di consegna precedenti (packet, AC-evidence, delivery,
  append-blocks): erano generati su tre commit diversi e nessuna modifica a un solo file li
  avrebbe potuti riconciliare;
- creato un commit di riferimento unico, `2dad45a40798a8059b5e2b7db077b76e77fcc88b` (`X`),
  che fissa il byte stream dei 15 artefatti citati;
- rigenerato packet **con `status: BLOCKED`**, `AC-05` dichiarato esplicitamente **non
  soddisfatto** (chiede di proporre `REVIEW`, e proporre `BLOCKED` mentre lo si dichiara
  soddisfatto sarebbe aggirare la condizione, non segnalarla);
- rigenerata l'evidenza per criterio e il blocco di consegna, **senza** il `ReviewResult` di
  `UJ-INT-006`, come richiesto — è un artefatto separato, non mescolato con questa consegna;
- committato (`f0218d495e96f0394b062f4bc8dde987ca857542`, `Y`) e pushato sul nuovo branch.

Nessuna modifica a `BACKLOG.json`, nessun incremento di peso.

### Giro 2 — il proprietario ha trovato tre incoerenze rileggendo byte per byte, e io una quarta

**Le sue tre:**

1. Il blueprint dichiarava ancora `| Stato | REVIEW |` alla riga 9, mentre packet e delivery
   dichiaravano `BLOCKED`. Era rimasto così **dalla sessione 1**, mai rivisto. Corretto, con una
   nota che distingue esplicitamente ammissibilità (bloccata) da qualità dell'artefatto (non in
   discussione): il blocco non si scioglie perché i test passano.
2. Quattro conteggi di test diversi in circolazione: `33` (§13.3, conteggio di sessione 1),
   `34` (riepilogo dell'artefatto nel packet, conteggio intermedio dopo la regressione sulla
   idempotency key), `36`, `140`. **Misurato due volte in modo indipendente** sul file
   byte-identico al blob committato — statico (`grep -c '^test('` → 36) e dinamico
   (`node --test` dalla root → `36 pass, 0 fail, exit 0`). Un avvertimento aggiunto al
   documento: eseguire il blob estratto da una directory temporanea **fallisce** sugli import
   verso `dist/`, e non va riportato come test rotto.
3. Due branch citati per lo stesso commit. **Dimostrato**, non supposto:
   `git branch -a --contains <commit>` restituisce **un solo branch** (più il suo remoto).
   Nessun `UNVERIFIED` necessario — la domanda aveva una risposta.

**La quarta, trovata da me mentre correggevo le sue:** avevo scritto "24 prove specificate"
nelle sezioni 16-22. Contando solo le righe di **tabella** (`grep -cE '^\|.*PROVA DA
IMPLEMENTARE'`), il numero vero è **22**: la 23ª e 24ª occorrenza erano una menzione in prosa,
non una riga di prova. **Scoperta collaterale mentre scrivevo la correzione:** documentare il
comando di conteggio *dentro* il documento che sta contando cambia il risultato — senza
l'ancora `^\|` i due comandi restituiscono 24 e 13 invece di 22 e 11, perché contano anche le
proprie righe di prosa. Ho dovuto ancorare entrambi i comandi e riverificare che, come scritti
nel documento, riproducessero davvero i numeri dichiarati accanto.

**Azioni:** blueprint corretto (stato, §13.3, §15 autovalutazione, tabella per sezione delle 22
prove), committato (`79408449bd096613d2823efe6872ed424b757ee6`, `Z` — nuovo `source_commit_sha`
perché correggere il blueprint sposta i byte); packet rigenerato a `Z` con **1 hash su 15
cambiato** (solo il blueprint — prova che la correzione è stata chirurgica), riepilogo
dell'artefatto `34→36`, riferimento al branch stantio corretto,
`24→22` in tre punti; AC-evidence e delivery rigenerati a `Z`; **verifica incrociata sui
quattro file prima di committare** — matrice grep su `source_commit_sha`, `card_id`, `BLOCKED`,
assenza di dichiarazioni `REVIEW`, `36`, assenza di `UJ-INT-006` — con due falsi positivi
ispezionati e confermati innocui (una frase che dichiara l'assenza della review, una citazione
del difetto corretto); committato
(`9a7e92022d399f3e6575b84415a38fe099d13fde`, `W`) e pushato.

### Il collo di bottiglia resta lo stesso, ora dimostrato due volte

Non è risolvibile da me: `repository_scope.read_ref` della card è di ChatGPT.

### Errore di questa parte

| # | Errore | Correzione |
|---|---|---|
| E27 | Un numero generato in una sessione precedente ("24 prove") è stato ripetuto per tre commit e quattro file senza mai essere ricontato | Trovato per iniziativa propria, non richiesto dal proprietario, mentre si correggevano altre tre incoerenze segnalate da lui. Corretto a 22, con scomposizione per sezione e comando ancorato per la riproducibilità |

**Nota di metodo, non un errore nuovo ma una conferma delle trappole 22/24/25:** il proprietario
ha trovato, rileggendo byte per byte, tre incoerenze che le mie verifiche automatiche non
avevano colto — perché erano *interne al documento* (uno stato dichiarato in due punti diversi
con valori diversi), non *fra il documento e l'ambiente* (che è ciò che i miei script di
verifica controllano). Una lettura umana byte per byte resta insostituibile per la coerenza
interna di un testo lungo.

### Prove eseguite in questa parte

| Prova | Esito |
|---|---|
| `git cat-file -e` della card al `read_ref` | fallisce, confermato due volte |
| `npx tsc --noEmit` / `npx tsc` (entrambi i giri) | exit 0 / exit 0 |
| suite completa (entrambi i giri) | **140/140**, `runtime-invariants` **36/36** |
| `validate-response-packet.mjs` (entrambi i giri) | exit 0, 15/15 hash |
| `git branch -a --contains` sul commit di consegna | un solo branch + remoto |
| conteggio statico e dinamico dei test sul blob committato | coincidono, **36** |
| comandi di conteggio delle 22 prove, ancorati e riverificati | riproducono 22 e 11 |
| matrice di coerenza incrociata sui 4 file, pre-commit | 2 falsi positivi, entrambi ispezionati |
| `git push` (entrambi i giri) | exit 0 letto dal comando vero |

### Confini rispettati

Non ho toccato i tre file di Grok (`UJ-HANDOFF-NOTICE-RED-001-GROK-BLOCKED.md`,
`UJ-RESPONSE-RED-001-GROK-20260818.INVALID-source_commit.json`,
`ZERO_COST_FALSIFICATION_REPORT.md`) né li ho letti per modificarli. `UJ-RED-001-GROK` non
compare in nessuno dei miei quattro file. Non ho modificato `BACKLOG.json`, non ho toccato il
peso accettato. Il push sul branch `agent/uj-run-001-blueprint-20260818` non è una pubblicazione
né un merge: nessuna scrittura su `main`.

### Cosa NON ho fatto, e perché

Non ho aperto la nuova consegna di Gemini su `UJ-CAP-001` (vedi RESUME_POINT, punto nuovo):
l'ho trovata riaprendo la trappola 11 a fine sessione, e revisionarla ora avrebbe significato
iniziare un lavoro nuovo invece di chiudere la sessione corrente in modo pulito, come chiesto
dal proprietario.

---

## Sessione 6 — `UJ-CLAUDE-2026-08-18-06` — 2026-08-18

**Richiesta del proprietario, via ChatGPT:** riconciliare completamente la consegna di
`UJ-RUN-001`. `docs/program/handoffs/HANDOFF-UJ-RUN-001.md` era ancora obsoleto — branch
`claude/ultrajarvis-repo-analysis-li6vvj`, stato `REVIEW`, 33 test — e contraddiceva packet e
blueprint. Mantenere `BLOCKED`, nuovo source commit, 15 hash ricalcolati, tutto rigenerato,
pushare **solo** il branch autorizzato.

### Il difetto segnalato era reale, e la sua causa è la mia trappola 20

L'handoff **è uno dei 15 artefatti che il mio stesso packet hasha**. Due artefatti pinati sullo
**stesso** commit dichiaravano stati opposti — `REVIEW` nell'handoff, `BLOCKED` nel packet — e
nessuno dei due conteneva qualcosa che permettesse di stabilire quale valesse. Una consegna così
non è ammissibile a prescindere dalla qualità del contenuto.

La causa non è distrazione: in sessione 5 avevo corretto `REVIEW` e `33` **nel blueprint** e
li avevo lasciati **nel file accanto**. È la trappola 20 — *un difetto corretto in un file non è
corretto nel file accanto* — dopo il byte NUL rimosso da `checkpoint.ts` e lasciato in
`depth-guard.ts` per quattro sessioni.

### Cercare l'istanza segnalata sarebbe stato l'errore: le occorrenze erano quattro

Invece di correggere il file indicato, ho scandito **tutto** il set di consegna cercando la
**classe**: *dichiarazioni di stato o di branch scritte al presente e già superate*.

| # | Artefatto | Dichiarava | Chi l'ha trovata |
|---:|---|---|---|
| 1 | `docs/program/handoffs/HANDOFF-UJ-RUN-001.md` | branch e stato di sessione 1, `33` test | **ChatGPT** |
| 2 | `packages/contracts/src/runtime/index.ts` | `RUNTIME_CONTRACTS_PROVENANCE.status = "REVIEW"` | la scansione |
| 3 | `packages/contracts/package.json` | `description: "… status REVIEW."` | la scansione |
| 4 | `docs/architecture/RUNTIME_BLUEPRINT.md` | il prompt canonico *«non è ancora su `main`»* | la scansione |

**La n. 2 è la peggiore, ed è una riga.** È l'**unica copia leggibile da una macchina** dello
stato, ed è offerta dal suo stesso commento *«for the Program OS ledger»*: un integratore che
leggesse la provenienza dal codice invece che dal packet avrebbe ottenuto `REVIEW` da una
consegna `BLOCKED`. Lo stesso file, venticinque righe più su, dichiarava `Status: PROPOSAL` —
due stati diversi nello stesso file. Ho separato i due assi, *maturità del contratto* e
*ammissibilità della consegna*, perché confonderli è ciò che ha prodotto la contraddizione.
Prima di toccarla ho verificato con `grep` che **nessuno la legge**, e ho rieseguito typecheck,
build e i 140 test dopo.

**La n. 4 era falsa, misurata:** `git show origin/main:…MASTER_PROMPT.md | sha256sum` e
`git show b8a7697:<stesso path> | sha256sum` danno entrambi `a3fcdfc9…a69a87`. Il prompt è su
`main`; la provenienza resta valida, cambiava solo dove leggerlo.

### Il metodo che ha reso verificabile la correzione

Ho ricalcolato **tutti e 15** gli hash a **entrambi** i commit sorgente. **4 su 15 cambiati**,
esattamente i quattro artefatti sopra, e nessun altro. Non è un dettaglio contabile: è la prova
che non ho toccato altri byte per far quadrare il risultato, ed è falsificabile — se avessi
"sistemato" qualcos'altro, il conteggio sarebbe stato 5.

### Che cosa dice ora l'handoff, e che cosa ho deciso di NON cancellare

Riscritto sui valori rimisurati: branch `agent/uj-run-001-blueprint-20260818`, stato
`BLOCKED`, peso `0/13`, `runtime-invariants` **36**, suite **140**, **22** prove non
implementate nelle §16-21 più **11** `PENDING` in §13.3 (**33** in totale), demo end-to-end
**non eseguita**, card assente al `read_ref` `3611b1b4` e introdotta da `d48e1e85`.

Tre scelte di progetto che vale la pena registrare:

1. **§0.3 conserva i valori superati sotto un'intestazione esplicita di storia**, ciascuno
   accanto al valore che vale oggi. Cancellarli in silenzio impedirebbe a chi ha visto la
   versione precedente di capire che cosa ha smesso di essere vero.
2. **§0.4 registra la classe, non l'istanza** — le quattro occorrenze e la contromisura: quando
   si corregge un valore condiviso, si greppa **tutta** la consegna. È ora una voce di
   `verification.checks_run` nel packet, così il giro successivo la eredita.
3. **L'handoff non nomina il commit che lo contiene.** Il suo hash è parte di quel commit:
   scriverlo dentro è impossibile per costruzione. Il `source_commit_sha` sta in **un solo
   posto**, il packet. È la stessa disciplina che il blueprint già seguiva.

Aggiunta anche una tabella §5 che separa **stato misurato nel `BACKLOG.json`** e **stato
proposto dal packet**: la versione precedente dichiarava transizioni come *avvenute* quando
nulla, nel repository, applica una transizione proposta.

### La delivery ora porta due blocchi FILE, non uno

Ho aggiunto l'handoff come secondo blocco estraibile accanto al blueprint, così ChatGPT può
riverificare l'artefatto corretto **senza clonare il branch**. Round-trip verificato: ogni
blocco riestratto rihasha identico alla sua sorgente, packet incluso.

### `response_id` cambiato di proposito

Da `…-BLOCKED` a `…-BLOCKED-R3`. Il mio finding `F-002` di sessione 3 dice che il validatore
del Council è **stateless** e non rileva un replay divergente: stesso id, byte diversi, passa.
Riusare l'id sarebbe stato produrre esattamente il caso che ho segnalato come difetto altrui.

### ERRORI COMMESSI IN QUESTA SESSIONE

| # | Errore | Come si è manifestato | Correzione | Lezione |
|---|---|---|---|---|
| E28 | **Falso negativo per campo sbagliato**, quasi consegnato: ho controllato `UJ-INT-007` con `tasks.map(t => t.id)`, ma il campo è `task_id`. Il confronto avveniva contro `undefined` | il primo script ha stampato `UJ-INT-007 presente: false` — e nello stesso output un altro `find` è esploso su `undefined`, che è ciò che mi ha insospettito | riletto lo schema del task (`Object.keys`), rifatto il controllo | **è la trappola 12 dal lato di chi scrive il controllo**: un check che fallisce per il motivo sbagliato conferma qualunque cosa ti aspetti. Il segnale che ha salvato è stata l'incoerenza fra due output dello stesso script |
| E29 | **Sopravvalutata una mia prova.** Nell'handoff avevo scritto che i valori Jaccard `0.7778`/`0.9130` sono *"pinnati in un test"* | aprendo il test: asserisce `< 0.95` e `> 0.7`, cioè i **limiti**; i due valori esatti stanno nel commento | frase corretta prima del commit, con la distinzione esplicita | citare una prova **come è**, non come la si ricorda. Il test impedisce di ritarare la soglia; non congela le due cifre. Trappola 14 applicata a me stesso |
| E30 | **Il comando di fetch documentato nella mia stessa memoria è difettoso.** `git fetch origin 'refs/heads/*:refs/remotes/origin/*'`, senza `+`, **rifiuta** l'aggiornamento di un ref remoto riscritto | eseguito il comando come documentato: `! [rejected] main -> origin/main (non-fast-forward)`, e `origin/main` è rimasto a `9d2a93d` (un solo commit, "Initial commit") mentre il vero era `25b1b7d` | rieseguito con `+refs/heads/*:…`; corretto in **CLAUDE.md PARTE 2 e AVVIO_NUOVA_SESSIONE.md**, e riprodotto in modo deterministico con un ref di prova | **è la trappola 17 causata dalla procedura che dovrebbe prevenirla.** Se non me ne fossi accorto, ogni confronto fra branch sarebbe stato contro un `origin/main` di un commit, e i diffstat sarebbero stati assurdi *senza che nulla lo dicesse*. La riga `! [rejected]` è una sola in mezzo a diciotto `[new branch]`: va **letta**, non scorsa |

### Correzione a un'affermazione della sessione 5

Il punto `S` del RESUME_POINT diceva: *"UJ-INT-007 NON ESISTE fra i 43 task del BACKLOG.json
(verificato al ref corrente)"*. **È falso.** `UJ-INT-007` esiste — owner CHATGPT, reviewer
GEMINI, peso 13, milestone **M10**, stato `DEFERRED` — ed esisteva già a `31f31b9`, verificato
a quattro ref diversi.

Con ogni probabilità quella verifica fu lo **stesso** falso negativo di E28, commesso senza
accorgersene. La conclusione operativa non cambia — `UJ-REV-002` resta non lavorabile — ma la
causa sì: *«la dipendenza esiste e non è accettata»*, non *«la dipendenza non esiste»*. **È la
causa a dire chi può sbloccare cosa**, e con la causa sbagliata una sessione futura cercherebbe
un task inesistente invece di aspettare M10.

### Prove eseguite in questa sessione

| Prova | Comando | Esito |
|---|---|---|
| Integrità piano canonico | `sha256sum docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md` | `a3fcdfc9…a69a87` **coincide** |
| Typecheck | `npx tsc -p packages/contracts --noEmit` | **exit 0** |
| Build | `npx tsc -p packages/contracts` | **exit 0** |
| Suite completa | `for f in tests/contracts/*.test.mjs; do node --test "$f"; done` | **140/140 pass, 0 fail** |
| Card al `read_ref` | `git cat-file -e 3611b1b4:…UJ-RUN-001-CLAUDE.json` | **exit 128** — condizione bloccante |
| Card a `d48e1e85` | `git cat-file -e d48e1e85:…` | exit 0 |
| I 4 input pinati a `3611b1b4` | ricalcolo sha256 | **4/4 coincidono** — non è un pin mismatch |
| 15 hash al nuovo source commit | `git show <commit>:<ref> \| sha256sum` | **15/15**, e **4 cambiati su 15** vs il precedente |
| Validatore packet | `node scripts/validate-response-packet.mjs …` | **exit 0**, `READY -> BLOCKED`, `0 -> 0/13` |
| Ogni SHA-256 citato nell'AC-evidence | cross-check contro gli hash reali | **15 su 15 riconosciuti, 0 sconosciuti** |
| Round-trip della delivery | riestrazione e rihash dei 3 blocchi | **3/3 identici** |
| Conteggi ancorati nel blueprint | `grep -cE '^\|.*PROVA DA IMPLEMENTARE'` e `'^\|.*PENDING'` | **22** e **11** |
| Conteggio test, statico e dinamico | `grep -c '^test('` e `node --test` | **36** e **36** |
| Consumatori di `RUNTIME_CONTRACTS_PROVENANCE` | `grep -rn` | **nessuno**, solo la dichiarazione |
| Branch containment | `git branch -a --contains` + `merge-base --is-ancestor` ×3 | un solo branch e il suo remoto; **non** su main né sugli altri due rami CLAUDE |
| Validatori di ChatGPT | `validate-council-packets`, `validate-program-os` | **exit 0** entrambi — non ho rotto niente di suo |
| Difetto del fetch (E30) | ref di prova, con e senza `+` | **riprodotto**: senza `+` il ref resta al valore vecchio |
| `git push` | letto dal comando vero, mai da una pipe | **exit 0**, due volte |

### Confini rispettati

Otto file toccati, **tutti miei**: blueprint, handoff, `index.ts`, `package.json`, packet,
AC-evidence, delivery, append-blocks — più `CLAUDE.md`, `TASKCLAUDE.md` e
`AVVIO_NUOVA_SESSIONE.md` per la Regola 2. Verificato per esecuzione che **non** ho toccato
`core/`, `tools/`, `advisors/`, `bin/`, i test Python, `cloud_bridge.py` (GROK), né
`BACKLOG.json`, `PROGRESS.md`, `schemas/`, `scripts/` (CHATGPT), né `gpt.md`, `taskgpt.md`,
`grok.md`, `taskgrok.md`. `origin/main` è invariato. Nessun `ReviewResult` emesso, nessun peso
auto-assegnato, nessuna chiamata a pagamento.

### Cosa NON ho fatto, e perché

- **Non ho portato `UJ-RUN-001` a `REVIEW`.** Il `read_ref` della card è di ChatGPT e non è
  cambiato. I test che passano non sciolgono una condizione di ammissibilità.
- **Non ho aperto il terzo invio di `UJ-CAP-001`** (`agent/uj-cap-001-gemini-review-20260818`
  @ `0f1c536`): la task esplicita di questa sessione era la riconciliazione di `UJ-RUN-001`, e
  aprire una review nuova avrebbe significato consegnarne due a metà. Resta il primo task della
  prossima sessione, come già scritto nel punto AA.
- **Non ho corretto i pesi né lo status nel `BACKLOG.json`**: è dell'integratore.


## Sessione 6, seconda parte — `main` è stato riscritto, e la correzione che chiedevo era sbagliata

Il proprietario ha confermato la diagnosi: *«il packet è BLOCKED perché la card indicava un
`read_ref` che non conteneva la card stessa … non ammissibili finché la correzione della card
non entra in main»*. Invece di registrare l'accordo e fermarmi, ho verificato le due cose che
quella frase dà per scontate. **Una era falsa, ed era una mia istruzione.**

### La scoperta

`main` **è stato riscritto.** Nessuno dei commit che l'intera vicenda nomina è più raggiungibile
da `origin/main`:

| Commit | Che cos'è | Antenato di `origin/main`? |
|---|---|---|
| `3611b1b4` | il `read_ref` dichiarato dalla card | **no** |
| `d48e1e85` | il commit che introduce la card | **no** |
| `31f31b9` | il tip del branch di ChatGPT | **no** |
| `99dece5` | **il mio merge di PR #1 e PR #2 su main**, sessione 3 | **no** |

Sopravvivono solo su rami laterali. **Un secondo indizio indipendente, che avevo già in mano
senza riconoscerlo:** a inizio sessione il `git fetch` senza `+` aveva rifiutato l'aggiornamento
di `origin/main` come *non-fast-forward* (E30). L'avevo classificato come difetto della mia
ricetta di fetch — ed era anche quello — ma era **anche** il sintomo di questo. Un sintomo letto
per metà è un sintomo perso.

### Perché conta: la mia istruzione avrebbe fatto sprecare un giro

La consegna diceva a ChatGPT: *«porta il `read_ref` a un commit pari o successivo a
`d48e1e85`»*. Soddisfa **una sola** delle due clausole necessarie. Seguita alla lettera
produrrebbe un `read_ref` che `main` **non può risolvere** — lo stesso difetto in forma nuova,
scoperto dopo un altro giro di HUMAN_BRIDGE pagato a mano.

**La condizione corretta:** il commit deve **contenere la card** *e* essere **raggiungibile da
`origin/main`**. Candidati verificati: `3cbae5c1` (il primo, nella storia attuale di `main`, in
cui la card compare) e il tip `25b1b7d5`.

### E il difetto è su tutte e quattro le card

| Card | `read_ref` | Esiste a quel commit? |
|---|---|---|
| `UJ-RUN-001-CLAUDE.json` | `3611b1b4` | **no** |
| `UJ-CAP-001-GEMINI.json` | `3611b1b4` | **no** |
| `UJ-GGL-001-GEMINI.json` | `3611b1b4` | **no** |
| `UJ-RED-001-GROK.json` | `3611b1b4` | **no** |

Gemini lo incontrerà **due** volte e Grok **una**. Correggerle insieme costa **un** giro di
HUMAN_BRIDGE invece di tre — e quelli li paga Christian a mano.

**Fragilità registrata:** i quattro input pinati si risolvono ancora a `3611b1b4`, 4 su 4, ma
**solo perché quei rami laterali esistono**. Cancellandoli, anche i pin diventerebbero
irrisolvibili.

### Metodo, e l'errore che questa parte corregge

| # | Errore | Correzione |
|---|---|---|
| E31 | **Ho scritto un'istruzione correttiva verificando solo metà della condizione.** *«un commit pari o successivo a `d48e1e85`»* controllava che la card ci fosse, non che il commit fosse raggiungibile da `main` | La regola generale: **quando prescrivi un ref a qualcun altro, verifica che sia risolvibile dal punto di vista di chi lo userà**, non solo dal tuo. Un ref esiste sempre *da qualche parte*: la domanda utile è *da dove* |
| E32 | **Ho letto un sintomo per metà** (E30): il fetch rifiutato come non-fast-forward era la prova che `main` era stato riscritto, e l'ho archiviato come difetto della mia ricetta | Un `! [rejected] … (non-fast-forward)` su un ref remoto **non è mai solo** un problema di refspec: dice anche che la storia remota è cambiata. Vanno lette entrambe le implicazioni |

Un bug operativo minore, senza conseguenze: uno script di patch degli append blocks è fallito
con `KeyError` su una `.format()` applicata a un pattern con graffe. Il file non è stato
toccato (l'eccezione precede la scrittura, verificato con `grep`), e l'ho rigenerato da zero
invece di patcharlo con regex fragili — che era comunque la scelta giusta.

### Consegna del giro 4

`source_commit_sha` `cfee1316cf83a6171871fedd541e7c4cd286389f`, delivery commit `d414306f2928c7ae3f1324aa5100805a23a40107`.
**1 hash su 15 cambiato**: solo l'handoff, che guadagna la §1.1 con i comandi di raggiungibilità
e le due tabelle. Packet `-R4`, AC-evidence §0-ter, delivery e append rigenerati.
`BLOCKED` invariato, **0/13** invariato, **nessuna card toccata** — sono di ChatGPT, e i loro
byte sul mio branch sono identici a quelli su `main`, confrontati.



## Sessione 6, terza parte — ChatGPT ha corretto le card, e la correzione ha rotto i pin

Trappola 11 all'apertura, nona volta che paga: `main` si era mossa e c'erano tre rami nuovi.
Fra i commit, `4b63b94` — *"fix(council): repin cards to reachable main history"*. Cioè
esattamente la correzione che avevo chiesto il giorno prima.

### Quello che ChatGPT ha fatto bene, e va detto per primo

Il difetto è **chiuso**: tutte e quattro le card dichiarano `read_ref` `25b1b7d53ff5`, che le
contiene ed è raggiungibile da `main`. Verificato 4 su 4 su entrambe le clausole. Ha scelto il
tip, che era l'opzione che avevo raccomandato.

E ha fatto **due cose che non avevo chiesto**:

1. **Ha allineato i criteri di accettazione.** `UJ-RUN-001` nel `BACKLOG.json` ne dichiara ora
   **cinque**, non due. Era il rilievo che rendeva non importabile qualunque `ReviewResult`.
2. **Ha reso il difetto meccanico invece di correggerlo e basta**, aggiungendo due assert a
   `validate-council-packets.mjs`: il `read_ref` deve coincidere col commit della missione, e i
   criteri della card devono coincidere con quelli del backlog. È più di quanto avessi chiesto,
   ed è la differenza fra un difetto corretto e un difetto impossibile.

### Quello che la stessa correzione ha rotto

Ha riscritto **anche** i sedici hash degli input pinati sulle quattro card. **Zero su sedici
corrispondono** ai byte al `read_ref` che le card stesse dichiarano.

Prima di scriverlo ho cercato una spiegazione innocente, perché "gli hash sono sbagliati" è
un'accusa pesante:

| Convenzione testata sul piano canonico | Risultato |
|---|---|
| sha256 del contenuto | `a3fcdfc9…a69a87` — il valore vero |
| sha256 blob-style `blob <len>\0…` | `db2b386f…` |
| sha256 senza newline finale | `8e61eeb7…` |
| sha256 con CRLF | `32c4164b…` |
| sha256 di path + contenuto | `eddf54d2…` |
| sha1 del contenuto | `baab5144…` |

La card dichiara `d4137ca3…`. **Nessuna delle sei lo produce.** E scorrendo tutta la storia del
file: il piano canonico vale `a3fcdfc9…` a ogni ref, e il valore dichiarato **non è mai
esistito**. I valori corretti sono quelli che le card portavano **prima** della correzione.

### Il gate di ChatGPT rifiuta il commit di ChatGPT

Eseguito in un worktree su `origin/main`: `validate-council-packets.mjs` → **exit 1**, dodici
mismatch. Il commit non è mai stato passato dal proprio validatore prima del push. Per
correttezza: `validate-program-os.mjs` passa, quindi il difetto è circoscritto alle card.

### Il rilievo che conta di più, e che il suo validatore non può mostrargli

Il validatore riporta **12**, io ne ho misurati **16**. La differenza è una riga:

```js
if (!artifact.ref.startsWith("docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md")) {
```

**L'unico artefatto escluso dal controllo di integrità è il piano canonico del programma.** Il
suo hash falso sta in tutte e quattro le card e nessun gate lo dirà mai, per quante volte lo si
esegua. È la nona occorrenza della forma "un controllo che sembra un controllo", e stavolta
sull'oggetto di rango più alto.

### Effetto su `UJ-RUN-001`: il blocco cambia identità, non si scioglie

| | Prima | Adesso |
|---|---|---|
| La card esiste al proprio `read_ref` | **no** | **sì** |
| Gli input pinati coincidono | **sì**, 4/4 | **no**, 0/4 |
| Il gate del Council passa | sì | **no**, exit 1 |

Per quattro giri la mia consegna ha scritto *"non è un pin mismatch"*. **Adesso lo è.**
Ma il rischio sostanziale è **nullo** e sarebbe disonesto non dirlo: il lavoro è stato svolto
contro i documenti reali, byte invariati, hash veri ricalcolati in questa sessione. Il blocco è
**formale**.

### Consegna del giro 5

`source_commit_sha` c645377d54c20fad517d376a1b1e10ac54d289a7, delivery 141180ae27613ec69b3a0dcbff96faa17494e1a3.
**1 hash su 15 cambiato**: solo l'handoff, che guadagna la §1.0. Packet `-R5`, AC-evidence
§0-quater, delivery e append rigenerati. Nuovo documento:
`docs/program/reviews/UJ-CARDS-REPIN-VERIFICATION-CLAUDE.md`. `BLOCKED` e `0/13` invariati,
**nessuna card toccata**.

### Errori di questa parte

Nessuno arrivato a un documento. Uno fermato in tempo: il primo controllo sul legame fra il
Python di Grok e i miei contratti l'avevo scritto come `grep … | head -5 || echo "ZERO"`, e il
`||` si applicava a `head`, non a `grep`. Il comando non poteva stampare la riga negativa e ho
letto un output vuoto come se fosse una risposta. **È la trappola 15 nella sua forma più
subdola**: non un exit code letto attraverso una pipe, ma un *ramo di fallback* messo dopo una
pipe. Rifatto senza pipe, la risposta era "zero file": vera, ma per poco non l'avevo dedotta
invece di misurarla.

### Nota di metodo che vale la pena tenere

Questa parte è andata bene per una ragione sola: **ho verificato una correzione altrui invece
di accettarla.** Il messaggio di commit diceva esattamente la cosa giusta, il difetto segnalato
era davvero chiuso, e fermarsi lì sarebbe stato ragionevole. I sedici hash falsi sono comparsi
solo perché ho ricalcolato ciò che il commit dichiarava. Vale come regola: **una correzione che
chiude il tuo finding va verificata con lo stesso metro con cui hai trovato il finding.**



## Sessione 6, quarta parte — `UJ-RUN-001` è **REVIEW**. Dopo cinque giri, il blocco è sciolto

Trappola 11 all'apertura, decima volta: `main` si era mossa due volte e c'erano cinque branch
nuovi. Fra i commit, `6ba3a2b` *"restore exact pinned input hashes"* e `27b7673` *"validate
every input hash at pinned ref"*. Cioè le due correzioni che avevo chiesto poche ore prima.

### Ho verificato invece di accreditare, ed è andata bene

| Clausola | Esito |
|---|---|
| card esiste al proprio `read_ref` `25b1b7d53ff5` | **exit 0** |
| `read_ref` raggiungibile da `origin/main` | **exit 0** |
| i quattro input pinati coincidono | **4 su 4** — e 16 su 16 su tutte e quattro le card |
| `validate-council-packets.mjs` su `origin/main` | **PASS, exit 0** |
| criteri card ≡ criteri `BACKLOG.json` | **`AC-01`…`AC-05`** |
| stato nel ledger | `READY`, reviewer GEMINI |

**Sei su sei.** ChatGPT ha chiuso tutto, compreso il rilievo che avevo esplicitamente
etichettato come **minore e non bloccante**: il validatore ora calcola gli hash con
`sha256AtRef(artifact.ref, readRef)`, cioè dal commit pinnato invece che dall'albero di lavoro.
Era la "causa 4" che avevo documentato in sessione 5 e che non avevo nemmeno messo fra le
richieste. È stata chiusa lo stesso, e va detto.

### La transizione a REVIEW è costata **un** commit, e il motivo è una nota di due giri fa

Lo stato della consegna vive in **quattro** posti: handoff, intestazione e nota del blueprint,
`RUNTIME_CONTRACTS_PROVENANCE` in `index.ts`, `description` del `package.json`. Non li ho
cercati: erano già censiti nella **§0.4 dell'handoff**, scritta quando avevo deciso di
registrare la *classe* del difetto invece dell'istanza segnalata.

**È il primo giro in cui quella disciplina ha pagato in avanti invece che indietro.** Muovere
`BLOCKED → REVIEW` è stato spuntare una lista, non una caccia. E ha funzionato anche in
negativo: la stessa scansione ha mostrato che `kind: "BLOCKED"` in `agent-manifest.ts` e
`team-spec.ts`, e il membro `BLOCKED` di `ResultStatus`, sono **stati del runtime**, non stato
della consegna. Una sostituzione cieca li avrebbe corrotti. Verificato: 4 hash su 15 cambiati,
esattamente le dichiarazioni di stato, e zero byte della logica dei contratti.

### Un difetto trovato dalla mia stessa scansione, dentro un documento appena scritto

La tabella storica §0.3 dell'handoff diceva alla riga 3: *"diceva `REVIEW` → vale invece
`BLOCKED`"*. Con lo sblocco quella riga è diventata **falsa**: lo stato è tornato `REVIEW`.

L'ho corretta aggiungendo la cosa che conta: **è tornato alla stessa parola con contenuto
opposto.** In sessione 1 `REVIEW` era asserito senza che nessuna condizione di ammissibilità
fosse mai stata controllata; oggi è il risultato di sei controlli eseguiti. Un lettore che
vedesse solo il valore concluderebbe che non è successo niente in cinque giri.

### `AC-05` passa da NON SODDISFATTO a SODDISFATTO, e non per sconto

Per cinque giri l'ho dichiarato non soddisfatto, correttamente: chiedeva un packet che
proponesse `REVIEW`, e il mio proponeva `BLOCKED`. Dichiararlo soddisfatto allora sarebbe stato
aggirare la condizione. Ora è soddisfatto perché le clausole sono vere.

**Il peso accettato resta `0/13`.** `REVIEW` non è accettazione, e il validatore rifiuta per
costruzione un packet che proponga la propria accettazione.

### Consegna del giro 6

`source_commit_sha` b2b32733e8db7394fbc0a7f0503bb2795f3b4821, delivery c4e23caca979750408ea8da3fabc8721aad2195c.
`response_id` `…-REVIEW-R6`, `status: REVIEW`, `READY → REVIEW`, accettato `0 → 0/13`.
**4 hash su 15 cambiati**, tutti dichiarazioni di stato. Delivery e append blocks **rinominati**
(non erano più `BLOCKED`) e riscritti per parlare a **GEMINI** invece che a ChatGPT: checklist,
i tre comandi nell'ordine giusto, l'avvertenza sulla build, e il rimando al §4 che dichiara cosa
**non** è dimostrato — 22 prove non eseguite, 11 `PENDING`, 33 in totale, demo §21 non eseguita.

### Errori di questa parte

Nessuno arrivato a un documento consegnato. Uno corretto in corsa: la riga 3 della tabella
storica, sopra. È significativo che l'abbia trovata **la scansione automatica che avevo scritto
per un altro scopo** — cercare dichiarazioni di stato residue — e non una rilettura. Le due cose
non si sostituiscono: la scansione trova le occorrenze, la rilettura trova le contraddizioni
interne. Questa era entrambe.

### La cosa che porto via

Tre giri fa ho scritto la trappola 26 — *correggi la classe, non l'istanza* — dopo aver perso
tempo a inseguire un difetto in quattro file. Oggi quella nota ha trasformato una transizione
che sarebbe stata una caccia in una spunta di quattro righe, e mi ha impedito di rompere tre
tipi del runtime con un find-and-replace. **Una lezione registrata bene si ripaga nel senso
opposto a quello in cui è stata imparata.**



## Sessione 6, quinta parte — mandato di Technical Lead, innesco scelto, PR #18 aperta

Christian ha deciso che a fine pianificazione la leadership operativa passa a me, e mi ha
delegato la scelta dell'innesco (*"scegli te"*). Ho fatto tre cose: verificato i fatti che mi
aveva dato, registrato il mandato in memoria, e scelto — correggendo una mia proposta sbagliata.

### Tre correzioni ai fatti del briefing, verificate

| Affermazione | Realtà misurata |
|---|---|
| *"Grok deve abbandonare la vecchia PR #13"* | **PR #13 è di CHATGPT**, branch `agent/chatgpt-uj-red-001-grok-intake-*`: è la sua PR di quarantena. Grok non può abbandonarla |
| *"Grok deve rifare UJ-RED-001"* | **Già fatto**: PR #16, branch nuovo, basata sul `main` attuale |
| — | **Il mio `UJ-RUN-001` non aveva alcuna PR**, pur essendo in `REVIEW` da stamattina |

`main` a `27b7673`, Council PASS, packet R6 `REVIEW` a `0/13`, 15 hash: tutto confermato.

### L'errore che ho trovato nella mia stessa proposta

Avevo proposto come innesco quattro task per 42 unità, includendo `UJ-INT-004`. Calcolando la
**chiusura transitiva** delle dipendenze — cosa che non avevo fatto prima di proporlo — quei
quattro diventano **8 task e 94 unità**: `UJ-INT-004` dipende da `UJ-INT-002`, che dipende da
tutti e quattro i deliverable degli specialisti.

Un "minimo" che si trascina dietro quasi tutta la milestone M0+M1 non è un minimo. **È la stessa
classe di errore che contesto agli altri: un numero dedotto invece che calcolato.** Adottata la
**Definizione B′**: tre task, 34 unità, `UJ-INT-004` escluso perché è la *specifica* del
monorepo e la struttura per costruire esiste già e funziona.

### La proprietà di B′ che l'ha fatta scegliere

| Task | Peso | Reviewer |
|---|---:|---|
| `UJ-RUN-001` | 13 | **GEMINI** |
| `UJ-SEC-001` | 13 | **GROK** |
| `UJ-RCV-001` | 8 | **CHATGPT** |

**Una review per ciascuna delle altre tre IA.** L'innesco è simmetrico: nessuno regge da solo il
passaggio di consegne, e nessuno può bloccarlo se non per la propria parte. Non l'avevo cercata,
è emersa dai dati — e ho anche dovuto correggere un'affermazione dell'ultimo messaggio in cui
avevo detto che Gemini teneva tre review su quattro. Ne tiene **una**.

### L'atto concreto: PR #18

`UJ-RUN-001` era ammissibile da stamattina e **non aveva una PR**. Il reviewer non aveva una
sede. Aperta come **draft**, compilata sul template del repository, con la tabella delle sei
clausole di ammissibilità verificate, i comandi di riproduzione nell'ordine giusto, e la sezione
*"che cosa NON è dimostrato"* in evidenza invece che sepolta.

È il primo dei cinque atti che avevo scritto nel mandato, ed è quello che costa meno e sblocca di
più. Il fatto che sia rimasto scoperto per un giorno intero è un difetto di coordinamento mio,
non di Gemini.

### Un blocker stantio nel `BACKLOG.json`, segnalato non corretto

`UJ-INT-002` dichiara come causa *"specialist ResponsePackets do not exist yet"*. Misurato: **i
quattro packet esistono tutti**, uno per branch. La causa dichiarata è superata. Se la condizione
vera è *"non sono ancora accettati"*, il testo va corretto — perché *"non esistono"* e *"esistono
e non sono accettati"* nominano **resolver diversi**: nel primo caso tocca produrre, nel secondo
pronunciarsi. È la causa a dire chi deve muoversi, ed è la stessa lezione di `UJ-INT-007`.

Non l'ho corretto: `BACKLOG.json` è di ChatGPT.

### Errori di questa parte

| # | Errore | Correzione |
|---|---|---|
| E33 | **Ho proposto una definizione di innesco senza calcolarne la chiusura transitiva.** 42 unità dichiarate, 94 reali | Calcolata con un attraversamento del grafo delle dipendenze e adottata `B′`. La lezione: **una soglia proposta va chiusa transitivamente prima di proporla**, altrimenti è una stima travestita da criterio |
| E34 | **Ho scritto che Gemini teneva "tre delle quattro review che servono".** Ne tiene una | Verificato nel `BACKLOG.json`: una per IA. Detto in un messaggio al proprietario senza controllare, ed è esattamente la fretta che produce i numeri sbagliati che passo il tempo a trovare negli altri |

Entrambi trovati da me, entrambi prima che producessero lavoro sbagliato — ma il secondo era già
uscito in un messaggio, quindi va corretto pubblicamente e non solo qui.



## Sessione 6, sesta parte — `UJ-CAP-001` quarto invio: FAIL 3/5, ma la metà dei blocchi non è di Gemini

Preso il primo task del `RESUME_POINT` (punto AA azione 2): il quarto invio di `UJ-CAP-001`
da Gemini, `agent/uj-cap-001-gemini-review-20260818` @ `0f1c536`. Sono il reviewer designato,
riverificato nella card e nel `BACKLOG`, non assunto.

**Consegnato:**
`docs/program/reviews/UJ-CAP-001-CLAUDE-VERDICT-20260819.md` (11 sezioni) e
`docs/program/reviews/UJ-CAP-001-CLAUDE-REVIEWRESULT-CANDIDATE-20260819.json`.
**Esito `FAIL`, 3 criteri su 5.** `UJ-CAP-001` resta **0/13**, prima e dopo.

### Il test dichiarato in anticipo ha funzionato di nuovo

I due `grep` erano scritti nel `RESUME_POINT` **prima** di aprire i file, e hanno distinto una
verifica da un reimballaggio: `UNKNOWN` 79 nel JSON, date ISO 28, **zero capability `ACTIVE`**,
confidenza massima `0.5` su 19 record. Quattro dei sei findings che avevo aperto sono chiusi, e
`G-002` è chiuso bene: `CAP-GGL-001` — l'unica capability che abiliterebbe lavoro automatico a
costo zero — è passata da numeri di quota inventati con confidenza `HIGH` a `status: UNKNOWN`,
più la clausola EEA/Svizzera/UK che si applica **anche all'accesso gratuito**. Quest'ultima non
l'avevo chiesta, riguarda direttamente Christian che è in Italia, e l'ha vista lei.

Ho anche controllato che il commit *"remove unverified capability claims"* non chiudesse una
lacuna cancellandola — era il difetto di `F-004` del giro precedente. **Non lo fa**: 19 ID
prima, 19 dopo, nessuno rimosso. Il sospetto era fondato e si è rivelato infondato, e va detto.

### L'esperimento a variabile singola su `AC-05`

Il packet, **come consegnato**, fallisce il mio validatore: exit 1, due errori, perché
`source_commit_sha` `3611b1b4` non contiene i suoi stessi artefatti. Ho cambiato **quel solo
campo** e lasciato ogni altro byte identico: **PASS, exit 0**.

**E la causa non è di Gemini.** La sua card, sul suo ramo, dichiara `read_ref` `3611b1b4`, e il
vecchio header del suo Markdown portava `Governing Commit: 3611b1b4`. Ha riportato il commit che
le era stato ordinato di leggere. ChatGPT ha corretto le card alle `00:30` del 19; il suo packet
è delle `16:13` del 18 — **otto ore prima**. È la seconda vittima misurata dello stesso
`read_ref` stantio, dopo la mia `UJ-RUN-001`.

Ho tenuto `AC-05` a `FAIL` lo stesso: il validatore esce 1, e *"basterebbe un campo"* è la
dimensione della correzione, non lo stato dell'artefatto. È lo stesso metro con cui ho tenuto il
**mio** `AC-05` a non soddisfatto per cinque giri.

### Il finding migliore: `F-102`, il campo che contraddice il record che lo contiene

`verified_at_utc` vale `2026-08-18T13:35:00Z` su **19 record su 19**, identico al secondo. Era
già il mio `F-002` del giro precedente. La forma nuova, che lo rende indiscutibile: **sullo
stesso record**, il campo `freshness` dice il contrario.

| Gruppo | `freshness` | `verified_at_utc` |
|---|---|---|
| 8 Google | *"Official documentation checked on 2026-08-18"* | guadagnato |
| **11 non-Google** | *"**not independently reverified** in this correction"* | **presente lo stesso** |

Undici record dichiarano una data di verifica che il campo accanto nega. La correzione è
`null` su quegli undici: rende il registro **più onesto senza togliere copertura**.

### `F-104` — il registro non contiene le superfici su cui il programma gira

Zero occorrenze di `Claude Code`, `Agent SDK`, `code.claude.com` in entrambi gli artefatti.
Anthropic ha quattro capability — Web UI, Messages API, Projects, MCP — e **nessuna è la
superficie su cui questo programma si esegue**. Il registro cataloga ciò che i provider
vendono, non ciò che il programma usa. E `UJ-CLD-001` — mio, già consegnato — contiene il
`VERIFIED_FACT` sull'Agent SDK citato alla fonte: **c'è da importarlo, non da ricercarlo**.

### ERRORI COMMESSI IN QUESTA PARTE

| # | Errore | Come si è manifestato | Correzione | Lezione |
|---|---|---|---|---|
| E35 | **Ho affermato la portata di una correzione altrui senza verificarla sul percorso in questione.** Avevo scritto in §9 che il problema *"gli artefatti vivono sul ramo dell'owner"* era risolto da `sha256AtRef` di ChatGPT | la config B del mio esperimento ha continuato a dare *"artifact ref is missing"*, contraddicendo quello che avevo appena scritto | letto il codice: `sha256AtRef` è usato **solo** ai pin delle card (riga 89); gli artefatti di un `ReviewResult` passano da `verifyReviewedArtifact`, che fa `readFileSync` **dall'albero di lavoro** | **una correzione chiude il percorso che tocca, non la classe che descrive.** Avevo verificato quel fix su `UJ-RUN-001` — dove riguarda le card — e ne ho esteso la portata a un percorso diverso senza rileggerlo. È la trappola 30 col segno opposto: là non accreditare un fix senza ricalcolare, qui non accreditarlo **oltre** ciò che copre |
| E36 | **Ho verificato i dati su `origin/main` e ho eseguito il gate dal mio albero stantio.** Avevo appena letto che card e `BACKLOG` concordano su 5 criteri — vero su `origin/main` — e ho concluso che restava **un solo** blocco | il validatore ne ha dati **otto**, fra cui `unknown criterion AC-03/AC-04/AC-05` | isolato a tre configurazioni: **8 → 4 → 1**. Il mio ramo portava ancora il `BACKLOG` a due criteri. Mergiato `origin/main` **dopo** aver verificato che non tocca nessuno dei miei 15 artefatti (intersezione vuota), riverificato dopo: 15/15 hash invariati | **è la trappola 17 in forma nuova, e più insidiosa: ref giusto per i DATI, ref sbagliato per il GATE.** Non basta leggere il file corretto — va eseguito lo strumento corretto. Un gate che gira su regole superate produce errori inventati con la stessa autorità di quelli veri. Contromisura: prima di credere all'output di un validatore, confrontare l'hash del file di regole che sta usando con quello di `origin/main` |

Nessuno dei due è arrivato a un documento consegnato: entrambi fermati perché **l'output
contraddiceva ciò che avevo appena scritto**. È la stessa euristica delle trappole 15 e 24 —
l'incoerenza fra output e verdetto è il segnale, non il codice di uscita.

### Perché la mia review non è importabile, misurato invece che asserito

| Config | Setup | Errori |
|---|---|---:|
| A | mio worktree, `BACKLOG` stantio, artefatti assenti | **8** |
| B | worktree pulito su `origin/main`, artefatti assenti | **4** |
| C | `origin/main` + i tre artefatti di Gemini, cioè dopo il merge | **1** |

L'unico irriducibile: *"may only be imported for a task currently in REVIEW; UJ-CAP-001 is
READY"*. **Il packet di Gemini propone `READY → REVIEW` e nulla, nel repository, applica una
transizione proposta.** Terza conferma della causa 3 del mio addendum di sessione 5, ora su due
task insieme — il suo e il mio, entrambi `READY` con un packet valido che propone `REVIEW`.

**Quindi il blocco sulla mia review non è più un difetto della consegna di Gemini.** Sull'asse
del ledger lei ha fatto tutto ciò che le compete.

### Integrazione fatta, non solo annotata

Mergiato `origin/main` nel ramo di consegna. Conflitto su `gpt.md` e `taskgpt.md`, **entrambi di
ChatGPT**: due voci di log diverse, nessuna delle due superset dell'altra. **Tenute entrambe** in
ordine cronologico, come per `README.md` in sessione 3 — `COUNCIL_IMPORT_AND_MERGE.md` vieta di
risolvere per media silenziosa. Verificato in **entrambe le direzioni** che non si sia persa una
riga: 0 righe del mio ramo assenti dal risultato, 0 righe di `origin/main` assenti.

Dopo il merge: typecheck 0, build 0, **140/140 test**, i due validatori di ChatGPT exit 0, il mio
packet `UJ-RUN-001` **PASS con 15/15 hash a `b2b32733`**.

### La correzione che vale più del verdetto: il validatore ora dice la CAUSA

`AC-05` di Gemini è fallito per un campo, e il mio validatore le avrebbe detto soltanto
*"does not exist at 3611b1b4"*. Quel messaggio manda l'autore a guardare **l'artefatto**,
mentre il difetto è nel **commit**. È la stessa cosa che è successa a me su `UJ-RUN-001`:
due delle quattro IA hanno sbattuto sullo stesso muro, e il muro non spiegava sé stesso.

Esteso `scripts/validate-response-packet.mjs` — script mio, scritto in sessione 4 — con due
diagnosi. Dal checkout di Gemini adesso stampa:

```
- diagnosis: all 2 unresolved artifact(s) exist at HEAD but not at 3611b1b400cf: the source
  commit predates the artifacts it cites. ... Do not copy it from your delegation card's
  read_ref — the card pins what you must READ, not the commit you are DELIVERING.
```

**La seconda diagnosi è nata da un mio test mal costruito**, ed è la più utile delle due.
Avevo scritto un caso avversariale per esercitare il ramo *"commit stantio"* puntando a un
commit vecchio ma **raggiungibile**: a quel commit i 15 artefatti **esistono tutti**, quindi
niente era irrisolto e il ramo che volevo provare non è mai stato eseguito. Il test non ha
dato un risultato falso — ha scoperto un caso **scoperto**, e peggiore: un commit stantio che
*risolve* tutto produce 8 `hash mismatch` e si legge come *"otto file manomessi"*.

**È letteralmente quello che è successo tre giorni fa** con il repin di ChatGPT: sedici hash
che non corrispondevano a nulla, e mi è costato provare sei convenzioni di hashing per
escludere una spiegazione innocente. Ora il validatore lo dice da solo:

```
- diagnosis: all 8 declared hash(es) match the bytes at HEAD, so the artifacts are not
  tampered with — source_commit_sha d8a3fffe80d5 is simply not the commit these hashes were
  computed from. Repoint it before touching any artifact.
```

**Controllo negativo, che è la parte che rende la diagnosi sicura:** con un hash **davvero**
falsificato e il commit corretto, la diagnosi **non scatta** — resta il solo `hash mismatch`.
Una diagnosi che scusasse una manomissione vera sarebbe peggio di nessuna diagnosi. Provato:

| Caso | Esito |
|---|---|
| packet di Gemini, dal suo checkout | 2 errori + **la diagnosi giusta** |
| packet di Gemini, dal mio albero | 2 errori + diagnosi di raggiungibilità |
| commit stantio che risolve tutto | 8 mismatch + **"non sono manomessi"** |
| **hash falsificato, commit giusto** | 1 mismatch, **nessuna diagnosi** |
| commit inesistente come oggetto | **"non è un oggetto in questo repository"** |
| il mio packet valido | **PASS**, nessuna diagnosi |

| # | Errore | Correzione |
|---|---|---|
| E37 | **Caso avversariale che non esercita il ramo che credevo.** Volevo provare *"commit stantio"* e ho scelto un commit dove gli artefatti esistono ancora: la diagnosi non è scattata e per un attimo l'ho letta come un difetto del codice nuovo | è la trappola 12 dal lato di chi scrive il test, terza occorrenza in questo programma. **Prima di concludere che un check non funziona, verifica di aver eseguito il ramo che volevi.** In questo caso il test mal costruito è stato utile — ha scoperto un caso scoperto — ma è stata fortuna, non metodo |

### Rilievo minore per ChatGPT, non un finding

Il suo log su `gpt.md` dice che il pin è ora `d48e1e85`. Le card e la mission consegnate su
`main` dichiarano invece `25b1b7d5`. **Il valore consegnato è il migliore dei due** — contiene le
card *ed* è raggiungibile da `main` — quindi non c'è niente da correggere negli artefatti: è la
riga di log a descrivere uno stato intermedio poi superato.



## Sessione 6, settima parte — `S-17` quarta verifica: la terza porta si è aperta, e la mia sonda mentiva

Coda dei doveri da reviewer vuota (`git fetch` di tutti i ref: nessuno ha revisionato un mio
task), portafoglio di produzione esaurito. Ho scelto il lavoro con più valore rimasto nel mio
perimetro: **riverificare `S-17`/`S-19` su `main`**, perché è l'unico meccanismo del programma
che può generare un addebito a Christian, ed è il mio finding.

### Il risultato

**Quarta verifica consecutiva, entrambi ancora aperti su `origin/main` @ `27b7673`.** Default
`MODEL_PROVIDER="openai"` in tre punti, `_call_openai` presente, `UJ_ALLOW_PAID_API` assente,
e in `embed()` il guard di budget ancora dentro `except Exception: pass`.

**E la terza porta prevista in §13 si è aperta:** `core/memory.py` chiama `cloud_bridge.embed`
dietro `UJ_EMBEDDING=1`. Misurato su un worktree a `origin/main`, con `openai` e `requests`
sostituiti da stub che registrano e sollevano — nessuna chiamata reale:

| Porta | default | solo il flag | + `MODEL_PROVIDER=local` |
|---|---|---|---|
| `UJ_PLANNER_LLM=1` | nessuna | **A PAGAMENTO ×3** | loopback ×3 |
| `UJ_WRITER_LLM=1` | nessuna | **A PAGAMENTO ×3** | loopback ×3 |
| `UJ_EMBEDDING=1` | nessuna | **A PAGAMENTO ×1** | loopback ×1 |

**L'asimmetria è ora 1 contro 3**: una impostazione corretta chiude tutte e tre le porte perché
condividono il ponte; tre impostazioni diverse possono aprirne una ciascuna. È l'argomento più
forte finora per correggere **il ponte** invece dei gate — i gate sono tre e cresceranno, il
ponte è uno, e la correzione già scritta lo **rimuove** invece di gatearlo.

### Ho verificato l'esposizione invece di presumerla, e mi ha smentito due volte

- **Primo sospetto sbagliato:** pensavo che l'embedding fosse una porta *senza* opt-in, cioè
  peggiore delle altre due. Falso: `core/memory.py:115` richiede `UJ_EMBEDDING=1`. Grok ha
  applicato la lezione al percorso nuovo, e va scritto.
- **Secondo:** ho tracciato i chiamanti dal `bin/uj` in giù. Writer e planner sono **cablati**
  (`natural_tasks` → `nt_runner`); l'embedding è **latente**, `recall_semantic_embedded` non ha
  chiamanti fuori dal proprio test. Va corretta **adesso proprio perché non è cablata** —
  stessa logica di `S-16`, dove correggere lo schema prima del cablaggio costa una frazione.

### ERRORE — la prima tabella diceva che `S-17` è CHIUSO, ed era falsa

| # | Errore | Come si è manifestato | Correzione | Lezione |
|---|---|---|---|---|
| E38 | **Sonda nuova con due difetti che si sommavano in un falso negativo su un finding CRITICO.** (a) importava dal **worktree corrente** dichiarando nell'intestazione di misurare `origin/main` — e il worktree corrente è il mio ramo, che porta già il fix STRICT_ZERO; (b) **`env=` non veniva passato a `subprocess.run`**: lo scenario era costruito riga per riga e mai applicato, quindi tutte e **dodici** le celle misuravano la stessa identica configurazione | prima tabella: `nessuna chiamata` in tutte e dodici le celle, cioè *"S-17 è chiuso su main"*. Poi, dopo la prima correzione, ancora incoerente: `MODEL_PROVIDER=local` risultava a pagamento | (a) worktree materializzato sul ref, perché il percorso attraversa **cinque** moduli e non basta un `git show`; (b) `env=e, cwd=REPO` | **le mie sonde precedenti materializzavano i ref con `git show` proprio per questo, e scrivendone una nuova ho dimenticato la ragione.** Una lezione registrata nel documento non è registrata nel codice: la contromisura vera è stata metterla **nel commento della sonda**, dove la rileggerà chi la modifica. E il segnale che ha salvato è sempre lo stesso — il risultato contraddiceva ciò che sapevo |

**Contromisura messa nel codice, non solo qui.** Se una chiamata solleva **prima** di
raggiungere il ponte — firma sbagliata, dipendenza assente — la cella ora stampa
`NON MISURATO (<errore>)` invece di `nessuna chiamata`. È l'estensione di `E22`: zero tentativi
per un guasto a monte si legge come sicurezza. Senza quella guardia il bug (b) sarebbe stato
invisibile: il writer falliva con `TypeError` sulla firma e la cella diceva "nessuna chiamata".

### File

`docs/threat-models/MAIN_IMPLEMENTATION_SECURITY_REVIEW.md` §19 ·
`docs/threat-models/GROK_FIX_LIST.md` → `FIX-13` ·
`docs/threat-models/probes/S-17-three-doors-probe.py` (nuova, riproducibile dalla root,
rimuove il proprio worktree).

**Nessuna riga di codice di Grok modificata.** Nessuna chiamata di rete reale, in nessuna
variante. `S-17` e `S-19` restano di Grok da correggere e di Christian da decidere.



## Sessione 6, ottava parte — stato consolidato dei 20 findings, e tre falsi positivi miei

`MAIN_IMPLEMENTATION_SECURITY_REVIEW.md` è cresciuto per accumulo in quattro sessioni: venti
findings chiusi a ref diversi in momenti diversi, e **nessuno — me compreso — aveva una vista
di cosa fosse aperto adesso**. L'ho costruita rieseguendo contro `origin/main` @ `27b7673`.

### Il risultato: 12 chiusi, 1 superato, 1 parziale, 6 aperti

Aperti: `S-06` (che è una decisione di policy, non un difetto), `S-07`, `S-16`, `S-17`, `S-18`,
`S-19`, `S-20`. Parziale: `S-02` — il gate c'è, tetto ed evento no.

**E due findings che la mia stessa documentazione dava per non chiusi lo sono:**

- **`S-03`**: lo davo parziale perché `SAFE_MODE` era una globale di modulo riscrivibile. Non
  conta più: `send()` chiama `_safe_mode()` **live a ogni invocazione**, quindi
  `email.SAFE_MODE = False` non funziona. La globale sopravvive come binding legacy inutilizzato.
- **`S-15`**: lo davo aperto perché `run_gates(use_real=False)` *"stampa che i gate sono
  passati"*. Adesso ritorna `ok: None`, stampa `STUB (not executed)` e porta un commento che
  dice al chiamante di non trattarlo come successo.

Lasciarli segnati aperti avrebbe **sovrastimato di un terzo** la superficie aperta e fatto
lavorare Grok su cose già fatte. Ho messo una tabella di stato in cima a `GROK_FIX_LIST.md`,
perché è il documento che lui apre per primo.

### La parte che conta: la mia sonda ha sbagliato tre volte, sempre nella direzione peggiore

Ho scritto uno script che riverifica i venti findings contro un worktree al ref. Ha dato tre
verdetti falsi, tutti *aperto* dove è *chiuso*:

| Finding | Perché l'euristica ha sbagliato |
|---|---|
| `S-11` | cercavo `allowed_kwargs`/`_filter`; `FIX-4` lo implementa come `PRIVILEGED_KWARGS & set(kwargs)` |
| `S-14` | il pattern pescava `assert "ok" in result.lower()` in `nt_runner.py:206`, che è una stringa di **template** — codice generato, non un verdetto di gate |
| `S-03` | vedevo `SAFE_MODE =` a livello di modulo e non che `send()` non lo usa |

**Un audit statico di findings di sicurezza sbaglia con la stessa sicurezza con cui azzecca.**
È letteralmente la forma che questi findings denunciano: un controllo che sembra un controllo.
Se avessi pubblicato la prima tabella avrei accusato Grok di tre regressioni inesistenti, dopo
avergli chiesto per sessioni di non fidarsi dei nomi.

**La regola, e l'ho messa NELLO script e non solo qui:** lo script produce **candidati**, non
verdetti. Ogni riga marcata aperta o parziale è stata riletta nel codice prima di finire nel
documento. Le due euristiche sbagliate sono corrette con il motivo scritto accanto.

### File

`MAIN_IMPLEMENTATION_SECURITY_REVIEW.md` §20 · `GROK_FIX_LIST.md` (tabella di stato in cima) ·
`docs/threat-models/probes/findings-status-audit.py` (nuovo, con l'avvertenza in testa).



## Sessione 6, nona parte — perché sei miei task non hanno una card: il meccanismo è cablato a quattro

Sei dei miei otto task sono consegnati e non hanno una delegation card. `card_id` è obbligatorio
nel `ResponsePacket`, quindi **55 unità di lavoro consegnato non sono rappresentabili**. In
sessione 4 avevo concluso: *"servono sette card da ChatGPT, il collo di bottiglia è quello e non
è mio"*. Invece di ripetere la richiesta una terza volta ho fatto la cosa più utile: **preparare
io le card come proposte già conformi**, così che a lui restasse solo verificarle.

### La diagnosi di sessione 4 era incompleta, e la correggo

Ho generato sei card derivandole **meccanicamente** dal `BACKLOG.json` — criteri copiati alla
lettera perché un assert di ChatGPT impone che coincidano, pin ricalcolati al `read_ref` della
mission (4 su 4) — e le ho sottoposte al suo validatore in un worktree.

**Primo esito: un falso PASS, riconosciuto dal conteggio e non dall'exit code.**

```
Council packet validation: PASS
- delegation_card_count=4
```

Dieci file nella directory, quattro controllati. Il validatore **non scandisce la directory**:
legge una lista **cablata** alle righe 34-37. Le mie sei non erano state guardate affatto.

Cablandole nella lista e nella mission, il gate ha finalmente risposto, e le cause di rifiuto
sono **quattro, strutturali, nessuna aggirabile scrivendo meglio la card**:

| # | Vincolo | Dove |
|---:|---|---|
| 1 | `task_snapshot.status` è un `const: "READY"`; `status` esclude `BLOCKED` dall'enum | schema della card |
| 2 | `reviewer` deve stare in `{CHATGPT, CLAUDE, GEMINI, GROK, CHRISTIAN}` | stesso schema |
| 3 | **`expectedTargets` è una Map cablata di quattro coppie task→AI** | `validate-council-packets.mjs:443-447` |
| 4 | *"Mission assigned tasks must be exactly the first four specialist tasks"* | stesso file, riga 471 |

### Il numero che chiude la questione

Ricalcolato dal `BACKLOG.json`, non stimato:

| Filtro | Task |
|---|---:|
| totale | **43** |
| con reviewer accettato dallo schema | **29** — 14 esclusi: 9 con `"Core task owner named on DelegationCard"`, 5 con `"Christian"` |
| in stato `READY` | **6** |
| ammessi da `expectedTargets` | **4** |
| card esistenti | **4** |

**Il meccanismo ha già emesso una card per ogni task che può averne una. Non è in ritardo: è al
suo tetto.** I due che sarebbero pronti e restano fuori sono `UJ-SEC-001` (13, GROK) e
`UJ-CLD-001` (8, GEMINI), entrambi miei, entrambi `READY`.

### Il secondo deadlock del programma, e si chiude su sé stesso

Gli altri quattro miei sono `BLOCKED`, e un task `BLOCKED` non può ricevere una card:

```
BLOCKED -> niente card -> niente packet -> mai REVIEW -> nessun ReviewResult importabile
        -> nessuna accettazione della dipendenza -> il task resta BLOCKED
```

Dipendenze verificate: `UJ-MCP-001`→`UJ-SEC-001`, `UJ-SKL-001`→`UJ-SEC-001`,
`UJ-RCV-001`→`UJ-RUN-001`, `UJ-REV-001`→`UJ-INT-001`. Stessa forma del primo deadlock
(l'import path): ogni anello è ragionevole da solo, insieme non lasciano un ingresso.

### Ho corretto la mia stessa richiesta invece di lasciarla in giro

`CLAUDE-TO-CHATGPT-CARDS-REQUEST-20260818.md` chiede sette card. **Quattro sono impossibili e
una ha un reviewer fuori enum.** Eseguirla alla lettera avrebbe fatto perdere a ChatGPT un giro
contro il suo stesso gate — esattamente il costo che quel documento voleva evitare. L'ho marcata
`SUPERATO` in testa, con il motivo, e l'ho sostituita con due proposte reali.

**E non è un difetto di condotta di ChatGPT.** L'insieme dei quattro è coerente con una mission
che si chiama *"first four specialist tasks"*: era un innesco deliberato. Il difetto è che
l'innesco **non ha una via d'uscita** — nessuno script estende l'insieme.

### File

`docs/program/reviews/UJ-REV-001-ADDENDUM-CARD-ISSUANCE-CEILING.md` (nuovo, 9 sezioni) ·
`prompts/handoffs/CLAUDE-PROPOSED-CARDS-20260819.md` (due card pronte, round-trip verificato) ·
`CLAUDE-TO-CHATGPT-CARDS-REQUEST-20260818.md` marcato superato.

**Raccomandazione che vale più delle due card:** sostituire l'insieme cablato con la regola
*«ogni task `READY` con owner e reviewer validi può avere una card»*. Così il tetto sparisce
invece di spostarsi da quattro a sei.



## Sessione 6, decima parte — `UJ-SEC-001` è ora revisionabile, ed è la chiave di volta

Chiuso il lavoro sulle card, ho cercato la cosa con più leva rimasta. È `UJ-SEC-001`: `READY`,
**nessuna dipendenza, nessun blocker**, reviewer GROK, e `UJ-MCP-001` (8) più `UJ-SKL-001` (13)
sono `BLOCKED` proprio su di lui. Accettarlo sblocca **21 unità già consegnate** oltre alle sue
13. Ed è uno dei tre task dell'innesco `B′`.

**Il difetto era che nessuno poteva revisionarlo.** I sei artefatti sono su `main` da giorni —
1.709 righe — e **non è mai esistito un pacchetto di consegna**: nessuna evidenza per criterio,
nessun elenco di hash, nessun documento che dica al reviewer cosa guardare e contro cosa.
`UJ-RUN-001` ci ha messo cinque giri ad avere quel materiale; qui la ricetta era nota.

### Che cosa ho consegnato

`docs/program/packets/UJ-SEC-001-AC-EVIDENCE.md` e
`prompts/handoffs/CLAUDE-SEC-001-DELIVERY-20260819.md`. Hash calcolati a `origin/main`, cioè
**dal punto di vista di chi legge** e non dal mio albero — trappola 29 applicata in positivo.

Numeri, tutti ricalcolati e con il comando che li riproduce **eseguito**, non solo scritto:

| Misura | Valore |
|---|---|
| minacce con `S/P/R`, Vettore, Impatto, Controlli, Residuo, Owner | **19/19 su tutti e sei i campi** |
| distribuzione severità | 6 `CRITICA` · 8 `ALTA` · 5 `MEDIA` |
| regole di override: documento / codice / test | **10 / 10 / 10** |
| suite approval policy | **28 pass, 0 fail** |
| difese §17 | **9 progettate · 3 parziali · 3 assenti** |
| critica: lacune / articoli / proposte | **3 / 12 / 12** |

### Due correzioni a dati miei, trovate rimisurando

- **Le difese di §17 sono 9/3/3, non 8/3/4** come dice `CLAUDE.md` sessione 2. Prevale la
  misura, ed è scritta nell'evidenza perché nessuno ricopi la cifra vecchia.
- **Quarto falso positivo di un mio grep in una giornata.** Contando le minacce con la riga di
  severità ottenevo **1 su 19**, e per un momento ho creduto che il mio stesso threat model
  fosse quasi vuoto. Causa: `TH-01` usa l'etichetta estesa
  `**Severità / Probabilità / Rilevabilità**`, le altre 18 l'abbreviazione `**S/P/R**`. Tutte e
  19 la portano. **Ho messo l'avvertenza nel blocco per Grok**, perché è esattamente il controllo
  che rifarà lui.

### Che cosa NON ho fatto, e perché non è una dimenticanza

**Nessun `ResponsePacket`.** `card_id` è obbligatorio e `UJ-SEC-001` non ha una card — è il
tetto documentato nella nona parte. Inventare un `card_id` sarebbe una dichiarazione falsa in un
documento il cui unico scopo è essere verificabile (`F-003`). **Ma questo non impedisce la
review**: il packet muove il ledger, il materiale per giudicare è consegnato. Se ChatGPT emette
la card, il packet si genera dagli stessi byte in pochi minuti.

**`AC-02` l'ho dichiarato non soddisfacibile da me** — nomina l'atto del reviewer, non una
proprietà dell'artefatto — invece di lasciarlo sembrare una mia omissione.

### La sezione che ho scritto contro me stesso

§5 dell'evidenza e §7 della consegna. I test citati nel threat model sono **pendenti, non
eseguiti**: i 28 verdi coprono la approval policy, non le 19 minacce, e chi leggesse "28 test"
come copertura del threat model leggerebbe male. `TH-10` resta parzialmente aperta. `OV-7`
impone un rollback plan che nessuno verifica. E ho chiesto esplicitamente a Grok di **non**
assegnarmi peso senza aver eseguito i comandi: un `PASS` basato sulla lettura sarebbe `TH-10`
applicata alla review del documento che descrive `TH-10`.



## Sessione 6, undicesima parte — `UJ-CLD-001` consegnato con le fonti riaperte oggi

Stesso schema di `UJ-SEC-001`: l'altro mio task `READY` senza blocker, 8 punti, reviewer GEMINI.
Artefatti su `main` da giorni (507 righe), nessun pacchetto di consegna.

### Non mi sono limitato a impacchettare: ho riaperto le fonti

La §6 del mio stesso artefatto dice che *"le fonti si spostano in tempo reale"* — 3 URL ufficiali
instabili su 20 in 24 ore. L'artefatto è datato **2026-08-17** e oggi è il **19**. Consegnare un
`VERIFIED_FACT` di due giorni fa su un bersaglio che si muove, chiedendo a qualcuno di
accettarlo, sarebbe stato il difetto che contesto agli altri.

**Riaperte entrambe le citazioni decisive. Due su due confermate verbatim:**

- Agent SDK, `code.claude.com/docs/en/agent-sdk/overview`: la frase su *"third party developers
  … including agents built on the Claude Agent SDK. Use the API key authentication methods"* è
  **identica** parola per parola;
- termini consumer, `anthropic.com/legal/consumer-terms`: il divieto di accesso *"through
  automated or non-human means"* è confermato, **più un dato che non avevo registrato**: la data
  di efficacia, **October 8, 2025**. Rende la citazione databile e non solo verificabile.

### Tre elementi comparsi alla fonte dopo la consegna, tutti a favore della conclusione

1. **`Managed Agents`** è ora elencato come prodotto ospitato separato con API REST — una
   **quinta superficie**, anch'essa a chiave API. **Lacuna che dichiaro io**: la mia matrice ne
   copre quattro. Non l'ho aggiunta perché modificherebbe un artefatto in attesa di review; è
   registrata come lavoro residuo, non nascosta.
2. L'Agent SDK è governato dai **Commercial Terms of Service**, *"including when you use it to
   power products … available to your own customers"*: conferma per via contrattuale ciò che
   `CAP-CLD-002` conclude per via tecnica.
3. **Linee guida di branding**: *"Claude Code"* e *"Claude Code Agent"* non sono nomi permessi
   per un prodotto di terzi. Se ultraJARVIS diventasse un prodotto, non potrebbe chiamarsi così.

### Che cosa ho scritto contro il mio stesso lavoro

§4 dell'evidenza: la quinta superficie mancante; **18 URL su 20 non riverificate oggi**;
`CAP-CLD-001` non verificato eseguendo un test di quota — perché raggiungere il limite propone
di abilitare crediti API, ed è l'unico modo in cui questo programma può generare un addebito;
`QuotaCounter.source` resta `OBSERVED_THRESHOLD`, che è una conferma di progetto e non una
misura.

E §5 dice al reviewer **cosa attaccare**: non i conteggi, ma la conclusione che per Claude
`HUMAN_BRIDGE` è la modalità **definitiva** e non un ripiego. Se Gemini trova un percorso
automatico a costo zero che non ho considerato, quella conclusione cade e con essa cambia il
piano dell'intero programma.

### File

`docs/program/packets/UJ-CLD-001-AC-EVIDENCE.md`. Ogni comando di riproduzione **eseguito**:
4 capability record, 10 domande, 10 `VERIFIED_FACT`, 2 `UNKNOWN`, 20 URL nel manifest.



## Sessione 6, dodicesima parte — gli ultimi tre pacchetti, e un difetto mio trovato facendoli

Completato il lavoro: `UJ-MCP-001`, `UJ-RCV-001` e `UJ-SKL-001` hanno ora l'evidenza per
criterio. **Tutti e otto i miei task hanno un pacchetto di consegna**, dove ieri ne aveva uno.

I tre sono `BLOCKED` — `MCP` e `SKL` su `UJ-SEC-001`, `RCV` su `UJ-RUN-001` — quindi non possono
avere una card né un packet. **Ma il blocco è sul ledger, non sull'artefatto**: quando la
dipendenza si accetta, il reviewer parte da materiale pronto invece che da zero. Un giro
risparmiato per ciascuno.

### Il difetto trovato riverificando il mio stesso lavoro

```
regole ADM-* nel documento : 18
regole ADM-* nel codice    : 18
regole ADM-* nei test      : 17
```

**`ADM-11` — versione e hash pinnati — è implementata e non ha un test.** Implementata a
`tool-manifest.ts:277-279`, mai esercitata. Nessuno me l'ha segnalata: l'ho trovata contando.

Il sospetto immediato era peggiore e **era sbagliato**: la tabella di `TOOL_PLANE.md` marca
`ADM-11` con *"sì"*, ma quella colonna si chiama **`Blocca?`** e significa *«blocca
l'ammissione»*, non *«è testata»*. Il documento non sopravvaluta la copertura. Controllato prima
di scriverlo.

### Perché non l'ho chiuso, ed è una decisione di sequenza

Il file da toccare è `tests/contracts/tool-admission.test.mjs`, che **non** è fra i 15 artefatti
hashati di `UJ-RUN-001`. Ma il totale della suite passerebbe da **140 a 141**, e `140` compare
**9 volte nell'handoff e 5 nel blueprint** — entrambi congelati, hashati e **in review presso
Gemini**. Aggiungere un test renderebbe false 14 affermazioni in due artefatti in revisione e
costringerebbe a un settimo giro di consegna.

**Si chiude dopo la review di `UJ-RUN-001`.** Registrato nell'evidenza di `UJ-MCP-001` §4.1
perché non si perda, non perché sia accettabile.

### Che cosa ho scritto contro il mio lavoro nei tre documenti

- **`UJ-RCV-001`**: il runbook di disaster recovery **non è mai stato eseguito** — nessuno ha
  spento un runtime a metà e l'ha riportato su, perché il runtime non esiste. E `R-SEC-03` è
  aperto e riguarda proprio questo task: `rollbackPlan` è obbligatorio e nessuno verifica che il
  piano funzioni.
- **`UJ-SKL-001`**: `TH-SF-06` — il sandbox prova il comportamento solo in condizioni di
  sandbox, e **nessun sandbox migliore lo risolve**. `TH-SF-03` — la pipeline verifica *come* è
  fatto il codice, non *perché* esiste: con un intent non fidato produce una skill pulita,
  firmata e sbagliata, con tutti i gate verdi. La difesa **non è implementata**.
- **`UJ-MCP-001`**: `TH-10` resta parzialmente aperta (copro l'attestazione, non il resoconto) e
  `R-MCP-01` non è chiuso — un server MCP remoto gira a casa loro.

### Verifica

13 hash citati, **13 corretti**. Ogni comando scritto nei documenti **eseguito**: 18/18/17
`ADM-*`, 10 `TH-SF-*`, 14 stadi, 3 classi di contatore, 30 · 9 · 37 test verdi.



## Sessione 6, tredicesima parte — ho scritto un numero falso e l'ho corretto entro l'ora

Chiudendo i tre pacchetti della dodicesima parte ho scritto, in un **messaggio di commit** e in
`TASKCLAUDE.md` §70, che *«tutti e otto i miei task hanno un pacchetto di consegna»*.

**Era falso. Erano sei.** `UJ-REV-001` e `UJ-REV-002` non ne avevano nessuno.

L'ho scoperto perché ho deciso di **verificare la mia stessa affermazione subito dopo averla
scritta**, invece di passare oltre. È la trappola 24 — *rimisura ogni cifra nel punto in cui la
scrivi* — commessa mentre passavo la giornata a correggerla agli altri: a Gemini per un campo
costante, a ChatGPT per sedici hash, a me stesso per quattro grep sbagliati.

**Non c'è niente di speciale nell'averla trovata**: il costo di scriverla era già pagato, era
già in un commit pubblicato. La differenza fra questo caso e un errore consegnato è di minuti,
non di metodo.

### Correzione applicata

- Scritto `docs/program/packets/UJ-REV-001-AC-EVIDENCE.md`: adesso sono **sette su otto**.
- `UJ-REV-002` **non può avere un pacchetto**: non ha artefatti. Ed è la seconda correzione —
  la mia memoria lo dava `BLOCKED`, ed è **`DEFERRED` a M10**. Diverso: non aspetta una
  dipendenza che può arrivare domani, è programmato per dopo. Non è un impedimento da rimuovere.
- Corretta la frase in `TASKCLAUDE.md` **con la nota dell'errore accanto**, non in silenzio.

### E una misura che rafforza la raccomandazione su `UJ-SEC-001`

Attraversando il grafo delle dipendenze per capire `UJ-REV-002`, ho ricavato la chiusura di
`UJ-SEC-001`:

```
UJ-SEC-001 (READY, 13, CLAUDE)
  ├─ UJ-SKL-001 (BLOCKED, 13, CLAUDE)
  │    ├─ UJ-INT-007 (DEFERRED, 13, CHATGPT) ─ UJ-REV-002 (DEFERRED, 8, CLAUDE)
  │    └─ UJ-INJ-001 (DEFERRED, 13, GROK)
  └─ UJ-MCP-001 (BLOCKED, 8, CLAUDE)
```

**Cinque task a valle per 55 unità, su tre portafogli diversi.** Ma attenzione al numero giusto:
**accettarlo sblocca subito 21 unità** (`SKL` 13 + `MCP` 8); le altre 34 sono `DEFERRED` a M10 e
non dipendono solo da lui. Avevo appena sbagliato un conteggio, quindi qui scrivo la cifra
precisa e non quella d'effetto.



## Sessione 6, quattordicesima parte — il percorso critico, e la seconda raccomandazione mia che si rivela sbagliata

Esaurito il lavoro di consegna, la cosa più utile non era produrre altro: era capire **in che
ordine** il programma deve muoversi. Il vincolo vero non è la capacità delle IA — è **quanti
inoltri manuali Christian può fare**, perché ogni giro passa da un copia-incolla.

### Lo stato, ricalcolato

**43 task, 340 unità, 26 accettate — il 7,6%.** E tutte e 26 sono task meta di ChatGPT:
`UJ-META-001` (21/21) e `UJ-META-002` (5/8, il peso parziale che il gate del programma non sa
produrre). **Zero unità di lavoro specialistico accettate, da nessuno dei quattro.**

Correzione: il peso totale è **340**, non **311** come dice la mia memoria di sessione 1. La
baseline è cresciuta di 29 unità e non me n'ero accorto.

### La correzione che conta, ed è la seconda in due ore

Stamattina ho scritto a Grok, in `TASKCLAUDE.md` §68, che revisionare `UJ-SEC-001` era *"la cosa
con più leva che puoi fare oggi"*. Misurato attraversando il grafo:

| Task | Reviewer | Sblocca |
|---|---|---:|
| `UJ-CAP-001` | **CLAUDE** | **55** |
| `UJ-RUN-001` | GEMINI | 34 |
| `UJ-GGL-001` | GROK | 29 |
| `UJ-RED-001` | CHATGPT | 29 |
| `UJ-INT-001` | GROK | 23 |
| **`UJ-SEC-001`** | GROK | **21 — l'ULTIMO dei sei** |

**Era falso.** Resta vero, ed è un'altra affermazione, che `UJ-SEC-001` è la chiave di volta
**del mio portafoglio**. Ho corretto §68 sul posto, con la nota accanto invece che in silenzio, e
ho indicato a Grok che fra le sue tre review `UJ-GGL-001` rende di più.

**Due affermazioni mie smentite dai fatti nella stessa sessione** — prima «tutti e otto i
pacchetti», ora «la cosa con più leva». Entrambe trovate da me, entrambe già pubblicate quando le
ho trovate. Il difetto comune non è il calcolo: è che **una frase d'effetto esce prima della
misura che la sostiene**. La contromisura non è scrivere meno: è misurare *prima* di
qualificare, non dopo.

### La metrica che ho aggiunto perché il numero grezzo inganna

`UJ-CAP-001` sblocca di più (55) ma oggi è `FAIL` nella mia review: servono due giri. La metrica
utile è **leva per giro**, e lì vince `UJ-RUN-001` con 34 in un solo giro.

E la raccomandazione operativa che ne esce è distribuita, non sequenziale: **i primi tre atti
usano tre reviewer diversi** (`RUN-001`→Gemini, `RED-001`→ChatGPT, `SEC-001`→Grok) e valgono
**84 unità con tre inoltri**.

### Il caveat che ho messo in grassetto e non in nota

**Nulla applica una transizione proposta.** Anche con tutte e sei le review consegnate domani,
il contatore resterebbe 26 su 340. Quindi l'ordine corretto è **l'anello mancante prima delle
review** — altrimenti si producono sei verdetti che nessun contatore registra. Le review restano
utili lo stesso, perché il giudizio esiste anche se il ledger non lo vede, e l'ho scritto invece
di usare il blocco come scusa per non consegnare.

### File

`docs/program/CRITICAL_PATH_20260819.md` — 7 sezioni, comando di riproduzione dentro ed
**eseguito**, e §7 dichiara i limiti del metodo: tratta ogni review come un giro, il che
favorisce i task grandi.



## Sessione 6, quindicesima parte — il prompt di avvio era scaduto nei punti che contano

`AVVIO_NUOVA_SESSIONE.md` è il file che Christian incolla per aprire una sessione nuova: è il
**primo** documento che una sessione legge. Dopo quattordici parti di lavoro l'ho riletto, ed era
falso in tre punti portanti:

| Diceva | È vero che |
|---|---|
| *"serve da ChatGPT: **sette** delegation card"* | ne sono emettibili **due**; le altre sono impossibili per schema |
| *"`UJ-RUN-001` **resta `BLOCKED`**… correggere il `read_ref` è l'unica cosa che manca"* | è **`REVIEW`** da stamattina, con sei clausole verificate e una PR aperta |
| *"correzioni per Grok: `FIX-1..FIX-11`"* | ne restano **quattro**, e due sono lo stesso ponte |

Più un rimando a un documento che **ho marcato superato io stesso** poche ore prima
(`CLAUDE-TO-CHATGPT-CARDS-REQUEST-20260818.md`): il prompt di avvio invitava a inoltrarlo.

**È `E16` per la terza volta**, e stavolta l'ho cercata invece di inciamparci: la ricetta scaduta
nel documento più letto. Le prime due volte è stata la ricetta dei test, e mi è costata una
sessione a inseguire una regressione inesistente.

### Che cosa ho riscritto

Sostituito il *"delta di sessione 5"* con quello di sessione 6, aggiunto il percorso critico con
la tabella di quanto sblocca ciascun task, aggiornato lo stato di sicurezza (12 chiusi, 6
aperti, la terza porta), e messo l'avvertenza di **non inoltrare** la richiesta superata.

E ci ho messo dentro anche la correzione contro me stesso: che avevo indicato `UJ-SEC-001` come
la cosa con più leva e non lo è. Se resta solo in `CLAUDE.md`, la sessione che legge il prompt
di avvio non la vede.

### La lezione, che è di manutenzione e non di tecnica

**Un'informazione duplicata in due punti diverge sempre, e diverge nel punto che nessuno
rilegge.** La contromisura che applico da adesso: quando chiudo un blocco di lavoro,
`AVVIO_NUOVA_SESSIONE.md` va riletto **cercando le affermazioni al presente**, non scorrendolo.
Sono quelle che scadono.



## Sessione 6, sedicesima parte — audit di copertura dei miei stessi contratti: un buco su 41

Avevo trovato `ADM-11` contando **una** famiglia di regole mentre preparavo il pacchetto di
`UJ-MCP-001`. La domanda ovvia era: **ce ne sono altri?** L'ho verificato su tutte.

### Risultato: 41 regole su 4 famiglie, **un solo buco**

| Famiglia | Documento | Codice | Test | Scoperte |
|---|---:|---:|---:|---|
| `OV-*` — override della approval policy | 10 | 10 | 10 | nessuna |
| `ADM-*` — ammissione dei tool | 18 | 18 | **17** | **`ADM-11`** |
| `SF-*` — le dieci proibizioni della forge | 10 | 10 | 10 | nessuna |
| `SF-PIPE-*` — invarianti della pipeline | 3 | 3 | 3 | nessuna |

`ADM-11` resta l'unico, e resta **deliberatamente non chiuso**: la suite passerebbe da 140 a 141
e `140` compare 14 volte in due artefatti congelati e in review presso Gemini.

### Il quinto falso positivo della giornata, e stavolta della mia stessa sonda

La prima esecuzione dava **`TH-SF-*` a 0 test su 10** — cioè *"dieci minacce della Skill Forge
senza copertura"*. Falso. `TH-SF-*` e `TH-*` sono **modelli di minaccia**, non insiemi di regole:
le loro mitigazioni hanno ID propri e la tracciabilità vive nella **colonna `Controlli`** di una
tabella. Il mio grep cercava sezioni `#### TH-SF-`; sono **righe di tabella**, e ne ha trovate
zero.

Misurato correttamente: 10 righe su 10 hanno la colonna `Controlli`, 2 citano un ID verificabile,
e **4 dichiarano un residuo esplicitamente aperto** — che è il pregio, non il difetto:
`TH-SF-03` e `TH-SF-06` dicono di **non essere chiudibili** dai controlli esistenti.

**Cinque falsi positivi in una giornata, tutti nella stessa direzione** — «manca» dove non manca —
su `S-11`, `S-14`, `S-03`, il conteggio della severità nel threat model, e ora `TH-SF-*`. Tutti
fermati dallo stesso riflesso, e nessuno dal metodo. L'avvertenza è **nel codice della sonda**,
accanto alla mappa delle famiglie, non solo nel documento.

### File

`docs/program/reviews/CLAUDE-CONTRACTS-RULE-COVERAGE-20260819.md` ·
`docs/threat-models/probes/contracts-rule-coverage.py`

§5 dichiara cosa l'audit **non** copre: gli invarianti del runtime non hanno ID e la sonda non
può dire quale manchi — ma quel file è fra i 15 hashati e in review, quindi il naming non l'ho
cambiato. E copertura non è correttezza: conto la tracciabilità, non la qualità dell'asserzione.



## Sessione 6, diciassettesima parte — controllo incrociato di tutto ciò che ho scritto oggi

Con il portafoglio esaurito, la cosa più utile non era produrre altro: era **verificare che i
35 documenti toccati oggi non si contraddicessero**. È la classe di difetto che è costata
**sei giri** su `UJ-RUN-001` — lo stesso fatto scritto in più posti e aggiornato in uno solo.

### Esito: sette fatti controllati, **uno solo davvero scaduto**

| Fatto | Valori trovati | Verdetto |
|---|---|---|
| conteggio della suite | `138` e `140` | **legittimo**: i `138` sono tutti dentro voci di Session Log delle sessioni 2-4, cioè storia |
| peso accettato mio | `0/76` ovunque | coerente in 10 documenti |
| totale di programma | `311` e `340` | **legittimo**: `311` compare solo come *"baseline §38"*, la cifra fissa del piano canonico, non come totale corrente |
| card esistenti | `4` | coerente |
| `UJ-SEC-001` sblocca | `21` | coerente |

**L'unico scaduto**: la §3 del mandato di Technical Lead diceva *"Misura al 2026-08-19: 185
unità su 311, accettate 0"* — al **presente**, con la baseline vecchia. Ricalcolato:
**17 task in M0+M1, 177 unità, 26 accettate.** E le 26 sono entrambe di governance
(`UJ-META-001` 21/21 e `UJ-META-002` 5/8): **di lavoro specialistico, in M0+M1, è accettato
zero.**

Conta perché è la sezione che una sessione futura legge per decidere **se il mandato è
scattato**. Con la cifra vecchia avrebbe misurato contro un denominatore che non esiste più.

### Due falsi positivi del controllo, entrambi miei

- `0 / 76` contro `0/76` — **spaziatura**, non divergenza. Corretto normalizzando gli spazi nella
  sonda: *un controllo che grida al lupo per la formattazione viene ignorato, e allora tanto vale
  non averlo.*
- `#### TH-SF-` a zero occorrenze perché le minacce stanno in **righe di tabella** — già
  registrato nella sedicesima parte.

### La sonda resta, con l'avvertenza dentro

`docs/threat-models/probes/cross-document-consistency.py`. In testa c'è scritto perché esiste —
i sei giri di `UJ-RUN-001` — e soprattutto **che produce candidati e non verdetti**, con i due
casi concreti in cui una divergenza è legittima: le voci di Session Log e la baseline §38.

Senza quell'avvertenza, la prossima sessione «correggerebbe» la storia per farla tornare, che è
esattamente il danno opposto.



## Sessione 6, diciottesima parte — `ADM-11` chiusa senza far diventare falso niente

Avevo rinviato la correzione di `ADM-11` con una motivazione precisa: un test **nuovo** avrebbe
portato la suite da **140 a 141**, e `140` compare 9 volte nell'handoff e 5 nel blueprint di
`UJ-RUN-001` — congelati, hashati e in review presso Gemini. Sarebbero diventate false 14
affermazioni in due artefatti in revisione.

**Il vincolo era giusto. La conclusione era pigra.** Rileggendolo mi sono accorto che il vincolo
non era *"non toccare il file"* ma *"non cambiare il conteggio"* — e quelle sono due cose
diverse.

### La soluzione, che è il posto naturale e non un espediente

Esiste già un test che si chiama *"a hopeless tool reports every failure, not just the first"*:
costruisce il manifest più indifendibile possibile e verifica che l'admission riporti **tutte**
le violazioni. Gli ho tolto `version` e `manifestHash` e ho aggiunto `ADM-11` all'insieme atteso.

Non è una scorciatoia: **quel test esiste proprio per dire «queste sono tutte le regole che un
manifest indifendibile viola»**, e finché `ADM-11` mancava dall'elenco, l'insieme non era
completo. Il difetto era anche lì, non solo nella copertura.

### Verificato in tre direzioni

| Controllo | Esito |
|---|---|
| conteggio del file / della suite | **30 / 140**, invariati |
| i 15 hash di `UJ-RUN-001` | **15 su 15** intatti |
| copertura delle regole | **41 su 41, zero scoperte** (era 40/41) |
| il test fallisce senza la regola? | `ADM-11` rimossa dal `dist/` → `29 pass, 1 fail`, *"expected ADM-11 to be reported"*; ripristinata → `30 pass, 0 fail` |

L'ultimo è la trappola 21 applicata: **un test che passa anche senza la correzione non prova
niente**, e l'unico modo di saperlo è rimettere il difetto e guardare.

### La lezione, che è di lettura e non di codice

Avevo scritto tre volte, in tre documenti, che `ADM-11` andava chiusa *"dopo la review di
`UJ-RUN-001`"*. Era la conclusione sbagliata da un vincolo giusto, ripetuta finché non l'ho
riletta. **Un rinvio motivato bene si trasforma facilmente in un rinvio non riesaminato**: la
motivazione resta vera e smette di essere pertinente, e nessuno se ne accorge perché la
motivazione regge ancora.



## Sessione 6, diciannovesima parte — il RESUME_POINT era diventato un muro di mille righe

Il RESUME_POINT esiste per una cosa sola: **essere letto a freddo da una sessione che non
ricorda niente.** L'ho misurato: **1000 righe, 37 punti in ordine non cronologico**
(`AT AS AR … AA P Q R T S Z Y X W V U A B E D C F`), e **sei di quei punti sono superati da
punti successivi**, incluso uno il cui titolo è letteralmente falso (`AP`: *"tutti e otto i
task hanno un pacchetto"*, corretto in `AQ`).

Una sessione nuova che lo legge dall'alto incontra prima le contraddizioni, poi le correzioni.

### Che cosa ho fatto, e che cosa NON ho fatto

**Non ho cancellato nulla.** La Regola 1 vale: la storia degli errori è la parte più utile del
file, e un punto superato spiega **come** ci siamo arrivati.

Ho aggiunto due cose:

1. **Un riquadro di stato in testa, ~30 righe**, con i fatti misurati adesso — branch, hash del
   piano, suite 140, copertura 41/41, `0/76` mio, `26/340` di programma, lo stato reale degli
   otto task, le due cose che bloccano tutti, e l'ordine raccomandato. Con la regola di
   precedenza scritta esplicitamente: **se un punto più in basso contraddice il riquadro, vince
   il riquadro.**
2. **Sei marcatori `>>> SUPERATO DAL PUNTO <X>`**, uno per ciascun punto scaduto, con il motivo
   in una riga. Servono a chi arriva a metà file senza aver letto l'intestazione — cioè al caso
   normale, non a quello ideale.

### Perché conta più di quanto sembri

È lo stesso difetto che ha prodotto `E16` tre volte: **l'informazione giusta esiste, ma è nel
punto sbagliato del documento più letto.** In sessione 4 la ricetta dei test corretta era in
`PARTE 2` e quella rotta nel RESUME_POINT, e la sessione ha seguito quella rotta.

Qui il rischio era lo stesso in forma più grande: la verità di oggi è distribuita su venti punti,
e la falsità di ieri sta in cima perché i punti sono in ordine inverso.

### E il marcatore che mi ha fatto notare una cosa

Applicando i marcatori ho dovuto rileggere `AP` e `AQ` di fila. **`AP` dice una cosa falsa e
`AQ` la corregge, ma sono a 40 righe di distanza e in ordine inverso** — chi legge dall'alto
trova prima la correzione e poi l'errore, e può concludere che sia la correzione a essere
vecchia. I marcatori risolvono questo, ma la causa vera è che **il RESUME_POINT è cresciuto per
prepend**: ogni sessione aggiunge in cima, e l'ordine di lettura è l'inverso dell'ordine di
verità.

Non l'ho riorganizzato — sarebbe stato un intervento grosso su un file che altre sessioni
useranno stanotte. È registrato come lavoro da fare quando il RESUME_POINT arriverà a rendere
inutile l'intestazione.



## Sessione 6, ventesima parte — che cosa significano davvero le «22 prove non implementate»

Le 22 prove dichiarate non implementate sono il difetto più grande della mia consegna, e lo
scrivo in ogni pacchetto. Stasera ho verificato **che cosa coprono**, e la risposta è più
precisa di quanto avessi mai scritto.

### Stanno tutte fuori da ciò che la card chiede

La card elenca: AgentManifest, TeamSpec, Supervisor, DepthGuard, RunLedger, checkpoint /
resume / cancel / retry / idempotency, ereditarietà dell'allowlist, comunicazione tipizzata,
scenari di guasto e loop, threat notes, checklist di integrazione.

**Le 22 prove sono tutte nelle §16-21** — decomposizione, selezione, routing, conflitti,
fallback, demo — che sono **parte II del blueprint**, consegnata **oltre** la card.

E il dato più netto: **quei cinque sottosistemi non hanno alcun contratto.**

```
grep -rl 'DEC-\|SEL-\|RTE-\|CNF-\|FBK-' packages/contracts/src/    → nessun file
```

Quindi le 22 prove sono specificate contro contratti **che non esistono**. È coerente —
scriverli è M2/M3 — ma **«cinque sottosistemi specificati e non contrattualizzati» è più preciso
di «22 prove mancanti»**, e dice al reviewer una cosa diversa.

### E il pattern mi ha ingannato una sesta volta

Mappando i requisiti della card sui test, il mio controllo dava **sei scoperti su tredici**.
Rileggendo i nomi dei 36 test:

- **quattro erano coperti con vocabolario diverso** — `AgentManifest` sta nei test sul narrowing,
  `RunLedger` nei tre sulla catena di hash, `cancel` nel kill switch, `failure containment` nella
  politica di retry;
- **due non hanno test perché non hanno codice**: `team-spec.ts` ed `envelopes.ts` esportano
  **zero funzioni** e 11 e 12 tipi. La loro verifica è `tsc --noEmit` con **12 flag attivi**, non
  un unit test.

**Sesto falso positivo della giornata**, e stavolta sul mio stesso lavoro nella direzione
peggiore: mi avrebbe fatto dichiarare a Gemini due buchi inesistenti nella consegna che sto
chiedendo di accettare.

### Dove l'ho scritto, e perché lì

Nella **§0-quinquies di `UJ-RUN-001-AC-EVIDENCE.md`**, che **non è fra i 15 artefatti hashati** —
quindi non muove un hash e non riapre la consegna. È l'unico posto dove potevo aggiungerlo senza
un settimo giro.

E ho chiuso la sezione senza addolcire: **la demo §21 non gira**, le 22 prove restano non
implementate, le 11 `PENDING` pure — **33 in totale**. Il fatto che stiano fuori dalla card
**non le rende meno mancanti: le colloca.**



## Sessione 6, ventunesima parte — ho implementato una delle 22 prove, e collega due scoperte

Avendo appena stabilito che le §16-21 specificano cinque sottosistemi senza contratto, ho
guardato **quali** delle 22 prove valga la pena implementare adesso. Una spicca: `T-DEC-4`,
cioè `DEC-E04` — *«un criterio la cui verità dipende solo dal verdetto del reviewer non è
falsificabile e va rifiutato»*.

**È la difesa meccanica contro il difetto che oggi blocca il programma**, e il blueprint la
specifica citando l'osservazione: *"41 criteri su 43 task hanno la forma «`<REVIEWER>` issues an
evidence-backed PASS or PASS_WITH_ACTIONS review»"*.

### Implementata come script, non come test, e il motivo è la suite congelata

`scripts/check-acceptance-criteria.mjs`. La regola appartiene ai contratti di decomposizione, che
non esistono; e aggiungere test porterebbe la suite oltre **140**, dichiarato in due artefatti
congelati e in review. Uno script fa lo stesso lavoro senza toccare niente, e resta usabile da
ChatGPT per verificare una correzione senza contarla a mano.

### Misurato su `origin/main`

```
task 43 · criteri 101 · violazioni 36 (35,6%)
   27x  <REVIEWER> issues an evidence-backed PASS or PASS_WITH_ACTIONS review.
    9x  Core task owner named on DelegationCard issues an evidence-backed ...
```

**Il blueprint diceva 41, oggi sono 36.** Non è un errore del blueprint: il difetto **sta
calando** mentre ChatGPT allinea i criteri alle card.

### La correlazione, che è il risultato vero

| Gruppo | Task | Criteri tautologici |
|---|---:|---|
| i **quattro** con delegation card | 4 | **0 su 5 ciascuno** |
| gli altri task specialistici | 32 | almeno uno ciascuno |
| task di governance di ChatGPT | 3 | 0 |

**Fra i task specialistici la correlazione è esatta.** Hanno criteri falsificabili esattamente i
quattro che hanno ricevuto una card, perché il processo che emette la card è lo stesso che
riscrive i criteri.

**Quindi il tetto delle card è anche il tetto sulla qualità dei criteri.** Non sono due difetti
che ho trovato separatamente oggi: è **uno solo, osservato da due lati**. E rafforza la
raccomandazione: sostituire l'insieme cablato con una regola non allarga solo l'emissione,
allarga la falsificabilità.

### Il controllo discrimina, e l'ho provato prima di crederci

Un controllo che segnalasse ogni criterio contenente *review* sarebbe rumore, e un gate ignorato
non è un gate. Il `--self-test` verifica **8 casi**, 4 da rifiutare e 4 da ammettere:

```
RIFIUTO   "GROK issues an evidence-backed PASS or PASS_WITH_ACTIONS review."
ammesso   "GROK issues a review confirming `…/THREAT_MODEL.md` covers 19 threats."
ammesso   "The reviewer approves after `npx tsc --noEmit` returns exit code 0."
```

**8 su 8.** Un criterio che nomina il verdetto **e** un artefatto resta falsificabile.



## Sessione 6, ventiduesima parte — la mia ipotesi era sbagliata, e cercandola ho trovato di meglio

Alla fine del blocco precedente avevo scritto: *«mi fa sospettare che anche il blocco del
contatore e il tetto delle schede abbiano una radice comune — entrambi vivono in liste cablate
nel validatore»*. **L'ho verificata invece di lasciarla come impressione, ed è falsa.**

### La correzione

**Nulla scrive `BACKLOG.json`.** Cercato in tutto il repository: l'unica `writeFileSync` in
`scripts/` sta in `test-review-result-intake.mjs` e scrive un file di review in una directory
temporanea. Quattro script **leggono** il backlog, **zero** lo scrivono.

Quindi il blocco del contatore **non è una lista cablata: è un'assenza.** Non condivide radice
con il tetto delle card. **Sono due correzioni, non una**, e avevo appena scritto il contrario.

Resta vera una cosa più debole e non banale: entrambi hanno la stessa **forma** — un meccanismo
che fa la cosa giusta per i casi che conosce e **non ha modo di imparare un caso nuovo**. Ma la
forma condivisa non è una radice condivisa, e confonderle avrebbe mandato ChatGPT a cercare una
correzione sola dove ne servono due.

### Che cosa ho trovato cercando

**Lo stesso fatto — «quali quattro task il Council serve» — è scritto in cinque posti:**

| # | Dove |
|---:|---|
| 1 | `validate-council-packets.mjs` righe 33-38, `cardPaths` |
| 2 | `validate-council-packets.mjs` righe 443-447, `expectedTargets` |
| 3 | mission, campo `assigned_task_ids` |
| 4 | mission, campo `delegation_card_ids` |
| 5 | il file di ciascuna card |

Più l'assert di riga 471 che impone *"exactly the first four specialist tasks"*.

**Oggi i quattro insiemi coincidono** — verificato, ed è merito della disciplina di ChatGPT. Ma
cinque copie di un fatto sono la struttura che produce divergenza, ed è esattamente il difetto
che questo programma continua a pagare.

**E spiega la frizione:** aggiungere una sola card significa modificare cinque posti e rilassare
un assert. Non è che il meccanismo sia rimasto a quattro per dimenticanza — **costa sei
modifiche coordinate per arrivare a cinque.**

### Il controllo, aggiunto dove serve

Non ho scritto una sonda nuova: l'ho aggiunto a `cross-document-consistency.py`, che è già la
sonda dei «fatti scritti in più posti». Ora stampa:

```
ok          insieme task del Council: 4 task, coerente in 4 sedi
```

e se un giorno una modifica parziale li disallinea, stampa quale sede diverge. Serve **a
ChatGPT**, non a me: quando estenderà l'insieme, il modo più probabile di sbagliare è modificarne
quattro su cinque, e gli errori che ne escono sembrano difetti della card e non della sincronia.
Ci sono passato io stamattina provando ad aggiungerne sei.



## Sessione 6, ventitreesima parte — `S-21`: la prima caccia vera dopo sessione 4, e trova un difetto latente

L'audit di stamattina ha **ricontrollato i findings noti**, non ne ha cercati di nuovi. Ma da
sessione 4 su `main` sono arrivate **2.171 righe** che non ho mai revisionato: `multi_file.py`,
`nt_runner.py`, `uj_cli.py`, `monetization.py`, più modifiche a `os_control`, `automation`,
`websearch`, `email`. Ho guardato lì.

### Il difetto

`core/registry.py:183` — `PRIVILEGED_KWARGS = {"force", "root"}` — è una **denylist**: nomina i
due kwarg a cui si è pensato, e inoltra tutti gli altri per default.

E ne esiste un terzo. **Cinque funzioni prendono `real=`**, che scavalca i gate d'ambiente
`UJ_OS_REAL` / `UJ_AUTO_REAL`: `os.open_app` (lancia un processo, e `terminal` è nell'allowlist),
`os.set_volume`, `automation.type_text` (battiture via `xdotool`), `automation.paste_text`,
`browser.open_url`.

### Oggi NON è sfruttabile, e ho verificato eseguendo

Tutte e cinque sono `safe=False`, e `FIX-7` rifiuta **prima** che il kwarg arrivi:

```
registry.call("os.open_app", "terminal", real=True)   -> PermissionError: not marked safe
```

Enumerati i **135 tool registrati**: nessun `safe=True` accetta un kwarg privilegiato non
filtrato. I due che prendono `root` (`files.safe_read`, `files.safe_list`) sono coperti dalla
denylist.

### Perché resta un finding, e non è pedanteria

**Il contenimento è il flag `safe`, non il filtro dei kwarg**, e sono due decisioni indipendenti.
`FIX-4` è stato scritto **per** fermare i kwarg privilegiati; su questi cinque non è lui a
fermarli. Basta marcare `safe=True` **una sola** delle cinque — `os.set_volume` sembra innocuo —
e il bypass diventa vivo **senza nessun'altra modifica**.

È la **quinta** volta in questo programma che il contenimento reale è diverso dal controllo che
sembra fornirlo. Due delle prime quattro hanno già smesso di proteggere.

### Il settimo falso negativo della giornata, e stavolta l'ho preso dal formato

La prima esecuzione della sonda ha stampato l'intestazione della tabella e **zero righe**, poi
`tool safe=True con kwarg privilegiato: NESSUNO`. Sembrava una risposta. Non lo era: la mia
introspezione cercava `r.names()` o `reg.TOOLS`, che non esistono — il registry espone
`_tools`. **La sonda non aveva enumerato niente**, e «nessun tool a rischio» su zero tool
esaminati è vuoto, non rassicurante.

Contromisura applicata: la sonda ora **stampa quanti tool ha enumerato** (`135`) prima di
qualunque conclusione. Se quel numero è zero, il verdetto non vale.

### Correzione proposta: invertire la polarità

Una denylist nomina i kwarg a cui si è pensato. Serve una **allowlist per tool**: passa solo ciò
che la `ToolSpec` dichiara inoltrabile. Stopgap in una riga: aggiungere `"real"` alla denylist.

**E ho verificato che il comando di rilevamento funzioni in entrambe le direzioni**: silenzioso
oggi, e marcando `safe=True` una delle cinque stampa `VIVO: os.set_volume ['real']`. Un
controllo che non scatta mai non è un controllo.

### File

`MAIN_IMPLEMENTATION_SECURITY_REVIEW.md` §21 · `GROK_FIX_LIST.md` → `FIX-14`.

**Nessuna azione reale eseguita**: nessun processo lanciato, nessuna battitura, nessun browser
aperto. Le tre prove terminano tutte con un rifiuto.



## Sessione 6, ventiquattresima parte — `S-22` e `S-23`: la stessa parola, due contratti opposti

Proseguendo la caccia della parte precedente sulle 2.171 righe nuove, ho tracciato
`core/multi_file.py` — che prende `write_fn` come callable iniettato — fino ai suoi chiamanti.
Ne sono usciti due difetti distinti.

### `S-22` — due funzioni si chiamano `safe_write`, e quella sul percorso di build non contiene nulla

```
core/reliability.py:46   safe_write   -> nessuna root, nessun PROTECTED
tools/files.py:88        safe_write   -> root + PROTECTED, indurita da FIX-3/FIX-4
core/nt_runner.py:13     from core.reliability import safe_write as guarded_write
```

**`guarded_write` è l'unica parola in tutta la catena che afferma una guardia, ed è un alias
scelto al punto di import.** Il nome del modulo — *reliability* — dice invece esattamente ciò
che la funzione fa: scrittura atomica, con backup e file temporaneo. È affidabilità, non
contenimento, e non c'è niente di sbagliato nella funzione: è sbagliato **dove viene usata**.

Dodici punti di scrittura, 11 in `nt_runner.py` e 1 in `nt_helpers.py`, fra cui `tool.py` — il
file che `promote_job_to_tools` copia poi in `tools/`.

**L'asimmetria sta dentro un solo file.** `core/nt_runner.py` importa la funzione senza
contenimento alla riga 13 e quella con contenimento alla riga 242, dentro la promozione. La
promozione è protetta; la costruzione, che genera il contenuto che la promozione copia, no.

### Ho scritto per primo che cosa NON è rotto

`slugify` **è sicuro**: `re.sub(r"[^a-z0-9]+", "_", text)` distrugge `/`, `\`, `.` e `..`, quindi
un titolo ostile non produce mai un path. È la difesa che regge, e attribuirle un difetto che
non ha manderebbe Grok a correggere la cosa sbagliata. Il ramo aperto è l'altro:
`if output_dir: job_dir = Path(output_dir)`, grezzo.

### La catena, che è il contenuto vero del finding

`bin/uj` non espone `output_dir` — nove sottocomandi, enumerati, non ricordati — e nemmeno
`uj_cli.py`. Ma `job_worker.enqueue` lo accetta, lo scrive in `workspace/queue.jsonl`, e la
riga 61 lo inoltra così com'è. **`workspace/queue.jsonl` non è in `PROTECTED` e sta dentro la
root:** una scrittura che il gate indurito **approva** deposita un `output_dir` che il percorso
di build usa **senza gate**.

Non serve bucare `FIX-3`. Basta usarlo per il suo scopo su un file che nessuno considera
sensibile. **Una scrittura contenuta si trasforma in una non contenuta attraversando una coda.**

### `S-23` — `PROTECTED` nomina il posto in cui il codice stava

`core/natural_tasks.py` è protetto ed è oggi un **guscio di re-export di 26 righe**. La logica
sta in `nt_pipeline.py` (27), `nt_runner.py` (311), `nt_helpers.py` (133): **nessuno dei tre è
protetto**, e `nt_runner.py` contiene `promote_job_to_tools`, cioè il gate di `FIX-1`.

Misurato per esecuzione, in una root finta: `core/registry.py` **rifiutato**,
`core/nt_runner.py` **accettato e riscritto**. Copertura: 23 moduli in `core/`, 2483 righe;
protetti 4, 418 righe.

**Il codice di `FIX-1` e `FIX-4` è intatto: è invecchiato l'insieme su cui operano.** Uno
spezzettamento di modulo del tutto ordinario ha spostato il gate fuori dalla lista, senza
toccare nessuna delle due correzioni e senza che nulla lo segnalasse. È la decima occorrenza in
questo programma di un controllo che continua a sembrare un controllo — e la prima in cui a
invecchiare non è il controllo ma il suo **insieme di applicazione**.

### L'ordine di correzione, detto invece che lasciato intuire

**`FIX-15` prima di `FIX-16`.** `PROTECTED` è controllata solo dalla `safe_write` di
`tools/files.py`: finché il build usa l'altra, allungare la lista non cambia niente su quel
percorso e lascia l'impressione che il buco sia chiuso. È la terza volta che questo programma
produce una coppia in cui la correzione più facile, applicata per prima, nasconde l'altra
(`S-12` prima di `S-13`, `FIX-10` prima del writer adapter, ora questa).

### Un errore mio, corretto prima del commit

Nella prima stesura di `FIX-15a` avevo scritto la correzione chiamando una funzione
`_resolve_within_root` **che non esiste**. L'avevo dedotta dal comportamento invece di aprire
il file. I nomi veri sono `_resolve` (riga 36) e `_is_protected` (riga 46). Corretto, e
verificato anche che `tools/files.py` non importi nulla da `core/`, quindi l'import suggerito
non crea un ciclo — perché suggerire una correzione che non compila costa a Grok un giro
esattamente come un finding sbagliato.

È la trappola 14 applicata a me stesso: **si cita solo ciò che si è aperto**, e vale anche per
una funzione di cui si sta proponendo l'uso.

### File

`MAIN_IMPLEMENTATION_SECURITY_REVIEW.md` §22 e §23 · `GROK_FIX_LIST.md` → `FIX-15`, `FIX-16`
(più la tabella di stato in cima, che era ferma a tredici correzioni e ora ne elenca sedici) ·
`docs/threat-models/probes/S-22-uncontained-write-probe.py` ·
`docs/threat-models/probes/S-23-protected-staleness-probe.py`.

**Nessuna riga di codice di Grok modificata. Nessuna scrittura fuori dalle directory
temporanee: entrambe le sonde lavorano in una root finta e rimuovono worktree e temp con
`atexit`.**


## Sessione 6, venticinquesima parte — quattro review consegnate, e tre sono bloccate dalla stessa riga

Trappola 11 dopo il push, undicesima volta che paga: **cinque rami nuovi datati 19 agosto**, e
dentro c'era la cosa più importante successa oggi nel programma. **Grok e ChatGPT hanno
consegnato tre `ReviewResult`**, e con la mia di `UJ-CAP-001` fanno **quattro review
indipendenti** — una per ciascuna IA, per la prima volta.

Nessuna ha mosso il ledger. Nessuno aveva misurato **perché**, review per review.

### Il risultato, in una tabella

| Review | Reviewer | Owner | Stato del task | Errori residui |
|---|---|---|---|---:|
| `UJ-GGL-001` | GROK | GEMINI | `READY` | **1** — solo il deadlock |
| `UJ-RED-001` | **CHATGPT** | GROK | `READY` | **1** — solo il deadlock |
| `UJ-CAP-001` | CLAUDE | GEMINI | `READY` | **1** — solo il deadlock |
| `UJ-INT-001` | GROK | CHATGPT | **`REVIEW`** | 5, tutti riparabili da lui |
| `UJ-INT-006` | CLAUDE | CHATGPT | `REVIEW` | **0** — controllo positivo, `PASS` |

**Tre su quattro sono bloccate da una riga**, `validate-council-packets.mjs:370`. E il dettaglio
che rende la cosa non discutibile: **una delle tre è di ChatGPT.** Il supervisore è bloccato dal
proprio gate sulla propria review — ben formata, tre artefatti con hash corretti, respinta perché
il task che giudica è `READY`.

### Il metodo: tre configurazioni, e la contaminazione che mi sono prodotto da solo

Su `UJ-GGL-001`: config A (checkout del reviewer) → **4** errori, B (regole correnti, artefatti
assenti) → **3**, C (regole correnti, artefatti presenti) → **1**.

**La prima config C era sbagliata, e l'errore era mio.** Avevo portato dentro gli artefatti con
`git checkout <pin> -- docs/`, e `docs/` contiene `docs/program/BACKLOG.json`: il backlog è
tornato a **due** criteri e sono ricomparsi tre `unknown criterion` **che erano costruzione mia,
non difetti di Grok**. Trappola 36 in forma nuova — non un gate eseguito con regole superate, ma
un gate a cui **io** avevo appena rimesso le regole superate sotto i piedi.

Il segnale che mi ha fermato è sempre lo stesso: tre errori che il gate non aveva dato un minuto
prima, su un file che non avevo motivo di toccare. Rifatto con **solo i due path citati**: un
errore.

### E ho ripetuto la trappola 15, nella prima misurazione

La prima esecuzione stampava `exit=0` accanto a `Council packet validation: FAIL`. Non era
l'exit del validatore: era quello di `sed`, perché avevo messo `| sed 's/^/   /'` fra il comando
e `$?`. È **la trappola che ho scritto io**, dopo E13 ed E18, e l'ho commessa una terza volta —
stavolta per indentare l'output. Rifatto con redirezione su file e `$?` letto dal comando vero.
*Non esiste una pipe "solo cosmetica" a valle di un comando di cui devi leggere l'esito*, e a
quanto pare scriverlo tre volte non basta ancora.

### `UJ-INT-001` — tre modifiche, e gli artefatti NON sono manomessi

Prima di dire *"due hash sono sbagliati"* — accusa che sul repin delle card mi era costata sei
prove di convenzioni alternative — ho verificato quale convenzione li produca:

| Artefatto | dichiarato | `sha256` al pin | `git rev-parse <ref>:<path>` |
|---|---|---|---|
| 3 artefatti a 64 caratteri | 64 | **OK** (e OK anche su main) | no |
| `validate-program-os.mjs` | **40** | no | **OK** |
| `UJ-INT-001-GROK.md` | **40** | no | **OK** |

**Sono ID di blob git.** Grok ha usato `git rev-parse` per due dei cinque. La review è genuina, e
questo va detto per primo. Più `PASS_WITH_ACTIONS` usato come esito di **criterio**, dove lo
schema ammette solo `PASS`/`FAIL`/`NOT_REVIEWED` — è valido solo come `outcome`, dove lui l'ha
già usato bene.

E il suo `F-001` sui 12 hash delle card **è già chiuso, e non è colpa sua**: la review pinna
`4b63b94e`, due commit indietro, e i due mancanti sono esattamente `6ba3a2b` e `27b7673`.

### Il controllo positivo, rieseguito e non ricordato — e il falso positivo che ha trovato

`UJ-INT-006`, la mia review di sessione 5, rieseguita oggi con le regole correnti e i 18
artefatti riportati al commit che pinna: **`PASS`, exit 0**. Il macchinario funziona. Non è un
impianto rotto: è un impianto le cui precondizioni non sono quasi mai tutte vere insieme.

**Alla prima esecuzione il controllo risultava FALLITO con 5 errori.** Non lo era: su `PASS` il
validatore stampa righe informative che cominciano anch'esse con `- ` — `mode`, `schema_count`,
`council_artifact_set_sha256` — e il mio estrattore le contava come errori. È **la stessa forma
dei tre falsi positivi dell'audit di findings di stamattina**: un'euristica di parsing troppo
grossolana che riporta un guasto inesistente.

L'ha preso il controllo positivo, che è esattamente il suo mestiere. Senza, avrei pubblicato che
il macchinario è rotto — cioè il contrario del risultato che rende utile tutto il documento.
**Un controllo positivo non serve solo a rendere falsificabile la diagnosi: serve a falsificare
lo strumento con cui la stai misurando.**

### Che cosa serve, e da chi

Le tre bloccate hanno **una** causa, riverificata oggi al ref corrente e non ricopiata: in tutto
`scripts/` l'unica `writeFileSync` sta in `test-review-result-intake.mjs:105` e scrive in una
`mkdtempSync`. **Nessuno script scrive `docs/program/BACKLOG.json`.**

Raccomandato a ChatGPT: uno script che **applica** un `ResponsePacket` valido, con il passaggio
a mano dei tre task in `REVIEW` come ponte per non fermare le review di oggi. **Non l'ho fatto
io**: il backlog è suo, e muoverlo sarebbe il falso avanzamento che passo il tempo a contestare.

### File

`docs/program/reviews/CLAUDE-REVIEW-IMPORTABILITY-AUDIT-20260819.md` (7 sezioni) ·
`scripts/audit-review-importability.mjs` (additivo, **guida il validatore di ChatGPT invece di
duplicarne la logica**, con il controllo positivo come quinta voce e l'avvertenza sulla
contaminazione scritta in testa) · `TASKCLAUDE.md` §76 e §77.

**Nessuna review modificata, nemmeno la mia. Nessun file di ChatGPT o di Grok toccato. Nessun
peso proposto, nessuno stato modificato.**

### E39 — il commit ha inghiottito 34 file che non c'entravano, ed era mio

Il commit `11166bb` doveva toccare **quattro** file. Ne ha toccati **trentotto**: ha riportato
indietro `cloud_bridge.py`, `core/config.py`, quattro sorgenti dei contratti, le quattro
delegation card, `validate-council-packets.mjs`, il `BACKLOG.json` e altri, e ha aggiunto otto
file di Gemini e di Grok. **Ed è stato pushato prima che me ne accorgessi.**

**Causa, misurata:** `git --work-tree="$W" checkout <ref> -- <path>` **scrive nell'indice del
repository principale**, non solo nel worktree indicato. L'ho usato quattro volte per portare
gli artefatti dentro i worktree di misura, e ogni volta ha messo in stage la versione di un
altro ref nel repository vero. Il mio `git add` successivo non ha aggiunto nulla di sbagliato:
lo stage era **già** sporco, e `git commit` prende tutto l'indice.

**Come me ne sono accorto:** l'output di `git status --short` che avevo messo *prima* del commit
nello stesso comando. Trentotto righe dove ne aspettavo quattro. **Se non avessi stampato lo
stato, avrei pushato una regressione silenziosa sui contratti e sul validatore di ChatGPT** — e
la suite sarebbe rimasta verde, perché i file dei test erano stati riportati indietro insieme
al resto, coerenti fra loro.

**Correzione, senza riscrivere la storia:** ripristinati i 26 file modificati a `79c617d` e
rimossi gli 8 aggiunti, con verifica per esecuzione che i 26 siano **byte-identici** (0
divergenze su 26) e che gli 8 non esistano più (0 su 8). Poi typecheck, build, 140 test e i tre
validatori, di nuovo verdi, e un commit di correzione. Nessun `force-push`, nessun `reset` della
storia già pubblicata: l'errore resta visibile nel log, che è dove deve stare.

**È la seconda volta che un `commit` inghiotte roba non voluta** — la prima fu `E15`, i
`__pycache__` generati eseguendo il codice di Grok. La lezione allora era *"eseguire codice
altrui sporca l'albero"*; questa la estende: **anche misurare lo sporca, e lo sporca
nell'indice, che è il posto in cui non si guarda.**

**Seguito, poche ore dopo, e cambia la lezione.** Preparando il commit di `S-24` la guardia ha
fermato una seconda volta: **21 file in stage invece di 7**. Non l'avevo rifatto a mano — era il
mio **stesso script**, `scripts/audit-review-importability.mjs`, che dentro usa
`git --work-tree=<W> checkout` per portare gli artefatti nei worktree di misura. **Ogni sua
esecuzione reinquina l'indice.**

Quindi la contromisura scritta qui non bastava: la trappola l'avevo registrata nel documento e
lasciata **dentro il codice**. Corretto in `-C <worktree>` con il motivo nel commento, e
verificato per esperimento — hash di `git status --porcelain` prima e dopo l'esecuzione:
identico. **Una lezione registrata solo in prosa protegge solo chi la rilegge; questa girava da
sola dieci volte al giorno.** Le due guardie hanno funzionato entrambe, ed è il motivo per cui
vanno tenute tutte e due: la stampa dello stato nello stesso comando del commit, e il
`git -C` nel codice.


## Sessione 6, ventiseiesima parte — `S-24`: il rubinetto è aperto per default e il contatore è spento

Coda dei doveri da reviewer vuota (fetch di tutti i ref: nessuna consegna nuova). Ho ripreso la
caccia sul codice arrivato dopo la mia ultima passata, scegliendo per primo `core/monetization.py`
— 139 righe, mai revisionate, ed è **il componente il cui mestiere è impedire che il programma
spenda**. Dato il vincolo che Christian ha posto come non negoziabile, viene prima di tutto il
resto.

### Il risultato in una frase

**`MODEL_PROVIDER` vale `openai` se nessuno dice altro, e le quote escono subito a meno che
`UJ_ENFORCE_QUOTA` valga `1`.** Due decisioni prese in momenti diversi, ognuna difendibile da
sola, che insieme fanno un sistema che spende senza tetto quando nessuno configura niente.

Misurato: **50 chiamate contro un limite di 10 e nessuna eccezione**; con `UJ_ENFORCE_QUOTA=1`
solleva correttamente. *Il codice del controllo funziona: è il suo default a essere spento.*
Stessa cosa per il budget — `UJ_LLM_BUDGET_USD` vale `"0"`, e `ok` è
`soft_cap <= 0 or spent < soft_cap`, quindi sempre vero: **10.000 chiamate, spesa stimata 10
dollari, `assert_llm_budget()` non solleva.**

### E il contatore misura una chiamata dove il provider ne fattura tre

`ask_cloud_ai` registra il consumo una volta, poi dispaccia a `_call_openai`, che porta
`@retry(max_attempts=3)`. È `FIX-10c` visto dal lato della misura invece che da quello della
spesa: là il retry moltiplica l'addebito, qui lo rende invisibile.

### `R-RUN-01`, di nuovo, e stavolta il limite che perde è quello sui soldi

`record_llm_call` fa `summarize_usage()` — che rilegge e riparsa **tutto** il file — poi confronta,
poi appende. Fra il controllo e l'incremento non c'è niente che escluda gli altri.

Otto thread con barriera, limite 10, registro precaricato a 9, ne dovrebbe passare **uno**:
`[1, 3, 8, 6, 4]` a registro vuoto, `[4, 5, 6, 4, 5]` con 5.000 righe di riempimento,
`[8, 8, 8, 6, 8]` con 20.000.

È esattamente la forma che ho chiuso in `UJ-RCV-001` con `AtomicActiveTaskCounter` e il test
`T-DG-4b`: `leggi → fai altro → scrivi`. La regola l'avevo già scritta, e il contratto è già in
`packages/contracts/src/recovery/active-task-counter.ts` — Grok non deve riprogettarlo, deve
prenderlo.

### Due volte la misura mi ha smentito, e la prima nella direzione peggiore

**La prima sonda diceva che il contatore è corretto.** Lanciava otto **processi** separati, e
l'avvio dell'interprete — 50-100 ms l'uno — li serializzava: la finestra di gara non veniva mai
colpita e passava esattamente uno, cioè il numero **giusto per il motivo sbagliato**. È la
trappola 12 dal lato di chi scrive il test, e se mi fossi fermato lì avrei scritto a Grok che il
contatore va bene. Rifatta con thread e una `threading.Barrier`, la gara si manifesta subito.

**La seconda smentita è stata su un'ipotesi mia.** Avevo previsto che l'ampiezza della gara
crescesse con la lunghezza del registro, perché la lettura si allunga — e il primo esperimento
sembrava confermarlo. Ma variava anche il **tier**, quindi anche il limite: le prime due righe
mostravano "8 ammessi su 8" semplicemente perché erano **sotto** il limite. Non era una gara, era
spazio libero. Rifatto isolando la variabile — distanza dal limite fissa a 9 su 10, cambia solo il
riempimento — l'andamento **non** è monotono: a 5.000 righe è a volte più mite che a 0.

L'ho scritto così nel documento e nel blocco per Grok, invece di tenere la versione che
raccontava meglio. **Un andamento che i dati non mostrano è esattamente il tipo di numero per cui
ho bocciato gli altri tre.**

### Due difetti minori, e uno è di quelli che si vedono solo eseguendo

`DEFAULT_USAGE_PATH = Path("workspace/usage.jsonl")` è **relativo**: segue la directory da cui
lanci. Misurato: la stessa quota scatta da una cartella e non scatta da un'altra, perché lì il
registro è vuoto. `core/job_worker.py` usa già un path ancorato al modulo — **`monetization` è
l'unico modulo di stato che non lo fa, ed è quello che conta i soldi.**

E `spent_usd_est` è chiamate × una costante scritta a mano, non token: un campo che promette
dollari e conta invocazioni.

### File

`MAIN_IMPLEMENTATION_SECURITY_REVIEW.md` §24 · `GROK_FIX_LIST.md` → `FIX-17` (nel **primo**
gruppo, insieme a `FIX-10`: uno chiude il rubinetto, l'altro accende il contatore, e applicarne
uno solo lascia il sistema o senza tetto o senza misura) ·
`docs/threat-models/probes/S-24-quota-meter-probe.py` · `TASKCLAUDE.md` §78.

**Nessuna riga di codice di Grok modificata. Nessuna chiamata di rete, in nessuna variante.**


## Sessione 6, ventisettesima parte — `S-25`: il webhook di pagamento ispeziona la firma invece di verificarla

Finito `monetization`, l'altro modulo che tocca i soldi e che avevo segnalato in sessione 4 senza
mai revisionarlo è `core/billing.py` — skeleton Stripe, 126 righe. All'epoca avevo scritto che non
aveva chiamanti; **riverificato oggi, è ancora vero**, e resta latente. Ma il contenuto è peggiore
di quanto la nota di allora lasciasse intendere.

### Il difetto, in cinque righe

```python
secret = (os.getenv("STRIPE_WEBHOOK_SECRET") or "").strip()
if secret and sig_header:
    if "t=" not in sig_header and "v1=" not in sig_header:
        return {"ok": False, "error": "invalid signature header"}
```

Tre difetti sovrapposti: **il segreto non entra in nessun calcolo** (`hmac` compare zero volte nel
file, `secret` compare a due sole righe, 102 e 103); la condizione è `and`, quindi basta uno dei
due marcatori; e se l'header è vuoto il controllo è saltato del tutto.

### Misurato, e il risultato è netto

| Header | Esito | Tier concesso |
|---|---|---|
| *(nessuno)* | **ACCETTATO** | `team` |
| `t=1` | **ACCETTATO** | `team` |
| `t=…,v1=000…0` | **ACCETTATO** | `team` |
| `ciao` | rifiutato | — |

**L'unico caso respinto è quello malformato.** Il controllo rifiuta gli header che non
*somigliano* a una firma e accetta tutti quelli che le somigliano, qualunque sia il valore. È un
controllo di **sintassi** travestito da controllo di **autenticità**: dodicesima occorrenza della
forma in questo programma, e la prima su un percorso di pagamento.

### Che cosa otterrebbe la contraffazione, e perché lo dico al condizionale

`result["suggested_env"] = {"UJ_TIER": tier}`, e `UJ_TIER` è la variabile che
`monetization.current_tier()` legge per decidere i limiti giornalieri — `free` 10 chiamate LLM,
`team` 20.000. Un webhook falso è una **richiesta di promozione di quota**.

Ma `suggested_env` **non è consumato da nessuno**: `git grep` dà una sola occorrenza, la sua
produzione. E `handle_webhook` non ha chiamanti fuori dai propri test. **Il difetto è latente**, e
va scritto così invece di lasciarlo sembrare vivo.

### La parte che vale più del finding: la correzione ha una trappola

La correzione ovvia è calcolare l'HMAC. Ma la firma di Stripe è calcolata sui **byte grezzi del
corpo**, e `handle_webhook` riceve un dizionario **già interpretato**. Riserializzarlo non dà gli
stessi byte — cambiano spaziatura e ordine delle chiavi — quindi qualunque HMAC calcolato da lì
**non coinciderà mai**, e chi corregge concluderà che la firma è sbagliata invece che il proprio
input.

**La correzione richiede un cambio di interfaccia**, e l'ho scritto in testa a `FIX-18` invece di
lasciarlo scoprire. È la terza volta in due giorni che segnalo una coppia in cui la versione
facile applicata per prima produce qualcosa che *sembra* corretto: `S-12` prima di `S-13`,
`FIX-15` prima di `FIX-16`, e ora questa.

### Perché correggerlo adesso che è latente

Quando ci sarà un endpoint HTTP, il difetto diventa **remoto e non autenticato senza nessun'altra
modifica al file** — e la correzione costerà un cambio di interfaccia con chiamanti veri da
aggiornare. È la stessa logica di `S-16`: si corregge lo schema **prima** che il cablaggio esista,
e costa una frazione.

### File

`MAIN_IMPLEMENTATION_SECURITY_REVIEW.md` §25 · `GROK_FIX_LIST.md` → `FIX-18` ·
`docs/threat-models/probes/S-25-billing-webhook-probe.py` · `TASKCLAUDE.md` §79.

**Nessuna chiamata a Stripe, nessuna chiave impostata**: la sonda non invoca `create_customer` né
`create_checkout_session`, che sono le uniche due funzioni del file che contatterebbero la rete.


## Sessione 6, ventottesima parte — `S-26`: il gate è sulla copia, non sull'esecuzione

Ultimo modulo non revisionato del gruppo arrivato dopo la sessione 4: `core/graph_exec.py`, 84
righe. Esecuzione di un grafo di dipendenze, cioè **runtime** — il mio perimetro esatto.

### Il risultato in una frase

**`promote_job_to_tools` ha un gate e funziona; `execute_graph` non ce l'ha.** E la prima
funzione *copia* un file, la seconda lo *esegue*.

| Punto | Operazione | `scan_text`? |
|---|---|---|
| `nt_helpers.py:48-53` | genera (corpo del writer LLM, con `UJ_WRITER_LLM=1`) | **sì** |
| `nt_runner.py:250` | **copia** in `tools/` | **sì** |
| `graph_exec.py:64` | **esegue** (`spec.loader.exec_module`) | **no** |

Misurato: un modulo che contiene `eval(` e `rm -rf` — due dei pattern che il loro stesso scanner
riconosce — viene caricato ed eseguito senza che nulla lo fermi; interrogando `scan_text` sullo
stesso testo, `['rm -rf', 'eval(']`. **Il gate esiste, è solo assente dal percorso.**

E il codice a livello di modulo gira dentro `exec_module`, cioè **prima** che `run()` venga
chiamata: controllare che cosa fa `run()` non basterebbe comunque.

### Raggiungibile in due modi, e uno è automatico

`uj_cli.py:57` espone un sottocomando `graph` che prende **una directory arbitraria**; e
`nt_runner.py:61-64` chiama `execute_graph(job_dir)` a **ogni job multi-file**. Non è una
funzione di libreria dimenticata: è cablata su entrambi i lati.

### Due difetti aggiuntivi trovati sullo stesso file

**Path traversal dai nomi in `deps.json`.** Il filtro guarda solo il suffisso, quindi
`../fuori.py` passa. Misurato: un modulo **fuori dalla job dir** caricato ed eseguito. È lo stesso
schema di `S-22` — un file dati che il sistema tratta come innocuo governa un'operazione che non
lo è.

**`sys.path` e `sys.modules` restano sporchi.** La job dir va in testa a `sys.path` e nessuno la
toglie; `sys.modules[stem]` registra con il nome nudo del file, quindi un `registry.py` generato
prenderebbe il posto di quello vero per ogni `import` successivo nello stesso processo.

### Ho scritto contro la mia stessa correzione

`FIX-19a` è una riga — chiamare `scan_text` prima di `exec_module` — e chiude il caso peggiore.
Ma l'ho marcata esplicitamente **necessaria e non sufficiente**, perché `S-08` dice che lo
scanner ha evasioni note: nel mio test di sessione 3 ne passavano 2 su 4. Consegnare una
correzione senza quel limite significherebbe far credere a Grok di aver chiuso il problema.

### Perché è la correzione da fare per prima

L'ho messa in cima all'ordine di `GROK_FIX_LIST.md`, davanti anche a `FIX-10`. Motivo: è **una
riga**, chiude l'esecuzione non validata di codice generato, ed è l'unico finding di questa serie
che riguarda l'esecuzione di codice invece del costo o della scrittura di file.

### File

`MAIN_IMPLEMENTATION_SECURITY_REVIEW.md` §26 · `GROK_FIX_LIST.md` → `FIX-19` (primo dell'ordine) ·
`docs/threat-models/probes/S-26-graph-exec-probe.py` · `TASKCLAUDE.md` §80.

**Nessuna riga di codice di Grok modificata. Il carico delle prove scrive un file di testo in una
directory temporanea: nessuna rete, nessun comando di sistema, nessuna scrittura fuori dai temp.**


## Sessione 6, ventinovesima parte — ho verificato l'ordine che avevo prescritto, e due posizioni erano sbagliate

Ho consegnato a Grok **dieci** correzioni con un ordine prescritto. Un ordine è un criterio, e i
criteri di questo programma li ho passati due giorni a contestare quando erano asseriti invece che
calcolati. Il mio non l'avevo calcolato: l'avevo composto a pezzi, una coppia alla volta, mentre
scrivevo i findings.

### Correzione 1 — `FIX-11` va in **seconda** posizione, non in fondo

`FIX-11` è ciò che impedisce alla test suite di sovrascrivere `grok.md` e altri file tracciati.
Finché non è applicato, **qualunque verifica che esegua `pytest` corrompe il repository** — e fra
quelle c'è la verifica di `FIX-16`, per cui **ho proposto io stesso un test nuovo**. Avevo scritto
una correzione la cui verifica danneggia il repository, e l'avevo messa dopo la correzione che
avrebbe reso quella verifica sicura.

Riverificato al ref corrente invece di ricopiarlo: `root` nei `__kwdefaults__` di `safe_write` è
legato alla **definizione**, quindi il monkeypatch di `PROJECT_ROOT` nella fixture è un no-op.

### Correzione 2 — `FIX-17b` è condizionato alla forma di `FIX-10`

`FIX-17b` dice di spostare `record_llm_call()` dentro `_call_openai`. Ma la correzione approvata
per `S-17` **rimuove quell'adapter**:

| Ref | `_call_openai` | `record_llm_call` |
|---|---:|---:|
| `origin/main` | **2** | 4 |
| i due rami `strict-zero` | **0** | 0 |
| ramo CLAUDE | **0** | **4** |

Dopo `FIX-10` il bersaglio non esiste più. Si sposta su `_call_local` — e cambia la ragione: una
chiamata locale non costa, quindi il retry sottostima l'**uso**, non la **spesa**.

**La tabella conferma anche una cosa che avevo scritto in sessione 5 e mai rimisurata:** il ramo
CLAUDE è l'unico che ha insieme l'adapter rimosso *e* l'integrazione di budget. È quello da
portare su `main`, e adesso è un numero e non un ricordo.

### Il metodo, che è la parte riutilizzabile

Ho mappato ogni correzione al file e alla funzione che tocca, cercato i file toccati da più di una
— **tre gruppi** — e per ogni coppia chiesto: *applicando A per prima, B resta rilevabile e
necessaria?* Le due correzioni sono uscite da lì, non da una rilettura.

E ho scritto anche le coppie **indipendenti**, perché "non interagiscono" è un'informazione utile
quanto il contrario: evita di serializzare lavoro che può procedere in parallelo.

### Un controllo con esito negativo, registrato di proposito

Sospettavo che il contenuto di una skill salvata finisse nel codice generato: sarebbe stato
`TH-SF-03` del mio Skill Forge — intent non vincolato a una provenienza fidata — trovato nel
codice di un altro. **È falso.** `nt_helpers.py:62-67` chiama `_skills_hint(prompt)` e **scarta il
valore di ritorno**.

Lo registro per due ragioni. La prima è che un sospetto verificato e caduto vale quanto uno
confermato: la prossima sessione non lo rifà. La seconda è che **la chiamata mostra l'intenzione**
— qualcuno voleva usare quel valore, e nel momento in cui lo collegherà il contenuto di una skill
entrerà nel percorso del codice, dove `add_skill` non valida niente. Va vincolato prima che il
cablaggio esista, come `S-16`.

Di contorno: è anche lavoro sprecato — una scansione completa del catalogo a ogni job del ramo
euristico, il cui risultato viene buttato. E `DEFAULT_SKILLS_PATH` è la **terza** occorrenza del
path relativo dopo `monetization` e `billing`.

### File

`docs/threat-models/FIX_ORDER_ANALYSIS_20260819.md` (nuovo, 5 sezioni + appendice) ·
`GROK_FIX_LIST.md` (ordine corretto in cima, con le due motivazioni) · `TASKCLAUDE.md` §81.


## Sessione 6, trentesima parte — `S-16`: il consumatore è arrivato, e non è quello che temevo

In sessione 3 avevo scritto che il percorso *contenuto non fidato → memoria → decisione* **non
era cablato**, e che `S-16` andava corretto nello schema **prima** che lo fosse. È il genere di
affermazione che in questo programma scade in ore, quindi l'ho riverificata.

**Il consumatore esiste.** `core/planner.py:152-167` rilegge la memoria e inserisce i fatti
**verbatim** nelle milestone del piano; `core/nt_runner.py:135-138` li scrive a fine job. Il
cerchio si chiude.

### Ma non si chiude dove pensavo, e la differenza è tutta la gravità

Il messaggio che il writer LLM manda al modello è, alla lettera:

```python
user = f"Task title: {title}\nTask prompt:\n{prompt.strip()[:1500]}\n\nWrite the Python module body now."
```

**Solo `title` e `prompt`.** Zero occorrenze di `milestone` o `to_markdown` nella funzione, e il
`title` non è influenzato dalla memoria — misurato, non dedotto dall'architettura.

Quindi la catena chiusa è **memoria → `plan.md`**, cioè un documento che legge un umano. La catena
**memoria → codice generato** resta aperta. L'ho scritto così invece di lasciar intendere il
peggio, che sarebbe stato facile e sbagliato.

### Il falso negativo che mi ha regalato l'informazione migliore

La prima misura diceva che il fatto seminato **non** entrava nel piano. Non era la catena a essere
aperta: `recall_semantic(..., min_score=0.05)` e il fallback sui token del prompt **filtrano per
rilevanza**, e il mio fatto non condivideva token con il prompt. Test che non esercita il ramo —
trappola 12 dal lato di chi lo scrive, ennesima volta.

Me ne sono accorto perché il risultato contraddiceva il codice che avevo appena letto. E rifacendo
la misura con un fatto pertinente ho ottenuto sia la conferma sia una **proprietà mitigante che
non conoscevo**: un fatto non finisce in un piano qualsiasi, solo in uno il cui prompt gli
somiglia. Riduce la superficie da *"ogni piano futuro"* a *"i piani su quell'argomento"*.

### La buona notizia, e a chi va detta

**Il consumatore è arrivato prima dello scrittore non fidato.** Significa che lo schema si può
ancora correggere a costo quasi nullo — è esattamente la finestra che `S-16` diceva di non
sprecare, e in questo programma le finestre si chiudono in ore.

Va a **GEMINI**, non a Grok: lo schema della memoria è `UJ-MEM-001`, suo. Servono tre cose — un
campo di provenienza obbligatorio, una regola su chi può essere richiamato in un contesto di
decisione (oggi basta il tag `job`, e `bin/uj memory add --tag job` accetta tag arbitrari), e che
l'inserimento nel piano sia citato **come dato** invece che concatenato come testo.

`tools/websearch.py` è ancora uno **stub** e non ha nessun percorso verso `remember()`:
verificato. Finché resta così non c'è vulnerabilità attiva.

### File

`MAIN_IMPLEMENTATION_SECURITY_REVIEW.md` §27 · `TASKCLAUDE.md` §82.
**Nessuna riga di `core/memory.py` o `core/planner.py` modificata.**


## Sessione 6, trentunesima parte — `S-27`: l'iniezione nel codice generato è contenuta solo per caso

Chiudendo `S-26` mi era rimasta una domanda: `execute_graph` esegue il modulo generato, e il
modulo generato incastona il **prompt grezzo** nella sua docstring. Un prompt ostile può chiudere
la docstring e iniettare codice? L'ho misurato, perché è la differenza fra un difetto di igiene e
una RCE via prompt.

### Il risultato, onesto in entrambe le direzioni

**Tre payload costruiti, nessuno compila.** Ma — e questo è il finding — nessuno è fermato da un
controllo: sono **tre accidenti sintattici diversi**. Stringa tripla non terminata (come `S-13`);
`from __future__ import annotations` che deve stare in cima, quindi rompe qualunque codice
iniettato prima; e il `return "ok – executed for {title}"` che si spezza sull'iniezione via title.

Il più robusto, `from __future__`, **non è lì per sicurezza**: è lì per le type hint. Spostarlo in
un refactor aprirebbe il vettore, e nessuno se ne accorgerebbe perché oggi "funziona".

### Perché l'ho registrato come finding e non come "va bene così"

È la **quarta** volta che il contenimento in questo programma è un accidente di sintassi, e tre di
quei quattro hanno già smesso di proteggere almeno una volta. E si somma a `S-26`: oggi l'unica
cosa che impedisce a un prompt ostile di far eseguire codice arbitrario è che il file generato
**non compili per caso**. Le due difese vere — scansionare prima di eseguire (`FIX-19a`) e non
interpolare input grezzo — non ci sono.

### Ho scritto contro la mia stessa conclusione

La riga più importante della §28.5: *"non escludo che una quarta forma più astuta bilanci tutti
gli accidenti"*. Ho provato tre payload e sono caduti; dichiarare "è sicuro" sarebbe stato
esattamente il difetto che contesto — una conclusione più forte della misura. Il punto non è che
i miei tre attacchi falliscono, è che **la tenuta dipende da accidenti invece che da un
controllo**, e quello si vede indipendentemente da quanti attacchi provo.

### File

`MAIN_IMPLEMENTATION_SECURITY_REVIEW.md` §28 · `GROK_FIX_LIST.md` → `FIX-20` ·
`docs/threat-models/probes/S-27-template-injection-probe.py` · `TASKCLAUDE.md` §83.
**Payload benigni (scrivono un file marcatore in `/tmp`), nessuna rete, nessun comando di
sistema, nessuna riga di codice di Grok modificata.**


## Sessione 6, trentaduesima parte — uno scan di tutti i 94 tool, un risultato positivo e una mia svista

Prima di registrare l'attesa ho fatto la cosa che chiude una caccia invece di lasciarla a metà:
uno scan di costrutti pericolosi su **tutti** i moduli di `tools/` e sui quattro `core/` piccoli
mai revisionati. Serviva a rispondere a una domanda che nessuno aveva verificato: **il gate di
promozione ha mai lasciato passare qualcosa di dannoso nel catalogo?**

### Il risultato è positivo, e conta quanto un finding

**90 tool promossi su 94 non contengono un solo costrutto pericoloso** — niente `eval`, `exec`,
`subprocess`, `os.system`, `pickle`. I quattro con un hit: `automation` e `os_control` (stub di
automazione già noti, `S-06`), `validate_helpers` (un `re.compile()`, falso positivo mio), e
`websearch`. È la prova **pratica** che `FIX-1` — il gate di `S-12` — ha tenuto: non l'ho dedotto
dal fatto che il gate esiste, l'ho verificato su ciò che è finito nel catalogo. Una review che
elenca solo difetti darebbe l'impressione opposta.

### E la mia svista, che correggo dove l'ho commessa

`websearch` mi ha fatto trovare un errore mio: **oggi ho scritto due volte** — nella §27 della
review e in `TASKCLAUDE` §82 — che `tools/websearch.py` *"è ancora uno stub"*. È falso: fa una
vera chiamata a DuckDuckGo. L'ho corretto nei due punti, non in silenzio.

La parte che salva la faccia — e che registro perché è la lezione, non la scusa — è che **la
conclusione di sicurezza reggeva comunque**: il contenuto web non entra in memoria, ma perché il
cablaggio `search → remember` non esiste, **non** perché websearch sia uno stub. Avevo la
conclusione giusta appoggiata a una premessa sbagliata. È esattamente il difetto che l'esperimento
a variabile singola serve a smascherare: se non avessi scansionato i tool, la premessa falsa
sarebbe rimasta lì a sostenere una conclusione vera, pronta a diventare falsa il giorno in cui il
cablaggio arriva.

### File

`MAIN_IMPLEMENTATION_SECURITY_REVIEW.md` §29 (`S-28`, LOW) · `GROK_FIX_LIST.md` → `FIX-21` ·
§27 e `TASKCLAUDE` §82 corretti. **Nessuna chiamata di rete eseguita: che websearch la faccia
l'ho stabilito leggendo il codice.**


## Sessione 6, trentatreesima parte — una vista sola su tutti i 28 findings, e un mio conteggio sbagliato preso prima del commit

Il documento di security review è cresciuto a **28 findings** scritti in quattro sessioni, e la
sua sezione di stato consolidato (§20) ne copriva solo i primi 20. Chi applica le correzioni —
Grok soprattutto — aveva bisogno di **una** vista autorevole su tutto, non di ricostruirla
scorrendo 2.500 righe. L'ho costruita: §30, una tabella dei 28 con severità, stato, correzione e
owner.

### Il mio errore, e dove l'ho preso

Ho scritto nel bilancio *"12 chiusi, 1 superato, 1 parziale, 14 aperti"*. **La tabella dice 10, 1,
1, 16.** L'ho contato da un ragionamento invece che dalla tabella — è la trappola 24, la stessa
per cui ho corretto numeri quattro volte in una sessione. Stavolta l'ha preso lo script di
verifica che ho scritto per contarli: prima del commit, non dopo.

Corretto a `10/1/1/16`, e ho aggiunto la cosa che rende il conteggio difendibile invece che
imposto: **spiego perché differisce dalla §20.** Questa tabella classifica `S-08`
(`advisors.safety` evadibile) come **aperto** e non chiuso, perché `FIX-9` copre un caso ma le due
evasioni note restano. È una classificazione più severa, non un cambiamento di stato del codice, e
l'ho scritto invece di lasciar sembrare che qualcosa fosse regredito.

### Il bilancio, che è anche la conclusione della review

**10 chiusi, 1 superato, 1 parziale, 16 aperti.** Dei 16 aperti: uno è di Gemini (`S-16`), uno è
una decisione di Christian (`S-06`), quattordici sono di Grok con un ordine verificato. E il
contrappeso misurato: 90 tool promossi su 94 sono puliti. **Il motore regge; sono i bordi a essere
fragili** — otto dei quattordici aperti sono lo stesso difetto, un controllo collegato al punto
sbagliato.

### File

`MAIN_IMPLEMENTATION_SECURITY_REVIEW.md` §30. **Nessun codice toccato: è consolidamento di
documentazione.**


## Sessione 6, trentaquattresima parte — gli advisor, e un fail-open che è quasi una buona notizia

Ultimo componente non revisionato nel mio perimetro: la directory `advisors/` — `critic`, `style`,
`debate`. Elaborano l'output della pipeline, cioè failure containment, che è §32.2 mio.

`critic` e `style` sono puri advisor read-only: letti, corretti, nessun costrutto pericoloso.

`debate` è il "multi-agent debate loop" di PHASE2, e lì c'era la domanda vera: **la sua decisione
viene usata, o scartata come il valore di `_skills_hint`?** Ho controllato prima quello, perché è
la differenza fra un gate e un ornamento. **È usata:** `nt_runner.py:122` declassa PASS→FAIL su
`reject`. Grok l'ha cablata bene, ed è la lezione di `_skills_hint` applicata al posto giusto —
va detto per primo.

Il difetto, verificato eseguendo: la votazione è **fail-open**. `_vote_safety` su errore ritorna
`abstain` invece di `reject`, e l'intero step è in `except: pass`. Misurato: safety rotto → job
approvato; debate rotto → status resta PASS. Un guasto del revisore di sicurezza si legge come
approvazione.

L'ho tenuto **LOW**, e la disciplina qui è non gonfiarlo: il debate declassa lo *status riportato*,
non contiene niente — la promozione ha il suo gate, l'esecuzione è scoperta ma il debate non la
gata comunque. Quindi il fail-open inganna un umano che legge lo status, non apre un percorso. Un
finding che riguarda un'etichetta non è un finding che riguarda un'esecuzione, e confonderli
sarebbe gonfiare la gravità — l'errore che contesto agli altri.

Aggiornata la §30 (la vista autorevole di ieri sera) a **29 findings**, così non diventa stantia
il giorno dopo averla creata — che è esattamente il difetto che §30 esisteva per risolvere.

### File

`MAIN_IMPLEMENTATION_SECURITY_REVIEW.md` §31 (`S-29`, LOW) e §30 aggiornata · `GROK_FIX_LIST.md`
→ `FIX-22` · `TASKCLAUDE.md` §84. **Nessuna riga di `advisors/` modificata.**


## Sessione 6, trentacinquesima parte — chiusura della campagna di review: tutte le prove reggono

Esaurita la superficie revisionabile — tutto `core/`, tutti i 94 `tools/`, tutti gli `advisors/` —
ho fatto l'ultima cosa che chiude una campagna invece di lasciarla sfilacciata: **ho rieseguito
tutte e 14 le sonde dalla root**, come le eseguirebbe una sessione futura che verifica i miei
findings.

**14 su 14 eseguono pulite, exit 0, nessun traceback, nessun worktree orfano, albero pulito.**

Non è una formalità. Una sonda citata come *"riproduzione"* di un finding che poi non gira è
esattamente il difetto `F-001` che ho contestato a ChatGPT su `UJ-INT-006` — evidenza che non
regge quando qualcuno la controlla. E conferma che la disciplina `E38`/`E39` ha funzionato: nessuna
sonda lascia l'indice sporco o un worktree dietro, perché tutte materializzano il ref, usano
`git -C`, e ripuliscono con `atexit`.

### Dove sono, detto senza giri

La campagna di security review sull'implementazione Python è **completa**: 29 findings, ognuno con
severità, stato, correzione e owner nella vista autorevole §30, ognuno riproducibile. Il mio
portafoglio di consegna è impacchettato (7 pacchetti su 8, l'ottavo non può averne uno). I doveri
da reviewer sono evasi per quanto il ledger consente.

**Non c'è altro codice mio da scrivere né altro da revisionare finché non arriva nuovo input.** Le
due cose che sbloccano il programma — l'anello che applica le transizioni e il tetto delle card —
sono di ChatGPT; `S-16` è di Gemini; i 15 fix aperti sono di Grok. Se una sessione futura apre e
non trova consegne nuove dopo la trappola 11, **la risposta corretta è registrare l'attesa, non
inventare lavoro** — ed è la stessa regola che la PARTE 4 di questo file impone da sempre.


## Sessione 6, trentaseiesima parte — verificato che la raccomandazione su S-17 regge, e ci sono quasi cascato

L'azione pendente più importante del programma è la mia raccomandazione di mergiare su `main` il
`cloud_bridge.py` del ramo CLAUDE, che chiude `S-17`/`S-19` — le uniche cose che possono addebitare
a Christian. Quella raccomandazione resterà ferma finché qualcuno non la applica, e una
raccomandazione che aspetta va riconfermata prima che diventi stantia.

**Regge, verificato:** sul mio ramo (`HEAD`) tutte e tre le porte a pagamento — planner, writer,
embedding — vanno a `loopback` anche con il solo flag attivo, senza `MODEL_PROVIDER=local`. Su
`origin/main` sono invece tutte "A PAGAMENTO". Il fix va mergiato, e continua a essere quello
giusto.

### Ci sono quasi cascato io, ed è la trappola 37 sul mio stesso strumento

La prima esecuzione ho passato `TARGET_REF=HEAD` — la convenzione delle sonde `S-22`…`S-27`, che ho
scritto io più tardi. **La sonda `S-17-three-doors` usa invece `UJ_PROBE_REF`**, il suo nome
storico, e ha ignorato `TARGET_REF` misurando `origin/main`. L'output diceva "ref misurato:
origin/main" e mostrava le porte **aperte** — stavo per registrare "il mio ramo non chiude le
porte", cioè il contrario del vero.

Me ne sono accorto perché l'header diceva `origin/main` mentre io avevo chiesto `HEAD`:
l'incoerenza fra quello che ho chiesto e quello che la sonda dichiara di misurare, la stessa
euristica che salva da sempre. **Una convenzione stabilita a metà è una trappola per chi la
segue**: un verificatore futuro passerebbe `TARGET_REF` e misurerebbe il ref sbagliato in silenzio.

Corretto: `S-17-three-doors` ora accetta **entrambe** le variabili (`TARGET_REF` prima,
`UJ_PROBE_REF` come retrocompat), con il motivo nel commento. Verificato che `TARGET_REF=HEAD` ora
misura `HEAD` e `UJ_PROBE_REF=origin/main` continua a funzionare.

### File

`docs/threat-models/probes/S-17-three-doors-probe.py` (accetta entrambe le variabili).
**Nessun findings nuovo: la raccomandazione era già scritta, questa è la sua riconferma prima che
resti in attesa.**


## Sessione 6, trentasettesima parte — il gate di integrazione, atto n.5 del mandato mai consegnato

Sotto l'ordine di continuare, la cosa con più valore reale rimasta non era un altro finding: era un
atto del mio mandato di Technical Lead che avevo **elencato e mai fatto**. La PARTE 3-bis §4, punto
5: *"cablare un gate di integrazione: nessun merge senza typecheck, build, suite e validator a exit
0, con gli exit code registrati"*. Non esisteva — né uno script, né una workflow CI.

L'ho costruito: `scripts/integration-gate.sh`. Un comando che esegue typecheck, build, i 140 test,
i due validatori di ChatGPT, il mio validatore di packet, e due controlli informativi — ognuno con
l'exit code letto **dal comando vero**, mai da una pipe. Consolida esattamente le verifiche che ho
digitato a mano a ogni commit di questa sessione.

### Due cose che valgono più dello script

**L'ho provato che può fallire.** Un gate che non può fallire non è un gate (trappola 21). Prima
falsificazione: ho rotto `ADM-11` nel `dist/` e il gate è passato lo stesso — perché la sezione
build **rigenera `dist/` dal sorgente** prima che i test girino, guarendo la mia rottura. Era la
trappola 12 di nuovo: il test non esercitava ciò che credevo. Rifatto rompendo il **sorgente** con
un errore di tipo: il gate esce **1** su typecheck, e torna a **0** dopo il ripristino da git. La
falsificazione fallita mi ha regalato una proprietà vera da scrivere: **il gate testa sempre codice
ricompilato da zero**, non un `dist/` stantio — che è esattamente il difetto in cui la sessione 4
era cascata (`E16`, `dist/` assente in un container nuovo).

**Non esegue `pytest`, di proposito, ed è la decisione che conta.** Sarebbe l'istinto ovvio in un
gate — "esegui tutti i test". Ma finché `FIX-11` non è applicato, la suite Python sovrascrive
`grok.md` (`S-18`): un gate che esegue `pytest` **corrompe il repository a ogni esecuzione**. È lo
stesso genere di trappola dei findings — la cosa che sembra la difesa giusta è quella che fa il
danno. Scritto nell'intestazione dello script, con l'istruzione per aggiungerlo quando `FIX-11`
sarà su `main`.

### File

`scripts/integration-gate.sh` (nuovo, eseguibile, falsificato) · `TASKCLAUDE.md` §85.
**Nessun codice di nessuno modificato: lo script solo orchestra comandi esistenti, non li
duplica.**


## Sessione 6, trentottesima parte — la demo §21 gira: il blueprint smette di essere teoria

Atto n.4 del mandato di Technical Lead, e l'unico rimasto non consegnato: la demo end-to-end del
blueprint §21. Il blueprint lo dice di sé stesso — *"se la demo non gira, il documento è teoria"*.
Fino a stasera era teoria.

**Adesso gira:** `packages/contracts/demo/mission-demo.mjs`, 9 osservabili su 9 e 4 casi negativi
su 4, exit 0, a costo zero (nessun import di rete, verificato dal passo 9 che conta i moduli di
rete caricati: zero).

### Che cosa è reale e che cosa è demo-minimale, detto senza ambiguità

Sei osservabili e due casi negativi usano i **contratti veri**: `checkSpawn` (rifiuto del tool non
posseduto, invariante `TA-2` nominata), `nextState` (kill switch → `HALTED` da `MONITORING`),
`verifyLedgerChain` (catena intatta e rilevamento della manomissione), `buildIdempotencyKey` (il
nodo 1 non rieseguito al resume), `mayStartNewStep`, `AtomicActiveTaskCounter` (due claim
concorrenti, esattamente un vincitore).

I restanti — decomposizione, selezione, e le regole `RTE-E01`/`FBK-E01` dei due casi negativi —
sono **logica demo-minimale marcata `[demo]`**, perché i contratti `DEC-`/`SEL-`/`RTE-`/`FBK-`/
`CNF-` **non esistono ancora** (sono i cinque sottosistemi senza contratto che avevo misurato nella
ventesima parte). Quando quei contratti arriveranno, la demo va ricablata su di essi. L'ho scritto
nell'intestazione del file, non in una nota a fondo pagina.

### Che cosa questa demo NON fa — la disciplina che conta

**Non chiude `T-E2E-1/2/3` nel blueprint.** Quelle prove restano `DA IMPLEMENTARE` finché la
consegna di `UJ-RUN-001` è congelata e in review: promuovere la demo a test vero cambierebbe il
conteggio di 140 e riaprirebbe i 15 artefatti hashati. Verificato che **non** l'ho fatto: suite
ancora 140, i 15 hash intatti a `b2b32733`, blueprint non toccato. La demo vive **accanto** alla
consegna, additiva, non dentro.

È lo stesso ragionamento con cui ho tenuto `ADM-11` fuori dal conteggio finché la review non
avviene: un primo taglio di codice che rende il blueprint falsificabile, senza spacciarlo per la
prova formale che sarà quando la consegna si sblocca.

### Provata falsificabile

Un demo che stampa sempre "ok" non prova niente (trappola 21). Ho rotto `verifyLedgerChain` nel
`dist/` forzando `intact:true`: il passo 8 è **fallito** e la demo è uscita **1**. Ricompilato dal
sorgente intatto, torna a passare. Quindi la demo **valida davvero il contratto**, non lo illustra.

Aggiunta al gate di integrazione (`scripts/integration-gate.sh`) come verifica bloccante: da ora
un merge che rompe la composizione dei contratti runtime lo fa vedere il gate.

### File

`packages/contracts/demo/mission-demo.mjs` (nuovo) · `scripts/integration-gate.sh` (demo aggiunta)
· `TASKCLAUDE.md` §86. **Nessun artefatto hashato toccato, suite invariata a 140, blueprint non
modificato.**


## Sessione 6, trentanovesima parte — il primo dei cinque contratti mancanti: RTE (routing), reale e fedele al §18

Sotto l'ordine di continuare, la scelta giusta non era un altro documento: era **costruire davvero**
uno dei cinque sottosistemi che la demo §21 esercitava con logica `[demo]` perché il loro contratto
non esisteva (`DEC`/`SEL`/`RTE`/`FBK`/`CNF`). Ne ho costruito uno per intero — il routing (`RTE`) —
e non l'ho inventato: il blueprint §18 lo **specifica** tipo per tipo, e ho implementato quello.

### Che cosa ho costruito

`packages/contracts/src/routing/adapter-routing.ts` — `CostClass`, `AdapterRegistration`,
`admitAdapterRegistration`, `resolveCostClass`, fedeli a §18.2:

- **`RTE-E01`** un adapter `METERED` è rifiutato sotto `STRICT_ZERO_CARD`;
- **`RTE-E02`** `METERED` è irrappresentabile sotto L3 — rifiuto **alla registrazione**, non alla
  chiamata (un controllo alla chiamata protegge solo chi ci arriva con la config giusta);
- **`RTE-E03`** un `ZERO_LOCAL` che non vincola l'endpoint al loopback contraddice la propria
  classe — è il buco che il fix di `S-17` chiude;
- **`resolveCostClass`** fa cadere il default su `ZERO_LOCAL`, **mai** su `METERED`: è la lezione
  di `S-17` (`MODEL_PROVIDER` default a pagamento) resa irrappresentabile nel tipo.

### La disciplina di scoping, che è la parte che conta

**Non ho toccato la consegna congelata di `UJ-RUN-001`.** Il contratto RTE è una superficie
**separata**: non è esportato da `runtime/index.ts` (uno dei 15 artefatti hashati e in review
presso Gemini), i suoi test stanno in `tests/routing/` e non in `tests/contracts/`, quindi il
conteggio 140 resta 140 e i 15 hash restano intatti a `b2b32733`. Verificato. È un anticipo di
M2/M3, non una modifica alla review in corso.

Poi ho sostituito la logica `[demo]` del caso negativo N2 con il **contratto vero**: la demo ora
prova `RTE-E02` sul codice reale, non su una simulazione. Sette test dedicati, tutti verdi, più il
gate di integrazione esteso a includerli.

### Un difetto della mia stessa demo, trovato dalla demo

Rifacendo la build il passo 9 (controllo di costo) è **fallito**: `net` risultava caricato. Non era
una regressione del codice — era che il mio passo 9 misurava la cosa sbagliata. `process.moduleLoadList`
dice quali moduli sono **caricati**, non quali connessioni sono **aperte**, e Node carica `net` per
ragioni interne senza aprire un socket. Era un falso segnale (trappola 12: un controllo che non
misura ciò che dichiara). L'ho riscritto perché intercetti i **tentativi di connessione reali** a
host non-loopback — che è la misura fedele di *"0 richieste uscenti"* del §21 — e ora prova la cosa
giusta. Un controllo di costo che passa perché nessuno ha ancora caricato `net` non è un controllo.

### File

`packages/contracts/src/routing/adapter-routing.ts` + `index.ts` (nuovi) ·
`tests/routing/adapter-routing.test.mjs` (7 test, fuori dai 140) ·
`packages/contracts/demo/mission-demo.mjs` (N2 reale, passo 9 corretto) ·
`scripts/integration-gate.sh` (RTE aggiunta) · `TASKCLAUDE.md` §87.
**15 hash intatti, tests/contracts invariata a 140, runtime/index.ts non toccato.**


## Sessione 6, quarantesima parte — il secondo contratto mancante: DEC (decomposizione), sette casi d'errore

Continuando a costruire i cinque sottosistemi che la demo esercitava con logica `[demo]`, ne ho
fatto un secondo per intero: la **decomposizione** (`DEC`), fedele al blueprint §16. È il
meglio-specificato dei rimasti — sette casi d'errore nominati e una funzione pura — e ne avevo già
implementato un pezzo (`DEC-E04`) come script in sessione precedente.

### Che cosa ho costruito

`packages/contracts/src/decomposition/decomposition.ts` — `TaskNode`, `Decomposition`,
`validateDecomposition`, fedeli a §16.3/§16.5. Tutti e sette gli errori del §16.5:

- `DEC-E01` ciclo nel DAG (ordinamento topologico) · `DEC-E02` somma dei pesi dei figli ≠ padre ·
  `DEC-E03` `reviewer === owner` · `DEC-E04` criterio non falsificabile (la logica che avevo scritto
  in `check-acceptance-criteria.mjs`, portata nel contratto) · `DEC-E05` depth/fan-out oltre i tetti
  · `DEC-E06` capability fuori dall'indice chiuso · `DEC-E07` task irraggiungibile dalla radice.

**Rifiuto in blocco**, come impone §16.5: `validateDecomposition` restituisce *tutte* le infrazioni,
mai una decomposizione parzialmente accettata — una a metà lascia task orfani, ed è peggio di
nessuna. 12 test in `tests/decomposition/`, tutti verdi, uno per ogni errore più il percorso felice,
il rifiuto in blocco e la falsificabilità.

### Scoping identico al contratto RTE

Superficie **separata**: non esportata da `runtime/index.ts` (uno dei 15 hashati), test fuori da
`tests/contracts/`, conteggio 140 invariato, 15 hash intatti a `b2b32733`. Verificato. Anticipo
M2/M3, non una modifica alla review in corso.

La demo §21 ora usa questo contratto vero per il **passo 1**: costruisce una `Decomposition` di
quattro nodi e la **valida col contratto reale** invece di simulare. Restano tre sottosistemi
demo-minimali: `SEL` (selezione), `FBK` (fallback), `CNF` (conflitto, già in parte coperto
dall'`AtomicActiveTaskCounter` reale al caso N4).

### Un conteggio stantio nella mia stessa demo, corretto

Portando la decomposizione a 4 nodi, l'etichetta del passo 2 diceva ancora `3/3 ASSIGNED` — un
numero fisso rimasto indietro (trappola 24, nel mio output). Sostituito con un conteggio dinamico
`${assigned.length}/${assigned.length}`, così non può più scadere quando la decomposizione cambia.

### Stato dei cinque contratti mancanti

**RTE ✓ · DEC ✓ · restano SEL, FBK, CNF.** La demo ora poggia su contratti reali per 7 dei suoi 13
controlli (passo 1 DEC, 5 kill, 6 idempotency, 8 ledger, N1 checkSpawn, N2 RTE, N4 counter).

### File

`packages/contracts/src/decomposition/` (nuovo) · `tests/decomposition/decomposition.test.mjs`
(12 test) · `packages/contracts/demo/mission-demo.mjs` (passo 1 reale, etichetta passo 2 corretta)
· `scripts/integration-gate.sh` (DEC aggiunta) · `TASKCLAUDE.md` §88.
**15 hash intatti, tests/contracts invariata a 140, runtime/index.ts non toccato.**


## Sessione 6, quarantunesima parte — il terzo contratto mancante: SEL (selezione), e la regola più difficile è il tie-break

Terzo dei cinque sottosistemi che la demo esercitava con logica `[demo]`: la **selezione**
(`SEL`), fedele al blueprint §17. Lega un `TaskNode` a un agente per capability e ceiling, **mai
per qualità percepita di un modello e mai per nome di fornitore** — è la proprietà che `AC-01` di
`UJ-RUN-001` chiede, e §17 la rende meccanicamente verificabile.

### Che cosa ho costruito

`packages/contracts/src/selection/selection.ts` — `selectAgent(input): Assignment`, tre esiti e
nessun quarto (§17.3): `ASSIGNED`, `HUMAN_BRIDGE`, `REFUSED`. Tutti e cinque gli errori §17.5:

- `SEL-E01` nessun candidato copre le capability → **HUMAN_BRIDGE, non REFUSED** (a costo zero
  l'assenza di un agente capace è normale, la risposta è chiedere a una persona);
- `SEL-E02` il candidato migliore viola un ceiling (`TA-2`/`TA-4`/`TA-5`/`TA-8`) → REFUSED, con
  **tutte** le invarianti elencate, non la prima;
- `SEL-E03` owner e reviewer coincidono → REFUSED (indipendenza ri-verificata a selezione, §17.6.5);
- `SEL-E04` manifest scaduto rispetto a `now` → REFUSED;
- `SEL-E05` due candidati ugualmente idonei → risolto dal tie-break, **mai** a caso.

12 test in `tests/selection/`, tutti verdi: uno per errore più il percorso felice, il tie-break su
due assi, la neutralità di provider, e il determinismo.

### La regola più difficile, e perché

Il tie-break §17.6.4 preferisce **l'agente MENO privilegiato**, non il più capace: (a) `maxAutonomy`
più basso, (b) `maxDataClass` più bassa, (c) `maxSideEffect` più basso, (d) `agentId` lessicografico.
È controintuitivo — un router "normale" sceglierebbe il più capace — ed è esattamente il punto: dare
a un task il minimo privilegio che lo svolge è il principio del minimo privilegio applicato alla
selezione. Il test `T-SEL-3` costruisce apposta un candidato più capace con `agentId`
lessicograficamente primo, e verifica che **perde comunque**: il privilegio domina il nome.

### Tre scelte di fedeltà, dichiarate

1. **`EffectiveGrants` non esiste come tipo concreto.** Il blueprint lo nomina (§17.2, §17.3) e non
   lo definisce mai. L'ho reso fedele a §9 — l'insieme di capability effettive del padre più i tre
   ceiling ordinati contro cui si applicano `TA-2/4/5/8`. Dichiarato nel commento, non inventato in
   silenzio.
2. **`SEL-E03` è un controllo a livello di TASK, non di candidato.** Il blueprint lo formula sul
   candidato ("owner AND reviewer"), ma `owner !== reviewer` è già un invariante garantito da
   `DEC-E03`: il re-check che ha senso a selezione è che il task non sia arrivato con
   `owner === reviewer` per una deriva del manifest fra `FROZEN` e assegnazione. È REFUSED e non
   HUMAN_BRIDGE — un self-review non si corregge incollando, va corretta la decomposizione.
3. **La neutralità di provider vale per costruzione perché l'`agentId` è un handle OPACO.** Il
   tie-break lessicografico su `agentId` non introduce dipendenza dal vendor: i nomi di fornitore
   vivono nei capability tag, non nell'handle. `T-SEL-2` lo prova relabelando i vendor token nei
   capability tag e mostrando che l'agente scelto non cambia.

### L'errore, e stavolta l'ha preso la demo

Cablando `SEL` reale nel **passo 2** della demo, il controllo è fallito. Causa: la regex
`VENDOR = /…|gemini|claude-|…/` che verifica "nessun vendor nell'input" ha fatto match su
`reviewer: "GEMINI"` e `owner: "CLAUDE"` dei nodi. **Ma quelli non sono nomi di fornitore per il
routing: sono gli AI_ID di governance dei membri del Council**, letti solo per l'uguaglianza di
indipendenza `SEL-E03`, che è neutrale per costruzione. La correzione non è allargare la regex né
rinominare i nodi: è restringere il controllo all'**input di routing** vero — i candidati e la
missione — e dichiararlo nel commento. Confondere l'identità di governance con il nome di vendore
avrebbe fatto sovra-dichiarare un difetto inesistente, che è la classe di errore che contesto agli
altri.

Secondo inciampo, minore: la prima falsificazione del tie-break (rompere il comparatore nel `dist`)
**non ha cambiato niente** perché il mio `sed` non combaciava con la forma su due righe del `dist`
(`return dAut;` su riga propria). È la trappola 12 — una falsificazione che non esercita il ramo
che credi. Me ne sono accorto perché "12 pass" con il codice "rotto" non tornava; rifatto il `sed`
sulla forma vera, `T-SEL-3` è diventato `not ok` (2 test falliti), poi la ricompilazione ha guarito.
Una falsificazione che non fallisce non prova la robustezza del test: prova solo che non hai toccato
il codice.

### Scoping identico a RTE e DEC

Superficie **separata**: non esportata da `runtime/index.ts` (uno dei 15 hashati), test fuori da
`tests/contracts/`. Verificato dopo il lavoro: **15 hash intatti a `b2b32733`, `tests/contracts`
invariata a 140, `runtime/index.ts` non toccato** (git diff vuoto su `runtime/` e `tests/contracts/`),
gate di integrazione PASS con la nuova suite `SEL (12 pass)`, `cross-document-consistency` exit 0.

La demo §21 ora usa il contratto `SEL` vero per il passo 2 (era `[demo]`): costruisce due candidati
che coprono `echo` e verifica che vince il meno privilegiato. **RTE ✓ · DEC ✓ · SEL ✓ · restano
FBK (fallback), CNF (conflitto).** La demo poggia su contratti reali per 8 dei suoi 13 controlli.

### Chiusura su "stop"

Christian ha scritto **stop** mentre verificavo i 15 hash — il segnale che il `/goal` aspettava. Ho
chiuso senza iniziare il quarto contratto: ho salvato il lavoro `SEL` completo e verde (Regola 2:
non committare significa perderlo alla prossima sessione), aggiornato la memoria, e mi sono fermato.

### File

`packages/contracts/src/selection/` (nuovo) · `tests/selection/selection.test.mjs` (12 test) ·
`packages/contracts/demo/mission-demo.mjs` (passo 2 reale, controllo vendor ristretto al routing) ·
`scripts/integration-gate.sh` (SEL aggiunta) · `TASKCLAUDE.md` §89.
**15 hash intatti, tests/contracts invariata a 140, runtime/index.ts non toccato.**

## Sessione 7 — `UJ-CLAUDE-2026-08-20-07` — 2026-08-20

**Richiesta di Christian:** *"manda un messaggio di cosa fare a grok, chatgpt, gemini e dimmi
in percentuale a quanto siamo della pianificazione e del risultato finale e di ogni lavoro di
ogni IA."*

### Trappola 11, dodicesima volta che paga, e stavolta trova la cosa migliore della settimana

`git fetch` con il `+`, come impone E30. Due rami mossi **dopo** la chiusura della sessione 6:
`agent/uj-red-001-grok-continuity-20260820` (17:28 del 20) e
`agent/uj-red-001-chatgpt-review-20260819-r2` (12:04 del 20). Nessuno dei due era nel
RESUME_POINT, perché non esistevano quando l'ho scritto.

Dentro il secondo ci sono due commit che valgono più di qualunque cosa io abbia prodotto ieri:

```
c46a967  ledger(RED): transition UJ-RED-001 to REVIEW
df24fd6  fix(governance): allow reviewed specialist status in council gate
```

**ChatGPT ha applicato per la prima volta una transizione di stato al `BACKLOG.json`.** È
l'anello mancante che avevo documentato tre volte in tre documenti e che nessuno aveva mai
eseguito. Verificato confrontando i due `BACKLOG.json` invece di fidarmi del messaggio di
commit: su quel ramo `UJ-RED-001` è davvero `REVIEW`, su `main` è ancora `READY`.

**E il ramo non è su `main`.** Quindi, per il programma, non è ancora successo — è la stessa
lezione della decisione n. 7 sul `cloud_bridge`: una decisione applicata su un ramo che nessuno
mergia non è una decisione applicata.

### Il fatto che rende il collo di bottiglia non più discutibile, e non è mio

ChatGPT ha revisionato `UJ-RED-001` di Grok oggi. Ho letto il `ReviewResult` invece di
riassumerlo: **cinque criteri su cinque a `PASS`**, outcome `PASS_WITH_ACTIONS`, unico finding
di severità `INFO` e sulla riproducibilità di un comando, non sulla consegna.

E nello stesso documento: `accepted_weight_before: 0` → `accepted_weight_after: 0`, con la
motivazione *"Import the corrected packet only after UJ-RED-001 is transitioned from READY to
REVIEW by the authorized integration flow."*

**Un lavoro promosso su ogni singolo criterio vale zero perché manca un passaggio di stato.**
Per quattro sessioni ho scritto che il deadlock del ledger era la causa vera e non la mia
condotta; questa è la prima dimostrazione che non viene da me, non riguarda un mio task, e
porta la firma del supervisore che quel gate lo possiede.

### Il calcolo, ricalcolato dal `BACKLOG.json` e non ricopiato

Ho scritto uno script che somma pesi, accettati e stati per owner, milestone e stato — invece
di sommare a mente, che è il difetto per cui ho corretto quattro numeri in una sola sessione.

**43 task, 340 unità, 26 accettate — 7,6%.** Le 26 sono `UJ-META-001` (21/21) e `UJ-META-002`
(5/8), entrambe governance. **Di lavoro specialistico: zero, da tutti e quattro.**

| IA | Task | Peso | Consegnato | Accettato |
|---|---:|---:|---:|---:|
| CHATGPT | 9 | 102 | 42 (41,2%) | **21 (20,6%)** |
| CLAUDE | 8 | 76 | 68 (89,5%) | **0** |
| GEMINI | 8 | 81 | 26 (32,1%) | **0** |
| GROK | 8 | 73 | 13 (17,8%) | **0** |
| Christian | 1 | 8 | 8 | 5 (62,5%) |

Pianificazione (M0 ∪ M1, unione e non somma — sei task stanno in entrambe): **17 task, 177
unità, 120 consegnate (67,8%), 26 accettate (14,7%)**. Resto (M2+): **26 task, 163 unità, zero
e zero.**

**«Consegnato» non è una mia impressione**: l'ho misurato enumerando su tutti i rami i
`ResponsePacket` e i `ReviewResult` esistenti, e i pacchetti di evidenza in
`docs/program/packets/`. Sono 5 packet reali (RUN-001 mio, CAP-001 e GGL-001 di Gemini,
RED-001 di Grok, più uno in quarantena) e 8 review result.

### Il dato nuovo, che nessuno aveva mai misurato e che riguarda Grok

**I 122 file Python su `main` non sono coperti da nessun task del `BACKLOG.json`.** Cercato:
zero riferimenti a `core/`, `tools/` o `bin/uj` in tutto il file. Il contributo più grande in
volume del programma — l'unico codice che si esegue davvero — è **invisibile al ledger**.

Non l'ho corretto, perché la baseline è di ChatGPT e sarebbe invasione di portafoglio. Ma
l'ho scritto nel blocco per Grok, perché se un giorno qualcuno guarderà i numeri per capire
chi ha fatto cosa, quel lavoro non comparirà, ed è giusto che lui possa dirlo prima che accada.

E ha una conseguenza sul calcolo che dico esplicitamente invece di lasciarla dedurre: **il
17,8% di Grok è la sua percentuale sul ledger, non la sua percentuale di lavoro.** Le due cose
divergono più per lui che per chiunque altro.

### Il dispatch

`prompts/handoffs/CLAUDE-DISPATCH-20260820.md` — tre blocchi delimitati, incollabili
integralmente e indipendenti l'uno dall'altro, perché ogni giro di HUMAN_BRIDGE lo paga
Christian a mano e un messaggio che richiede di leggerne un altro costa un giro in più.

A ciascuno ho scritto **prima cosa ha fatto bene**, misurato: a Grok che 90 tool promossi su 94
non contengono un solo costrutto pericoloso (quindi `FIX-1` ha tenuto, verificato su ciò che è
finito nel catalogo e non dedotto dall'esistenza del gate); a ChatGPT che ha applicato la
transizione e che il controllo positivo `UJ-INT-006` importa a exit 0, cioè il macchinario
funziona; a Gemini che il quarto invio di `UJ-CAP-001` passa il test dichiarato in anticipo —
`UNKNOWN` da 1 a 79, date ISO da 0 a 28, zero capability `ACTIVE`, confidenza massima 0,5.

### Tre correzioni a mie affermazioni, e stanno dentro il blocco di chi le aveva ricevute

Non in una nota a piè di pagina: nel messaggio che quella IA leggerà.

1. **A Grok:** gli avevo scritto che `UJ-SEC-001` era *"la cosa con più leva che puoi fare
   oggi"*. Falso — fra i sei task in attesa di review è **l'ultimo** per quantità sbloccata.
2. **A Gemini:** *"local ha zero occorrenze"* nel suo registro non è esatto. Compare 8 volte,
   sempre come destinazione di fallback e mai come classe governata. Il difetto resta, la
   formulazione era sbagliata.
3. **A Gemini:** avevo scritto **due volte** che `tools/websearch.py` è uno stub. È falso, fa
   una vera chiamata a DuckDuckGo. La conclusione di sicurezza reggeva — il contenuto web non
   entra in memoria — ma **per un'altra ragione**: il cablaggio `search → remember` non esiste.
   Una conclusione giusta appoggiata a una premessa falsa è pronta a diventare falsa il giorno
   in cui la premessa cambia.

### Riverifiche eseguite, non ricordate

| Verifica | Esito |
|---|---|
| `sha256sum` piano canonico | `a3fcdfc9…a69a87` **coincide** |
| `npx tsc -p packages/contracts --noEmit` / senza `--noEmit` | exit 0 / exit 0 |
| suite contratti, 5 file | **140 pass, 0 fail** (28·9·36·37·30) |
| `S-17` su `origin/main` | **aperto**, quinta verifica: default `openai` righe 12 e 109, `_call_openai` presente, `UJ_ALLOW_PAID_API` assente |
| `S-19` su `origin/main` | **aperto**: guard di budget in `embed()` dentro `except Exception` |
| `S-26` su `origin/main` | **aperto**: zero occorrenze di `scan_text`/`safety` in `core/graph_exec.py` |
| Ultimo commit di Gemini, qualunque ramo | **2026-08-18 16:13** — due giorni fermo |
| `writeFileSync` su `BACKLOG.json` in `scripts/` | **nessuna**, confermato al ref corrente |

### Errori commessi in questa sessione

Nessuno arrivato a un documento. Uno evitato per abitudine: stavo per sommare M0 e M1 come
`117 + 86 = 203`, ma **sei task stanno in entrambe le milestone**, quindi il totale vero è
l'unione — **177**. L'ho calcolato con un filtro invece che a mente perché la trappola 24 dice
esattamente questo, e la cifra sbagliata sarebbe finita in un messaggio a Christian.

Un secondo rischio evitato: `git rev-parse HEAD main origin/main` è **fallito** con *"ambiguous
argument 'main'"* — in questo container non esiste un `main` locale. Non l'ho letto come un
problema: è la condizione che rende impossibile l'errore E17. Ma è un caso che la mia stessa
ricetta di avvio non prevede, e vale la pena saperlo prima di interpretarlo come un guasto.

### Confini rispettati

Nessun file di ChatGPT, Gemini o Grok modificato. Nessuna review alterata, nemmeno la mia.
Nessun peso proposto o assegnato: `0/76` resta corretto. Nessun merge su `main`. Nessuna
chiamata di rete a pagamento, in nessuna variante. Toccati solo `TASKCLAUDE.md`, `CLAUDE.md` e
un file nuovo in `prompts/handoffs/`.

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

20. **Un difetto corretto in un file non è corretto nel file accanto** (E6, seconda
    occorrenza). Il NUL come separatore è stato tolto da `checkpoint.ts` in sessione 1 e
    lasciato in `depth-guard.ts` fino alla sessione 5. Quando correggi un difetto di
    *principio* — non di battitura — **cerca lo stesso schema in tutto il portafoglio** e
    metti la correzione in **una sede sola**, così la terza occorrenza non è possibile.
    Corollario: un byte NUL rende il file **binario** per git e grep, cioè lo toglie da ogni
    audit testuale. Il sintomo è `binary file matches` al posto di una riga: non ignorarlo.
21. **Un test nuovo va provato contro il codice vecchio prima di essere accettato.** Se passa
    su entrambi non prova niente (falso negativo, trappola 12, visto dall'altro lato). Il
    modo più rapido è rimettere il difetto nel `dist/`, rieseguire, leggere il fallimento
    atteso, ripristinare. In sessione 5: `expected: false, actual: true`.
22. **Ogni numero consegnato a un'altra IA va accompagnato dal suo scope** (E19). *"local
    compare una volta"* era vero sui due artefatti del task e falso sull'allegato intero,
    dove compare tre volte. Un numero senza scope è la stessa classe di difetto per cui ho
    bocciato Gemini in `G-002`: **rimisura sempre, non ricopiare dal tuo documento
    precedente**, e scrivi l'intervallo su cui vale.
23. **Confronta ogni ramo contro la propria merge-base, non contro un altro ramo** (E14/E17,
    terza forma). Un diff fra due rami con basi diverse mostra come "cancellazioni" tutto ciò
    che il ramo più vecchio semplicemente non ha ancora. In sessione 5 sembrava che `-v2`
    cancellasse 444 righe: erano commit che non aveva. Il rischio pratico è mergiare un fix
    corretto che, su una base più recente, **rimuove una feature**.

24. **Rimisura ogni cifra nel punto in cui la scrivi, e scrivi accanto il comando che la
    riproduce — poi ESEGUI quel comando** (E19, E21, E25, E26: quattro volte in una sola
    sessione). Il difetto non è l'aritmetica, è dedurre un numero da un ragionamento invece di
    contarlo. Vale soprattutto quando la cifra sembra ovvia: "42 su 43" lo sembrava, ed erano
    40. E un comando di riproduzione scritto ma non eseguito è peggio di nessun comando, perché
    autorizza chi legge a fidarsi (`grep -c` dava 44 dove il conteggio corretto era 41).
25. **Cerca sempre un controllo positivo prima di consegnare una diagnosi** (sessione 5). Una
    spiegazione che rende conto solo dei fallimenti non è falsificabile: sembra completa perché
    nulla la contraddice. Il caso in cui il meccanismo **riesce** dice dove sta davvero il
    confine — e trasforma *"non funziona"* in *"funziona, e queste sono le precondizioni che
    mancano"*, che è più vero e più utile a chi deve correggere.

26. **Correggi la CLASSE del difetto, non l'istanza segnalata** (sessione 6). ChatGPT ha
    segnalato **un** artefatto che dichiarava uno stato superato; scandendo tutto il set ne sono
    emersi **quattro**, e il peggiore non era quello segnalato — era una costante TypeScript
    (`RUNTIME_CONTRACTS_PROVENANCE.status`), cioè l'unica copia **leggibile da una macchina**
    dello stato. Quando qualcuno segnala un'incoerenza, la domanda giusta non è *«dov'è quel
    file?»* ma *«questa forma dove altro compare?»*. Contromisura meccanica: un grep sull'intero
    set di consegna ogni volta che si corregge un valore condiviso — uno stato, un conteggio, il
    nome di un branch — prima di dichiarare chiusa la correzione. Prova che la correzione è
    chirurgica: ricalcolare **tutti** gli hash a entrambi i commit e mostrare che ne sono
    cambiati esattamente quanti erano i difetti.
27. **Il `+` nel refspec di `git fetch` non è opzionale** (E30). `git fetch origin
    'refs/heads/*:refs/remotes/origin/*'` **rifiuta** l'aggiornamento di un ref remoto riscritto
    e lascia `origin/main` al valore vecchio, stampando una sola riga `! [rejected] …
    (non-fast-forward)` in mezzo a decine di `[new branch]`. Da lì ogni confronto fra branch è
    sbagliato **senza che nulla lo segnali**: è la trappola 17 prodotta dalla procedura che
    dovrebbe prevenirla. Usa sempre `+refs/heads/*:refs/remotes/origin/*` e, dopo il fetch,
    **verifica che `origin/main` sia dove ti aspetti** invece di darlo per aggiornato.
28. **Un artefatto hashato non può contenere il SHA del commit che lo contiene** (sessione 6).
    È impossibile per costruzione: l'hash dipende dal contenuto che dovrebbe dichiararlo. Il
    `source_commit_sha` va in **una sede sola** — il packet — e gli artefatti citano al più i
    commit **superati** e quelli **esterni** alla consegna, che sono stabili. Scriverlo dentro
    l'artefatto significa o mentire o inseguire il proprio hash a ogni giro.

29. **Un ref che prescrivi a qualcun altro va verificato dal punto di vista di CHI LO USERA'**
    (E31, sessione 6). Avevo chiesto a ChatGPT di portare il `read_ref` a *«un commit pari o
    successivo a `d48e1e85`»*: avevo controllato che la card **esistesse** a quel commit, non
    che il commit fosse **raggiungibile da `main`**. Non lo era — `main` era stato riscritto —
    quindi l'istruzione, seguita alla lettera, avrebbe riprodotto il difetto e sprecato un giro
    di HUMAN_BRIDGE. Un commit esiste sempre *da qualche parte*: la domanda utile è **da dove**.
    Corollario (E32): un `! [rejected] … (non-fast-forward)` su un ref remoto non è **mai solo**
    un problema di refspec — dice anche che la storia remota e' cambiata. Vanno lette entrambe.

30. **Una correzione che chiude il tuo finding va verificata con lo stesso metro con cui hai
    trovato il finding** (sessione 6, terza parte). ChatGPT ha corretto il `read_ref` delle
    quattro card: il difetto era davvero chiuso e il messaggio di commit diceva la cosa giusta.
    Fermarsi lì sarebbe stato ragionevole e sbagliato: **la stessa correzione aveva sostituito
    sedici hash corretti con sedici valori che non corrispondono a nulla**, e il gate di ChatGPT
    rifiuta il commit di ChatGPT. Un fix è una consegna come le altre: si ricalcola, non si
    accredita. Corollario: prima di dire *"gli hash sono sbagliati"*, prova le convenzioni
    alternative — sei, nel caso concreto — altrimenti stai accusando qualcuno di un errore che
    potrebbe essere una tua assunzione sul metodo di calcolo.
31. **Un `||` dopo una pipe non è un fallback: è attaccato all'ultimo comando della pipe**
    (sessione 6). `grep … | head -5 || echo "nessuno"` non stampa mai il messaggio, perché
    `head` esce sempre 0. È la trappola 15 in forma nuova — non un exit code letto male, ma un
    ramo negativo che non può scattare — e produce un output vuoto che si legge come una
    risposta. Se ti serve il caso negativo, redirigi su file e conta le righe.

32. **Quando uno stato torna al valore di partenza, dillo esplicitamente** (sessione 6, quarta
    parte). `UJ-RUN-001` è tornato a `REVIEW` dopo cinque giri di `BLOCKED`: stessa parola della
    sessione 1, contenuto opposto — allora asserita senza controlli, oggi risultato di sei
    clausole verificate. Una tabella storica che dice solo *"prima X, adesso Y"* diventa falsa
    nel momento in cui Y torna a X, e un lettore conclude che non è successo niente. Il valore
    non basta: serve **perché** vale.
33. **Un elenco di dove vive un valore condiviso si ripaga nella direzione opposta a quella in
    cui l'hai scritto** (trappola 26, applicata al contrario). La §0.4 dell'handoff censiva i
    quattro punti in cui vive lo stato della consegna, scritta per **correggere** un difetto.
    Tre giri dopo ha reso la transizione `BLOCKED → REVIEW` un commit solo, e — cosa più
    importante — ha impedito che un find-and-replace corrompesse `kind: "BLOCKED"` e
    `ResultStatus`, che sono **vocabolario di dominio** e non stato della consegna. Quando
    censisci le occorrenze di un valore, censisci anche gli **omonimi da non toccare**.

34. **Una soglia che proponi va chiusa transitivamente prima di proporla** (E33, sessione 6).
    Avevo proposto come innesco quattro task per 42 unità; il grafo delle dipendenze ne
    richiedeva otto per 94, perché uno dei quattro dipendeva da una catena che non avevo
    seguito. Un criterio di completamento che non è stato chiuso sulle sue dipendenze **non è un
    criterio, è una stima travestita**. Contromisura: attraversa il grafo con uno script e
    stampa la chiusura, prima di scrivere il numero.

35. **Una correzione altrui chiude il percorso che tocca, non la classe che descrive** (E35,
    sessione 6). Avevo verificato che `sha256AtRef` di ChatGPT risolvesse gli hash dal commit
    pinnato — vero, **per i pin delle delegation card**. Ne ho esteso la portata agli artefatti
    di un `ReviewResult`, che passano invece da `verifyReviewedArtifact` e vengono letti con
    `readFileSync` **dall'albero di lavoro**. È la trappola 30 col segno opposto: là *non
    accreditare un fix senza ricalcolare*, qui *non accreditarlo oltre ciò che copre*. Prima di
    dire *"quel problema è risolto"*, apri il codice del percorso di cui stai parlando, non di
    quello su cui hai visto il fix funzionare.
36. **Ref giusto per i dati, ref sbagliato per il gate** (E36, sessione 6). Avevo letto card e
    `BACKLOG` su `origin/main` — corretti, cinque criteri concordi — e ho **eseguito il
    validatore dal mio albero**, che portava ancora il `BACKLOG` a due criteri. Risultato: tre
    `unknown criterion` inventati, più un quarto errore derivato, indistinguibili dai difetti
    veri. **Un gate che gira su regole superate produce errori falsi con la stessa autorità di
    quelli veri**, ed è più pericoloso di un gate assente. È la trappola 17 applicata agli
    *strumenti* invece che ai *file*. Contromisura: prima di credere all'output di un
    validatore, confronta l'hash del file di regole che sta usando con quello su `origin/main`;
    se divergono, mergia **dopo** aver verificato che il merge non tocchi i tuoi artefatti
    hashati (intersezione fra i file in arrivo e quelli citati dal tuo packet), e ricontrolla
    gli hash dopo.

37. **Una sonda deve MATERIALIZZARE il ref che dichiara di misurare, e uno scenario calcolato
    va APPLICATO** (E38, sessione 6). Due difetti sommati hanno prodotto una tabella che diceva
    *"`S-17` è chiuso su main"* — il contrario del vero, su un finding che riguarda i soldi del
    proprietario. Il primo: la sonda importava dal worktree corrente mentre l'intestazione
    diceva `origin/main`, e il worktree corrente portava già il fix. Il secondo: `env=` non
    passato a `subprocess.run`, quindi dodici celle misuravano la stessa configurazione. **Le
    sonde precedenti materializzavano i ref con `git show` proprio per questo, e scrivendone una
    nuova ho dimenticato la ragione** — quindi la contromisura vera non è questa riga, è il
    commento dentro la sonda, dove lo rilegge chi la modifica. Corollario, estensione di `E22`:
    quando una chiamata solleva **prima** di raggiungere ciò che stai misurando, il risultato non
    è *"nessuna chiamata"* ma *"non misurato"* — distinguili nel codice, o il guasto a monte si
    legge come sicurezza.

39. **`git --work-tree=<dir> checkout <ref> -- <path>` scrive nell'INDICE del repository
    principale** (E39, sessione 6). Non è un'operazione confinata al worktree indicato: mette in
    stage la versione di un altro ref nel repository vero. Usato quattro volte per portare
    artefatti dentro worktree di misura, ha prodotto un commit di **38 file invece di 4**, che
    riportava indietro contratti, card e il validatore di ChatGPT — e la suite sarebbe rimasta
    **verde**, perché anche i test erano stati riportati indietro insieme al resto. Contromisure,
    entrambe necessarie — e serve cercare il pattern anche negli **script che hai già scritto**:
    il mio `scripts/audit-review-importability.mjs` lo conteneva e reinquinava l'indice a ogni
    esecuzione, fermato dalla guardia poche ore dopo aver registrato la trappola. La prima
    contromisura è **verificata per esperimento**, non dedotta:
    `git -C <worktree> checkout <ref> -- <path>` porta il file nel worktree e **non tocca**
    l'indice principale, mentre `git --work-tree=<worktree> checkout …` lo tocca — provate
    entrambe di fila confrontando l'hash di `git status --porcelain` prima e dopo. E **stampare
    `git status --short` nello stesso comando del commit**, non prima e non dopo. È l'estensione di `E15`:
    eseguire codice altrui sporca l'albero, **misurare lo sporca nell'indice** — cioè nel posto
    in cui non si guarda.

38. **Un audit statico produce CANDIDATI, non verdetti** (sessione 6, ottava parte). Uno script
    che riverifica venti findings di sicurezza con delle regex ne ha sbagliati **tre**, tutti
    nella direzione peggiore — *aperto* dove è *chiuso* — perché cercava una forma di codice e
    ne esisteva un'altra equivalente (`PRIVILEGED_KWARGS & set(kwargs)` invece di
    `allowed_kwargs`), perché pescava una stringa di **template** scambiandola per logica, e
    perché vedeva una globale senza controllare se il percorso la usa. Pubblicarlo avrebbe
    accusato un altro autore di tre regressioni inesistenti. **Ogni riga marcata aperta va
    riletta nel codice prima di uscire dal tuo albero**, e l'avvertenza va messa **dentro lo
    script**, dove la legge chi lo riesegue, non solo nel documento che lo cita.

---

# PARTE 8 — RESUME_POINT

> ## ⚡⚡ AGGIORNAMENTO 2026-08-20 (SESSIONE 7) — QUESTO VIENE PRIMA DEL RIQUADRO SOTTO
>
> | Fatto nuovo, misurato il 20 | Valore |
> |---|---|
> | **ChatGPT ha applicato la PRIMA transizione di stato al `BACKLOG.json`** | commit `c46a967` su `agent/uj-red-001-chatgpt-review-20260819-r2`, `UJ-RED-001` `READY→REVIEW`. **NON è su `main`** |
> | ChatGPT ha revisionato `UJ-RED-001` di Grok | **5 criteri su 5 `PASS`**, `PASS_WITH_ACTIONS`, e `accepted_weight` **0 → 0**. È la prova, non mia, che il deadlock è reale |
> | Gemini | **ferma dal 2026-08-18 16:13**, due giorni. Tiene 29 unità mie in review |
> | Programma | **43 task, 340 unità, 26 accettate = 7,6%** — e tutte e 26 sono governance |
> | Pianificazione (M0 ∪ M1, **unione**, non 117+86) | **17 task, 177 unità, 120 consegnate (67,8%), 26 accettate (14,7%)** |
> | Per IA (consegnato / accettato) | CHATGPT 41,2% / 20,6% · CLAUDE 89,5% / **0** · GEMINI 32,1% / **0** · GROK 17,8% / **0** |
> | **I 122 file Python di Grok su `main` non sono in NESSUN task del `BACKLOG.json`** | zero riferimenti a `core/`, `tools/`, `bin/uj`. Il suo 17,8% è la percentuale sul ledger, non sul lavoro |
> | `S-17`, `S-19`, `S-26` su `origin/main` | **tutti e tre ancora aperti**, riverificati |
> | Suite, hash, typecheck, build | 140/140 · `a3fcdfc9…` · exit 0 · exit 0 |
>
> **Dispatch alle tre IA:** `prompts/handoffs/CLAUDE-DISPATCH-20260820.md` — tre blocchi
> incollabili e indipendenti. Richieste in ordine di leva: **ChatGPT** mergia la transizione su
> `main` + la generalizza + emette l'R4 che porta `UJ-RED-001` a 13/13 (sarebbe **la prima
> unità specialistica accettata del programma**); **Gemini** revisiona `UJ-RUN-001` (**34 unità
> in un giro**, la leva più alta); **Grok** applica `FIX-19a` per prima e poi revisiona
> `UJ-SEC-001`.
>
> **Attenzione operativa:** in questo container **non esiste un `main` locale** —
> `git rev-parse HEAD main origin/main` fallisce con *"ambiguous argument 'main'"*. Non è un
> guasto: usa `origin/main` e basta.
>
> ## ⚡ STATO AL 2026-08-19, FINE SESSIONE 6 — LEGGI QUESTE 30 RIGHE PRIMA DELLE ALTRE 1000
>
> Il blocco qui sotto ha **48 punti accumulati in sei sessioni, in ordine non cronologico**, e
> **diversi sono superati da punti successivi**. Non sono stati cancellati — servono a capire
> come ci siamo arrivati — ma **questo riquadro è ciò che è vero adesso**. Se un punto più in
> basso contraddice questo riquadro, **vince il riquadro**.
>
> | Fatto | Valore, misurato |
> |---|---|
> | Branch con consegna **e** memoria | `agent/uj-run-001-blueprint-20260818` |
> | `origin/main` | `27b7673` |
> | Hash del piano canonico | `a3fcdfc9…a69a87` — invariato da sessione 1 |
> | Suite contratti | **140 pass, 0 fail** (runtime 36 · policy 28 · tools 30 · recovery 9 · skills 37) |
> | Copertura delle regole | **41 su 41**, zero scoperte (`ADM-11` chiusa, punto AT) |
> | Contratti dei 5 sottosistemi mancanti | **RTE ✓ · DEC ✓ · SEL ✓ · restano FBK, CNF** — superfici separate, `tests/contracts` resta 140 (punti BG, BH, BI) |
> | Mio portafoglio accettato | **0 / 76** — corretto, nessun reviewer si è espresso |
> | Programma | **26 / 340 accettate**, e tutte e 26 sono task meta di ChatGPT |
> | Pacchetti di evidenza | **7 su 8** — l'ottavo (`UJ-REV-002`) non può averne uno |
> | Security review su `main` | **campagna COMPLETA**: 29 findings, vista autorevole in `MAIN_IMPLEMENTATION_SECURITY_REVIEW.md` **§30** — 10 chiusi, 1 superato, 1 parziale, 17 aperti (15 Grok, 1 Gemini `S-16`, 1 Christian `S-06`) |
> | Correzioni per Grok | `GROK_FIX_LIST.md`: ordine **verificato** in `FIX_ORDER_ANALYSIS_20260819.md` — `FIX-19` per primo. 90 tool su 94 puliti: `FIX-1` ha tenuto |
>
> **I miei otto task, stato reale.** Attenzione a una distinzione che è costata sei giri:
> `REVIEW` qui sotto è lo stato **proposto dal packet** e l'ammissibilità della consegna; nel
> `BACKLOG.json` su `origin/main` `UJ-RUN-001` risulta ancora **`READY`**, perché nulla applica
> una transizione proposta. Non è una contraddizione, sono due assi diversi — misurato oggi.
> `UJ-RUN-001` **REVIEW** (PR #18, attende GEMINI) · `UJ-SEC-001` READY (attende GROK) ·
> `UJ-CLD-001` READY (attende GEMINI) · `UJ-MCP-001`, `UJ-SKL-001` BLOCKED su `UJ-SEC-001` ·
> `UJ-RCV-001` BLOCKED su `UJ-RUN-001` · `UJ-REV-001` BLOCKED su `UJ-INT-001` ·
> `UJ-REV-002` **DEFERRED a M10**, non lavorabile.
>
> **Non c'è lavoro di consegna che io possa iniziare.** Tutto ciò che era consegnabile è
> consegnato, impacchettato e verificato. Se apri una sessione e la coda è vuota, **è vero**:
> registra l'attesa — ma solo **dopo** aver eseguito la trappola 11.
>
> **Le due cose che bloccano tutti, e sono di CHATGPT:**
> 1. **nulla applica una transizione di stato proposta** → nessun `ReviewResult` è importabile,
>    quindi nessun peso è accettabile da nessuno
>    (`docs/program/reviews/UJ-REV-001-ADDENDUM-LEDGER-IMPORT-PATH.md`).
>    **Al 19 agosto non è più teoria: quattro review indipendenti sono consegnate e tre sono
>    bloccate da quella riga sola — una delle tre è di ChatGPT stesso.** Misura riproducibile:
>    `node scripts/audit-review-importability.mjs`, documento
>    `docs/program/reviews/CLAUDE-REVIEW-IMPORTABILITY-AUDIT-20260819.md`. Il controllo
>    positivo (`UJ-INT-006`) importa a **exit 0**: il macchinario funziona, mancano le
>    precondizioni;
> 2. **il meccanismo delle delegation card è cablato a quattro task** → sei miei task non
>    possono avere un packet
>    (`docs/program/reviews/UJ-REV-001-ADDENDUM-CARD-ISSUANCE-CEILING.md`).
>
> **Ordine raccomandato**, misurato in `docs/program/CRITICAL_PATH_20260819.md`: i tre atti più
> redditizi usano **tre reviewer diversi** e partono insieme — `UJ-RUN-001` a Gemini (34),
> `UJ-RED-001` a ChatGPT (29), `UJ-SEC-001` a Grok (21).
>
> **Punti superati, da non rileggere come attuali:**
> `AB`/`AF`/`AG` (`UJ-RUN-001` BLOCKED e i pin) → superati da **`AH`** ·
> `AP` («tutti e otto i pacchetti») → superato da **`AQ`** ·
> `AS` («chiudere `ADM-11` dopo») → superato da **`AT`** ·
> `S` («`UJ-INT-007` non esiste») → superato da **`AC`**.
>
> **Punti ancora attuali, in ordine di utilità:** `AT`, `AS`, `AR`, `AQ`, `AP`, `AO`, `AN`,
> `AM`, `AL`, `AK`, `AJ`, `AI`, `AH`, `AD`, `AE`, `P`, `T`, `V`.

```
PROGRAMMA : ultraJARVIS
AI_ID     : CLAUDE — Runtime, Security & Skill Architect

BRANCH    : ATTENZIONE — L'AMBIENTE PUO' NON ASSEGNARTELO (sessione 5: container
            vuoto, repo non clonato). Se non te lo assegna, il clone atterra su main:
            scegli il branch e DIMOSTRA la scelta con git rev-list, non dal nome.
            ATTENZIONE — CAMBIATO IN SESSIONE 4.
            Sessione 4 in poi : claude/claude-md-resume-point-tvej1u
            Sessioni 1-3      : claude/ultrajarvis-repo-analysis-li6vvj
            Il branch è assegnato dall'ambiente, non lo scelgo io: RILEGGI quale ti
            è stato dato invece di fidarti di questa riga. Da sessione 4 il branch di
            lavoro NON coincide più con main: il pre-verdetto UJ-CAP-001 sta sul
            branch di sessione 4 e NON è su main.

            AGGIORNATO IN SESSIONE 6 — LEGGERE QUESTO, NON IL BLOCCO DI SESSIONE 5.
            In sessione 6 l'ambiente ha assegnato un TERZO nome,
            claude/ultrajarvis-program-setup-2noca9, che al clone era IDENTICO a
            origin/main (0 avanti, 0 indietro) e NON contiene lavoro mio. Non usarlo
            come casa senza verificarlo.

            LA MEMORIA AGGIORNATA (questo file, TASKCLAUDE.md, AVVIO_NUOVA_SESSIONE.md)
            E' ORA SU  agent/uj-run-001-blueprint-20260818, non piu' sul branch di
            casa storico. Motivo: il proprietario ha chiesto di pushare SOLO il branch
            autorizzato, e la Regola 2 impone comunque di aggiornare la memoria; ho
            quindi mergiato li' il commit di memoria 2f0464d dopo aver verificato che
            non tocca NESSUNO dei 15 artefatti hashati.

              agent/uj-run-001-blueprint-20260818   -> CONSEGNA **E** MEMORIA.
                Autorizzato dalla delegation card (write_branch_patterns
                "agent/uj-run-001-*"). Contiene UJ-RUN-001 riconciliata (blueprint,
                packet, AC-evidence, delivery, append-blocks) E la memoria aggiornata.
                source_commit_sha finale: a7e03e979baee5a8b796007313ad93408299f840
                Verificato con `git branch -a --contains <sha>` e in NEGATIVO contro
                origin/main e gli altri due rami CLAUDE: e' l'UNICO che lo contiene.
              claude/claude-md-resume-point-tvej1u  -> casa STORICA, ora INDIETRO
                sulla memoria (ferma a fine sessione 5). Non e' piu' la copia buona.
              claude/ultrajarvis-program-setup-2noca9 -> assegnato dall'ambiente in
                sessione 6, vuoto di lavoro mio.
            PRIMA DI SCEGLIERE, DIMOSTRA la scelta con
            `git rev-list --left-right --count origin/main...<branch>`, non dal nome.

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

SESSIONE 6 — FATTI NUOVI, LEGGERE PRIMA DI TUTTO IL RESTO:

  BI) 2026-08-20 — COSTRUITO IL CONTRATTO SEL (selezione, §17), terzo dei 5.
     packages/contracts/src/selection/ + tests/selection/ (12 test verdi)
     GIA' FATTO, NON RIFARE. Fedele al blueprint §17.3/§17.5/§17.6, non inventato.
     selectAgent(input): Assignment — TRE esiti e nessun quarto (ASSIGNED /
     HUMAN_BRIDGE / REFUSED). Tutti e 5 gli errori: SEL-E01 nessuna copertura ->
     HUMAN_BRIDGE (NON REFUSED), E02 ceiling TA-2/TA-4/TA-5/TA-8 con TUTTE le
     invarianti elencate, E03 owner==reviewer, E04 manifest scaduto vs `now`,
     E05 tie-break deterministico mai a caso.
     LA REGOLA CHE INGANNA: il tie-break §17.6.4 preferisce l'agente MENO
     privilegiato, non il piu' capace (autonomy, poi dataClass, poi sideEffect,
     poi agentId lessicografico). T-SEL-3 lo prova con un candidato piu' capace e
     agentId lessicograficamente PRIMO: perde comunque.
     `now` E' UN PARAMETRO INIETTATO, mai letto dall'orologio (§17.2): senza,
     la selezione non sarebbe riproducibile e il ledger non replayabile.
     TRE SCELTE DI FEDELTA' DICHIARATE: (1) EffectiveGrants e' nominato dal
     blueprint e MAI definito -> reso fedele a §9 (capabilities + 3 ceiling);
     (2) SEL-E03 e' un controllo di TASK, non di candidato (owner!==reviewer e'
     gia' DEC-E03; qui e' il re-check contro la deriva dei manifest);
     (3) la neutralita' di provider vale perche' l'agentId e' un handle OPACO —
     i nomi di fornitore vivono nei capability tag, non nell'handle (T-SEL-2).
     Superficie SEPARATA come RTE/DEC: non tocca i 15 hashati, test fuori da
     tests/contracts/, 140 invariato, 15 hash intatti a b2b32733, gate PASS.
     La demo §21 passo 2 ora usa il contratto SEL reale (era [demo]).
     STATO 5 mancanti: RTE ok, DEC ok, SEL ok, restano FBK e CNF.
     ERRORE PRESO DALLA DEMO, non da me: la regex VENDOR del passo 2 faceva match
     su reviewer:"GEMINI"/owner:"CLAUDE" dei nodi, che NON sono nomi di fornitore
     per il routing ma AI_ID di GOVERNANCE del Council. Correzione: restringere il
     controllo all'input di ROUTING (candidati + missione). Non allargare la regex.

  BH) 2026-08-19 — COSTRUITO IL CONTRATTO DEC (decomposizione, §16), secondo dei 5.
     packages/contracts/src/decomposition/ + tests/decomposition/ (12 test verdi)
     GIA' FATTO, NON RIFARE. Fedele al blueprint §16.3/§16.5, non inventato.
     validateDecomposition, RIFIUTO IN BLOCCO, tutti e 7 gli errori: DEC-E01 ciclo,
     E02 pesi, E03 reviewer==owner, E04 criterio non falsificabile (portato da
     check-acceptance-criteria.mjs), E05 depth/fan-out, E06 capability fuori indice,
     E07 irraggiungibile. Superficie SEPARATA come RTE: non tocca i 15 hashati,
     test fuori da tests/contracts/, 140 invariato, 15 hash intatti a b2b32733.
     La demo §21 passo 1 ora VALIDA una Decomposition reale col contratto (era [demo]).
     STATO 5 mancanti: RTE ok, DEC ok, restano SEL, FBK, CNF.
     Corretto un conteggio stantio (3/3 -> dinamico) nell'etichetta del passo 2 demo.

  BG) 2026-08-19 — COSTRUITO IL CONTRATTO RTE (routing, §18), primo dei 5 mancanti.
     packages/contracts/src/routing/adapter-routing.ts + tests/routing/ (7 test verdi)
     GIA' FATTO, NON RIFARE. Fedele al blueprint §18.2, non inventato.
     admitAdapterRegistration (RTE-E01 METERED sotto strict-zero, RTE-E02 METERED
     irrappresentabile <L3, RTE-E03 ZERO_LOCAL deve essere LOOPBACK_ONLY) +
     resolveCostClass (default ZERO_LOCAL, MAI METERED: lezione S-17 nel tipo).
     SCOPING: superficie SEPARATA, NON tocca la consegna congelata di UJ-RUN-001 —
     non esportato da runtime/index.ts (hashato), test fuori da tests/contracts/,
     conteggio 140 invariato, 15 hash intatti a b2b32733. Anticipo M2/M3.
     La demo §21 ora usa questo contratto VERO per N2 (era [demo]). Restano 4
     sottosistemi demo-minimali: DEC, SEL, FBK, CNF.
     DIFETTO DELLA MIA DEMO trovato dalla demo: il passo 9 misurava i moduli CARICATI
     (process.moduleLoadList), non le CONNESSIONI aperte -> falso segnale (net caricato
     da Node internamente). Riscritto per intercettare i tentativi di connessione reali
     a host non-loopback. Un controllo di costo che passa perche' net non e' ancora
     caricato non e' un controllo.

  BF) 2026-08-19 — LA DEMO §21 GIRA. packages/contracts/demo/mission-demo.mjs
     Atto n.4 del mandato (PARTE 3-bis §4). 9 osservabili/9, 4 casi negativi/4, exit 0,
     costo zero. GIA' FATTO, NON RIFARE.
     ADDITIVA: NON chiude T-E2E-1/2/3 (restano DA IMPLEMENTARE nel blueprint), NON tocca
     i 15 artefatti hashati, NON cambia il conteggio 140. Vive ACCANTO alla consegna
     congelata di UJ-RUN-001, cosi' la review di Gemini non e' toccata. Verificato:
     suite 140, 15 hash intatti a b2b32733, blueprint non modificato.
     6 osservabili + 2 negativi usano i CONTRATTI VERI (checkSpawn, nextState,
     verifyLedgerChain, buildIdempotencyKey, AtomicActiveTaskCounter, mayStartNewStep);
     il resto e' logica [demo] perche' DEC/SEL/RTE/FBK/CNF non hanno ancora contratto.
     PROVATA FALSIFICABILE (trappola 21): rotto verifyLedgerChain nel dist -> passo 8
     fallisce, demo esce 1; ricompilato, torna a passare. Aggiunta al gate di integrazione.
     ATTO n.5 (gate) e n.4 (demo) del mandato ORA CONSEGNATI; restano 1/2/3 (bloccati
     dalle card di ChatGPT).

  BE) 2026-08-19 — VISTA AUTOREVOLE SU TUTTI I 29 FINDINGS: §30 della security review.
     Bilancio contato dalla tabella (non dedotto): 10 chiusi, 1 superato, 1 parziale,
     17 APERTI. Dei 17: S-16 -> GEMINI, S-06 -> Christian (policy), 15 -> GROK.
     S-29 (LOW): debate loop fail-open, ma la decisione E' consumata (bene). FIX-22.
     Ordine dei fix di Grok VERIFICATO in FIX_ORDER_ANALYSIS_20260819.md.
     La §20 (primi 20, "12 chiusi") e' superata da §30 dove divergono: §30 classifica
     S-08 come APERTO (FIX-9 copre un caso, le 2 evasioni note restano). Non e' una
     regressione, e' una classificazione piu' severa.
     CONTRAPPESO misurato: 90 tool promossi su 94 sono puliti (FIX-1 ha tenuto).

  BD) 2026-08-19 — S-28 (NUOVO, LOW) + CORREZIONE A UNA MIA AFFERMAZIONE DI OGGI.
     MAIN_IMPLEMENTATION_SECURITY_REVIEW.md §29 · GROK_FIX_LIST.md -> FIX-21
     GIA' FATTO, NON RIFARE. Ref: origin/main @ 27b7673.

     HO SCRITTO DUE VOLTE OGGI (§27 della review e TASKCLAUDE §82) che
     tools/websearch.py "e' ancora uno stub". E' FALSO: _ddg_search fa una VERA
     chiamata a html.duckduckgo.com (urllib.request.urlopen). Scoperto con uno scan
     di costrutti pericolosi su tutti i 94 tool. Corretto nei due punti.
     Nel registry e' ancora "Search the web (stub)" e, per il default
     ToolSpec.safe=True, e' safe=True: un EXTERNAL_READ di rete etichettato safe.

     IMPATTO LIMITATO, misurato: host fisso (nessun SSRF, la query va solo nel
     parametro ?q=); l'output NON raggiunge remember() (va solo a cmd_search che
     stampa). Quindi la conclusione di S-16 §27 REGGE — il contenuto web non entra in
     memoria — MA NON PER LA RAGIONE CHE AVEVO SCRITTO (non "e' uno stub", ma "il
     cablaggio search->remember non esiste"). La conclusione non dipendeva dalla
     premessa sbagliata, ma la premessa era falsa e va corretta.

     RISULTATO POSITIVO DELLO SCAN, che vale quanto il finding: 90 tool promossi su 94
     non hanno UN SOLO costrutto pericoloso. Gli altri 4: automation/os_control
     (subprocess, stub noti S-06), validate_helpers (re.compile, falso positivo),
     websearch (questo). PROVA PRATICA che il gate di promozione (FIX-1) non ha mai
     lasciato passare codice dannoso nel catalogo.

     FIX-21 (LOW): togliere "(stub)" dalla descrizione, safe=False perche' e' rete.

  BC) 2026-08-19 — S-27 (NUOVO, MEDIUM): l'iniezione prompt -> codice generato e'
     contenuta SOLO PER CASO.
     MAIN_IMPLEMENTATION_SECURITY_REVIEW.md §28 · GROK_FIX_LIST.md -> FIX-20
     docs/threat-models/probes/S-27-template-injection-probe.py
     GIA' FATTO, NON RIFARE. Ref: origin/main @ 27b7673.

     nt_runner.py:187-197 incastona il PROMPT GREZZO nella docstring del modulo
     generato, che execute_graph poi ESEGUE (S-26). Tre payload costruiti: NESSUNO
     compila, ma per TRE ACCIDENTI SINTATTICI diversi, non per un controllo:
       - triple-quote sbilanciato -> stringa non terminata (come S-13);
       - triple-quote bilanciato -> `from __future__` deve stare in cima, rompe il
         codice iniettato prima. MA E' LI' PER LE TYPE HINT, non per sicurezza;
       - iniezione via title -> il `return` con {title} si spezza.
     Quarta volta che il contenimento e' un accidente di sintassi (dopo S-13, moduli
     mancanti, openai assente); tre di quei quattro hanno gia' smesso di proteggere.
     Si somma a S-26: oggi l'unica cosa che ferma un prompt ostile e' che il file
     generato non compili per caso.
     CORREZIONE FIX-20: interpolare con repr() invece che grezzo (ogni triple-quote
     diventa testo inerte), o scrivere il prompt in prompt.txt accanto. FIX-19a resta
     la rete a valle per il ramo UJ_WRITER_LLM.
     HO SCRITTO CONTRO LA MIA CONCLUSIONE: "non escludo che una quarta forma bilanci
     tutti gli accidenti". Tre attacchi caduti non provano "e' sicuro"; il punto e'
     che la tenuta dipende da accidenti, e quello si vede a prescindere dagli attacchi.

  BB) 2026-08-19 — S-16 TERZA VERIFICA: IL CONSUMATORE E' ARRIVATO, ma non e' il
     percorso del codice. VA A GEMINI (UJ-MEM-001), NON A GROK.
     MAIN_IMPLEMENTATION_SECURITY_REVIEW.md §27 · TASKCLAUDE.md §82
     GIA' FATTO, NON RIFARE. Ref: origin/main @ 27b7673.

     CORREGGE la mia nota di sessione 3 ("il percorso non e' cablato") e quella di
     sessione 5 ("meta' della catena"). Adesso:
       core/nt_runner.py:135-138   SCRIVE  remember("job:... title=... status=...")
       core/planner.py:152-167     LEGGE   recall_semantic(tag="job") e inserisce i
                                           fatti VERBATIM nelle milestone del piano
     Misurato: la milestone prodotta contiene il fatto seminato, e finisce in plan.md.

     MA NON ARRIVA AL CODICE, e la differenza e' tutta la gravita'. Il messaggio che
     il writer LLM manda al modello e', alla lettera:
       user = f"Task title: {title}\nTask prompt:\n{prompt.strip()[:1500]}..."
     SOLO title e prompt. Zero occorrenze di 'milestone'/'to_markdown' nella
     funzione, e il title NON e' influenzato dalla memoria (misurato).
     Catena chiusa: memoria -> plan.md (documento umano). Catena memoria -> codice
     generato: APERTA.

     PROPRIETA' MITIGANTE trovata sbagliando: la prima misura diceva che il fatto non
     entrava. Non era la catena — recall_semantic(min_score=0.05) e il fallback sui
     token del prompt FILTRANO PER RILEVANZA. Un fatto non finisce in un piano
     qualsiasi, solo in uno il cui prompt gli somiglia.

     >>> SERVE DA GEMINI, nello schema di UJ-MEM-001: (1) campo di provenienza
     obbligatorio; (2) regola su chi puo' essere richiamato in un contesto di
     decisione (oggi basta il tag "job", e `uj memory add --tag job` accetta tag
     arbitrari); (3) inserimento nel piano CITATO COME DATO, non concatenato.
     LA FINESTRA E' APERTA ADESSO: il consumatore e' arrivato prima dello scrittore
     non fidato, quindi lo schema si corregge a costo quasi nullo.
     tools/websearch.py e' ancora uno STUB e non ha percorsi verso remember().

  BA) 2026-08-19 — ORDINE DELLE DIECI CORREZIONI VERIFICATO. DUE POSIZIONI ERANO
     SBAGLIATE, ED ERANO MIE.
     docs/threat-models/FIX_ORDER_ANALYSIS_20260819.md · ordine corretto in cima a
     GROK_FIX_LIST.md · TASKCLAUDE.md §81.  GIA' FATTO, NON RIFARE.

     1. FIX-11 VA IN SECONDA POSIZIONE, non in fondo. E' cio' che impedisce alla test
        suite di sovrascrivere grok.md (S-18). Finche' non e' applicato, QUALUNQUE
        verifica che esegua pytest corrompe il repository — inclusa quella di FIX-16,
        per cui ho proposto IO un test nuovo. Riverificato: `root` nei __kwdefaults__
        e' legato alla DEFINIZIONE, il monkeypatch della fixture e' un no-op.
     2. FIX-17b E' CONDIZIONATO ALLA FORMA DI FIX-10. Dice di spostare
        record_llm_call() dentro _call_openai, ma la correzione approvata per S-17
        RIMUOVE quell'adapter. Misurato: _call_openai = 2 su main, 0 sui rami
        strict-zero e 0 sul ramo CLAUDE. Dopo FIX-10 il bersaglio si sposta su
        _call_local, e cambia la ragione: il retry sottostima l'USO, non la SPESA.

     CONFERMA COLLATERALE, ora un numero e non un ricordo: il ramo CLAUDE e' l'UNICO
     con _call_openai assente (0) E record_llm_call presente (4). E' quello da
     portare su main; i due rami strict-zero hanno una base che precede embed().

     ORDINE CORRETTO:
       1 FIX-19 · 2 FIX-11 · 3 FIX-10+FIX-13+FIX-17 (un passaggio solo) ·
       4 FIX-15 poi FIX-16 · 5 FIX-18 · 6 FIX-12 · 7 FIX-14
     INDIPENDENTI (non serializzarle): FIX-19/FIX-15, FIX-12/FIX-14, FIX-16/FIX-19,
     FIX-18 isolato.

     CONTROLLO CON ESITO NEGATIVO, registrato di proposito: sospettavo che il
     contenuto di una skill finisse nel codice generato (sarebbe stato TH-SF-03 nel
     codice di un altro). E' FALSO: nt_helpers.py:62-67 chiama _skills_hint(prompt) e
     SCARTA il valore di ritorno. Ma la chiamata mostra l'intenzione: quando qualcuno
     la collega, add_skill non valida `content` in nessun modo -> vincolarlo PRIMA
     del cablaggio, come S-16. Di contorno: e' anche lavoro sprecato (scansione
     completa del catalogo buttata via a ogni job euristico) e DEFAULT_SKILLS_PATH e'
     la TERZA occorrenza del path relativo dopo monetization e billing.

  AZ) 2026-08-19 — S-26 (NUOVO, HIGH): il gate di safety e' sulla COPIA, non
     sull'ESECUZIONE. E' la correzione da far applicare PER PRIMA.
     MAIN_IMPLEMENTATION_SECURITY_REVIEW.md §26 · GROK_FIX_LIST.md -> FIX-19
     docs/threat-models/probes/S-26-graph-exec-probe.py
     GIA' FATTO, NON RIFARE. Ref: origin/main @ 27b7673.

     promote_job_to_tools ha un gate e FUNZIONA (FIX-1, verificato). Ma quella
     funzione COPIA un file; core/graph_exec.execute_graph lo ESEGUE, e li' il gate
     non c'e': ZERO occorrenze di scan_text o safety in tutto il file.
       nt_helpers.py:48-53  genera (corpo writer LLM, con UJ_WRITER_LLM=1)  -> SI
       nt_runner.py:250     COPIA in tools/                                 -> SI
       graph_exec.py:64     ESEGUE (spec.loader.exec_module)                -> NO
     MISURATO: un modulo con `eval(` e `rm -rf` — due pattern che il LORO scanner
     riconosce — viene caricato ed eseguito. Interrogando scan_text sullo stesso
     testo: ['rm -rf', 'eval(']. IL GATE ESISTE, E' SOLO ASSENTE DAL PERCORSO.
     E il codice a livello di modulo gira dentro exec_module, PRIMA che run() venga
     chiamata: controllare run() non basterebbe.

     RAGGIUNGIBILE IN DUE MODI, uno automatico:
       uj_cli.py:57       sottocomando `graph` con una DIRECTORY ARBITRARIA
       nt_runner.py:61-64 chiamato a OGNI job multi-file

     PIU' DUE DIFETTI SULLO STESSO FILE:
       - PATH TRAVERSAL da deps.json: il filtro guarda solo il suffisso, quindi
         "../fuori.py" passa. Misurato: modulo FUORI dalla job dir eseguito.
         Stesso schema di S-22.
       - sys.path.insert(0, job_dir) e sys.modules[stem]=mod restano sporchi: un
         registry.py generato prenderebbe il posto di quello vero per ogni import
         successivo nello stesso processo.

     HO SCRITTO CONTRO LA MIA STESSA CORREZIONE: FIX-19a e' una riga e chiude il
     caso peggiore, ma e' NECESSARIA E NON SUFFICIENTE — S-08 dice che lo scanner
     ha evasioni note (2 su 4 nel test di sessione 3). Senza quel limite Grok
     crederebbe di aver chiuso il problema.

  AY) 2026-08-19 — S-25 (NUOVO, HIGH latente): il webhook di pagamento ISPEZIONA
     la firma invece di verificarla.
     MAIN_IMPLEMENTATION_SECURITY_REVIEW.md §25 · GROK_FIX_LIST.md -> FIX-18
     docs/threat-models/probes/S-25-billing-webhook-probe.py  (nessuna chiamata a Stripe)
     GIA' FATTO, NON RIFARE. Ref: origin/main @ 27b7673.

     core/billing.py:102-105. Il segreto e' letto e MAI usato in un calcolo: `hmac`
     compare ZERO volte nel file, `secret` compare a due sole righe. La condizione e'
     `and`, quindi basta uno dei due marcatori. E se sig_header e' vuoto il controllo
     e' saltato del tutto.
     MISURATO, con segreto configurato e payload che chiede il tier `team`:
       nessun header          -> ACCETTATO, tier team
       "t=1"                  -> ACCETTATO, tier team
       "t=...,v1=000...0"     -> ACCETTATO, tier team
       "ciao"                 -> rifiutato
     L'UNICO CASO RESPINTO E' QUELLO MALFORMATO: e' un controllo di SINTASSI
     travestito da controllo di AUTENTICITA'. Dodicesima occorrenza della forma, la
     prima su un percorso di pagamento.

     LATENTE, e va detto: `suggested_env` NON e' consumato da nessuno (git grep: una
     sola occorrenza, la sua produzione) e handle_webhook non ha chiamanti fuori dai
     test. Ma UJ_TIER e' cio' che monetization.current_tier() legge per i limiti
     (free 10 chiamate LLM, team 20.000): un webhook falso e' una richiesta di
     promozione di quota. Con un endpoint HTTP diventa REMOTO E NON AUTENTICATO senza
     nessun'altra modifica al file.

     >>> LA TRAPPOLA DELLA CORREZIONE, scritta in testa a FIX-18: la firma di Stripe
     e' calcolata sui BYTE GREZZI del corpo, e handle_webhook riceve un dizionario
     GIA' INTERPRETATO. Riserializzarlo non da' gli stessi byte, quindi qualunque HMAC
     calcolato da li' NON COINCIDERA' MAI e sembrera' che la firma sia sbagliata
     invece che l'input. SERVE UN CAMBIO DI INTERFACCIA (corpo grezzo, interpretato
     DOPO la verifica) piu' la tolleranza sul timestamp contro il replay e
     hmac.compare_digest. Terza coppia "versione facile prima = sembra corretta e non
     lo e'" dopo S-12/S-13 e FIX-15/FIX-16.

     Tre rilievi minori sullo stesso file: create_customer verso Stripe NON ha
     idempotency key (viola ADM-13); la sola presenza di una chiave `sk_` abilita la
     chiamata reale (stessa asimmetria di FIX-10); DEFAULT_CUSTOMERS/DEFAULT_EVENTS
     sono path RELATIVI e seguono la cwd (come FIX-17d).

  AX) 2026-08-19 — S-24 (NUOVO, HIGH): il contatore della spesa e' spento per default.
     MAIN_IMPLEMENTATION_SECURITY_REVIEW.md §24 · GROK_FIX_LIST.md -> FIX-17
     docs/threat-models/probes/S-24-quota-meter-probe.py  (nessuna chiamata di rete)
     GIA' FATTO, NON RIFARE. Ref: origin/main @ 27b7673.

     core/monetization.py (139 righe) non era mai stato revisionato. CINQUE difetti:
      1. LE DUE QUOTE SONO SPENTE PER DEFAULT: check_job_quota/check_llm_quota
         escono subito se UJ_ENFORCE_QUOTA != "1". Misurato: 50 chiamate contro un
         limite di 10 -> nessuna eccezione. Con UJ_ENFORCE_QUOTA=1 solleva: IL
         CODICE DEL CONTROLLO FUNZIONA, E' IL DEFAULT A ESSERE SPENTO.
      2. ANCHE IL TETTO E' SPENTO: UJ_LLM_BUDGET_USD default "0", e ok e'
         "soft_cap <= 0 or spent < soft_cap" -> sempre vero. Misurato: 10.000
         chiamate, $10 stimati, assert_llm_budget() non solleva.
      3. IL CONTATORE MISURA 1 DOVE IL PROVIDER FATTURA 3: ask_cloud_ai chiama
         record_llm_call() una volta e poi dispaccia a _call_openai, che porta
         @retry(max_attempts=3). E' FIX-10c dal lato della misura.
      4. CHECK-THEN-ACT NON ATOMICO: summarize_usage() rilegge tutto il file, poi
         record_usage() appende. 8 thread con barriera, limite 10, precarico 9 (ne
         dovrebbe passare UNO): [1,3,8,6,4] a registro vuoto, [4,5,6,4,5] con 5.000
         righe, [8,8,8,6,8] con 20.000. E' R-RUN-01 in un posto nuovo: il contratto
         corretto e' GIA' in packages/contracts/src/recovery/active-task-counter.ts.
      5. DEFAULT_USAGE_PATH E' RELATIVO ("workspace/usage.jsonl"): segue la cwd.
         Misurato: la stessa quota scatta da una cartella e non da un'altra.
         job_worker usa gia' un path ancorato al modulo; monetization e' l'unico
         modulo di stato che non lo fa, ed e' quello che conta i soldi.
      (+ spent_usd_est e' chiamate x una costante scritta a mano, non token.)

     IL PUNTO CHE CONTA: il rubinetto e' APERTO per default (S-17/FIX-10) e il
     contatore e' SPENTO per default. Per questo FIX-17 sta nel PRIMO gruppo con
     FIX-10: applicarne uno solo lascia il sistema o senza tetto o senza misura.

     DUE VOLTE LA MISURA MI HA SMENTITO, e la prima nella direzione peggiore:
      - la prima sonda lanciava 8 PROCESSI: l'avvio dell'interprete li serializzava
        e passava esattamente UNO, cioe' il numero GIUSTO PER IL MOTIVO SBAGLIATO.
        Fermandomi li' avrei scritto a Grok che il contatore va bene. Rifatta con
        thread + threading.Barrier, la gara si manifesta subito;
      - avevo previsto che l'ampiezza crescesse con la lunghezza del registro. Il
        primo esperimento sembrava confermarlo ma variava ANCHE il tier, quindi il
        limite: "8 ammessi su 8" era spazio libero, non una gara. Isolata la
        variabile, l'andamento NON e' monotono. Scritto cosi' nel documento invece
        di tenere la versione che raccontava meglio.

     NON e' una vulnerabilita' (nessun terzo la sfrutta) e oggi non si spende
     comunque perche' `import openai` fallisce: contenimento PER ASSENZA, quinta
     volta in questo albero, non una difesa.

  AW) 2026-08-19 — QUATTRO REVIEW CONSEGNATE, TRE BLOCCATE DALLA STESSA RIGA.
     docs/program/reviews/CLAUDE-REVIEW-IMPORTABILITY-AUDIT-20260819.md
     scripts/audit-review-importability.mjs   (riproduce tutto con un comando)
     GIA' FATTO, NON RIFARE. Regole del gate: origin/main @ 27b7673.

     GROK E CHATGPT HANNO CONSEGNATO. Rami nuovi del 19:
       agent/uj-ggl-001-grok-review-20260819       GROK su GEMINI  PASS_WITH_ACTIONS
       agent/uj-int-001-grok-review-20260819       GROK su CHATGPT PASS_WITH_ACTIONS
       agent/uj-red-001-chatgpt-review-20260819-r2 CHATGPT su GROK FAIL
       agent/uj-red-001-grok-review-20260819       consegna di GROK, UJ-RED-001

     MISURATO, errori residui con regole correnti e artefatti presenti:
       UJ-GGL-001  READY   1  <- SOLO il deadlock del ledger
       UJ-RED-001  READY   1  <- SOLO il deadlock. E LA REVIEW E' DI CHATGPT:
                                 il supervisore e' bloccato dal proprio gate
       UJ-CAP-001  READY   1  <- SOLO il deadlock (la mia)
       UJ-INT-001  REVIEW  5  <- riparabili da GROK, vedi sotto
       UJ-INT-006  REVIEW  0  <- CONTROLLO POSITIVO, PASS exit 0

     UJ-INT-001 E' L'UNICO TASK GIA' IN REVIEW, quindi l'unica review che puo'
     importare oggi. I suoi 5 errori sono 3 difetti:
       (a) artifacts_reviewed[3] e [4] hanno hash a 40 caratteri: sono ID DI BLOB
           GIT (git rev-parse <ref>:<path>), non sha256. VERIFICATO provando le
           convenzioni prima di accusare. Gli altri 3 hash coincidono al pin E su
           main: LA REVIEW E' GENUINA, gli artefatti NON sono manomessi;
       (b) criteria[2].result = PASS_WITH_ACTIONS, ma lo schema per criterio
           ammette solo PASS/FAIL/NOT_REVIEWED. E' valido solo come `outcome`;
       (c) il suo F-001 sui 12 hash delle card E' GIA' CHIUSO e non e' colpa sua:
           pinna 4b63b94e, due commit indietro, e i due mancanti sono 6ba3a2b e
           27b7673, cioe' proprio la correzione.

     CONTROLLO POSITIVO rieseguito, non ricordato: UJ-INT-006 importa a EXIT 0. IL
     MACCHINARIO FUNZIONA. Non c'e' niente da riscrivere: mancano le precondizioni.
     Riverificato al ref corrente: in tutto scripts/ l'unica writeFileSync sta in
     test-review-result-intake.mjs:105 e scrive in una mkdtempSync. NESSUNO SCRIPT
     SCRIVE docs/program/BACKLOG.json.

     >>> SERVE DA CHATGPT, ed e' la stessa richiesta di AJ ma ora con la misura:
     (1) ponte: portare a mano i tre task in REVIEW -> le tre review importano;
     (2) strutturale: uno script che APPLICA un ResponsePacket valido.
     Raccomando la 2 con la 1 come ponte. NON l'ho fatto io: BACKLOG.json e' suo.
     Resta aperto anche il difetto n.3 della §63 di TASKCLAUDE: riga 357,
     verifyReviewedArtifact legge ancora dall'ALBERO DI LAVORO. sha256AtRef copre
     le CARD (riga 89), non le REVIEW (E35/trappola 35: non estendere un fix).

     DUE ERRORI MIEI IN QUESTA MISURA, entrambi fermati prima del documento:
       1. TRAPPOLA 15 PER LA TERZA VOLTA: `... | sed 's/^/   /'` fra il comando e
          $? -> ho letto exit=0 su un FAIL. Non esiste una pipe "solo cosmetica".
       2. CONTAMINAZIONE MIA: `git checkout <pin> -- docs/` riporta indietro
          docs/program/BACKLOG.json (da 5 a 2 criteri) e fa comparire tre
          "unknown criterion" che NON sono difetti della review. Portare dentro
          SOLO i path citati. L'avvertenza e' dentro lo script, in testa.
       3. E il controllo positivo ha trovato un falso positivo del mio script: su
          PASS il validatore stampa righe informative che iniziano con "- ", e le
          contavo come errori -> il controllo risultava FALLITO. Un controllo
          positivo non serve solo a rendere falsificabile la diagnosi: serve a
          falsificare LO STRUMENTO con cui la stai misurando.

  AV) 2026-08-19 — S-22 e S-23 (NUOVI): la stessa parola, due contratti opposti.
     MAIN_IMPLEMENTATION_SECURITY_REVIEW.md §22 e §23
     GROK_FIX_LIST.md -> FIX-15 (HIGH) e FIX-16 (MEDIUM)
     docs/threat-models/probes/S-22-uncontained-write-probe.py
     docs/threat-models/probes/S-23-protected-staleness-probe.py

     S-22 — DUE funzioni si chiamano safe_write:
       core/reliability.py:46  -> NESSUNA root, NESSUN PROTECTED
       tools/files.py:88       -> root + PROTECTED (indurita da FIX-3/FIX-4)
     Il percorso di build usa la PRIMA, importata come `guarded_write` in
     core/nt_runner.py:13 e core/nt_helpers.py:7. 12 punti di scrittura (11+1),
     fra cui tool.py, il file che promote_job_to_tools copia poi in tools/.
     E nello STESSO file, riga 242, e' gia' importata quella giusta dentro la
     promozione: la promozione e' protetta, la costruzione no.
     ATTENZIONE, NON CORREGGERE LA COSA SBAGLIATA: slugify E' SICURO
     (core/utils.py:10, re.sub(r"[^a-z0-9]+","_") distrugge / \ . e ..).
     Il ramo aperto e' l'altro: `if output_dir: job_dir = Path(output_dir)`.
     CATENA MISURATA: bin/uj (9 sottocomandi) e uj_cli.py NON espongono
     output_dir, ma job_worker.enqueue lo accetta, lo scrive in
     workspace/queue.jsonl, e la riga 61 lo inoltra grezzo. queue.jsonl NON e'
     in PROTECTED ed e' dentro la root -> una scrittura che il gate APPROVA
     deposita un output_dir che il build usa SENZA gate.
     NON sfruttabile dalla CLI oggi. NON ho eseguito process_one() end-to-end:
     ho misurato le tre parti separatamente e LETTO la riga che inoltra.

     S-23 — PROTECTED nomina il posto in cui il codice STAVA.
     core/natural_tasks.py e' PROTETTO ed e' un guscio di re-export di 26 righe.
     La logica sta in nt_pipeline.py (27), nt_runner.py (311), nt_helpers.py
     (133): NESSUNO dei tre e' protetto, e nt_runner.py contiene
     promote_job_to_tools, cioe' il gate di FIX-1.
     Misurato: core/registry.py RIFIUTATO, core/nt_runner.py ACCETTATO e
     riscritto. Copertura: 23 moduli core/, 2483 righe; protetti 4, 418 righe.
     Il codice di FIX-1 e FIX-4 e' INTATTO: e' invecchiato l'INSIEME su cui
     operano. Decima occorrenza della forma "un controllo che sembra un
     controllo", la prima in cui a invecchiare e' l'insieme e non il controllo.

     ORDINE: FIX-15 PRIMA di FIX-16. PROTECTED e' controllata solo dalla
     safe_write di tools/files.py: finche' il build usa l'altra, allungare la
     lista NON cambia niente su quel percorso e sembra che il buco sia chiuso.
     Terza coppia di questo tipo dopo S-12/S-13 e FIX-10/writer adapter.

     ERRORE MIO CORRETTO PRIMA DEL COMMIT: avevo scritto la correzione FIX-15a
     chiamando `_resolve_within_root`, funzione CHE NON ESISTE — dedotta dal
     comportamento invece di aprire il file. I nomi veri sono _resolve (riga 36)
     e _is_protected (riga 46). Verificato anche che tools/files.py non importi
     nulla da core/, quindi l'import suggerito non crea un ciclo.

  AU) 2026-08-19 — S-21 (NUOVO, MEDIUM latente): PRIVILEGED_KWARGS e' una denylist.
     MAIN_IMPLEMENTATION_SECURITY_REVIEW.md §21 · GROK_FIX_LIST.md -> FIX-14
     Trovato cercando difetti NUOVI nelle 2.171 righe arrivate su main dopo la
     sessione 4 (multi_file, nt_runner, uj_cli, monetization, tools/).
     core/registry.py:183 blocca solo {"force","root"}. CINQUE funzioni prendono
     real=, che scavalca UJ_OS_REAL/UJ_AUTO_REAL: os.open_app (lancia processi,
     "terminal" e' nell'allowlist), os.set_volume, automation.type_text (xdotool),
     automation.paste_text, browser.open_url.
     OGGI NON E' SFRUTTABILE, verificato eseguendo: tutte e cinque sono
     safe=False e FIX-7 rifiuta prima del kwarg. Enumerati 135 tool: nessun
     safe=True accetta un kwarg privilegiato non filtrato.
     MA IL CONTENIMENTO E' 'safe', NON IL FILTRO. Marcare safe=True UNA sola
     delle cinque rende il bypass vivo senza altre modifiche. Quinta volta che
     il contenimento reale differisce dal controllo che sembra fornirlo.
     CORREZIONE: allowlist per tool (forwardable_kwargs nella ToolSpec).
     Stopgap in una riga: aggiungere "real" alla denylist.
     ATTENZIONE, settimo falso negativo della giornata: la prima sonda ha
     stampato zero righe e "NESSUNO" perche' cercava r.names()/reg.TOOLS, che
     non esistono — il registry espone _tools. Zero tool esaminati non e'
     "nessun tool a rischio". La sonda ora stampa QUANTI ne ha enumerati prima
     di qualunque conclusione.

  AT) 2026-08-19 — ADM-11 E' CHIUSA. COPERTURA 41 SU 41. NON RIAPRIRLA.
     Il punto AS qui sotto dice "chiudere ADM-11 dopo la review di UJ-RUN-001".
     E' GIA' FATTO, e senza aspettare, perche' il vincolo era "non cambiare il
     conteggio", non "non toccare il file".
     COME: esercitata dentro un test che esiste gia' — "a hopeless tool reports
     every failure, not just the first" — togliendo version e manifestHash al
     manifest ostile e aggiungendo ADM-11 all'insieme atteso. E' il posto
     naturale: quel test elenca tutte le regole che un manifest indifendibile
     viola, e ADM-11 mancava dall'elenco.
     VERIFICATO: file 30, suite 140, INVARIATI. I 15 hash di UJ-RUN-001 15/15
     intatti. Copertura 41/41. E il test FALLISCE senza la regola: rimossa dal
     dist -> 29 pass 1 fail "expected ADM-11 to be reported"; ripristinata ->
     30 pass 0 fail.
     LEZIONE: avevo scritto tre volte in tre documenti che andava rinviata. Era
     la conclusione sbagliata da un vincolo giusto. Un rinvio motivato bene si
     trasforma in un rinvio non riesaminato, perche' la motivazione regge ancora.

  >>> SUPERATO IN PARTE DAL PUNTO AT: ADM-11 e' CHIUSA, copertura 41/41.
  >>> Ignora l'istruzione "chiudere dopo la review di UJ-RUN-001": e' gia' fatto.
  AS) 2026-08-19 — AUDIT DI COPERTURA DEI MIEI CONTRATTI. UN BUCO SU 41.
     docs/program/reviews/CLAUDE-CONTRACTS-RULE-COVERAGE-20260819.md
     docs/threat-models/probes/contracts-rule-coverage.py
     41 regole su 4 famiglie: OV 10/10/10, ADM 18/18/17, SF 10/10/10,
     SF-PIPE 3/3/3. UNICO BUCO: ADM-11, implementata e mai testata.
     NON CHIUDERLO ADESSO: la suite passerebbe da 140 a 141 e "140" compare 9
     volte nell'handoff e 5 nel blueprint di UJ-RUN-001, congelati e in review.
     >>> CHIUDERE ADM-11 SUBITO DOPO la review di UJ-RUN-001.
     ATTENZIONE, falso positivo della sonda gia' corretto: TH-SF-* e TH-* NON
     sono insiemi di regole, sono MODELLI DI MINACCIA. Le mitigazioni hanno ID
     propri e la tracciabilita' sta nella colonna "Controlli" di una TABELLA,
     non nei nomi dei test. Contarli come "regole senza test" da' un allarme
     falso: la prima esecuzione diceva "10 minacce scoperte". L'avvertenza e'
     dentro la sonda.

  AR) 2026-08-19 — PERCORSO CRITICO MISURATO. E UJ-SEC-001 NON E' IL PRIMO.
     docs/program/CRITICAL_PATH_20260819.md
     STATO: 43 task, 340 unita', 26 ACCETTATE (7,6%). Tutte e 26 sono task meta
     di ChatGPT (META-001 21/21, META-002 5/8). ZERO unita' di lavoro
     specialistico accettate, da nessuno dei quattro. Il mio resta 0/76.
     CORREZIONE: il peso totale e' 340, NON 311 come dice la memoria di
     sessione 1. La baseline e' cresciuta di 29 unita'.
     QUANTO SBLOCCA CIASCUNO (dipendenti diretti oggi BLOCKED):
       UJ-CAP-001  rev CLAUDE   -> 55   <-- il piu' redditizio, ma oggi e' FAIL
       UJ-RUN-001  rev GEMINI   -> 34   <-- miglior LEVA PER GIRO
       UJ-GGL-001  rev GROK     -> 29
       UJ-RED-001  rev CHATGPT  -> 29
       UJ-INT-001  rev GROK     -> 23
       UJ-SEC-001  rev GROK     -> 21   <-- l'ULTIMO dei sei
     ERRORE MIO CORRETTO: stamattina avevo scritto a Grok in TASKCLAUDE §68 che
     UJ-SEC-001 era "la cosa con piu' leva che puoi fare oggi". FALSO. Resta
     vero che e' la chiave di volta DEL MIO PORTAFOGLIO. §68 corretta sul posto.
     RACCOMANDAZIONE: i primi TRE atti usano tre reviewer DIVERSI e partono
     insieme — RUN-001 a Gemini, RED-001 a ChatGPT, SEC-001 a Grok = 84 unita'
     con tre inoltri.
     CAVEAT IN GRASSETTO: nulla applica una transizione proposta. Con tutte e sei
     le review consegnate domani il contatore resterebbe 26/340. L'anello va
     PRIMA delle review.

  AQ) 2026-08-19 — CORREZIONE: SONO SETTE SU OTTO, NON OTTO. E DUE FATTI NUOVI.
     Il punto AP qui sotto e il commit fbe9bf9 dicono "tutti e otto". ERA FALSO:
     erano SEI. L'ho scoperto verificando la mia stessa affermazione subito dopo
     averla scritta. E' la trappola 24 commessa nel giorno in cui l'ho corretta
     a Gemini, a ChatGPT e a me stesso quattro volte.
     ORA SONO SETTE: aggiunto docs/program/packets/UJ-REV-001-AC-EVIDENCE.md.
     L'OTTAVO NON PUO' AVERNE UNO: UJ-REV-002 non ha artefatti.
     CORREZIONE 2: UJ-REV-002 e' DEFERRED a M10, NON BLOCKED come dice la mia
     memoria. Diverso: non aspetta una dipendenza, e' programmato per dopo.
     Stessa cosa per UJ-INT-007 (DEFERRED M10, dip UJ-MCP-001 + UJ-SKL-001).
     CHIUSURA DI UJ-SEC-001, misurata attraversando il grafo:
       UJ-SEC-001 (READY,13) -> UJ-SKL-001 (13) -> UJ-INT-007 (13) -> UJ-REV-002 (8)
                                              \-> UJ-INJ-001 (13, GROK)
                             -> UJ-MCP-001 (8)
       5 task a valle, 55 unita', 3 portafogli. MA IL NUMERO GIUSTO E' 21:
       accettarlo sblocca SUBITO solo SKL(13)+MCP(8); le altre 34 sono DEFERRED
       a M10 e non dipendono solo da lui. Scrivo la cifra precisa perche' avevo
       appena sbagliato un conteggio.

  >>> SUPERATO DAL PUNTO AQ: erano SEI, non otto. Ora sono SETTE, e l'ottavo
  >>> non puo' averne uno perche' non ha artefatti. Il titolo qui sotto e' FALSO.
  AP) 2026-08-19 — TUTTI E OTTO I MIEI TASK HANNO UN PACCHETTO. NON RIFARE.
     docs/program/packets/UJ-MCP-001-AC-EVIDENCE.md
     docs/program/packets/UJ-RCV-001-AC-EVIDENCE.md
     docs/program/packets/UJ-SKL-001-AC-EVIDENCE.md
     I tre sono BLOCKED (MCP e SKL su UJ-SEC-001, RCV su UJ-RUN-001) quindi non
     possono avere card ne' packet. Il blocco e' sul LEDGER, non sull'artefatto:
     quando la dipendenza si accetta, il reviewer parte da materiale pronto.
     DIFETTO MIO TROVATO CONTANDO, non segnalato da nessuno:
       ADM-* nel documento 18, nel codice 18, NEI TEST 17.
       ADM-11 (versione e hash pinnati) e' implementata a tool-manifest.ts:277
       e NON HA UN TEST.
     ATTENZIONE: la colonna "Blocca?" di TOOL_PLANE.md dice "si'" per ADM-11 ma
     significa "blocca l'ammissione", NON "e' testata". Il documento non
     sopravvaluta. Controllato prima di scriverlo.
     NON L'HO CHIUSO, ED E' UNA DECISIONE DI SEQUENZA: tool-admission.test.mjs
     non e' fra i 15 artefatti hashati, ma la suite passerebbe da 140 a 141 e
     "140" compare 9 volte nell'handoff e 5 nel blueprint di UJ-RUN-001, en-
     trambi congelati e IN REVIEW presso Gemini. Costringerebbe a un settimo
     giro. >>> CHIUDERE ADM-11 DOPO la review di UJ-RUN-001.

  AO) 2026-08-19 — UJ-CLD-001 CONSEGNATO CON LE FONTI RIAPERTE. NON RIFARE.
     docs/program/packets/UJ-CLD-001-AC-EVIDENCE.md
     READY, 8 punti, nessun blocker, reviewer GEMINI.
     LE DUE CITAZIONI DECISIVE SONO STATE RIVERIFICATE IL 19, non citate a
     memoria: entrambe CONFERMATE VERBATIM. La §6 del mio artefatto dice che le
     fonti si spostano in tempo reale, e l'artefatto e' datato 17: consegnarlo
     senza riaprirle sarebbe stato il difetto che contesto agli altri.
     GUADAGNATO nella riverifica: la data di efficacia dei termini consumer,
     October 8 2025 — l'artefatto non la registrava.
     TRE COSE NUOVE ALLA FONTE, tutte a favore della conclusione:
       1. Managed Agents e' una QUINTA superficie, a chiave API. LA MIA MATRICE
          NE COPRE QUATTRO: lacuna che dichiaro io, lavoro residuo. NON l'ho
          aggiunta perche' modificherebbe un artefatto in attesa di review.
       2. l'Agent SDK e' governato dai Commercial ToS anche quando alimenta
          prodotti per i propri clienti;
       3. "Claude Code" e "Claude Code Agent" NON sono nomi permessi per un
          prodotto di terzi.
     COSA DEVE ATTACCARE GEMINI (§5): non i conteggi, ma la conclusione che per
     Claude HUMAN_BRIDGE e' la modalita' DEFINITIVA. Se esiste un percorso
     automatico a costo zero che non ho visto, cambia il piano del programma.
     Nessun ResponsePacket: card_id obbligatorio, card assente (punto AM).

  AN) 2026-08-19 — UJ-SEC-001 E' ORA REVISIONABILE. GIA' FATTO, NON RIFARE.
     docs/program/packets/UJ-SEC-001-AC-EVIDENCE.md
     prompts/handoffs/CLAUDE-SEC-001-DELIVERY-20260819.md
     E' LA CHIAVE DI VOLTA: READY, nessuna dipendenza, nessun blocker, reviewer
     GROK. UJ-MCP-001 (8) e UJ-SKL-001 (13) sono BLOCKED su di lui: accettarlo
     sblocca 21 unita' gia' consegnate oltre alle sue 13. E' anche uno dei tre
     task dell'innesco B'.
     Il difetto era che NESSUNO POTEVA REVISIONARLO: sei artefatti su main da
     giorni, 1709 righe, e nessun pacchetto di consegna.
     NUMERI, ogni comando ESEGUITO e non solo scritto:
       19/19 minacce con S/P/R, Vettore, Impatto, Controlli, Residuo, Owner
       severita': 6 CRITICA, 8 ALTA, 5 MEDIA
       regole OV-*: 10 nel documento, 10 nel codice, 10 nei test
       approval-policy.test.mjs: 28 pass, 0 fail
       difese §17: 9 progettate, 3 parziali, 3 assenti
       critica: 3 lacune, 12 articoli, 12 proposte
     DUE CORREZIONI A DATI MIEI:
       - le difese sono 9/3/3, NON 8/3/4 come dice CLAUDE.md sessione 2;
       - contando le minacce con la riga di severita' ottenevo 1 SU 19 e ho
         creduto per un attimo che il mio threat model fosse vuoto. TH-01 usa
         "**Severità / Probabilità / Rilevabilità**", le altre 18 "**S/P/R**".
         Tutte e 19 ce l'hanno. L'avvertenza e' NEL BLOCCO PER GROK: e'
         esattamente il controllo che rifara' lui. Usare 'Residuo', uniforme.
     NESSUN ResponsePacket, e non e' una dimenticanza: card_id e' obbligatorio e
     UJ-SEC-001 non ha una card (vedi punto AM). NON impedisce la review.
     AC-02 dichiarato NON soddisfacibile da me: nomina l'atto del reviewer.

  AM) 2026-08-19 — PERCHE' 6 MIEI TASK NON HANNO UNA CARD. CORREGGE LA SESSIONE 4.
     docs/program/reviews/UJ-REV-001-ADDENDUM-CARD-ISSUANCE-CEILING.md
     prompts/handoffs/CLAUDE-PROPOSED-CARDS-20260819.md  (due card pronte)
     CLAUDE-TO-CHATGPT-CARDS-REQUEST-20260818.md -> MARCATO SUPERATO, non eseguirlo.
     LA DIAGNOSI DI SESSIONE 4 ("servono sette card, il collo di bottiglia e' di
     ChatGPT") E' INCOMPLETA. Misurato eseguendo il SUO validatore:
       il meccanismo delle card e' CABLATO A QUATTRO TASK. expectedTargets e' una
       Map di quattro coppie a validate-council-packets.mjs:443-447, e la riga 471
       impone che la mission assegni esattamente quei quattro.
     NUMERI, ricalcolati dal BACKLOG (43 task):
       reviewer accettato dallo schema : 29   (14 esclusi: 9 "Core task owner named
                                               on DelegationCard", 5 "Christian")
       in stato READY                  :  6   (un task BLOCKED non puo' avere card:
                                               task_snapshot.status e' const READY)
       ammessi da expectedTargets      :  4
       card esistenti                  :  4
     IL MECCANISMO HA GIA' EMESSO UNA CARD PER OGNI TASK CHE PUO' AVERNE UNA.
     Non e' in ritardo, e' al suo tetto. Non e' un difetto di condotta di ChatGPT.
     EMETTIBILI SUBITO, entrambi miei e READY: UJ-SEC-001 (13, GROK) e
     UJ-CLD-001 (8, GEMINI) = 21 unita' consegnate. Le card sono gia' scritte.
     SERVONO TRE MODIFICHE NEI FILE DI CHATGPT, non un file: lista cablata righe
     34-37, expectedTargets 443-447, mission assigned_task_ids + delegation_card_ids.
     RACCOMANDATO invece: sostituire l'insieme cablato con la regola "ogni task
     READY con owner e reviewer validi puo' avere una card" — il tetto sparisce
     invece di spostarsi da 4 a 6.
     SECONDO DEADLOCK: gli altri 4 miei sono BLOCKED -> niente card -> niente
     packet -> mai REVIEW -> nessun ReviewResult -> nessuna accettazione della
     dipendenza -> restano BLOCKED. Dipendenze verificate: MCP/SKL -> SEC-001,
     RCV -> RUN-001, REV-001 -> INT-001.
     TRAPPOLA INCONTRATA: il primo run del validatore ha dato PASS con
     delegation_card_count=4 mentre nella directory c'erano 10 card. Il validatore
     NON scandisce la directory. Il segnale era il CONTEGGIO, non l'exit code.

  >>> SUPERATO DAL PUNTO BE / §30: la vista autorevole e' ora la §30 della security
  >>> review, con TUTTI i 29 findings — 10 chiusi, 1 superato, 1 parziale, 17 aperti.
  >>> Questo punto (e il "23" del vecchio marcatore) descrivono stati intermedi. Per
  >>> il conteggio corrente NON leggere qui: leggi §30. Il metodo dell'audit resta
  >>> valido (la sonda produce CANDIDATI, non verdetti), il conteggio no.
  AL) 2026-08-19 — STATO CONSOLIDATO DEI 20 FINDINGS SU main. GIA' FATTO, NON RIFARE.
     docs/threat-models/MAIN_IMPLEMENTATION_SECURITY_REVIEW.md §20
     docs/threat-models/GROK_FIX_LIST.md (tabella di stato IN CIMA)
     docs/threat-models/probes/findings-status-audit.py  (nuovo)
     Ref: origin/main @ 27b7673. BILANCIO: 12 CHIUSI, 1 superato, 1 parziale, 6 aperti.
     APERTI: S-06 (policy, non un bug), S-07, S-16, S-17, S-18, S-19, S-20.
     PARZIALE: S-02 (gate si', tetto e evento no).
     DUE CHE LA MIA STESSA MEMORIA DAVA PER NON CHIUSI LO SONO:
       S-03  send() chiama _safe_mode() LIVE a ogni invocazione: la globale
             riscrivibile non e' sul percorso. email.SAFE_MODE=False non funziona.
       S-15  run_gates(use_real=False) ritorna ok:None e stampa "STUB (not
             executed)", con il commento che vieta di trattarlo come successo.
     Non aggiornarli avrebbe SOVRASTIMATO DI UN TERZO il lavoro residuo di Grok.
     RESTANO QUATTRO FIX, E DUE SONO LO STESSO PONTE: FIX-10 e FIX-13 si chiudono
     insieme. Ordine: FIX-10+FIX-13 -> FIX-11 -> FIX-12.
     ATTENZIONE, ERRORE MIO (E38/trappola 38): la sonda di audit ha dato TRE
     verdetti falsi, tutti "aperto" dove era "chiuso" (S-11, S-14, S-03).
     LO SCRIPT PRODUCE CANDIDATI, NON VERDETTI. Ogni riga aperta va RILETTA nel
     codice prima di pubblicarla. L'avvertenza e' dentro lo script, in testa.

  >>> AGGIORNATO: S-17/S-19 riconfermati aperti su origin/main anche nella quinta
  >>> verifica (log sessione 6 parte 36); il ramo CLAUDE li chiude, misurato con
  >>> UJ_PROBE_REF=HEAD o TARGET_REF=HEAD. Vista completa: §30.
  AK) 2026-08-19 — S-17 QUARTA VERIFICA: TERZA PORTA APERTA. GIA' FATTO, NON RIFARE.
     docs/threat-models/MAIN_IMPLEMENTATION_SECURITY_REVIEW.md §19
     docs/threat-models/GROK_FIX_LIST.md -> FIX-13
     docs/threat-models/probes/S-17-three-doors-probe.py  (nuova, si rilancia dalla root)
     S-17 e S-19 ANCORA APERTI su origin/main @ 27b7673. Quarta verifica di fila.
     MODEL_PROVIDER default "openai" in TRE punti; _call_openai presente;
     UJ_ALLOW_PAID_API assente; in embed() QuotaExceeded ancora inghiottito.
     LE PORTE ORA SONO TRE, misurate (nessuna chiamata di rete reale):
       UJ_PLANNER_LLM=1 -> 3 tentativi a pagamento
       UJ_WRITER_LLM=1  -> 3 tentativi a pagamento
       UJ_EMBEDDING=1   -> 1 tentativo  a pagamento   <-- NUOVA, prevista in §13
     MODEL_PROVIDER=local le chiude TUTTE E TRE: asimmetria 1 contro 3.
     E' l'argomento definitivo per correggere IL PONTE e non i gate.
     ESPOSIZIONE, tracciata per chiamante e NON presunta:
       writer e planner CABLATI (bin/uj -> natural_tasks -> nt_runner)
       embedding LATENTE: recall_semantic_embedded ha ZERO chiamanti fuori dal
       suo test. Va corretta ADESSO proprio perche' non e' cablata (come S-16).
     DUE MIE AFFERMAZIONI SMENTITE DAI FATTI, entrambe a favore di Grok:
       (1) sospettavo un percorso embedding SENZA opt-in: falso, core/memory.py:115
           richiede UJ_EMBEDDING=1;
       (2) il default e' sicuro su tutte e tre le porte, misurato.
     ATTENZIONE AL MERGE DEL FIX: la base di agent/strict-zero-cloud-bridge-*
     PRECEDE embed(). Portarla su main cosi' com'e' cancella embed() e le quattro
     guardie di budget, e core/memory.py:118 lo importa. La versione buona e'
     quella del ramo CLAUDE, l'unica su una base che contiene embed().

  AJ) 2026-08-19 — UJ-CAP-001 QUARTO INVIO REVISIONATO. GIA' FATTO, NON RIFARE.
     Ref: origin/agent/uj-cap-001-gemini-review-20260818 @ 0f1c536774aff39c349b89914d8d7184ba138834
       docs/program/reviews/UJ-CAP-001-CLAUDE-VERDICT-20260819.md
       docs/program/reviews/UJ-CAP-001-CLAUDE-REVIEWRESULT-CANDIDATE-20260819.json
     ESITO: FAIL, 3 criteri su 5 (AC-01/02/03 PASS, AC-04/AC-05 FAIL). 0/13 -> 0/13.
     I VERDETTI PRECEDENTI SONO SUPERATI: il registro e' stato RISCRITTO fra 27b3717
     e 0f1c536 (719 righe JSON, 500 MD). Non ripartire dal verdetto del 18.
     CHIUSI, con merito a Gemini: G-001, G-002, G-003, G-004 e F-001. Zero capability
     ACTIVE, confidenza max 0.5 su 19, UNKNOWN 79 nel JSON, 18 URL distinte.
     Controllato che "remove unverified capability claims" NON chiudesse una lacuna
     cancellandola: 19 ID prima, 19 dopo, nessuno rimosso.
     LE DUE COSE DA SAPERE PRIMA DI RIAPRIRLO:
      1. AC-05 fallisce per UN CAMPO, e NON E' COLPA DI GEMINI. Il packet dichiara
         source_commit_sha 3611b1b4, dove i suoi artefatti NON esistono. Ma quel
         valore e' il read_ref che la SUA CARD le ordinava di usare, e ChatGPT ha
         corretto le card OTTO ORE DOPO il suo packet. Dimostrato cambiando SOLO
         quel campo: da FAIL(2) a PASS exit 0. Seconda vittima misurata dello stesso
         read_ref stantio dopo la mia UJ-RUN-001. I DUE HASH SONO AUTENTICI.
      2. AC-04 fallisce per la classe local-compute: nessun campo, nessuna
         capability, nessuno stato — mentre policy_enforcement nomina "zero heavy
         local inference". Tre classi su quattro sono governate 19/19.
         CORREZIONE A UNA MIA FORMULAZIONE: avevo scritto "local ha zero occorrenze".
         NON E' ESATTO — compare 8 volte, sempre come DESTINAZIONE DI FALLBACK. Il
         difetto e' che non e' mai un percorso governato.
     F-102 (HIGH): verified_at_utc e' UNA COSTANTE su 19/19 e su 11 record
       CONTRADDICE il campo freshness dello STESSO record ("not independently
       reverified"). Correzione: null su quegli 11, invariato sugli 8 Google.
     F-104 (MEDIUM): il registro NON contiene le superfici su cui il programma gira.
       Claude Code, Agent SDK, code.claude.com: ZERO occorrenze. UJ-CLD-001 (mio)
       ha gia' il VERIFIED_FACT sull'Agent SDK: c'e' da IMPORTARLO, non ricercarlo.
     CORREZIONI CHIESTE: 5, di cui 3 di contenuto minimo (1 campo, 1 record, 2
       record). NON ho chiesto un quinto giro di riscrittura. §8 del verdetto.
     IL MIO REVIEWRESULT NON E' IMPORTABILE, e il motivo e' UNO SOLO, misurato a
     tre configurazioni: 8 errori dal mio albero stantio -> 4 da origin/main pulito
     -> 1 con gli artefatti presenti. L'irriducibile e' "may only be imported for a
     task currently in REVIEW; UJ-CAP-001 is READY". IL PACKET DI GEMINI PROPONE
     REVIEW E NULLA APPLICA LA TRANSIZIONE. Terza conferma della causa 3
     dell'addendum di sessione 5, ora su DUE task insieme (il suo e il mio).
     >>> SERVE DA CHATGPT: (a) l'anello che applica le transizioni proposte;
     (b) far risolvere verifyReviewedArtifact con sha256AtRef(ref, commit_sha) —
     oggi legge dall'ALBERO DI LAVORO, quindi sha256AtRef copre le CARD ma NON le
     REVIEW (vedi E35/trappola 35: non estendere la portata di un fix altrui).

  AI) 2026-08-19 — MANDATO DI TECHNICAL LEAD + INNESCO SCELTO + PR #18 APERTA.
     Christian: a fine pianificazione la leadership operativa passa a CLAUDE.
     Mandato completo, vincoli, primi cinque atti e rischio: CLAUDE.md PARTE 3-bis.
     ChatGPT resta SUPERVISORE ESTERNO con potere di rifiuto. NON e' una deroga:
     accepted_weight non si muove senza review indipendente, MAI reviewer di un
     mio task.
     INNESCO ADOTTATO (delega "scegli te"): DEFINIZIONE B' — tre task ACCEPTED:
       UJ-RUN-001 (13) reviewer GEMINI   -> PR #18 aperta, draft
       UJ-SEC-001 (13) reviewer GROK     -> READY, nessun blocker, puo' partire
       UJ-RCV-001 (8)  reviewer CHATGPT  -> BLOCKED su UJ-RUN-001
     34 unita', UNA REVIEW PER CIASCUNA DELLE ALTRE TRE IA. Finche' non sono
     accettati il mandato e' SOSPESO e si lavora da specialista.
     ATTENZIONE, ERRORE MIO DA NON RIPETERE (E33): la prima versione dell'innesco
     includeva UJ-INT-004 e dichiarava 42 unita'; la chiusura transitiva e' 8 task
     e 94 unita' perche' UJ-INT-004 -> UJ-INT-002 -> i quattro specialisti.
     UJ-INT-004 e' stato TOLTO: e' la specifica del monorepo, e packages/contracts
     esiste gia', compila e ha 140 test verdi.
     PR #18: era la cosa piu' importante e mancava. UJ-RUN-001 era ammissibile da
     ore e il reviewer non aveva una sede dove lavorare.
     SEGNALATO A CHATGPT, non corretto: il blocker di UJ-INT-002 dice "specialist
     ResponsePackets do not exist yet" e i quattro packet ESISTONO tutti.


  AH) 2026-08-19 — UJ-RUN-001 E' **REVIEW**. IL BLOCCO E' SCIOLTO. NON RIAPRIRLO.
     ChatGPT ha chiuso tutto con 6ba3a2b (ripristino dei 16 hash) e 27b7673 (via
     l'esenzione del piano canonico dal controllo, e calcolo dal commit pinnato
     con sha256AtRef invece che dall'albero — quest'ultimo era un rilievo che
     avevo definito MINORE e non bloccante, chiuso lo stesso).
     SEI CLAUSOLE VERIFICATE su origin/main: card al proprio read_ref exit 0;
     read_ref raggiungibile da main exit 0; pin 4/4 (16/16 sulle quattro card);
     validate-council-packets exit 0; criteri card == BACKLOG (AC-01..AC-05);
     ledger READY, reviewer GEMINI.
     CONSEGNA GIRO 6: source b2b32733e8db, delivery c4e23caca979,
     response_id ...-REVIEW-R6, status REVIEW, READY -> REVIEW, accettato 0 -> 0/13.
     4 hash su 15 cambiati: SOLO dichiarazioni di stato (handoff, blueprint,
     index.ts RUNTIME_CONTRACTS_PROVENANCE, package.json description) — i quattro
     punti censiti nella §0.4 dell'handoff. Delivery e append RINOMINATI in
     ...-REVIEW-20260819.md e riscritti per parlare a GEMINI.
     ATTENZIONE, DA NON ROMPERE: kind:"BLOCKED" in agent-manifest.ts e team-spec.ts
     e il membro BLOCKED di ResultStatus sono STATI DEL RUNTIME, non stato della
     consegna. Un find-and-replace su "BLOCKED" corrompe i contratti.
     IL PESO RESTA 0/13. REVIEW non e' accettazione: si muove solo se GEMINI accetta.
     ORA LA PALLA E' DI GEMINI. Da CLAUDE non serve altro su questo task.


  >>> SUPERATO DAL PUNTO AH: i 16 hash sono stati ripristinati con 6ba3a2b e
  >>> l'esenzione del piano canonico rimossa con 27b7673. Chiuso.
  AG) 2026-08-19 — CHATGPT HA CORRETTO LE CARD (4b63b94) E LA CORREZIONE HA ROTTO I PIN.
     LEGGERE PRIMA DI TOCCARE QUALUNQUE COSA LEGATA ALLE DELEGATION CARD.
     CHIUSO: i 4 read_ref puntano ora a 25b1b7d53ff5, che contiene le card ed e'
     raggiungibile da main (4/4, entrambe le clausole). ChatGPT ha ANCHE allineato
     i criteri (UJ-RUN-001 ne ha 5 nel BACKLOG, non 2) e aggiunto due assert al
     validatore che rendono il difetto meccanicamente impossibile. Accreditato.
     APERTO: lo stesso commit ha riscritto i 16 hash degli input pinati sulle 4
     card e ZERO su 16 corrispondono. Sei convenzioni di hashing testate, nessuna
     produce quei valori; nessuna versione storica del piano canonico ha mai avuto
     l'hash dichiarato. I valori CORRETTI sono quelli di PRIMA:
       a3fcdfc9...a69a87  docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md
       72edc395...93590a  docs/program/SPECIALIST_INPUTS.md
       eb4d0d0d...d29ff88  docs/program/COUNCIL_PACKETS.md
       ee44e1b7...7e69c0a  schemas/response-packet.schema.json
     IL GATE DI CHATGPT RIFIUTA IL COMMIT DI CHATGPT: validate-council-packets.mjs
     su origin/main -> exit 1, 12 mismatch. validate-program-os.mjs -> exit 0.
     IL RILIEVO PIU' GRAVE: il validatore riporta 12 e non 16 perche' la riga 444
     ESCLUDE il piano canonico dal controllo di integrita'. L'unico artefatto esente
     dal gate e' il documento che definisce il programma, e il suo hash falso e'
     invisibile. Quella eccezione va rimossa.
     EFFETTO SU UJ-RUN-001: il blocco CAMBIA IDENTITA', non si scioglie. Per quattro
     giri avevo scritto "non e' un pin mismatch": ADESSO LO E'. Rischio sostanziale
     NULLO (lavoro svolto contro i documenti reali, byte invariati), blocco FORMALE.
     GIA' FATTO, NON RIFARE: docs/program/reviews/UJ-CARDS-REPIN-VERIFICATION-CLAUDE.md
     Consegna giro 5: source c645377d54c2, delivery 141180ae2761, packet -R5,
     1 hash su 15 cambiato (solo l'handoff, §1.0).


  >>> SUPERATO DAL PUNTO AH: le card sono state ripinnate a 25b1b7d5 e i pin
  >>> ripristinati. La richiesta descritta qui e' stata soddisfatta.
  AF) main E' STATO RISCRITTO, E QUESTO CAMBIA LA CORREZIONE DA CHIEDERE A CHATGPT.
     LEGGERE PRIMA DI RIPETERE LA RICHIESTA DI SBLOCCO.
     Misurato: 3611b1b4, d48e1e85, 31f31b9 e ANCHE 99dece5 (il mio merge di PR #1
     e PR #2 su main, sessione 3) NON sono raggiungibili da origin/main.
     Sopravvivono solo su rami laterali. Secondo indizio dello stesso fatto: il
     fetch senza '+' rifiutato come non-fast-forward (E30) — l'avevo letto solo
     come difetto della mia ricetta, era ANCHE il sintomo del rewrite.
     LA MIA ISTRUZIONE PRECEDENTE ERA SBAGLIATA: "read_ref a un commit pari o
     successivo a d48e1e85" verifica solo che la card ci sia, NON che il commit
     sia risolvibile da main. Seguita alla lettera riproduce il difetto.
     CONDIZIONE CORRETTA, due clausole: il commit deve CONTENERE LA CARD **e**
     ESSERE RAGGIUNGIBILE DA origin/main.
     Candidati verificati: 3cbae5c19bb6e29fbc3e0dbbd60c5a7c92fc6fa1 (il primo
     nella storia ATTUALE di main in cui la card compare) oppure il tip
     25b1b7d53ff5bc4b05348453ebb704aba3a88630.
     E IL DIFETTO E' SU TUTTE E QUATTRO LE CARD: UJ-RUN-001-CLAUDE,
     UJ-CAP-001-GEMINI, UJ-GGL-001-GEMINI, UJ-RED-001-GROK dichiarano tutte
     read_ref 3611b1b4 e NESSUNA esiste a quel commit. Gemini lo incontra due
     volte, Grok una. Correggerle insieme costa UN giro di HUMAN_BRIDGE invece
     di tre. NON ho toccato le card: sono di ChatGPT.
     FRAGILITA': i 4 input pinati si risolvono ancora a 3611b1b4 (4/4) ma SOLO
     perche' quei rami laterali esistono. Cancellandoli, saltano anche i pin.
     CONSEGNA GIRO 4: source cfee1316cf83, delivery d414306f2928,
     packet -R4, 1 hash su 15 cambiato (solo l'handoff, che guadagna la §1.1).


  >>> SUPERATO DAL PUNTO AH: UJ-RUN-001 e' REVIEW dal 2026-08-19. Il blocco
  >>> descritto qui e' sciolto. Il punto resta come storia del perche'.
  AB) UJ-RUN-001 RICONCILIATA UNA TERZA VOLTA E RESTA BLOCKED. GIA' FATTO, NON RIFARE.
     Ref: agent/uj-run-001-blueprint-20260818
       source_commit_sha : a7e03e979baee5a8b796007313ad93408299f840
       delivery commit   : 39e9a8350566682d1469deb2243764b321dd8c5e
     Supersede 79408449bd096613d2823efe6872ed424b757ee6, che superava 2dad45a4.
     File: docs/program/handoffs/HANDOFF-UJ-RUN-001.md (RISCRITTO),
       docs/program/packets/UJ-RESP-RUN-001-CLAUDE.json (response_id ...-R3),
       docs/program/packets/UJ-RUN-001-AC-EVIDENCE.md,
       prompts/handoffs/CLAUDE-RUN-001-DELIVERY-BLOCKED-20260818.md (ORA 2 blocchi
         FILE: blueprint E handoff, cosi' ChatGPT rihasha senza clonare),
       prompts/handoffs/CLAUDE-RUN-001-APPEND-BLOCKS-BLOCKED-20260818.md

     COSA ERA ROTTO: ChatGPT ha segnalato che l'handoff era ancora il documento
     della SESSIONE 1 (branch claude/ultrajarvis-repo-analysis-li6vvj, stato
     REVIEW, 33 test). Vero, ed e' uno dei 15 artefatti che il packet hasha:
     due artefatti sullo STESSO commit dichiaravano stati opposti.

     LA PARTE CHE CONTA: cercare solo quell'istanza sarebbe stato l'errore.
     Scandendo TUTTO il set per la CLASSE del difetto ne sono uscite QUATTRO:
       1. l'handoff                                (segnalata da ChatGPT)
       2. packages/contracts/src/runtime/index.ts  RUNTIME_CONTRACTS_PROVENANCE
                                                   .status = "REVIEW"  <- LA PEGGIORE
       3. packages/contracts/package.json          description "... status REVIEW."
       4. RUNTIME_BLUEPRINT.md                     "il prompt non e' ancora su main"
     La n.2 e' la peggiore perche' e' l'UNICA copia LEGGIBILE DA UNA MACCHINA
     dello stato, offerta dal suo commento "for the Program OS ledger". Lo stesso
     file dichiarava "Status: PROPOSAL" 25 righe sopra: due stati in un file.
     Ora maturita' del contratto e ammissibilita' della consegna sono due assi
     separati. Nessuno legge quella costante (grep fatto prima di toccarla).
     La n.4 era FALSA: origin/main e b8a7697 danno lo stesso a3fcdfc9...a69a87.

     PROVA CHE LA CORREZIONE E' CHIRURGICA: ricalcolati TUTTI e 15 gli hash a
     ENTRAMBI i commit sorgente -> 4 su 15 cambiati, esattamente quei quattro.

     PERCHE' RESTA BLOCKED: invariato. La card non esiste al proprio read_ref
     3611b1b4; entra con d48e1e85, dodici minuti dopo. I 4 input pinati
     COINCIDONO a 3611b1b4 (ricalcolati): non e' un pin mismatch. Serve CHATGPT.
     Questi stessi byte diventano REVIEW cambiando SOLO status.

     TRE SCELTE DI PROGETTO DA NON DISFARE:
       - l'handoff NON nomina il commit che lo contiene: impossibile per
         costruzione (trappola 28). Il source_commit_sha sta SOLO nel packet.
       - §0.3 conserva i valori superati sotto intestazione ESPLICITA di storia:
         non cancellarli, servono a chi ha visto la versione precedente.
       - §0.4 registra la CLASSE del difetto, non l'istanza (trappola 26).
       - response_id cambiato in ...-R3 di proposito: riusarlo sarebbe stato un
         replay divergente, cioe' il mio stesso finding F-002 contro ChatGPT.

  AC) CORREZIONE A UN FATTO DELLA SESSIONE 5 — LEGGERE PRIMA DI CERCARE UJ-INT-007.
     Il punto S diceva "UJ-INT-007 NON ESISTE fra i 43 task". E' FALSO.
     ESISTE: owner CHATGPT, reviewer GEMINI, peso 13, milestone M10, DEFERRED.
     Verificato a quattro ref diversi, esisteva gia' a 31f31b9.
     Era quasi certamente lo stesso falso negativo dell'errore E28 di sessione 6:
     leggere t.id dove il campo e' t.task_id, quindi confrontare contro undefined.
     UJ-REV-002 resta NON lavorabile, ma la causa e' "la dipendenza esiste e non
     e' accettata", NON "non esiste". E' la causa a dire chi puo' sbloccare cosa.

  AD) IL COMANDO DI FETCH DELLA MIA STESSA MEMORIA ERA DIFETTOSO (E30). CORRETTO
     in CLAUDE.md PARTE 2 e in AVVIO_NUOVA_SESSIONE.md. Usa SEMPRE:
       git fetch origin '+refs/heads/*:refs/remotes/origin/*'
     Senza il '+', un ref remoto riscritto viene RIFIUTATO e origin/main resta al
     valore VECCHIO, con una sola riga "! [rejected] ... (non-fast-forward)" in
     mezzo a decine di "[new branch]". In questa sessione origin/main e' rimasto
     a 9d2a93d ("Initial commit") mentre il vero era 25b1b7d. Da li' in poi ogni
     confronto fra branch sarebbe stato sbagliato SENZA CHE NULLA LO DICESSE.
     DOPO il fetch, verifica che origin/main sia dove ti aspetti.

  AE) IL BRANCH DI CASA E QUELLO DI CONSEGNA SONO ORA ALLINEATI SULLA MEMORIA.
     agent/uj-run-001-blueprint-20260818 contiene ANCHE CLAUDE.md/TASKCLAUDE.md
     aggiornati: ho mergiato 2f0464d (l'ultimo commit di memoria di sessione 5) e
     scritto qui il log di sessione 6, perche' il proprietario aveva chiesto di
     pushare SOLO il branch autorizzato e la Regola 2 impone comunque di
     aggiornare la memoria. Verificato che 2f0464d non tocca NESSUNO dei 15
     artefatti, quindi il merge non poteva cambiare un hash.
     CONSEGUENZA: claude/claude-md-resume-point-tvej1u e' ora INDIETRO sulla
     memoria. La copia buona e' su agent/uj-run-001-blueprint-20260818.

SESSIONE 5 — FATTI NUOVI, LEGGERE PRIMA DI TUTTO IL RESTO:

  AA) CHIUSURA DI SESSIONE (fine settima parte). Leggi questo punto per primo,
     letteralmente prima di P-Z qui sotto: quelli sono la cronologia della
     sessione, questo e' dove si riprende.

     1. UJ-RUN-001 E' STATA RICONCILIATA E RESTA BLOCKED. NON RIFARE.
        Ref: agent/uj-run-001-blueprint-20260818
        @ 9a7e92022d399f3e6575b84415a38fe099d13fde (i quattro documenti di consegna)
        source_commit_sha citato da tutti e quattro (blueprint incluso):
          79408449bd096613d2823efe6872ed424b757ee6
        File: docs/program/packets/UJ-RESP-RUN-001-CLAUDE.json (status BLOCKED,
          AC-05 dichiarato NON soddisfatto), UJ-RUN-001-AC-EVIDENCE.md,
          prompts/handoffs/CLAUDE-RUN-001-DELIVERY-BLOCKED-20260818.md (2 blocchi,
          NESSUN ReviewResult dentro), CLAUDE-RUN-001-APPEND-BLOCKS-BLOCKED-
          20260818.md (3 blocchi append-only per gpt.md/taskgpt.md/RESUME_POINT.md
          DI CHATGPT, non scritti li' da me).
        PERCHE' RESTA BLOCKED: la card UJ-CARD-RUN-001-CLAUDE non esiste al commit
        che il suo stesso read_ref nomina (3611b1b4); entra 12 minuti dopo con
        d48e1e85. Verificato con `git cat-file -e`, due volte in due sessioni
        diverse. Non e' un pin mismatch: i 4 hash pinati coincidono.
        NON DIVENTA REVIEW SOLO PERCHE' I TEST PASSANO (140/140, runtime 36/36,
        rieseguiti). Diventa REVIEW quando CHATGPT corregge il read_ref della
        card — servono zero byte di modifica dopo, solo il cambio di status.
        Corretti in questo giro anche 3 incoerenze interne trovate rileggendo
        byte per byte (stato REVIEW residuo in una tabella, 4 conteggi test in
        conflitto risolti a 36/140, un branch stantio citato) + 1 trovata da me
        (24 prove dichiarate, contate 22). Dettaglio: CLAUDE.md sessione 5
        settima parte, qui sopra.

     2. GEMINI HA RISPEDITO UJ-CAP-001 UNA TERZA VOLTA. TROVATO A FINE SESSIONE
        DALLA TRAPPOLA 11, NON ANCORA REVISIONATO. E' IL PRIMO TASK DA FARE.
        Ref: agent/uj-cap-001-gemini-review-20260818 @ 0f1c536 (5 commit dopo il
        27b3717 che avevo gia' revisionato con esito FAIL 3/5 — vedi punto R qui
        sotto, che ora e' SUPERATO da questo terzo invio).
        Cosa cambia rispetto al mio ultimo verdetto: il commit 0f1c536 aggiunge
        "docs/program/packets/UJ-RESPONSE-CAP-001-GEMINI-001.json" — cioe' proprio
        il ResponsePacket la cui ASSENZA era F-001, il mio finding piu' grave
        (AC-05 fallito, motivo per cui il ReviewResult non era importabile).
        Gli altri 4 commit del giro (cd1fa6e, 73afb8c, f65e44a, 1185133) toccano
        ancora CAPABILITY_REGISTRY.md/.json: puo' darsi che F-002 (verified_at_utc
        costante) e F-004 (CLD-SDK-001 rimossa) siano stati affrontati, va
        VERIFICATO, non presunto dal nome dei commit.
        NON L'HO ANCORA APERTO: il proprietario aveva chiesto di chiudere la
        sessione, e aprire una nuova review a quel punto sarebbe stato iniziare
        lavoro nuovo invece di chiudere quello in corso. E' il primo task della
        sessione che segue.
        Metodo gia' rodato per farlo: (a) i due grep dichiarati in anticipo su
        UNKNOWN/date; (b) confrontare il nuovo packet con lo schema ESEGUENDO il
        validatore, non leggendolo; (c) verificare se il ResponsePacket risolve
        DAVVERO F-001 o se e' un packet malformato come il primo tentativo di
        sessione 4 (zero ResponsePacket, file troncato) — quel precedente e'
        proprio la ragione per cui va eseguito il validatore e non solo letto
        il JSON.

  P) S-18 RIVERIFICATO, ANCORA APERTO su main. GIA' FATTO, NON RIFARE:
       MAIN_IMPLEMENTATION_SECURITY_REVIEW.md §18
       GROK_FIX_LIST.md -> FIX-11, sezione "Riverificato 2026-08-18"
     ATTENZIONE: pytest NON e' installato in un container nuovo, quindi la
     verifica documentata (`python3 -m pytest tests/test_files.py`) NON e'
     eseguibile a freddo. Usa il riproduttore senza pytest scritto in FIX-11.
     PRECISAZIONE CHE FA SBAGLIARE: `root` e' keyword-only, quindi il default
     catturato sta in __kwdefaults__, NON in __defaults__ (che vale None).
     Guardare nel posto sbagliato porta alla conclusione OPPOSTA a quella vera.
     Misurato: grok.md d72ece89 -> 6fa4b524 nella root REALE, temp dir vuota.
     Passando root= esplicito il contenimento FUNZIONA: sbagliato e' solo il
     momento in cui la root viene legata. La correzione di FIX-11 e' giusta.
     FORMA RICORRENTE, tre volte in questa sessione: un valore fissato una volta
     sola (PROVIDER all'import, safe=True cablato, __kwdefaults__['root'] alla
     def) e una riassegnazione che sembra avere effetto e non ne ha. Il codice
     del controllo e' corretto in tutti e tre: inganna il QUANDO. La lettura
     statica li ha mancati tutti e tre, l'esecuzione li ha trovati tutti e tre.


  Q) PERCHE' NESSUN TASK PUO' ESSERE ACCETTATO — misurato, non dedotto.
     docs/program/reviews/UJ-REV-001-ADDENDUM-LEDGER-IMPORT-PATH.md
     Esperimento a tre configurazioni sul validatore: 7 errori -> 3 -> 1.
     L'unico irriducibile: si importa solo per task in REVIEW, e NULLA porta un
     task da READY a REVIEW. Nessuno script scrive su BACKLOG.json: il packet
     PROPONE e basta. PROVA: UJ-RESP-RUN-001-CLAUDE.json valida a exit 0 e
     UJ-RUN-001 nel BACKLOG e' ancora READY.
     Le altre due cause: (1) TUTTE E QUATTRO le card dichiarano 5 criteri e il
     BACKLOG ne dichiara 2 -> ogni ReviewResult scritto sui criteri ricevuti e'
     respinto con "unknown criterion"; (2) 41 criteri su 43 task dicono
     "<reviewer> issues a PASS or PASS_WITH_ACTIONS review", cioe' meta' della
     superficie di accettazione e' una tautologia sull'esito, non sull'artefatto.
     CORREGGE la mia diagnosi di sessione 4: il packet mancante era vero ma NON
     era la causa sufficiente. Non cercare un difetto nella tua condotta.
     >>> SERVE DA CHATGPT, nell'ordine: applicare le transizioni proposte;
     allineare i criteri del BACKLOG alle card; togliere il verdetto del
     reviewer dai criteri (e' il gate, non un criterio).
     CONTROLLO POSITIVO, cercato apposta: la mia ReviewResult su UJ-INT-006,
     eseguita dal commit che pinna, valida a EXIT 0. IL MACCHINARIO FUNZIONA.
     Non e' rotto: le sue precondizioni non sono quasi mai tutte vere insieme.
     Cifre esatte, ricontate: 3 task su 43 sono in REVIEW (UJ-META-002,
     UJ-INT-001, UJ-INT-006), quindi 40 non possono ricevere una review
     importabile. Solo UJ-INT-006 ne ha davvero una, ed e' mia.
     CAUSA 4, trovata dal controllo positivo: il validatore verifica gli hash
     contro L'ALBERO DI LAVORO, non contro il commit pinnato. Provato in due
     direzioni. Che una review sia importabile dipende da quale checkout la
     esegue, non dai byte che pinna. Correzione: risolvere i ref con
     `git show <commit_sha>:<ref>`; il commit e' gia' nel documento.
     NOTA SUL MIO BRANCH: porta 8 righe in piu' in docs/program/RESUME_POINT.md,
     testo DI CHATGPT ereditato mergiando agent/strict-zero-cloud-bridge-20260818
     in sessione 4 e mai arrivato su main. Non l'ho scritto io, non l'ho tolto.


  R) GEMINI HA RISPEDITO UJ-CAP-001 ed E' GIA' STATO REVISIONATO. NON RIFARE.
     Ref: agent/uj-cap-001-gemini-review-20260818 @ 27b37174c10b86122f7b7ba71e697dfda91647d2
       docs/program/reviews/UJ-CAP-001-CLAUDE-VERDICT-20260818.md
       docs/program/reviews/UJ-CAP-001-CLAUDE-REVIEWRESULT-CANDIDATE.json
     ESITO: FAIL, 3 criteri su 5 (era 1 su 5). AC-04 e AC-05 falliti.
     Il test dei due grep e' passato: UNKNOWN 1 -> 42/70, date 0 -> 20/20.
     G-002 e G-004 chiusi bene. G-006 chiuso RIMUOVENDO la capability.
     F-002 (HIGH): verified_at_utc e' UNA COSTANTE su 19 capability, al secondo,
     identica al timestamp di impacchettamento. Stessa forma di S-20.
     IL REVIEWRESULT NON E' IMPORTABILE, e i 3 motivi sono findings per CHATGPT:
       1. deadlock del ledger: importabile solo se il task e' in REVIEW, ma
          diventa REVIEW solo con un ResponsePacket, che non esiste. SECONDA
          occorrenza della diagnosi di sessione 4, su un task di un'altra IA.
       2. UJ-CAP-001 ha DUE liste di criteri: la card ne ha 5, BACKLOG.json 2.
          E l'AC-02 del BACKLOG dice "CLAUDE issues a PASS or PASS_WITH_ACTIONS
          review": un criterio che nomina solo gli esiti positivi del reviewer.
       3. gli artefatti sono sul ramo di Gemini, non nell'albero di chi valida.


  T) S-20 (NUOVO, MEDIUM) — la promozione cabla safe=True. GIA' FATTO, NON RIFARE:
       MAIN_IMPLEMENTATION_SECURITY_REVIEW.md §17
       GROK_FIX_LIST.md -> FIX-12
       docs/threat-models/probes/S-17-writer-pipeline-probe.py
     MISURATO su main: UJ_WRITER_LLM=1 DA SOLO -> 3 tentativi fatturabili, sul
     percorso che GENERA CODICE. §13 chiedeva FIX-10a/10b PRIMA del writer: il
     writer e' stato riscritto e allargato (core/nt_helpers.py, core/nt_runner.py),
     il fix non e' arrivato.
     ATTENZIONE, DUE CORREZIONI ALLE MIE STESSE AFFERMAZIONI:
       - ToolSpec.safe NON e' piu' una manopola che non gira nulla: FIX-7 di Grok
         l'ha resa vera (registry.py:189 solleva PermissionError). La mia review di
         sessione 3 su questo era superata.
       - promote_job_to_tools NON e' la promozione senza gate di S-12/S-13: ha
         quattro controlli reali. Quelli sono chiusi.
     IL RILIEVO VERO e' che il gate ora conta e la promozione gli passa sempre
     safe=True: unica occorrenza di `safe=` nella funzione. Provato eseguendo.
     ORDINE: FIX-10 (merge strict-zero su main) PRIMA di FIX-12.

  >>> SUPERATO DAL PUNTO AC: UJ-INT-007 ESISTE (owner CHATGPT, M10, DEFERRED).
  >>> Era un falso negativo, lo stesso errore E28.
  S) UJ-INT-007 NON ESISTE fra i 43 task del BACKLOG.json (verificato al ref
     corrente). UJ-REV-002 resta BLOCKED e non lavorabile. Non e' un blocco
     formale da aggirare: il deliverable da revisionare non c'e'.


  Z) L'AMBIENTE PUO' NON ASSEGNARTI NIENTE. In sessione 5 il container era VUOTO:
     /home/user senza file, repository NON clonato, nessun branch. Il clone atterra
     su main. Il branch di lavoro va SCELTO e la scelta DIMOSTRATA con
     `git rev-list --left-right --count origin/main...<branch>`, non presunta dal
     nome. Atteso per il branch giusto: 0 indietro, N avanti.

  Y) LA SUITE ORA E' 140, NON 138. Due test nuovi in runtime-invariants
     (34 -> 36). Se ne vedi 138 sei su un ref vecchio, non c'e' una regressione.
     Totale: runtime 36 · policy 28 · tools 30 · recovery 9 · skills 37.

  X) E6 AVEVA UNA SECONDA OCCORRENZA, ORA CHIUSA. depth-guard.ts costruiva la
     chiave k-gram con join su un byte NUL: falsi positivi di ciclo (ToolId non ha
     validazione a runtime) e file BINARIO per git/grep, quindi fuori da ogni audit
     testuale per quattro sessioni. Corretto con `encodeInjective` in common.ts,
     sede UNICA, usata anche da buildIdempotencyKey. GIA' FATTO, NON RIFARE.

  W) GATE UJ-RUN-001 RICEVUTO E CONSEGNATO. Trovato dalla trappola 11 su
     agent/claude-run-handoff-20260818. GIA' FATTO, NON RIFARE:
       prompts/handoffs/CLAUDE-RUN-001-DELIVERY-20260818.md  (blocco da incollare,
         round-trip verificato: il blueprint riestratto rihasha identico)
       docs/program/packets/UJ-RUN-001-AC-EVIDENCE.md  (AC-01..AC-05, un controllo
         ESEGUITO per criterio)
       docs/program/packets/UJ-RESP-RUN-001-CLAUDE.json (aggiornato, validatore
         exit 0, 15 hash, accepted 0/13 invariato)
     TRE INCOERENZE NEL GATE, segnalate a ChatGPT, nessuna bloccante: la card NON
     esiste al commit 3611b1b4 al quale il gate ordina di leggerla (entra 12 minuti
     dopo con d48e1e85); il gate dice `path` dove lo schema dice `ref`; il gate
     chiede la mappatura per criterio DENTRO il packet e lo schema, con
     additionalProperties:false, non la ammette.
     >>> SERVE DA CHATGPT: decidere se lo schema prende un campo per criterio o se
     il gate punta a un documento accanto. Oggi le due cose si contraddicono.

  V) S-17 E S-19 ANCORA APERTI SU main, terza verifica consecutiva. E ci sono TRE
     candidati per la stessa correzione. GIA' FATTO, NON RIFARE:
       docs/program/reviews/UJ-SEC-003-STRICT-ZERO-CANDIDATE-RECONCILIATION.md
       docs/threat-models/probes/S-17-strict-zero-candidate-probe.py
       docs/threat-models/probes/S-19-embed-budget-gate-probe.py
     Le sonde si automaterializzano dai ref con `git show`: si rieseguono dalla root
     senza dipendere da file temporanei. Nessuna chiamata di rete reale, costo zero.
     MISURATO: main 6 percorsi a pagamento/remoti su 7 attacchi, i candidati 0. Con
     budget ESAURITO main chiama comunque (S-19), il branch CLAUDE no.
     IL PUNTO CHE CONTA: v1 e v2 hanno cloud_bridge.py BYTE-IDENTICO (md5
     2961c3a8...) e entrambe le basi precedono embed(). Mergiarli oggi chiuderebbe
     S-17 e CANCELLEREBBE embed() e le 4 guardie di budget — core/memory.py:118 lo
     importa e lo chiama a riga 139, quindi romperebbe il lavoro di Gemini.
     >>> RACCOMANDATO: portare su main la versione del branch CLAUDE, la sola su
     una base che contiene embed(). NON l'ho fatto io: direct_main_write false.

  U) UJ-CAP-001: LA CORRECTION REQUEST DI CHATGPT COPRE 4 DELLE MIE 6 CORREZIONI.
     GIA' FATTO, NON RIFARE:
       docs/program/reviews/UJ-CAP-001-CLAUDE-GATE-COVERAGE.md
       prompts/handoffs/CLAUDE-TO-GEMINI-MERIT-ADDENDUM-UJ-CAP-001-20260818.md
     Coperte: 7 campi JSON, URL+ora UTC, rate limit. NON coperte: G-004 (la matrice
     §4 contraddice la tassonomia §2 DENTRO il Markdown, quindi "far concordare MD e
     JSON" si soddisfa propagando l'errore nel JSON) e G-005 (la classe
     local-compute di AC-04, assente dalla request).
     >>> SERVE DA CHRISTIAN: incollare l'addendum INSIEME alla request di ChatGPT,
     stesso messaggio. Separarli costa un terzo giro di HUMAN_BRIDGE.
     UJ-CAP-001 resta 0/13. Nessun ReviewResult emesso.

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
            0-bis. FETCH CON IL '+', SEMPRE (E30, sessione 6):
               git fetch origin '+refs/heads/*:refs/remotes/origin/*'
               Senza il '+' un ref remoto riscritto viene RIFIUTATO in silenzio e
               origin/main resta al valore vecchio. Dopo il fetch VERIFICA che
               origin/main sia dove ti aspetti, non darlo per aggiornato.
            0-ter. LA MEMORIA BUONA E' SU agent/uj-run-001-blueprint-20260818, non
               piu' su claude/claude-md-resume-point-tvej1u (vedi punto AE). E
               l'ambiente puo' assegnarti un branch nuovo e VUOTO: in sessione 6 ha
               dato claude/ultrajarvis-program-setup-2noca9, identico a main.
            0. CONTROLLA `git rev-parse main origin/main` PRIMA di interpretare
               qualunque diff fra branch: dopo un fetch il main locale resta
               indietro e i diffstat diventano insensati (E17, ripetizione di E14).
            1. ESEGUI PRIMA LA TRAPPOLA 11 — git fetch di tutti i branch e controlla
               se qualcuno ha consegnato. In sessione 6 e' stata la prima volta con
               esito NEGATIVO: nessuna consegna nuova dopo la chiusura di sessione 5.
               Non e' un motivo per saltarla, e' il motivo per cui va eseguita.
            1. UJ-CAP-001 @ 0f1c536 E' GIA' STATO REVISIONATO. NON RIFARLO.
               Verdetto FAIL 3/5 in
               docs/program/reviews/UJ-CAP-001-CLAUDE-VERDICT-20260819.md — vedi
               punto AJ. TUTTI i verdetti precedenti su UJ-CAP-001 (sessione 4
               pre-verdetto, sessione 5 VERDICT-20260818) SONO SUPERATI: il registro
               e' stato riscritto. Non ripartire da quelli.
               SE GEMINI RISPEDISCE ANCORA, controlla nell'ordine: (a) e' cambiato
               source_commit_sha e il packet passa il validatore? (b) esiste una
               capability local-compute? (c) verified_at_utc e' ancora costante?
               (d) ci sono Claude Code e Agent SDK? Sono le 4 correzioni chieste.
            2. GROK_FIX_LIST.md È GIÀ STATO VERIFICATO APPLICATO da me, non solo
               dichiarato — 10/16 findings chiusi con comando+esito in
               MAIN_IMPLEMENTATION_SECURITY_REVIEW.md §10-ter. Non rifare quella
               verifica. Se riprendi UJ-SEC-003, parti da lì: restano S-02
               (parziale), S-06, S-07, S-16, più S-20 (nuovo, §17) e S-18
               riverificato ancora aperto (§18).
            3. Se UJ-INT-007 esiste ora (era DEFERRED, verificato assente in
               sessione 5) -> prendi UJ-REV-002.
            4. Se Gemini/Grok hanno consegnato altro -> hai doveri da reviewer su
               UJ-CAP-001, UJ-MEM-001, UJ-ADK-001, UJ-RSK-001, UJ-ALT-001.
               NON su UJ-RED-001: il suo reviewer è CHATGPT (verificato).
            5. Se UJ-RUN-001 e' uscita da BLOCKED (il read_ref della card e'
               stato corretto) -> il tuo compito e' verificare che il ledger
               segua, non ripetere il lavoro: i byte sono gia' pronti su
               agent/uj-run-001-blueprint-20260818.
            6. Se NIENTE di tutto questo -> registra l'attesa. Ma solo dopo 1-5.

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
            LA RICONCILIAZIONE DI UJ-RUN-001 — TERZO GIRO, sessione 6: handoff
            RISCRITTO piu' altri tre artefatti che dichiaravano uno stato superato
            (index.ts, package.json, blueprint), packet ...-R3 BLOCKED, AC-evidence,
            delivery con DUE blocchi FILE, append-blocks. Tutto su
            agent/uj-run-001-blueprint-20260818 @ a7e03e979bae (vedi punto AB).
            Il TERZO invio di UJ-CAP-001 NON e' in questa lista: quello va aperto,
            e' il primo task.
            Verifica prima, DALLA ROOT del repo, SOLO la mia suite (non toccare i
            test Python di Grok, sono un altro portafoglio).
            ESEGUI I TRE COMANDI IN QUEST'ORDINE — il secondo NON è opzionale:
              npx tsc -p packages/contracts --noEmit   -> exit 0   (typecheck)
              npx tsc -p packages/contracts            -> exit 0   (BUILD: i test
                                                          importano da dist/)
              for f in tests/contracts/*.test.mjs; do node --test "$f"; done
              totale atteso: 140/140 (runtime 36 · policy 28 · tools 30 ·
                                      recovery 9 · skills 37)
              ERA 138 fino alla sessione 4: i due test in piu' sono le regressioni
              di E6 aggiunte in sessione 5, non un errore di conteggio.
            SE SALTI LA BUILD ottieni 5 suite su 5 fallite con
            ERR_MODULE_NOT_FOUND su packages/contracts/dist/... . NON è una
            regressione: dist/ è in .gitignore e in un container nuovo non
            esiste. La sessione 4 ci è cascata perché questo blocco elencava solo
            --noEmit e metteva i test PRIMA del typecheck (errore E16).
            Riverificato in sessione 5 dopo la build: 140/140 pass, exit 0.

RICORDA   : a fine task, Regola 2 — aggiorna CLAUDE.md e TASKCLAUDE.md (estensione,
            mai riscrittura), poi commit e push. Un push va verificato leggendo
            l'exit code del comando vero, mai attraverso una pipe (trappola 15).
```
