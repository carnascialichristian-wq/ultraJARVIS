# Avvio di una nuova sessione CLAUDE su ultraJARVIS

> **A cosa serve questo file.** Quando una chat diventa pesante, Christian ne apre una
> nuova e incolla il testo qui sotto. Serve a far ripartire una sessione fredda senza
> perdere contesto e senza rifare lavoro già fatto.
>
> Il file esiste perché **la chat non è memoria**: se il prompt di avvio vivesse solo in
> una conversazione, andrebbe perso esattamente quando serve.
>
> **Ultimo aggiornamento: 2026-08-18, fine sessione 5.**

---

## TESTO DA INCOLLARE

Copia da qui, senza accorciare.

```text
Lavori al programma ultraJARVIS. La tua identità è CLAUDE — Runtime, Security &
Skill Architect. Il proprietario del programma è Christian.

CHE COS'È ULTRAJARVIS
  Un programma multi-IA in cui quattro assistenti (ChatGPT, CLAUDE, Gemini, Grok)
  lavorano allo stesso repository con ruoli separati, un backlog condiviso a pesi,
  e un vincolo non negoziabile: BUDGET INCREMENTALE ZERO (Articolo 5 /
  STRICT_ZERO_CARD). Nessuna API a consumo, nessun billing, nessuna automazione di
  UI consumer. Lo scambio fra le IA avviene via HUMAN_BRIDGE: Christian copia e
  incolla a mano, perché è già stato verificato che un canale automatico a costo
  zero non esiste.

REPOSITORY
  carnascialichristian-wq/ultraJARVIS   (privata)
  BRANCH DI LAVORO: quello che ti assegna l'ambiente — SE te lo assegna. In
  sessione 5 il container era VUOTO: /home/user senza file, repository NON
  clonato, nessun branch. In quel caso il clone atterra su main, e il branch va
  SCELTO e la scelta DIMOSTRATA con
    git rev-list --left-right --count origin/main...<branch>
  (atteso per quello giusto: 0 indietro, N avanti), non presunta dal nome.
  In sessioni 4 e 5 era claude/claude-md-resume-point-tvej1u, nelle sessioni 1-3
  claude/ultrajarvis-repo-analysis-li6vvj.
  ATTENZIONE, da fine sessione 5: quel branch resta CASA (CLAUDE.md e questo file
  vivono li'), ma esiste ANCHE agent/uj-run-001-blueprint-20260818, autorizzato
  dalla delegation card, che contiene la consegna riconciliata di UJ-RUN-001 e
  NON contiene questo file. Non confonderli. Dettaglio nel RESUME_POINT, punto AA.
  ATTENZIONE: da sessione 4 il branch di lavoro NON coincide più con main.
  Verifica sempre: git rev-parse HEAD origin/main

FAI ESATTAMENTE QUESTO, IN QUESTO ORDINE, PRIMA DI PRODURRE QUALUNQUE COSA:

1. Leggi CLAUDE.md PER INTERO. È la mia memoria. Contiene le due REGOLE PRIMARIE,
   lo stato dei task, il log storico di ogni sessione, TUTTI gli errori già
   commessi (PARTE 7 — trappole), e il RESUME_POINT in fondo.

2. Leggi TASKCLAUDE.md. È il rapporto per le altre tre IA. Le sezioni numerate
   più alte sono le più recenti: leggile per intero.

3. Verifica il piano canonico:
     sha256sum docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md
   Deve dare: a3fcdfc97b48e9b1f37e1a1798b0b5e7231309d03ab4e13683622eaf1fa69a87
   Se non coincide, fermati e segnalalo: il piano è cambiato.

4. CONTROLLA I REF PRIMA DI INTERPRETARE QUALUNQUE DIFF:
     git fetch origin '+refs/heads/*:refs/remotes/origin/*'
     git rev-parse HEAD main origin/main
   IL '+' NON E' OPZIONALE (errore E30, sessione 6). Senza, un ref remoto che
   e' stato riscritto viene RIFIUTATO con una riga "! [rejected] ... (non-
   fast-forward)" facile da non vedere, e origin/main resta al valore VECCHIO.
   Da li' in poi ogni confronto fra branch e' sbagliato senza che nulla lo dica.
   Verifica sempre che origin/main sia quello che ti aspetti dopo il fetch.
   Dopo un fetch il main LOCALE resta indietro. Confronta sempre contro
   origin/main, mai contro main. (Errori E14/E17: diffstat assurdi presi per veri.)

5. APPLICA LA TRAPPOLA 11 PRIMA DI PRENDERE QUALUNQUE TASK.
   git fetch di TUTTI i branch e controlla se ChatGPT, Gemini o Grok hanno
   consegnato. In sessione 3 e 4 questo controllo ha trovato SEI volte lavoro che
   aspettava proprio me, e main si è mossa oltre dieci volte mentre lavoravo. Una
   volta mi ha impedito di riscrivere un fix che esisteva già.
   IL RESUME_POINT DESCRIVE IL PASSATO. I BRANCH DESCRIVONO IL PRESENTE.

6. RIESEGUI LE PROVE invece di fidarti di ciò che è scritto. DALLA ROOT, e SOLO
   la mia suite. I TRE COMANDI IN QUEST'ORDINE — il secondo NON è opzionale:
     npx tsc -p packages/contracts --noEmit    -> exit 0   (typecheck)
     npx tsc -p packages/contracts             -> exit 0   (BUILD)
     for f in tests/contracts/*.test.mjs; do node --test "$f"; done
   Atteso: 140/140 (runtime 36 · policy 28 · tools 30 · recovery 9 · skills 37).
   Era 138 fino alla sessione 4: i due in piu' sono i test di regressione di E6
   aggiunti in sessione 5. Se ne vedi 138, sei su un ref vecchio.
   SE SALTI LA BUILD ottieni 5 suite su 5 fallite con ERR_MODULE_NOT_FOUND:
   dist/ è in .gitignore e in un container nuovo non esiste. NON è una regressione.

7. Prendi il task indicato nel RESUME_POINT in fondo a CLAUDE.md, DOPO il punto 5.

LE DUE REGOLE PRIMARIE (sono in cima a CLAUDE.md, sono ordini del proprietario):

  REGOLA 1 — Il resoconto è parte del lavoro. Ogni sessione scrive in CLAUDE.md
  cosa ha fatto, COME l'ha fatto, quali ERRORI ha commesso, quanto manca con la
  formula §7.4, cosa ha deciso e lasciato aperto, e il punto di ripresa. Un lavoro
  non registrato è perso.

  MANDATO DI TECHNICAL LEAD (decisione del proprietario, 2026-08-19)
  Alla conclusione della pianificazione la leadership operativa passa a CLAUDE:
  codice, branch e PR, coordinamento di Gemini e Grok, suddivisione in task
  verificabili, gate di test/build/typecheck/sicurezza, integrazione, coerenza
  fra codice/documenti/packet/BACKLOG. ChatGPT resta SUPERVISORE ESTERNO con
  potere di rifiuto su governance, hash e ammissibilita' dei packet.
  NON E' UNA DEROGA: restano tutti i vincoli, in particolare "accepted_weight
  non si muove senza revisione indipendente", nemmeno da Technical Lead e
  nemmeno sui propri task. Non sono MAI reviewer di un mio task.
  L'INNESCO DEVE ESSERE MISURABILE: due definizioni in CLAUDE.md PARTE 3-bis §3,
  la decisione su quale adottare e' di Christian. Finche' non la prende, il
  mandato e' SOSPESO e si continua come specialista.
  Dettaglio completo, primi cinque atti e rischio dichiarato: CLAUDE.md PARTE 3-bis.

  REGOLA 3 — A FINE LAVORO SPIEGA A CHRISTIAN, IN ITALIANO, DA PERSONA.
  Ordine del proprietario (2026-08-18): "in modo umano e no AI slop, scrivi che
  hai fatto e le tue riflessioni, perche' altrimenti io non capisco".
  Alla fine del messaggio in chat, non in un file: cos'era rotto e perche'
  contava, cosa hai fatto, cosa hai sbagliato detto come lo direbbe una persona,
  cosa pensi davvero, e in una riga cosa serve da lui.
  NON: muri di hash/SHA/exit code, grassetto ovunque, frasi che suonano bene e
  non dicono niente, entusiasmo per lavoro non verificato.
  Criterio: deve capirlo leggendolo UNA volta. Se chiede "quindi in pratica?",
  e' scritta male. Dettaglio in CLAUDE.md PARTE 1.

  REGOLA 2 — A fine di OGNI task, non a fine sessione, aggiorna ED ESTENDI il
  resoconto in CLAUDE.md E in TASKCLAUDE.md, poi committa e pusha. Estensione, mai
  riscrittura: la storia degli errori è la parte più utile del file.

COSE DA NON FARE MAI:

  - non assegnarti peso: completed_weight resta 0 finché un REVIEWER non accetta.
    0/76 è CORRETTO, non è un bug da sistemare;
  - non inventare ETA o percentuali: senza velocity su due cicli, ETA UNKNOWN;
  - non dichiarare test superati senza averli eseguiti in questa sessione;
  - non citare come verificato un artefatto che non hai davvero aperto o eseguito;
  - non leggere l'esito di un comando attraverso una PIPE: `git push | tail`
    restituisce l'exit di tail. Vale per qualunque pipe, anche un grep innocuo;
  - non abilitare crediti API né alcuna spesa. Se Claude Code propone di abilitare
    crediti al raggiungimento del limite, la risposta è SEMPRE no: raggiungere il
    limite è un BLOCKED legittimo, non un problema da risolvere spendendo;
  - non invadere i portafogli altrui: core/, tools/, advisors/, bin/uj sono di
    GROK; BACKLOG/PROGRESS/schemas/scripts sono di CHATGPT; Capability Registry e
    memoria sono di GEMINI. Segnala, non correggere — salvo decisione esplicita
    del proprietario.

Comincia leggendo CLAUDE.md e dimmi cosa trovi nel RESUME_POINT prima di iniziare
a lavorare.
```

