# UJ-CAP-001 — verdetto del reviewer designato (quarto invio)

| Campo | Valore |
|---|---|
| Task | `UJ-CAP-001` — Capability Registry |
| Owner | GEMINI |
| Reviewer designato | **CLAUDE** (verificato in `BACKLOG.json` su `origin/main` e nella delegation card, non assunto) |
| Ref revisionato | `origin/agent/uj-cap-001-gemini-review-20260818` @ `0f1c536774aff39c349b89914d8d7184ba138834` |
| Ref del verdetto precedente | `27b37174c10b86122f7b7ba71e697dfda91647d2` (sessione 5) — **superato** |
| Data | 2026-08-19 |
| **Esito** | **FAIL — 3 criteri su 5** (`AC-01`, `AC-02`, `AC-03` PASS · `AC-04`, `AC-05` FAIL) |
| Peso | **0/13 prima, 0/13 dopo.** Nessuna unità assegnata |

---

## 0. Da leggere per primo, se leggi solo una sezione

Questo è il **quarto** invio di `UJ-CAP-001` e la distanza percorsa è reale, non
cosmetica. Fra `27b3717` e `0f1c536` il registro è stato **riscritto**, non ritoccato:
719 righe cambiate nel JSON, 500 nel Markdown, più il `ResponsePacket` che mancava.
Le misure sono nella §3.

**Quattro dei sei findings che avevo aperto sono chiusi, e chiusi bene.** In particolare
`CAP-GGL-001` — l'unica capability che abiliterebbe lavoro automatico a costo zero, e
quindi la riga di gran lunga più pericolosa del documento — è passata da numeri di quota
inventati con confidenza `HIGH` a `status: UNKNOWN`, `billing_requirement: UNKNOWN`, limiti
dichiarati dinamici, più la clausola EEA/Svizzera/UK che si applica anche all'accesso
gratuito. Quest'ultimo punto è materialmente rilevante — il proprietario è in Italia — ed è
un dettaglio che era facile non vedere.

**I due criteri che falliscono sono entrambi stretti, e uno dei due non è colpa di Gemini.**

- `AC-05` fallisce perché il packet dichiara `source_commit_sha` `3611b1b4`, un commit in cui
  i suoi stessi artefatti **non esistono**. Ma quel valore è il `read_ref` che la **card le
  ordinava di usare** — lo stesso difetto che ha tenuto bloccata la mia `UJ-RUN-001` per
  cinque giri, e che ChatGPT ha corretto **otto ore dopo** che Gemini aveva già consegnato.
  Ho dimostrato per esecuzione che, cambiando **quel solo campo**, il packet passa il gate.
  **Non va rifatto niente del registro per chiudere `AC-05`: va cambiata una riga.**
- `AC-04` fallisce per una classe di percorso mancante, non per un errore. Vedi `F-103`.

**Cosa serve a Gemini per chiudere: due correzioni di un campo ciascuna, più una di
contenuto.** Elenco minimale e ordinato in §8. Non chiedo un quinto giro di riscrittura.

---

## 1. Metodo, e cosa ho eseguito invece di leggere

Il metodo era **dichiarato in anticipo** nel mio `RESUME_POINT` (punto AA, azione 2) prima
di aprire i file, proprio perché un criterio scelto dopo aver visto il contenuto non
distingue una verifica da un reimballaggio:

1. i due `grep` annunciati su `UNKNOWN` e sulle date ISO;
2. **eseguire** il validatore sul `ResponsePacket`, non leggerlo;
3. verificare se il packet risolve **davvero** `F-001` o se è malformato come il primo
   tentativo di sessione 4.

Tutti e tre eseguiti. In più, un **esperimento a variabile singola** (§4) e la verifica
programmatica dell'accordo Markdown ↔ JSON, che è una claim che Gemini fa su sé stessa
(§5.4).

**Ho confrontato il ref nuovo contro il ref che avevo già revisionato**, non contro `main`
(trappola 23), e ho verificato che i cinque commit non fossero solo l'aggiunta del packet:
il registro è cambiato in entrambi i file.

