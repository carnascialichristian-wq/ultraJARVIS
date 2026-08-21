# Perché il ledger dice `0 / 76` — diagnosi e correzione

| Metadato | Valore |
|---|---|
| Autore | **CLAUDE** — Runtime, Security & Skill Architect |
| Domanda | *"Cerca di capire e sistemare i 0 su 76 di ChatGPT"* — Christian, 2026-08-18 |
| Ref | `origin/main` @ `b4b4b12`, branch di lavoro `claude/claude-md-resume-point-tvej1u` |
| **Esito** | 1 causa trovata e **corretta per 1 task su 8**; 7 restano bloccati da un difetto **strutturale** che non è mio |
| Pesi | **invariati**. Questo documento non sposta un'unità di `completed_weight` |

---

## 1. `0 / 76` sono DUE cose diverse, e solo una è un difetto

È la distinzione che rende la domanda rispondibile.

### 1a. `accepted_weight = 0 / 76` è **CORRETTO**. Non va "sistemato".

`docs/program/PROGRESS.md`, regole di accettazione:

> **2.** *"Produced, submitted, or REVIEW work is not automatically accepted."*
> **4.** *"DONE requires all criteria and review proof; **status alone never changes accepted weight**."*

E l'esempio lavorato nello stesso file, che descrive esattamente la mia situazione:

> *"If UJ-INT-001 produces all artifacts but no reviewer has passed them: status: REVIEW; …
> **accepted weight: 0/13**; contribution to progress: 0."*

Nessuno dei quattro reviewer designati si è espresso su nessuno dei miei otto task. Quindi
`0/76` **è il sistema che funziona come progettato**, non un guasto.

**Portarlo a un numero diverso sarebbe il "falso avanzamento" vietato da §31.5**, e violerebbe
la regola che ho applicato contro ChatGPT (`F-001` su `UJ-INT-006`) e contro Gemini (`G-003` su
`UJ-CAP-001`). Non lo farò, e nessuna sessione futura deve farlo.

### 1b. Lo **status** `READY`/`BLOCKED` invece di `REVIEW` è un difetto **vero**

Questo sì. `BACKLOG.json` al ref corrente riporta i miei otto task così:

| Task | Status nel ledger | Realtà |
|---|---|---|
| UJ-RUN-001 | `READY` | consegnato in sessione 1, riverificato ogni sessione |
| UJ-SEC-001 | `READY` | consegnato in sessione 2 |
| UJ-CLD-001 | `READY` | consegnato in sessione 2 |
| UJ-MCP-001 | `BLOCKED` | consegnato in sessione 2 |
| UJ-RCV-001 | `BLOCKED` | consegnato in sessione 2 |
| UJ-SKL-001 | `BLOCKED` | consegnato in sessione 2 |
| UJ-REV-001 | `BLOCKED` | consegnato in sessione 3 |
| UJ-REV-002 | `DEFERRED` | **mai iniziato** — l'unico corretto |

`PROGRESS.md` prevede esplicitamente la categoria che manca: *"produced scope: **may be
reported separately** as 13 units submitted"*. Il programma **ha** la nozione di "consegnato ma
non accettato". I miei task dovrebbero starci dentro, e non ci stanno.

---

## 2. La causa: non ho mai emesso un `ResponsePacket`

Cercato in tutto il repository: **non esiste un solo `ResponsePacket` firmato `CLAUDE`.**
L'unico JSON che ho prodotto è `docs/program/reviews/UJ-REVIEW-INT-006-CLAUDE.json`, che è un
**`ReviewResult`** — una review del task *di ChatGPT*, non un rapporto di consegna dei miei.

Il ledger si muove sui packet. Io ho consegnato blueprint, contratti, test, threat model,
review e handoff — e ho scritto resoconti in `CLAUDE.md` e `TASKCLAUDE.md` — **ma non ho mai
mandato l'oggetto che la macchina consuma.** Dal punto di vista del ledger non ho mai
dichiarato di aver consegnato niente.

**E non è una formalità che ho scoperto adesso: è un acceptance criterion del mio stesso task.**
`prompts/delegation-cards/UJ-RUN-001-CLAUDE.json`, criterio **AC-05**:

> *"ResponsePacket is valid, cites every artifact hash, proposes REVIEW, and keeps accepted
> weight at 0/13."*

**Ho soddisfatto quattro criteri su cinque e saltato proprio quello che rende contabili gli
altri quattro.** È il difetto più imbarazzante che ho trovato in questo programma, perché è mio
e perché è scritto nero su bianco nella card che ho ricevuto all'inizio.

Va detto anche il rovescio, per onestà: nessuno me l'ha contestato per quattro sessioni, e il
`BACKLOG.json` non ha mai segnalato l'assenza. Un criterio che nessuno verifica è un criterio
che verrà mancato.

---

## 3. Corretto: `UJ-RUN-001` ha ora un packet valido

**`docs/program/packets/UJ-RESP-RUN-001-CLAUDE.json`**

| Proprietà | Valore |
|---|---|
| `status` | `REVIEW` |
| `task_ledger_delta` | `READY` → `REVIEW` |
| `accepted_weight` | **0 → 0 / 13, invariato** |
| `artifacts` | **15 citati, ogni hash verificato contro i byte committati** |
| `source_commit_sha` | commit reale a 40 caratteri, esistenza verificata |

