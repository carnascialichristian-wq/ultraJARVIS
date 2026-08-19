# `UJ-REV-001` — evidenza per criterio

| Campo | Valore |
|---|---|
| Task | `UJ-REV-001` — review del Program OS (`UJ-INT-001`, owner CHATGPT) |
| Owner | CLAUDE · **Reviewer designato: `Christian`** (così scritto nel `BACKLOG.json`) |
| Peso | 5 · **accettato `0/5` prima e dopo** |
| Stato nel ledger | **`BLOCKED`** su `UJ-INT-001` · milestone M0 |
| Data | 2026-08-19 |

---

## 0. Questo task ha due impedimenti, e nessuno dei due è il contenuto

1. **È `BLOCKED` su `UJ-INT-001`**, che è a sua volta in `REVIEW` con reviewer canonico GROK.
2. **Il suo `reviewer` è la stringa `"Christian"`**, che **non è nell'enum** dello schema della
   delegation card (`CHATGPT`, `CLAUDE`, `GEMINI`, `GROK`, `CHRISTIAN` maiuscolo). Quindi questo
   task **non potrà mai ricevere una card** finché quel valore resta com'è — è uno dei 5 task del
   backlog con quel difetto di dato, più altri 9 con il segnaposto
   `"Core task owner named on DelegationCard"`. Dettaglio in
   `docs/program/reviews/UJ-REV-001-ADDENDUM-CARD-ISSUANCE-CEILING.md`.

Nessuno dei due impedisce di leggere la review, che è consegnata da tre sessioni.

---

## 1. Artefatti

| # | Artefatto | Righe | SHA-256 | Dove |
|---:|---|---:|---|---|
| 1 | `docs/program/reviews/UJ-REV-001-PROGRAM-OS-REVIEW.md` | 280 | `f80f1d2cdccaefb8d9f9cf6c66f8d98b28bf5be40352c2973994d5c42ca8c152` | `origin/main` |
| 2 | `docs/program/reviews/UJ-REV-001-CLAUDE-REVIEWRESULT-CANDIDATE.json` | 123 | `1301f23d6ce7c949d3d38cf8c7e8d9857edd507b744af36b7ac40c0a492c1249` | `origin/main` |
| 3 | `docs/program/reviews/UJ-REV-001-ADDENDUM-LEDGER-IMPORT-PATH.md` | 287 | `98834dd3e9f2736a8e3b13341f92aaf8ac3623738171aad3e744e9d11db06e20` | **solo sul ramo** |
| 4 | `docs/program/reviews/UJ-REV-001-ADDENDUM-CARD-ISSUANCE-CEILING.md` | 188 | `5aaabb135a94ac7a09dc1970666e8134b42dce224615f4786d0cf300f16b6fda` | **solo sul ramo** |

Gli artefatti 3 e 4 sono **addenda successivi alla consegna originale** e vivono su
`agent/uj-run-001-blueprint-20260818`, non su `main`. Chi valuta deve saperlo: gli hash 1 e 2 si
riproducono da `main`, i 3 e 4 no.

---

## 2. `AC-01` — l'artefatto esiste e rispetta il contratto dichiarato

> `output_contract`: *"PASS, PASS_WITH_ACTIONS, or FAIL review of UJ-INT-001"*

**Esito emesso: `PASS_WITH_ACTIONS`.** Peso proposto per `UJ-INT-001`: **0/13 invariato** — non
sono il reviewer canonico di quel task (è GROK), quindi la mia review non muove il suo ledger, e
lo dico invece di lasciarlo intendere.

### 2.1 Il metodo: ho ri-derivato il ledger, non l'ho letto

Un Program OS si revisiona **ricalcolando**, non ammirando la prosa. Verifiche indipendenti,
senza fidarmi del validatore:

| Controllo | Esito |
|---|---|
| somma dei pesi per `task_ids` di ogni baseline vs `declared_weight` | **3 su 3 esatte** |
| `remaining_weight == weight − completed_weight` su tutti i task | **43 su 43** |
| risoluzione di ogni dipendenza + DFS per i cicli | **nessuna rotta, nessun ciclo** |
| task fuori da ogni baseline | **9, tutti `PROPOSED` e di peso 0** |

**L'aritmetica di ChatGPT è corretta.** Il difetto non era nei numeri: era in **una regola
violata dai numeri**.

### 2.2 I difetti trovati

- **`F-001`** — l'unico peso parziale del ledger è vietato dal sistema stesso. `UJ-META-002`
  porta **5/8** con **1 criterio su 3** passato, ma `PROGRESS.md` regola 3 impone tutto-o-niente
  senza una mappatura di sottocriteri (**zero occorrenze** cercandola in tutto `BACKLOG.json`), e
  `validate-council-packets.mjs` **rifiuterebbe** un `ReviewResult` che proponga 5/8. Effetto
  misurato: `meta-bootstrap` passa da **89,66% a 72,41%** applicando la regola scritta accanto.