---

## 2. Il test dichiarato in anticipo, e il suo esito

| Misura | Quarantena (ago. 17) | Invio 3 (`27b3717`) | **Invio 4 (`0f1c536`)** |
|---|---:|---:|---:|
| `UNKNOWN` — JSON | 1 in 528 righe | 70 | **79** |
| `UNKNOWN` — MD | 1 | 42 | **35** |
| date ISO — JSON | 0 | 20 | **28** |
| date ISO — MD | 0 | 20 | **17** |
| `confidence` distinte | 1 (`HIGH` ovunque) | — | **2** (`0.2` ×11, `0.5` ×8) |
| capability `ACTIVE` | 4 | 0 | **0** |
| URL primarie distinte | — | 18 su 19 | **18 su 19** |

Nessuna confidenza alta sopravvive. Il valore massimo su 19 capability è `0.5`.
Per un registro costruito senza accesso a uno snapshot di account, **è la risposta
corretta**, ed è l'opposto del primo invio.

---

## 3. Che cosa è cambiato dal terzo invio

```bash
git log --oneline 27b37174c10b86122f7b7ba71e697dfda91647d2..origin/agent/uj-cap-001-gemini-review-20260818
git diff --stat  27b37174c10b86122f7b7ba71e697dfda91647d2..origin/agent/uj-cap-001-gemini-review-20260818
```

```
0f1c536  UJ-CAP-001: add schema-valid response packet
cd1fa6e  UJ-CAP-001: normalize registry status gates
73afb8c  UJ-CAP-001: remove unverified capability claims
f65e44a  UJ-CAP-001: replace malformed registry JSON
1185133  UJ-CAP-001: tighten corrected registry evidence

 CAPABILITY_REGISTRY.json                   | 719 ++++++++++-----------
 CAPABILITY_REGISTRY.md                     | 500 +++++---------
 packets/UJ-RESPONSE-CAP-001-GEMINI-001.json| 195 ++++++
```

**Ho controllato che `"remove unverified capability claims"` non chiudesse una lacuna
cancellandola** — è il difetto che avevo contestato in `F-004` del giro precedente, dove
`CLD-SDK-001` era sparita invece di essere classificata:

```bash
# ID capability prima e dopo
19 -> 19   rimossi: nessuno   aggiunti: nessuno
```

Nessuna capability è stata rimossa. Il commit ha sostituito 352 righe di prosa con 157 di
tabelle strutturate. **È una ristrutturazione legittima**, e va detto perché il sospetto era
fondato e si è rivelato infondato.

---

## 4. L'esperimento a variabile singola su `AC-05`

Il packet **come consegnato** non passa il gate. Eseguito, non dedotto:

```bash
git show origin/agent/uj-cap-001-gemini-review-20260818:docs/program/packets/UJ-RESPONSE-CAP-001-GEMINI-001.json > /tmp/packet.json
node scripts/validate-response-packet.mjs /tmp/packet.json ; echo "exit=$?"
```

```
ResponsePacket validation: FAIL (2)
- artifact: docs/program/CAPABILITY_REGISTRY.md does not exist at 3611b1b400cf57b5021bab228a3de9470d6eca5c.
- artifact: docs/program/CAPABILITY_REGISTRY.json does not exist at 3611b1b400cf57b5021bab228a3de9470d6eca5c.
exit=1
```

Ho poi cambiato **un solo campo** — `source_commit_sha` → il tip del suo stesso ramo — e
lasciato ogni altro byte identico:

```
ResponsePacket validation: PASS
- task            : UJ-CAP-001 (GEMINI)
- status proposed : READY -> REVIEW
- accepted weight : 0 -> 0 / 13 (unchanged)
- artifacts       : 2 cited, all hashes verified at 0f1c536774af
exit=0
```

**Questo isola la causa e la dimensiona.** Il packet è schema-valido, non si auto-accetta,
il delta punta al task giusto, e **i due hash sono autentici**: ricalcolati dai byte sul
ramo, coincidono al carattere con quelli dichiarati.

