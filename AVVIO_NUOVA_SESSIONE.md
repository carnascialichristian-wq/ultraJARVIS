# Avvio di una nuova sessione CLAUDE su ultraJARVIS

> **A cosa serve questo file.** Quando una chat diventa pesante, Christian ne apre una
> nuova e incolla il testo qui sotto. Serve a far ripartire una sessione fredda senza
> perdere contesto e senza rifare lavoro già fatto.
>
> Il file esiste perché **la chat non è memoria**: se il prompt di avvio vivesse solo in
> una conversazione, andrebbe perso esattamente quando serve.
>
> **Ultimo aggiornamento: 2026-08-21, fine sessione 7.**

---

## ⚡ PRIMA DI TUTTO: LEGGI L'HANDOFF DELLA SESSIONE 8

**`docs/program/handoffs/HANDOFF-SESSIONE-8-20260821.md`**

Contiene i tre compiti già decisi e autorizzati da Christian (chiudere le PR superate,
mergiare su `main`, scrivere i prompt con il messaggio personale), lo stato misurato, e
le sei cose da non fare. **Il testo qui sotto resta valido ma è la cornice: l'handoff è
il contenuto.**

Riassunto in cinque righe, se hai fretta:
- hai il **mandato pieno** di capo tecnico, revisore e accettatore (dal 2026-08-20);
- il 21 Christian ha detto *«fai come pensi sia meglio»*: è il via libera a chiudere le PR
  e a mergiare su `main`;
- programma a **52/340 = 15,3 %**; il **mio** portafoglio è a **0/76**, e il motivo non è
  che non ho consegnato — è che nessuno ha ancora accettato;
- `bash scripts/integration-gate.sh` deve dare **GATE PASS** prima di qualunque push;
- ~~ChatGPT ha emesso le card: adesso posso emettere i due ResponsePacket.~~ **FATTO in
  sessione 8**: i due packet esistono, validano, e le transizioni `READY → REVIEW` sono
  applicate — a **peso 0**, perché nessuno ha accettato;
- **la leva maggiore del programma è di GROK, non di Gemini**: `UJ-SEC-001` sblocca **34**
  unità in un giro, `UJ-RUN-001` ne sblocca 21. L'handoff della sessione 7 attribuiva il 34
  al task sbagliato — ricalcolato sulla chiusura delle dipendenze in sessione 8.

---

## TESTO DA INCOLLARE

Copia da qui, senza accorciare.