Il packet chiede **solo** ciò che è vero: che il lavoro esiste e attende **Gemini**. Non si
assegna un'unità di peso.

---

## 4. Perché gli altri 7 task NON possono avere un packet

Non è pigrizia: è **impossibile in modo veritiero**, ed è un difetto strutturale del programma.

`card_id` è un campo **obbligatorio** del `ResponsePacket`, con pattern `^UJ-CARD-[A-Z0-9-]+$`.
E le delegation card esistenti sono **quattro in tutto**, dichiarate dalla missione:

```
UJ-CARD-RUN-001-CLAUDE   <- l'unica mia
UJ-CARD-CAP-001-GEMINI
UJ-CARD-GGL-001-GEMINI
UJ-CARD-RED-001-GROK
```

| Mio task | Card | Packet possibile? |
|---|---|---|
| UJ-RUN-001 | `UJ-CARD-RUN-001-CLAUDE` | **sì — fatto** |
| UJ-SEC-001, UJ-MCP-001, UJ-RCV-001, UJ-SKL-001, UJ-CLD-001, UJ-REV-001, UJ-REV-002 | **nessuna** | **no** |

Per quei sette dovrei **inventare un `card_id` che non corrisponde a nessuna card**. Sarebbe una
dichiarazione falsa dentro un documento il cui unico scopo è essere verificabile.

È lo stesso ragionamento di `F-003` in `UJ-REV-001`: **quando il deliverable corretto non è
rappresentabile nel formato previsto, si consegna la sostanza e si dichiara l'impedimento,
invece di produrre un JSON conforme che afferma il falso.**

**Cosa serve da ChatGPT, che possiede la missione e le card:** emettere sette delegation card,
o estendere la missione, per i task che ha assegnato a CLAUDE nel `BACKLOG.json` ma per i quali
non ha mai prodotto una card. **Il collo di bottiglia dei 57 punti consegnati è quello, e non è
mio.**

---

## 5. Secondo difetto strutturale: non esisteva un gate per i packet

`scripts/validate-council-packets.mjs` espone `--review-result` per i `ReviewResult`,
`--schemas-only` e `--review-self-test`. **Non ha nessun entry point per un `ResponsePacket`** —
cioè per l'oggetto che fa muovere lo status di ogni task del programma.

Conseguenza: un specialista non può controllare un packet **prima** di mandarlo via
`HUMAN_BRIDGE`, e l'integratore non ha un comando per controllarlo all'arrivo. È il gate
mancante per il meccanismo su cui poggia l'intero Council — e riguarda tutti e quattro, non me.

**Fornito:** `scripts/validate-response-packet.mjs`. Non modifica il validatore di ChatGPT:
**riusa la sua stessa funzione `validate()`**, estratta a runtime, così le due porte non possono
divergere. Verifica in più: che ogni hash citato corrisponda ai byte al commit dichiarato, che
ogni `proof_ref` sia un artefatto realmente citato, e che il packet **non proponga la propria
accettazione**.

### L'ho attaccato invece di fidarmene: 8 candidati, 8 respinti

| Attacco | Esito |
|---|---|
| auto-accettazione 13/13 | **respinto** — un owner non può accettare il proprio task |
| accettazione parziale 5/13 | **respinto** — coerente con `PROGRESS.md` regola 3 |
| hash falsificato su un artefatto reale | **respinto** — mismatch rilevato |
| artefatto fantasma che non esiste al commit | **respinto** |
| `proof_ref` che cita un file non incluso fra gli artefatti | **respinto** |
| delta che punta a un task diverso da quello del packet | **respinto** |
| `status: DONE` auto-proposto | **respinto** dallo schema |
| attestazione di policy falsa (`no_paid_api: false`) | **respinto** dallo schema |

L'accettazione parziale respinta è la conferma incrociata di `F-001` che avevo scritto su
`UJ-INT-001`: il `5/8` di `UJ-META-002` presente nel ledger **non è producibile dal gate del
programma stesso**.

---

## 6. Rilievo minore sullo schema

`risk_id` impone il pattern `^R-[0-9]{3}$`, ma tutta la nomenclatura dei rischi del programma
usa la forma `R-SEC-01`, `R-RUN-01`, `R-MCP-01`, `R-SKL-03`. **Nessun rischio reale del
programma può essere citato in un packet con il proprio identificatore.** Ho rispettato lo
schema (`R-001`, `R-002`) e perso il riferimento incrociato. Da allineare: o lo schema o la
nomenclatura, ma non entrambi come sono adesso.

---

## 7. Cosa cambia, in numeri

| | Prima | Dopo |
|---|---|---|
| `accepted_weight` | **0 / 76** | **0 / 76 — invariato, ed è corretto** |
| Packet CLAUDE esistenti | 0 | **1, validato e con 15 hash verificati** |
| Task miei rappresentabili in un packet | 0 | 1 su 8 (gli altri 7 aspettano le card di ChatGPT) |
| Gate per validare un packet | **non esisteva** | c'è, e respinge 8 attacchi su 8 |

**Il numero che ti interessa non si muove, e non deve muoversi finché un reviewer non firma.**
Quello che si muove è che adesso esiste il canale per cui una firma possa arrivare.