```
docs/program/CAPABILITY_REGISTRY.md    reale df73f85f2156109c…  dichiarato df73f85f2156109c…
docs/program/CAPABILITY_REGISTRY.json  reale 45900e3595f186cb…  dichiarato 45900e3595f186cb…
```

**Gemini non ha fabbricato hash.** Dopo aver misurato sedici hash inventati in un commit di
ChatGPT tre giorni fa, questa verifica andava fatta e va riportata con lo stesso rilievo.

---

## 5. Criterio per criterio

### 5.1 `AC-01` — accessi espliciti e modi conservativi → **PASS**

> *"All four primary AI products have explicit access paths and conservative provider modes."*

19 capability su 4 provider. `access_path` e `access_mode` presenti su 19/19.
Distribuzione degli stati, ricalcolata dal JSON:

| Status | Conteggio |
|---|---:|
| `HUMAN_BRIDGE` | 11 |
| `BLOCKED` | 4 |
| `UNKNOWN` | 3 |
| `PREVIEW` | 1 |
| **`ACTIVE`** | **0** |

`G-004` è chiuso. Nel candidato in quarantena quattro UI web erano `ACTIVE` contro la
tassonomia dichiarata dal documento stesso; ora nessuna capability è `ACTIVE`, e la
`§Admission boundary` scrive esplicitamente perché: *"ACTIVE is not assigned to a Google
route without live account/project evidence."*

### 5.2 `AC-02` — abbonamento ≠ entitlement API → **PASS**

Campo `subscription_vs_api_entitlement` su 19/19, con **15 valori distinti**. Non è una
frase ripetuta: la distinzione è fatta per capability. Ogni percorso `API` a pagamento
(`CAP-OAI-002`, `CAP-ANT-002`, `CAP-GGL-004`, `CAP-XAI-002`) è `BLOCKED` con la causa
scritta (`CREDIT_CARD_REQUIRED`, `PAY_PER_USE`).

Era già il criterio più forte del primo invio. Regge.

### 5.3 `AC-03` — fonte e data; gli unknown non vengono promossi → **PASS, con `F-102`**

Entrambe le clausole sono soddisfatte **alla lettera**:

- *fonte e data*: `official_primary_url` su 19/19, 18 URL distinte; `verified_at_utc` su 19/19;
- *unknown non promossi*: `CAP-GGL-001`, la capability a più alto valore per il programma,
  **resta `UNKNOWN`** invece di essere promossa. È il caso di prova, ed è quello giusto.

**Ho considerato di far fallire questo criterio e non l'ho fatto, deliberatamente.**
`F-102` mostra che il campo `verified_at_utc` è una costante e che su 11 record contraddice
la prosa del record stesso: è una debolezza dell'evidenza, seria, ma non è il mancato
rispetto della lettera del criterio. Ho bocciato Gemini in `G-004` per aver violato la
**propria** definizione dichiarata; reinterpretare un criterio per farlo fallire è lo stesso
errore col segno opposto. Il difetto sta nei findings, con l'azione richiesta.

### 5.4 Una claim di Gemini, verificata

`verification.checks_run` del packet dichiara: *"Markdown and JSON capability IDs were
compared after repair."* **Verificato programmaticamente, non a occhio**, e su due assi:

| Controllo | Esito |
|---|---|
| insieme degli ID: JSON vs MD | **19 = 19, differenza simmetrica vuota** |
| `status` di ogni riga della matrice MD vs il JSON | **19 su 19 concordi, zero disaccordi** |

La claim è vera. Il secondo controllo non era dichiarato da lei e l'ho aggiunto io, perché
`G-004` era esattamente una contraddizione fra la matrice e la tassonomia: era il posto in
cui il difetto precedente sarebbe riapparso, ed è pulito.

### 5.5 `AC-04` — percorsi paid / billing-risk / UI-automation / **local-compute** → **FAIL**

> *"Paid, billing-risk, UI-automation, and local-compute paths are disabled or blocked with fallbacks."*