- **`F-002`** — la difesa anti-gaming non può girare prima di ciò che deve controllare.
  `PROGRESS.md` dice *"Grok `UJ-REV-004` challenges the formula **before acceptance**"*, e
  `UJ-REV-004` è `BLOCKED` *"Required dependency is not accepted: UJ-INT-001"*. **La review che
  deve precedere l'accettazione è bloccata fino all'accettazione.**
- **`F-003`** — il mio stesso deliverable non è rappresentabile: l'intake rifiuta il mio
  `ReviewResult` con *"reviewer must be GROK"*. Due task dello stesso `BACKLOG.json` sono
  mutuamente incoerenti — uno mi incarica di revisionare `UJ-INT-001`, l'altro rifiuta per
  costruzione ogni review non firmata GROK.
- **`F-005`** — riguarda **anche me**: il ledger non vede i miei deliverable, e una delle due
  cause è mia — `GOVERNANCE.md` prescrive branch `agent/<task-id>-<slug>` e il mio si chiamava
  `claude/ultrajarvis-repo-analysis-li6vvj`. L'ho scritto nella review invece di attribuire tutta
  la causa a ChatGPT.

### 2.3 I due addenda, che estendono la review

- **`ADDENDUM-LEDGER-IMPORT-PATH`** — perché **nessun task del programma può essere accettato**:
  isolato a tre configurazioni del validatore, `7 → 3 → 1` errori. L'unico irriducibile è che
  nulla applica una transizione proposta. Con **controllo positivo** cercato apposta: la mia
  `ReviewResult` su `UJ-INT-006` valida a **exit 0** dal commit che pinna, quindi il macchinario
  **funziona** — le sue precondizioni non sono quasi mai tutte vere insieme.
- **`ADDENDUM-CARD-ISSUANCE-CEILING`** — perché sei miei task non hanno una card: il meccanismo
  è **cablato a quattro**. Sui 43 task, 29 hanno un reviewer accettato dallo schema, 6 sono
  `READY`, 4 sono ammessi da `expectedTargets`, e 4 card esistono. **Correggo una mia diagnosi di
  sessione 4** che dava la colpa a un arretrato di ChatGPT.

### Verdetto proposto per `AC-01`

**Soddisfatto**: la review esiste, emette uno dei tre esiti ammessi, ed è sostenuta da conteggi
ri-derivati indipendentemente.

---

## 3. `AC-02` — non è un criterio sull'artefatto

> *"Christian issues an evidence-backed PASS or PASS_WITH_ACTIONS review."*

Nomina l'atto del reviewer. **Non soddisfacibile da me**, e in più il valore `"Christian"` non è
nell'enum dello schema: finché resta così, questo criterio non è nemmeno **rappresentabile** in
un packet.

---

## 4. Che cosa NON è dimostrato

- **Non ho letto integralmente 8 degli oltre 20 documenti di `UJ-INT-001`.** L'esistenza dei
  dodici gruppi di deliverable l'ha confermata **il validatore**, non io, e l'ho scritto nella
  nota del criterio e in §10 della review. Dopo aver contestato a ChatGPT le prove insufficienti
  (`F-001` di `UJ-INT-006`), citare documenti non letti sarebbe stato lo stesso difetto commesso
  mentre lo si denuncia.
- **Il `ReviewResult` candidato non è importabile**, e lo dichiara nel nome. Non è un packet
  valido: consegnarlo come tale sarebbe una dichiarazione falsa.
- **Due dei quattro artefatti non sono su `main`.**
- **Nessuna delegation card, nessun `ResponsePacket`**: impossibili per due ragioni indipendenti
  (§0).

---

## 5. Delta di ledger proposto

| Campo | Valore |
|---|---|
| Stato misurato | **`BLOCKED`** su `UJ-INT-001` |
| Stato proposto | nessuno |
| Peso accettato di `UJ-REV-001` | **0 / 5 → 0 / 5** |
| Peso di `UJ-INT-001` proposto dalla review | **0 / 13 invariato** — non sono il suo reviewer canonico |

---

## 6. Nota su `UJ-REV-002`, l'ottavo task del portafoglio

**Non ha e non può avere un pacchetto di evidenza, perché non ha artefatti.** Misurato:

```
UJ-REV-002  DEFERRED  peso 8  reviewer GROK  dip [UJ-INT-007]  milestone M10
UJ-INT-007  DEFERRED  peso 13 owner CHATGPT  dip [UJ-MCP-001, UJ-SKL-001]  milestone M10
```

**Correzione a una mia affermazione**: la mia memoria lo dava `BLOCKED`. È **`DEFERRED`**, che è
diverso — non aspetta una dipendenza che potrebbe arrivare domani, è **programmato per la
milestone M10**. Non è lavorabile, e non è un impedimento da rimuovere.
