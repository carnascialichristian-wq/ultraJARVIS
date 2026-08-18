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
| UJ-REV-002 — Security review Website Team | 8 | **no** | `UJ-INT-007`, DEFERRED a M10 |

**`0/76` accettato è CORRETTO** (`PROGRESS.md` regole 2 e 4). Sette task su otto sono
consegnati; nessun reviewer si è ancora espresso. **Non c'è una sola unità che io possa
portare a casa lavorando di più.**

### Il collo di bottiglia, e non è mio

Il ledger si muove sui `ResponsePacket`. Per emetterne uno serve un `card_id`, e le
**delegation card esistenti sono quattro in tutto** — una sola mia. ChatGPT mi ha assegnato
otto task ed emesso una card.

- **Fatto:** `docs/program/packets/UJ-RESP-RUN-001-CLAUDE.json`, validato, 15 hash verificati.
- **Serve da ChatGPT:** sette delegation card. Messaggio pronto da inoltrare in
  `prompts/handoffs/CLAUDE-TO-CHATGPT-CARDS-REQUEST-20260818.md`.

### Doveri da reviewer (non contano nelle 76 unità)

Sono reviewer di 8 task altrui. Uno solo è azionabile: **UJ-CAP-001** (Gemini), in attesa
del reinvio dopo il mio pre-verdetto `CHANGES_REQUIRED`.

### Findings di sicurezza aperti su `main`

| ID | Sostanza | Stato |
|---|---|---|
| **S-17** | `cloud_bridge` va su OpenAI per default; `UJ_PLANNER_LLM=1` o `UJ_WRITER_LLM=1` da soli → 3 tentativi fatturabili | **ANCORA APERTO SU `main`.** Il fix approvato (decisione n. 7) è sul mio branch e su `agent/strict-zero-cloud-bridge-20260818`, **mai mergiato su main** |
| **S-19** | In `embed()` il budget gate è dentro `except Exception: pass`: `QuotaExceeded` viene inghiottito e la chiamata procede | aperto su `main` |
| **S-18** | `pytest` sovrascrive `grok.md` (memoria di Grok) e sporca la root: la fixture `tmp_root` è un **no-op** perché la root è catturata nei default degli argomenti | aperto, è di Grok |
| **S-16** | Record di memoria senza provenienza; il planner ora li rilegge e li mette nei piani | metà catena chiusa, **non sfruttabile oggi**; è di Gemini (`UJ-MEM-001`) |
| **S-02 · S-06 · S-07** | ammissione parziale, automazione UI nel catalogo, nessun evento `tool.*` | aperti |

Dettaglio completo con comandi di riproduzione: `docs/threat-models/MAIN_IMPLEMENTATION_SECURITY_REVIEW.md`.
Correzioni applicabili per Grok: `docs/threat-models/GROK_FIX_LIST.md` (FIX-1..FIX-11).

### Decisione n. 7 — APPROVATA dal proprietario

`MODEL_PROVIDER` default `local`, nessuna chiamata pay-per-use implicita, fail-safe senza
fallback al cloud. Applicata e verificata sul mio branch: 6 attacchi di provider e 13 di
endpoint tutti bloccati. **Su `main` non è ancora arrivata.**

---

### Delta di sessione 5 — cosa è cambiato rispetto alla tabella qui sopra

La tabella di stato dei task **non cambia nei numeri**: 7 su 8 hanno una consegna, `0/76`
accettato, e resta corretto. Cambia lo stato di uno di quei sette e compare un ottavo fatto.

1. **La suite è 140, non 138.** Due test di regressione nuovi (`runtime` 34 → 36). Trovata e
   chiusa la **seconda occorrenza dell'errore E6**: `depth-guard.ts` usava un byte NUL come
   separatore nella chiave del rilevatore di cicli. Falsi positivi misurati, e il file era
   **binario** per git e grep, quindi fuori da ogni audit testuale per quattro sessioni.
2. **`UJ-RUN-001` ha un gate di consegna, e la prima consegna era incoerente.** Riconciliata
   in due giri su un branch dedicato — `agent/uj-run-001-blueprint-20260818`, un solo
   `source_commit_sha` (`79408449bd096613d2823efe6872ed424b757ee6`) per i quattro documenti.
   **Resta `BLOCKED`, non `REVIEW`**: la delegation card non esiste al commit che il suo
   stesso `read_ref` nomina. Correggere quel `read_ref` è l'unica cosa che manca — a quel
   punto questi stessi byte diventano una consegna `REVIEW` senza altra modifica.
3. **`S-17` e `S-19` sono ancora aperti su `main`** — terza verifica — e i candidati alla
   correzione sono diventati **tre**. `v1` e `v2` sono byte-identici e **mergiarli oggi
   cancellerebbe `embed()`**, rompendo `core/memory.py`. Raccomandazione e misure in
   `docs/program/reviews/UJ-SEC-003-STRICT-ZERO-CANDIDATE-RECONCILIATION.md`.
4. **Gemini ha rispedito `UJ-CAP-001` per la seconda e poi per la terza volta.** Il secondo
   invio (`27b3717`) è stato revisionato: **FAIL, 3 criteri su 5**, era 1 su 5 nella
   quarantena originale — `docs/program/reviews/UJ-CAP-001-CLAUDE-VERDICT-20260818.md`. **Il
   terzo invio (`0f1c536`) è stato trovato dalla trappola 11 a fine sessione e NON è ancora
   aperto**: aggiunge il `ResponsePacket` che mancava (`F-001`). **È il primo task della
   sessione che apri.**

**Una cosa sola serve ancora da altri, ed è il vero collo di bottiglia:** ChatGPT deve
correggere il `read_ref` della delegation card di `UJ-RUN-001` — la consegna tecnica è già
pronta e ferma da lì. Resta anche aperto un merge del fix strict-zero su `main`, da parte di
chi ne ha l'autorizzazione.

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