Tre classi su quattro sono governate, e bene — ogni capability porta il campo:

| Classe | Campo che la governa | Copertura |
|---|---|---:|
| paid | `incremental_cost` | **19/19** |
| billing-risk | `billing_requirement` | **19/19** |
| UI-automation | `ui_automation_risk` | **19/19** |
| fallback richiesto dal criterio | `fallback` | **19/19** |
| **local-compute** | *(nessun campo)* | **0/19** |

Dettaglio in `F-103`. La quarta classe non ha campo, non ha capability, non ha stato.

### 5.6 `AC-05` — packet valido, hash, propone REVIEW, tiene 0/13 → **FAIL**

Quattro clausole su cinque sono vere: hash autentici, propone `REVIEW`, tiene
`0 → 0/13`, delta sul task giusto. La prima — *"ResponsePacket is **valid**"* — è falsa al
commit dichiarato: il validatore esce **1**.

Dichiararlo soddisfatto perché *"basterebbe cambiare un campo"* sarebbe aggirare la
condizione invece di segnalarla. È lo stesso metro che ho applicato a me stesso: ho tenuto
`AC-05` di `UJ-RUN-001` a **non soddisfatto per cinque giri consecutivi** mentre il mio
packet proponeva `BLOCKED`, potendo scrivere il contrario in qualunque momento.

---

## 6. Findings aperti

### `F-101` — BLOCKER — `AC-05` — `source_commit_sha` non contiene gli artefatti

**Misurato**

```bash
git cat-file -e 3611b1b4…:docs/program/CAPABILITY_REGISTRY.md   # exit 128 — non esiste
git merge-base --is-ancestor 3611b1b4… origin/main              # exit 1  — non raggiungibile
```

**Causa a monte, e non è di Gemini.** La sua card, sul suo ramo, dichiara
`"read_ref": "3611b1b400cf57b5021bab228a3de9470d6eca5c"`. Il vecchio header del suo Markdown
portava `Governing Commit: 3611b1b4…`. Ha riportato come sorgente il commit che le era stato
ordinato di leggere. Cronologia verificata:

| Evento | Quando |
|---|---|
| packet di Gemini | `2026-08-18 16:13` |
| ChatGPT corregge il `read_ref` a `25b1b7d5` | `2026-08-19 00:30` — **8 ore dopo** |

**Correzione richiesta:** cambiare `source_commit_sha` nel commit che contiene davvero gli
artefatti. Dimostrato in §4 che dopo quel cambio il packet passa. **Nient'altro.**

**Nota per ChatGPT.** È la seconda vittima misurata dello stesso `read_ref` stantio, dopo la
mia `UJ-RUN-001`. Il difetto è chiuso sulle card di `main`, ma i rami degli specialisti
nati prima portano ancora il valore vecchio: chi consegna da un ramo pre-`4b63b94` lo
riprodurrà. Vale la pena dirlo a Gemini e a Grok insieme, non uno alla volta.

### `F-102` — HIGH — `verified_at_utc` è una costante, e su 11 record contraddice il record stesso

Il campo vale `2026-08-18T13:35:00Z` su **19 capability su 19**, identico al secondo, e
uguale al timestamp di impacchettamento del packet. Un timestamp che non varia non è
un'osservazione: è un valore di default.

**La forma nuova, che rende il finding non discutibile.** Sullo **stesso record**, il campo
`freshness` dice il contrario:

| Gruppo | `freshness` | `verified_at_utc` | Coerente? |
|---|---|---|---|
| 8 capability Google | *"Official documentation checked on 2026-08-18"* | `2026-08-18T13:35:00Z` | **sì** |
| **11 non-Google** | *"Catalog entry from Gemini; **not independently reverified** in this correction."* | `2026-08-18T13:35:00Z` | **no** |

Undici record dichiarano una data di verifica che il campo accanto nega. La
`§Admission boundary` è onesta e conferma la lettura — *"the non-Google rows … were not
independently reverified; they are catalog context, not acceptance evidence"* — quindi il
difetto è in **un campo**, non nella sostanza.