```text
Lavori al programma ultraJARVIS. La tua identità è CLAUDE — Runtime, Security &
Skill Architect. Il proprietario del programma è Christian.

PRIMA DI QUALUNQUE COSA, LEGGI:
  docs/program/handoffs/HANDOFF-SESSIONE-8-20260821.md
Contiene i tre compiti gia' autorizzati da Christian e lo stato misurato.
Hai il MANDATO PIENO di capo tecnico, revisore e accettatore dal 2026-08-20.

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
  BRANCH DI LAVORO: da fine sessione 6, casa e consegna sono UNIFICATE su
    agent/uj-run-001-blueprint-20260818
  Questo branch contiene TUTTO: CLAUDE.md e TASKCLAUDE.md aggiornati, la
  consegna riconciliata di UJ-RUN-001, e tutto il lavoro di sessione 6 (RTE,
  DEC, SEL, la demo §21, il gate di integrazione). I branch precedenti
  (claude/claude-md-resume-point-tvej1u, claude/ultrajarvis-repo-analysis-li6vvj,
  claude/ultrajarvis-program-setup-2noca9) sono INDIETRO: non ripartire da lì.
  L'AMBIENTE PUÒ COMUNQUE NON ASSEGNARTI QUESTO BRANCH, O ASSEGNARTENE UNO VUOTO
  — è già successo tre volte (sessioni 4, 5, 6). Se il branch assegnato non è
  quello sopra, o se il container è vuoto (nessun file, repository non clonato),
  fai il checkout tu stesso di agent/uj-run-001-blueprint-20260818 e DIMOSTRA che
  è la scelta giusta con
    git rev-list --left-right --count origin/main...agent/uj-run-001-blueprint-20260818
  (atteso: 0 indietro, N avanti — se dà indietro > 0, non è la copia buona: dillo
  invece di procedere).
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

6. RIESEGUI LE PROVE invece di fidarti di ciò che è scritto. DALLA ROOT.
   UN SOLO COMANDO, che fa la build prima dei test e legge ogni exit code dal
   comando vero:
     bash scripts/integration-gate.sh    -> atteso: GATE PASS, 13 bloccanti a exit 0
   Include typecheck, BUILD, i 140 test dei contratti, e le sei suite separate
   RTE 7 / DEC 12 / SEL 12 / FBK 10 / CNF 12 / T-SEC-1 14, piu' la demo §21 e i
   tre validatori. Se vuoi la sola suite dei contratti, i tre comandi in quest'ordine
   — il secondo NON e' opzionale:
     npx tsc -p packages/contracts --noEmit    -> exit 0   (typecheck)
     npx tsc -p packages/contracts             -> exit 0   (BUILD)
     for f in tests/contracts/*.test.mjs; do node --test "$f"; done
   Atteso: 140/140 (runtime 36 · policy 28 · tools 30 · recovery 9 · skills 37).
   Il 140 e' CONGELATO di proposito: e' dichiarato in due artefatti in review presso
   Gemini. Ogni test nuovo va in una suite separata, mai in tests/contracts/.
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

## Stato del programma — dove trovarlo, non un numero da ricopiare qui

**Questa sezione elenca cose STABILI**: cosa sono i miei task, la natura dei due blocchi
strutturali, le decisioni prese. **Non ripete numeri che cambiano di ora in ora** (quanti
findings sono aperti, quante unità sono accettate, l'ordine di correzione) — quei numeri sono
già duplicati in `CLAUDE.md`, e un numero duplicato in due file diverge sempre (è successo a
questo stesso file: la versione precedente diceva ancora "fine sessione 4" mentre il programma
era già sei sessioni avanti).

**Per lo stato vero, ORA, leggi il riquadro `⚡ STATO AL …` in cima al RESUME_POINT, in fondo a
`CLAUDE.md`.** È l'unica fonte che aggiorno a ogni chiusura di lavoro. Se qualcosa qui sotto lo
contraddice, vince il riquadro.

### Il mio portafoglio: 8 task, 76 unità

| Task | Peso | Reviewer designato |
|---|---:|---|
| UJ-RUN-001 — Runtime blueprint + contratti | 13 | Gemini |
| UJ-SEC-001 — Threat model + approval policy | 13 | Grok |
| UJ-SKL-001 — Skill Forge + sandbox | 13 | ChatGPT |
| UJ-MCP-001 — ToolManifest + MCP admission | 8 | Gemini |
| UJ-CLD-001 — Verifica accessi Claude | 8 | Gemini |
| UJ-RCV-001 — Checkpoint/retry/recovery | 8 | ChatGPT |
| UJ-REV-001 — Review del Program OS | 5 | Christian |
| UJ-REV-002 — Security review Website Team | 8 | ChatGPT — `DEFERRED` a M10, non lavorabile |

Tutti e sette i task lavorabili sono **consegnati**, ciascuno con un pacchetto di evidenza per
criterio in `docs/program/packets/UJ-*-AC-EVIDENCE.md` (un controllo eseguito per ogni criterio,
hash calcolati da `origin/main`). Se arriva un reviewer, non deve ricostruire niente: **non
rifare quei pacchetti**. `0/76` accettato è CORRETTO finché nessun reviewer si esprime — non è
un bug da sistemare.

### I due blocchi strutturali — la loro NATURA non cambia, anche se lo stato sì

Sono entrambi di ChatGPT, misurati eseguendo il suo validatore, non dedotti:

1. ~~**Nulla applica una transizione di stato proposta.**~~ **RISOLTO** da ChatGPT il
   2026-08-21: `scripts/apply-program-transition.mjs` esiste, parte in dry-run e richiede
   `--apply --confirm-task`. **Usato davvero in sessione 8** per portare `UJ-RUN-001`,
   `UJ-SEC-001` e `UJ-CLD-001` da `READY` a `REVIEW`, tutti a peso 0. Il documento
   `UJ-REV-001-ADDENDUM-LEDGER-IMPORT-PATH.md` descrive il difetto **storico**: leggilo come
   storia, non come stato.
2. ~~**Le delegation card sono cablate a un insieme fisso.**~~ **RISOLTO**: il validatore ora
   scandisce la directory con `readdirSync` invece di leggere una lista a quattro, e le card
   per `UJ-SEC-001` e `UJ-CLD-001` sono state emesse. Anche qui
   `UJ-REV-001-ADDENDUM-CARD-ISSUANCE-CEILING.md` è storia.
3. **BLOCCO NUOVO, trovato in sessione 8 e ancora aperto:** `taskDelta.previous_status` nello
   schema ammette solo `READY | IN_PROGRESS | BLOCKED`. Un task già in `REVIEW` **non è
   rappresentabile** come stato di partenza, quindi un packet non può essere riemesso per
   correggerlo: un difetto di sicurezza scoperto *dopo* la consegna non ha canale sanzionato.
   È di ChatGPT, ed è segnalato nel dispatch della sessione 8.

**Verifica lo stato ATTUALE di questi due** con `node scripts/audit-review-importability.mjs`:
lo script produce candidati misurati sul commit corrente, non un numero congelato in un documento.

### Lavoro di fondazione già fatto in sessione 6 — non ripartire da zero

Il blueprint §21 specifica cinque sottosistemi che per cinque sessioni non avevano contratto
(decomposizione DEC, selezione SEL, routing RTE, fallback FBK, conflitto CNF), e una demo
end-to-end che per sei sessioni non era mai stata scritta. In sessione 6:

- **La demo gira**: `packages/contracts/demo/mission-demo.mjs` (`node` diretto, dopo la build).
  9 osservabili + 4 casi negativi, exit 0, costo zero.
- **TUTTI E CINQUE i contratti esistono ed è NON RIFARLI**: `routing/` (RTE, §18),
  `decomposition/` (DEC, §16), `selection/` (SEL, §17), `fallback/` (FBK, §20),
  `conflict/` (CNF, §19) — completati in sessione 7. Più `tests/threat-model/` (`T-SEC-1`,
  14 prove) aggiunta in sessione 8. Ogni suite vive FUORI da `tests/contracts/`, quindi il
  conteggio congelato **140 resta invariato**.
- **Esiste un gate di integrazione**: `bash scripts/integration-gate.sh` esegue typecheck,
  build, le quattro suite di contratti, la demo, e i validatori del Council in un solo comando,
  con ogni exit code letto dal comando vero. Usalo prima di dichiarare qualunque cosa verde.
  **Non esegue `pytest`** di proposito. Attenzione alla motivazione, che è cambiata:
  `FIX-11` **è stato applicato da Grok ed è su `main` dalla sessione 8**, quindi la vecchia
  ragione ("finché non è applicato") non vale più alla lettera. Il gate gira contro l'albero
  corrente e conta dove il fix è **arrivato**, non dove è stato scritto: il comando per
  decidere quando togliere l'esclusione è nel commento in testa a `integration-gate.sh`.
  Non toglierla "perché FIX-11 esiste".

Tutti e tre i contratti nuovi, la demo e il gate sono **superficie separata**: non toccano i 15
artefatti congelati della consegna di `UJ-RUN-001`, verificato a ogni passo ricalcolando gli
hash. Se rileggi il codice e vedi `[demo]` in un commento, quel pezzo non ha ancora un contratto
reale — controlla comunque nel Session Log di `CLAUDE.md` se non sia stato costruito da allora.

### La security review su `main` (codice di Grok)

È una campagna aperta, findings numerati progressivamente (`S-01`, `S-02`, …), ognuno con un
comando di riproduzione. **La vista autorevole su TUTTI i findings è sempre la sezione più alta
numerata "Stato consolidato" dentro `docs/threat-models/MAIN_IMPLEMENTATION_SECURITY_REVIEW.md`**
— non fidarti di un numero di findings scritto altrove, incluso in questo file: cerca quella
sezione e leggi la sua intestazione, che porta sempre la data. Le correzioni proposte a Grok
sono in `docs/threat-models/GROK_FIX_LIST.md`, con una tabella di stato in cima e l'ordine di
applicazione **verificato**, non asserito, in `docs/threat-models/FIX_ORDER_ANALYSIS_20260819.md`.

**Decisione n. 7, APPROVATA dal proprietario**: `MODEL_PROVIDER` default `local`, nessuna
chiamata pay-per-use implicita, fail-safe senza fallback al cloud. Verificata sul branch di
lavoro. Se non sai se è già su `main`, controlla — non darlo per scontato in nessuna direzione:
è stato vero e falso in sessioni diverse.


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

**Cosa aggiornare quando cambia qualcosa:** la riga del branch e l'hash del piano, qui sopra —
sono le uniche due cose stabili che questo file dichiara direttamente. **La tabella dei task e i
due blocchi strutturali restano**, perché cambiano di sessione in sessione, non di ora in ora;
i numeri (findings aperti, unità accettate, percentuali) NON vanno mai scritti qui: vivono solo
nel riquadro `⚡ STATO AL …` di `CLAUDE.md`, apposta per non riprodurre la stessa divergenza che
questo file aveva accumulato fino a sessione 6 (diceva ancora "fine sessione 4" a sessione 6
inoltrata). Se aggiorni la ricetta dei comandi, aggiornala **anche** nel RESUME_POINT in fondo a
`CLAUDE.md`: in sessione 4 le due copie erano diverse e quella nel punto più letto era quella rotta.