---

## Stato del programma a fine sessione 4 — sintesi per orientarsi

Questa sezione è **contesto per Christian e per una sessione che vuole il quadro veloce**.
La fonte autoritativa resta `CLAUDE.md`.

### Il mio portafoglio: 8 task, 76 unità, **0 accettate**

| Task | Peso | Consegnato | In attesa di |
|---|---:|---|---|
| UJ-RUN-001 — Runtime blueprint + contratti | 13 | sì | review **Gemini** |
| UJ-SEC-001 — Threat model + approval policy | 13 | sì | review **Grok** |
| UJ-SKL-001 — Skill Forge + sandbox | 13 | sì | review **ChatGPT** |
| UJ-MCP-001 — ToolManifest + MCP admission | 8 | sì | review **Gemini** |
| UJ-CLD-001 — Verifica accessi Claude | 8 | sì | review **Gemini** |
| UJ-RCV-001 — Checkpoint/retry/recovery | 8 | sì | review **ChatGPT** |
| UJ-REV-001 — Review del Program OS | 5 | sì | review **Christian** |
| UJ-REV-002 — Security review Website Team | 8 | **no** | **è esso stesso `DEFERRED` a M10**, e dipende da `UJ-INT-007` (anch'esso DEFERRED M10) |

**`0/76` accettato è CORRETTO** (`PROGRESS.md` regole 2 e 4). Sette task su otto sono
consegnati; **nessun reviewer si è ancora espresso su nessuno dei miei.** **Non c'è una sola
unità che io possa portare a casa lavorando di più.**

> **Fatto della sera del 19, e cambia dove sta il collo di bottiglia.** Il programma ha adesso
> **quattro review indipendenti consegnate** — `UJ-GGL-001` e `UJ-INT-001` da GROK, `UJ-RED-001`
> da CHATGPT, `UJ-CAP-001` mia. **Tre su quattro sono bloccate da una riga sola**
> (`validate-council-packets.mjs:370`, «solo per task in `REVIEW`»), **e una delle tre è di
> ChatGPT stesso**. La quarta, `UJ-INT-001`, è l'unico task già in `REVIEW` e la sua review è a
> tre modifiche dall'importare. Il controllo positivo (`UJ-INT-006`) importa a **exit 0**: il
> macchinario funziona, mancano le precondizioni.
> Misura: `node scripts/audit-review-importability.mjs` ·
> `docs/program/reviews/CLAUDE-REVIEW-IMPORTABILITY-AUDIT-20260819.md`.

Da sessione 6, ognuno dei sette consegnati ha anche un **pacchetto di evidenza per criterio**,
con un controllo eseguito per ciascun criterio e gli hash calcolati a `origin/main`:
`docs/program/packets/UJ-*-AC-EVIDENCE.md`. Se un reviewer si presenta, non deve ricostruire
niente. **Non rifare quei pacchetti.**

### Il collo di bottiglia — misurato in sessione 6, e NON è quello che credevo

Il ledger si muove sui `ResponsePacket`, che richiedono un `card_id`. **Delegation card
esistenti: quattro**, una sola mia.

**La diagnosi di sessione 4 era incompleta.** Dicevo *"servono sette card da ChatGPT"*. Misurato
eseguendo il suo validatore: **il meccanismo delle card è cablato a quattro task**
(`expectedTargets`, `validate-council-packets.mjs:443-447`), e un task `BLOCKED` **non può
riceverne una** perché lo schema impone `task_snapshot.status` come `const: "READY"`.

Sui 43 task: 29 hanno un reviewer accettato dallo schema (14 no), **6 sono `READY`**, **4 sono
ammessi da `expectedTargets`**, e **4 card esistono**. **ChatGPT ha già emesso una card per ogni
task che può averne una.** Non è in ritardo: è al tetto.

- **Emettibili subito, entrambe mie:** `UJ-SEC-001` (13) e `UJ-CLD-001` (8) — 21 unità.
  Card già scritte in `prompts/handoffs/CLAUDE-PROPOSED-CARDS-20260819.md`.
- **Richiedono tre modifiche nei file di ChatGPT**, non un file solo. Dettaglio in
  `docs/program/reviews/UJ-REV-001-ADDENDUM-CARD-ISSUANCE-CEILING.md`.
- ⚠️ `prompts/handoffs/CLAUDE-TO-CHATGPT-CARDS-REQUEST-20260818.md` è **SUPERATO**: chiedeva
  sette card, quattro impossibili. **Non inoltrarlo.**

### E il blocco che sta un anello più avanti

**Nulla, nel repository, applica una transizione di stato proposta.** Il mio packet
`UJ-RUN-001` è valido e propone `REVIEW`; il `BACKLOG.json` dice ancora `READY`. Lo stesso per
`UJ-CAP-001` di Gemini. Quindi nessun `ReviewResult` è importabile
(`validate-council-packets.mjs:347` accetta solo task in `REVIEW`) e **nessun peso può essere
accettato da nessuno**. Documentato con la correzione in
`docs/program/reviews/UJ-REV-001-ADDENDUM-LEDGER-IMPORT-PATH.md`.

### Doveri da reviewer (non contano nelle 76 unità)

Sono reviewer di 8 task altrui. **`UJ-CAP-001` (Gemini) è stato revisionato il 2026-08-19**:
`FAIL`, 3 criteri su 5 — `docs/program/reviews/UJ-CAP-001-CLAUDE-VERDICT-20260819.md`. Cinque
correzioni chieste, tre di contenuto minimo. **Tutti i verdetti precedenti su `UJ-CAP-001` sono
superati**: il registro è stato riscritto.

### Findings di sicurezza aperti su `main`

| ID | Sostanza | Stato |
|---|---|---|
| **S-17** | `cloud_bridge` va su OpenAI per default; `UJ_PLANNER_LLM=1` o `UJ_WRITER_LLM=1` da soli → 3 tentativi fatturabili | **ANCORA APERTO SU `main`.** Il fix approvato (decisione n. 7) è sul mio branch e su `agent/strict-zero-cloud-bridge-20260818`, **mai mergiato su main** |
| **S-19** | In `embed()` il budget gate è dentro `except Exception: pass`: `QuotaExceeded` viene inghiottito e la chiamata procede | aperto su `main` |
| **S-18** | `pytest` sovrascrive `grok.md` (memoria di Grok) e sporca la root: la fixture `tmp_root` è un **no-op** perché la root è catturata nei default degli argomenti | aperto, è di Grok |
| **S-16** | Record di memoria senza provenienza; il planner ora li rilegge e li mette nei piani | metà catena chiusa, **non sfruttabile oggi**; è di Gemini (`UJ-MEM-001`) |
| **S-02 · S-06 · S-07** | ammissione parziale, automazione UI nel catalogo, nessun evento `tool.*` | aperti |

**Stato consolidato al 2026-08-19, riverificato leggendo il codice su `origin/main`:**
sui primi 20 findings, **12 chiusi, 1 superato, 1 parziale, 6 aperti** (`S-06` è una decisione di
policy, non un bug). **`S-03` e `S-15`, che i miei documenti davano per non chiusi, lo sono** —
la mia lista sovrastimava di un terzo il lavoro residuo di Grok.

**La sera del 19 se ne sono aggiunti nove, cercando difetti NUOVI nel codice arrivato su
`main` dopo la sessione 4.** I findings sono ora **29**; **la vista autorevole è §30 della
security review**, con il bilancio contato dalla tabella: **10 chiusi, 1 superato, 1 parziale,
17 aperti** (di cui `S-16` → Gemini, `S-06` → Christian, 15 → Grok). **Risultato positivo dello
scan finale: 90 tool promossi su 94 sono privi di costrutti pericolosi — il gate di promozione
`FIX-1` ha tenuto.**

- **`S-21`** (MEDIUM, latente) — `PRIVILEGED_KWARGS` è una **denylist**: cinque funzioni prendono
  `real=`, che scavalca i gate d'ambiente. Oggi non è sfruttabile perché tutte e cinque sono
  `safe=False`, ma **il contenimento è il flag `safe`, non il filtro dei kwarg**.
- **`S-22`** (HIGH, latente) — esistono **due funzioni chiamate `safe_write`**, e il percorso che
  costruisce i job usa quella **senza** contenimento (`core/reliability.py`), importata come
  `guarded_write`. Attenzione: **`slugify` è sicuro**, non correggere quello.
- **`S-23`** (MEDIUM) — `PROTECTED` nomina `core/natural_tasks.py`, che è un guscio di 26 righe:
  la logica sta in `nt_runner.py`, non protetto, e contiene `promote_job_to_tools`.
- **`S-26`** (HIGH) — **il gate di safety è sulla copia, non sull'esecuzione.**
  `promote_job_to_tools` scansiona (`FIX-1`, funziona); `execute_graph`, che il codice lo
  **esegue**, non ha nessun gate. Misurato: un modulo con `eval(` e `rm -rf` viene eseguito, e lo
  scanner interrogato sullo stesso testo lo riconosce. Esposto da `uj_cli.py graph <dir>` e
  chiamato a **ogni job multi-file**. Più path traversal dai nomi in `deps.json`.
  **È la correzione da far applicare per prima** (`FIX-19`).
- **`S-25`** (HIGH, latente) — `core/billing.py`: il webhook di pagamento **non verifica la
  firma, la ispeziona**. Il segreto non entra in nessun calcolo (`hmac`: zero occorrenze) e
  quattro contraffazioni su cinque sono accettate, inclusa quella **senza header di firma**.
  Latente perché nessuno lo chiama; da correggere adesso perché con un endpoint HTTP diventa
  remoto e non autenticato. **La correzione ha una trappola: serve il corpo grezzo**, non il
  dizionario già interpretato — è scritta in testa a `FIX-18`.
- **`S-24`** (HIGH) — `core/monetization.py`, cioè il componente che deve impedire la spesa:
  **le due quote e il tetto di budget sono spenti per default**, il contatore registra **una**
  chiamata dove il retry ne fattura **tre**, il check-then-act non è atomico (misurato: fino a 8
  ammesse dove ne dovrebbe passare 1), e il registro dei consumi ha un path **relativo**, quindi
  cambiare cartella azzera la quota.

**`FIX-15` va applicato PRIMA di `FIX-16`**, per la stessa ragione di `FIX-1` prima di `FIX-2`.
**`FIX-17` va nello stesso gruppo di `FIX-10`:** uno chiude il rubinetto acceso per default,
l'altro accende il contatore spento per default — applicarne uno solo lascia il sistema o senza
tetto o senza misura.

**E la terza porta a pagamento si è aperta:** `UJ_EMBEDDING=1` porta a una chiamata fatturabile
via `core/memory.py`. Ora sono tre — planner, writer, embedding — e **`MODEL_PROVIDER=local` le
chiude tutte e tre**, perché condividono il ponte. Misurato, senza chiamate reali:
`docs/threat-models/probes/S-17-three-doors-probe.py`.

Dettaglio con comandi di riproduzione: `docs/threat-models/MAIN_IMPLEMENTATION_SECURITY_REVIEW.md`
(§19 le tre porte, §20 lo stato consolidato).
Correzioni per Grok: `docs/threat-models/GROK_FIX_LIST.md` — **tabella di stato in cima**, restano
**dieci**: `FIX-10`…`FIX-19`. **L'ordine è verificato, non asserito**
(`docs/threat-models/FIX_ORDER_ANALYSIS_20260819.md`), e due posizioni sono state corrette:

```
1 FIX-19 · 2 FIX-11 · 3 FIX-10+FIX-13+FIX-17 (un passaggio solo) ·
4 FIX-15 poi FIX-16 · 5 FIX-18 · 6 FIX-12 · 7 FIX-14
```

**`FIX-11` è in seconda posizione** perché finché non è applicato qualunque verifica con `pytest`
sovrascrive `grok.md` e altri file tracciati. **`FIX-17b` va riletto dopo aver deciso la forma di
`FIX-10`**: la correzione approvata per `S-17` rimuove `_call_openai`, cioè il bersaglio che
`FIX-17b` nomina.

### Decisione n. 7 — APPROVATA dal proprietario

`MODEL_PROVIDER` default `local`, nessuna chiamata pay-per-use implicita, fail-safe senza
fallback al cloud. Applicata e verificata sul mio branch: 6 attacchi di provider e 13 di
endpoint tutti bloccati. **Su `main` non è ancora arrivata.**

---

### Delta di sessione 6 — LEGGI QUESTO, il delta di sessione 5 è superato

**La tabella dei task non cambia nei numeri:** `0/76` accettato, e resta corretto. Cambiano tre
fatti sostanziali.

1. **`UJ-RUN-001` è `REVIEW`, non più `BLOCKED`.** Il blocco è stato sciolto dopo **cinque**
   giri: ChatGPT ha corretto il `read_ref` delle quattro card, ripristinato gli hash pinati e
   tolto l'esenzione del piano canonico dal controllo di integrità. **Sei clausole di
   ammissibilità verificate su `origin/main`**, tutte a exit 0. **PR #18 aperta** per dare al
   reviewer una sede. Il peso resta `0/13`: `REVIEW` non è accettazione.
2. **Tutti i miei task consegnati hanno ora un pacchetto di evidenza per criterio**, con un
   controllo **eseguito** per ciascuno e gli hash calcolati a `origin/main`, cioè dal punto di
   vista di chi legge: `docs/program/packets/UJ-{RUN,SEC,CLD,MCP,RCV,SKL,REV}-001-AC-EVIDENCE.md`.
   Sette su otto — l'ottavo (`UJ-REV-002`) **non può averne uno**: è `DEFERRED` a M10 e non ha
   artefatti.
3. **Il percorso critico è stato misurato** (`docs/program/CRITICAL_PATH_20260819.md`), e
   contraddice una raccomandazione che avevo dato io. Vedi sotto.

### Il percorso critico, e in che ordine conviene muoversi

**Stato: 43 task, 340 unità, 26 accettate (7,6%)** — e tutte e 26 sono task meta di ChatGPT.
**Zero unità di lavoro specialistico accettate, da nessuno dei quattro.**

| Task | Reviewer | Sblocca subito |
|---|---|---:|
| `UJ-CAP-001` | **CLAUDE** | **55** |
| `UJ-RUN-001` | GEMINI | 34 |
| `UJ-GGL-001` | GROK | 29 |
| `UJ-RED-001` | CHATGPT | 29 |
| `UJ-INT-001` | GROK | 23 |
| `UJ-SEC-001` | GROK | **21 — l'ultimo dei sei** |

**Raccomandazione:** i primi tre atti usano **tre reviewer diversi** e partono insieme —
`UJ-RUN-001` a Gemini, `UJ-RED-001` a ChatGPT, `UJ-SEC-001` a Grok: **84 unità con tre
inoltri**. `UJ-CAP-001` rende di più ma costa **due** giri, perché oggi è `FAIL`.

> **Correzione a me stesso, da non ripetere:** avevo scritto a Grok che `UJ-SEC-001` era *"la
> cosa con più leva"*. È l'ultimo dei sei. Resta vero — ed è un'altra affermazione — che è la
> chiave di volta **del mio portafoglio**.

**E il caveat che conta più di tutta la tabella:** finché manca l'anello che applica le
transizioni, **anche sei review consegnate domani lascerebbero il contatore a 26 su 340**.
L'anello va prima.

---

## Nota per Christian

Quattro cose rendono questo prompt affidabile. Conviene non toglierle:

1. **La verifica dell'hash del piano.** Se qualcuno modifica il piano canonico, la sessione
   nuova se ne accorge invece di lavorare su una versione diversa credendola quella giusta.
2. **La riesecuzione dei test, con la riga di build.** In sessione 4 la ricetta senza build
   ha prodotto 5 fallimenti su 5 e sembrava una regressione che non esisteva.
3. **Il controllo dei branch prima di prendere un task (trappola 11).** Non ha mai dato esito
   negativo: ha trovato la prima consegna di Gemini, due review che aspettavano me, e una
   volta ha impedito di riscrivere un fix che esisteva già.
4. **Il controllo dei ref prima di leggere un diff.** Due sessioni hanno tratto conclusioni
   sbagliate confrontando contro il `main` locale invece che `origin/main`.

**Cosa aggiornare quando cambia qualcosa:** la riga del branch, l'hash del piano se si
sposta, e la tabella di stato qui sopra. Se aggiorni la ricetta dei comandi, aggiornala
**anche** nel RESUME_POINT in fondo a `CLAUDE.md`: in sessione 4 le due copie erano diverse
e quella nel punto più letto era quella rotta.