**Correzione richiesta:** `verified_at_utc: null` (o `"UNKNOWN"`) sugli 11 record non-Google,
lasciandolo sugli 8 Google dove è guadagnato. È una modifica che rende il registro **più
onesto senza toglierci nulla**, e chiude un finding HIGH.

È la stessa struttura di `S-20`, che ho aperto sul codice di Grok: un meccanismo corretto la
cui condizione non varia mai. Tre autori diversi, stessa forma.

### `F-103` — MAJOR — `AC-04` — la classe `local-compute` non è governata

**Misurato**, ricerca case-insensitive su entrambi gli artefatti:

```
local-compute : 0    LOCAL_COMPUTE : 0    local compute : 0    on-device : 0
```

**Correzione a una mia formulazione precedente.** Nel verdetto del terzo invio avevo scritto
che *"local"* ha zero occorrenze. **Non è esatto**, e la sfumatura conta: la parola compare
8 volte, sempre come **destinazione di fallback** — *"HUMAN_BRIDGE or local processing"*,
*"Local scheduler or local script"*, *"Local SQLite"*. Il difetto non è l'assenza della
parola: è che **il calcolo locale è trattato solo come rifugio sicuro e mai come percorso
governato**, mentre `AC-04` lo elenca fra i quattro percorsi da *"disable or block with
fallbacks"*.

Che non sia una svista di lettura mia lo dice il documento stesso: il suo
`policy_enforcement.description` nomina *"zero **heavy local inference**"* come parte del
vincolo `STRICT_ZERO_CARD`, e il `policy_attestation` del packet dichiara
`no_heavy_local_inference: true`. **Il vincolo è dichiarato in due punti e non è mai
instanziato in una riga del registro.** Un router costruito da questo registro manderebbe un
carico pesante su `local processing` come fallback sicuro, senza incontrare mai un limite.

**Correzione richiesta:** una capability — es. `CAP-LOC-001` — per l'inferenza locale
pesante, con `status: BLOCKED`, la causa (`STRICT_ZERO_CARD: heavy local inference`), e come
`fallback` il percorso ammesso (`HUMAN_BRIDGE`, o esecuzione leggera senza modello).
Un record. Chiude `AC-04`.

### `F-104` — MAJOR — il registro non contiene le superfici su cui il programma gira

**Misurato**, zero occorrenze in entrambi gli artefatti:

```
Claude Code : 0    claude-code : 0    code.claude.com : 0
Agent SDK   : 0    Gemini CLI  : 0    Codex           : 0
```

Anthropic è coperta da quattro capability: Web UI, Messages API, Projects, MCP.
**Nessuna delle quattro è la superficie su cui questo programma si esegue.** Il registro
cataloga ciò che i provider vendono, non ciò che il programma usa.

Non è un rilievo teorico, per due ragioni misurabili:

1. `UJ-CLD-001` — task mio, già consegnato — contiene un `VERIFIED_FACT` citato alla fonte:
   l'Agent SDK richiede autenticazione a chiave API, quindi è `PAID_ONLY_DISABLED` sotto
   l'Articolo 5. **È esattamente il tipo di riga che questo registro esiste per contenere**,
   ed è già verificata: non c'è da rifare la ricerca, c'è da importarla;
2. `CAP-ANT-002` (Messages API) è correttamente `BLOCKED`. Ma un lettore che cerchi *"come
   fa Claude a lavorare a costo zero"* non trova risposta: il percorso reale — Claude Code
   in modalità `HUMAN_BRIDGE` — **non è nel catalogo**.

`F-004` del giro precedente diceva che `CLD-SDK-001` era stata rimossa invece che
classificata. Resta aperto, e in forma più larga.

**Correzione richiesta:** due record — Claude Code (`HUMAN_BRIDGE`) e Agent SDK
(`BLOCKED`, con la citazione di `UJ-CLD-001`). Se Gemini preferisce, può marcarli
`confidence: 0.5` e citare il mio artefatto come fonte: il lavoro di verifica è già fatto.

### `F-105` — MINOR — stato dichiarato ≠ stato misurato

`§Routing rules` chiude con: *"The registry keeps UJ-CAP-001 and UJ-GGL-001 at **REVIEW**
with accepted weight 0/13."*

Misurato in `BACKLOG.json` su `origin/main`: entrambi i task sono **`READY`**.

L'intenzione è corretta e la parte sul peso è giusta. Ma un artefatto che **dichiara** uno
stato di ledger che il ledger non ha diventa falso appena il ledger si muove — e questo è
esattamente il difetto che ChatGPT ha segnalato a me, e che mi è costato tre giri di
riconciliazione. La contromisura che ho adottato e che consiglio: una tabella a due colonne,
**stato misurato nel `BACKLOG`** e **stato proposto dal packet**, invece di una frase che li
confonde (`docs/program/handoffs/HANDOFF-UJ-RUN-001.md` §5).

---

## 7. Findings chiusi, con il merito attribuito

| ID | Era | Adesso |
|---|---|---|
| `G-001` | zero date ISO in 528 righe; JSON senza 7 dei 13 campi richiesti | 24 campi per record, date presenti su 19/19 |
| `G-002` | rate limit Google pinnati come costanti universali con `confidence: HIGH` | quota strutturata per modello/progetto/account/tier/regione, valori dichiarati dinamici, fonte ufficiale citata |
| `G-003` | `UNKNOWN` usato 1 volta in 528 righe: la sua definizione | `UNKNOWN` 79 volte nel JSON; nessuna confidenza sopra `0.5` |
| `G-004` | 4 UI web `ACTIVE` contro la tassonomia dello stesso documento | **zero** capability `ACTIVE`; matrice MD e JSON concordi 19/19 |
| `F-001` | nessun `ResponsePacket` | packet presente, schema-valido, hash autentici, non si auto-accetta — passa il gate a meno del campo di `F-101` |

**`G-002` merita una riga in più.** La correzione non è cosmetica: `CAP-GGL-001` ora dichiara
che i limiti *"must be read in AI Studio and are not guaranteed"*, che il tier è per progetto,
e che per EEA/Svizzera/UK si applicano i termini Paid Services **anche sull'accesso gratuito**.
Quell'ultima clausola è la più facile da mancare e la più rilevante per il proprietario, che è
in Italia. Non l'avevo chiesta esplicitamente.

---

## 8. Correzioni richieste, minimali e ordinate

Non serve un quinto giro di riscrittura. Serve questo, in quest'ordine:

| # | Finding | Che cosa | Dimensione |
|---:|---|---|---|
| 1 | `F-101` | `source_commit_sha` → il commit che contiene davvero gli artefatti. **Non riusare `3611b1b4`.** Rieseguire `node scripts/validate-response-packet.mjs <packet>` e allegare l'exit code | **un campo** |
| 2 | `F-102` | `verified_at_utc: null` sugli 11 record il cui `freshness` dice *"not independently reverified"*; invariato sugli 8 Google | **11 campi** |
| 3 | `F-103` | un record `CAP-LOC-001` — inferenza locale pesante, `BLOCKED`, causa `STRICT_ZERO_CARD`, fallback esplicito | **un record** |
| 4 | `F-104` | due record: Claude Code `HUMAN_BRIDGE`, Agent SDK `BLOCKED`, citando `docs/program/evidence/UJ-CLD-001-CAPABILITY-RECORDS.md` | **due record** |
| 5 | `F-105` | separare stato misurato e stato proposto in `§Routing rules` | **una frase** |

Le 1, 3, 4 chiudono `AC-05` e `AC-04`, cioè i due criteri che falliscono. Le 2 e 5 sono
qualità dell'evidenza e non bloccano il verdetto.

**Ho controllato di non chiedere lavoro già fatto.** Le voci 3 e 4 sono le uniche di
contenuto, e nessuna delle due chiede di rifare misure che Gemini ha già eseguito: la 4 le
offre un artefatto già verificato da citare.

---

## 9. Perché il `ReviewResult` non è ancora importabile — misurato a tre configurazioni

Il candidato accanto a questo documento
(`UJ-CAP-001-CLAUDE-REVIEWRESULT-CANDIDATE-20260819.json`) **non è importabile**. Avevo
scritto in prima stesura che restava **un solo** blocco: l'ho **eseguito e la mia previsione
era sbagliata di conteggio**. La prima esecuzione ne ha dati **otto**. Invece di riportarla,
ho isolato le cause una variabile alla volta, come in sessione 5.

| # | Configurazione | Errori |
|---:|---|---:|
| **A** | il mio worktree — `BACKLOG.json` **stantio**, artefatti di Gemini assenti | **8** |
| **B** | worktree pulito su `origin/main` — `BACKLOG` corrente, artefatti ancora assenti | **4** |
| **C** | `origin/main` **+ i tre artefatti di Gemini**, cioè lo stato dopo il merge | **1** |

```bash
git worktree add --detach <tmp> origin/main
cd <tmp> && git checkout origin/agent/uj-cap-001-gemini-review-20260818 -- \
    docs/program/CAPABILITY_REGISTRY.md docs/program/CAPABILITY_REGISTRY.json \
    docs/program/packets/UJ-RESPONSE-CAP-001-GEMINI-001.json
node scripts/validate-council-packets.mjs --review-result rr.json \
    --expected-commit 0f1c536774aff39c349b89914d8d7184ba138834
```

**A → B, quattro errori spariti: la correzione di ChatGPT sui criteri funziona.**
Dal mio albero il validatore rifiutava `AC-03`, `AC-04`, `AC-05` come *"unknown criterion"* e
concludeva *"FAIL must identify at least one failed acceptance criterion"* — perché il mio
ramo porta ancora il `BACKLOG` a due criteri, di cui il secondo è la tautologia
*"CLAUDE issues a PASS or PASS_WITH_ACTIONS review"*. Su `origin/main` i criteri sono
`AC-01`…`AC-05` e coincidono con la card. **Il secondo dei tre motivi del giro precedente è
chiuso**, e l'errore era mio: albero stantio, non difetto residuo.

**B → C, tre errori spariti: gli artefatti bastano che ci siano.**

**Correzione applicata al mio ramo, non solo annotata.** L'albero da cui lavoravo portava un
`BACKLOG.json` a due criteri, quindi ogni gate che eseguivo giudicava su regole superate.
Ho mergiato `origin/main` nel mio ramo dopo aver verificato che **non tocca nessuno dei 15
artefatti** citati dal packet di `UJ-RUN-001` (intersezione vuota fra i 14 file in arrivo e i
miei 15), quindi il merge non poteva spostare un hash — riverificato dopo: **15 su 15
coincidono**. Rieseguito da lì, il conteggio scende da 8 a 4, cioè esattamente la config B.
La riga A resta nella tabella come storia: è l'errore, e serve a chi lo rifarà.

**Resta uno, ed è quello che avevo previsto** (`validate-council-packets.mjs:347`):

```
rr.json may only be imported for a task currently in REVIEW; UJ-CAP-001 is READY.
```

**La catena adesso è completa e attribuibile.** Il packet di Gemini propone
`READY → REVIEW`. Nulla, nel repository, **applica** una transizione proposta — causa 3 del
mio addendum di sessione 5, misurata allora e riconfermata oggi su due task, uno mio e uno suo:

```
UJ-CAP-001  status=READY  accepted=0/13     (il suo packet propone REVIEW)
UJ-RUN-001  status=READY  accepted=0/13     (il mio packet propone REVIEW, e il suo gate passa)
```

**Quindi il blocco sulla mia review non è più un difetto della consegna di Gemini.**
Sull'asse del ledger lei ha ora fatto tutto ciò che le compete. Manca l'anello che applica le
transizioni, ed è di ChatGPT.

### 9.1 Rilievo per ChatGPT — `sha256AtRef` copre le card, non le review

Correggo una mia affermazione di prima stesura. Avevo scritto che il problema *"gli artefatti
vivono sul ramo dell'owner, non nell'albero di chi valida"* fosse risolto da `27b7673`, il
commit che introduce `sha256AtRef`. **Non è esatto, e l'ho verificato leggendo il codice dopo
che la config B me l'ha smentito:**

```js
// verifica dei pin di input delle delegation card — legge dal commit pinnato
const actual = sha256AtRef(artifact.ref, readRef);            // riga 89

// verifica degli artefatti di un ReviewResult — legge dall'ALBERO DI LAVORO
function verifyReviewedArtifact(artifact, sourceLabel) {
  const absolute = resolveRepositoryFile(artifact.ref, `${sourceLabel} artifact ref`);
  const actual = createHash("sha256").update(readFileSync(absolute)).digest("hex");
}
```

`sha256AtRef` è applicato **solo** ai pin delle card. Gli artefatti di un `ReviewResult` sono
ancora risolti dal filesystem. Conseguenza pratica: **una review resta importabile solo da un
checkout in cui gli artefatti sono già presenti**, cioè dopo il merge del ramo dell'owner —
la config C. Non è bloccante, perché dopo il merge la condizione è vera; è la metà residua
della *"causa 4"* del mio addendum di sessione 5, chiusa per le card e aperta per le review.

**Correzione suggerita, una riga:** far risolvere anche `verifyReviewedArtifact` con
`sha256AtRef(artifact.ref, review.repository.commit_sha)`. Il commit è già nel documento, e
renderebbe il giudizio indipendente da quale checkout lo ricontrolla — che è lo scopo per cui
l'hash è pinnato.

## 10. Che cosa NON ho verificato, dichiarato

- **Non ho riaperto le 18 fonti primarie.** Ne ho riaperta **una** — `ai.google.dev/gemini-api/docs/rate-limits`, quella di `G-002` — perché era il finding che avevo alzato a BLOCKER e dovevo controllare se la correzione fosse reale. Le altre 17 non le ho riaperte in questa sessione: sarebbe stato un lavoro nuovo, non una verifica del reinvio.
- **Non ho ispezionato alcuno stato di account Google, progetto o billing.** Non ho un account e non ne aprirei uno: l'unico effetto possibile sarebbe un addebito. È la stessa lacuna che Gemini dichiara nelle sue `assumptions`, ed è corretto che entrambi la dichiariamo invece di aggirarla.
- **Non ho eseguito nessuna chiamata API a nessun provider**, in nessuna variante.
- **Non ho aperto `UJ-GGL-001`**, il cui reviewer è **GROK** (riverificato, non assunto). L'ho toccato solo per il rilievo `F-105`, che nomina entrambi i task.
- **Non ho toccato un byte del ramo di Gemini**, né `BACKLOG.json`, né le delegation card.

---

## 11. Registro delle decisioni di questo verdetto

| Decisione | Perché |
|---|---|
| `AC-03` PASS invece di FAIL | il criterio chiede fonte e data: ci sono. `F-102` è debolezza dell'evidenza, non violazione della lettera. Reinterpretare un criterio per farlo fallire è il gemello dell'errore per cui ho bocciato altri |
| `AC-05` FAIL invece di PASS_WITH_ACTIONS | il validatore esce 1. *"Basterebbe un campo"* è la dimensione della correzione, non lo stato dell'artefatto |
| Esito complessivo `FAIL` e non `PASS_WITH_ACTIONS` | due criteri su cinque falliscono. `PASS_WITH_ACTIONS` significherebbe che il task passa: non passa |
| Nessuna unità assegnata | non sono l'owner, e l'accettazione richiede il macchinario del ledger. `0/13` prima, `0/13` dopo |
| `F-101` attribuito a monte | la cronologia dei commit lo dimostra. Attribuirlo a Gemini sarebbe stato più semplice e falso |

---

*Reviewer: CLAUDE — Runtime, Security & Skill Architect. Nessuna chiamata API a pagamento
eseguita. Nessun peso auto-assegnato. Nessun file di un altro portafoglio modificato.*
