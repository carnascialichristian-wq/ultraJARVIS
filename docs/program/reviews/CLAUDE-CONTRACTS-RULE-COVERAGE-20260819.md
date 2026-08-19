# Copertura delle regole nei contratti CLAUDE — audit dei miei stessi artefatti

| Campo | Valore |
|---|---|
| Autore | CLAUDE, su artefatti propri |
| Ref | worktree su `agent/uj-run-001-blueprint-20260818`, artefatti identici a `origin/main` |
| Data | 2026-08-19 |
| Sonda | `docs/threat-models/probes/contracts-rule-coverage.py`, riproducibile dalla root |
| Effetto sul ledger | **nessuno** |

---

## 0. Il risultato

**41 regole verificate su 4 famiglie. Una sola non aveva un test — `ADM-11` — e l'ho chiusa
nella stessa sessione. Copertura finale: 41 su 41.**

Non l'ha segnalata nessun reviewer: l'ho trovata contando, mentre preparavo il pacchetto di
consegna di `UJ-MCP-001`.

---

## 1. La tabella

| Famiglia | Che cosa | Documento | Codice | Test | Scoperte |
|---|---|---:|---:|---:|---|
| `OV-*` | regole di override della approval policy | 10 | 10 | 10 | nessuna |
| `ADM-*` | regole di ammissione dei tool | 18 | 18 | **18** | nessuna — `ADM-11` chiusa, §2 |
| `SF-*` | le dieci proibizioni della Skill Forge | 10 | 10 | 10 | nessuna |
| `SF-PIPE-*` | invarianti della pipeline della forge | 3 | 3 | 3 | nessuna |

```bash
python3 docs/threat-models/probes/contracts-rule-coverage.py
```

---

## 2. `ADM-11` — l'unico buco, trovato e chiuso

*Versione e hash pinnati.* Era implementata a
`packages/contracts/src/tools/tool-manifest.ts:277-279`, dichiarata in
`docs/architecture/TOOL_PLANE.md` riga 195, **e mai esercitata da un test**.

```bash
comm -23 <(grep -oE '"ADM-[0-9]+"' packages/contracts/src/tools/tool-manifest.ts | tr -d '"' | sort -u) \
         <(grep -oE 'ADM-[0-9]+' tests/contracts/tool-admission.test.mjs | sort -u)
# prima: ADM-11        adesso: (vuoto)
```

**Precisazione, perché il sospetto iniziale era peggiore e sbagliato.** La tabella di
`TOOL_PLANE.md` marca `ADM-11` con *"sì"*, ma quella colonna si chiama **`Blocca?`** e significa
*«blocca l'ammissione»*, non *«è testata»*. **Il documento non sopravvalutava la copertura.**

### 2.1 Il vincolo che rendeva la correzione non banale

`tests/contracts/tool-admission.test.mjs` **non** è fra i 15 artefatti hashati di `UJ-RUN-001`,
quindi si poteva toccare. Ma un test **nuovo** avrebbe portato la suite da **140 a 141**, e `140`
compare **9 volte nell'handoff e 5 nel blueprint** di `UJ-RUN-001` — entrambi congelati, hashati
e **in review presso GEMINI**. Sarebbero diventate false 14 affermazioni in due artefatti in
revisione, con un settimo giro di consegna su un task che ne ha già fatti sei.

### 2.2 Come l'ho chiusa senza rompere niente

**Ho esercitato `ADM-11` dentro un test che esiste già**: *"a hopeless tool reports every
failure, not just the first"*, che costruisce il manifest più ostile possibile per verificare che
l'admission riporti **tutte** le violazioni e non solo la prima. Gli ho tolto `version` e
`manifestHash` e ho aggiunto `ADM-11` all'insieme atteso.

È il posto naturale, non un espediente: quel test esiste proprio per dire *«queste sono tutte le
regole che un manifest indifendibile viola»*, e finché `ADM-11` mancava dall'elenco, l'insieme
non era completo.

**Il conteggio resta 30 per il file e 140 per la suite.** Nessun artefatto congelato diventa
falso, nessun hash dei 15 cambia — riverificato: **15 su 15**.

### 2.3 Provato contro il codice vecchio prima di accettarlo

Trappola 21: un test nuovo che passa anche senza la correzione non prova niente.

```
ADM-11 rimossa dal dist/  ->  29 pass, 1 fail   'expected ADM-11 to be reported'
ripristinata              ->  30 pass, 0 fail
```

---

## 3. Le due famiglie di minacce non sono un buco, e ci ero quasi cascato

La prima esecuzione della sonda dava `TH-SF-*` a **0 test su 10**, cioè *"dieci minacce della
Skill Forge senza copertura"*. **Falso allarme, ed era un difetto della sonda.**

`TH-SF-*` e `TH-*` sono **modelli di minaccia**, non insiemi di regole: le loro mitigazioni hanno
ID propri (`SF-*`, `SF-PIPE-*`, `ADM-*`) e la tracciabilità vive nella **colonna `Controlli`** di
una tabella, non nei nomi dei test. Misurato:

| | `TH-SF-*` (Skill Forge) | `TH-*` (programma) |
|---|---:|---:|
| minacce | 10 | 19 |
| con riga `Controlli` / `Owner / Test` | **10 / 10** | **19 / 19** |
| che citano un ID di controllo verificabile | 2 | — |
| con residuo **esplicitamente aperto** | **4** | — |
| test dichiarati `⏳ pendenti` | — | **15** |

**Le 4 con residuo aperto sono il pregio, non il difetto**: `TH-SF-03` (prompt injection
nell'intent) e `TH-SF-06` (codice consapevole del sandbox) dichiarano di **non essere chiudibili**
dai controlli esistenti, e lo dicono nel documento invece di lasciarlo dedurre.

**Resta vero e già dichiarato che i 15 test `⏳` del threat model non esistono.** È nella §4 di
`docs/program/packets/UJ-SEC-001-AC-EVIDENCE.md`, con l'avvertenza che i 28 test verdi coprono la
**approval policy** e non le 19 minacce.

---

## 4. Nota di metodo — quinto falso positivo della giornata

Il grep che cercava i blocchi `#### TH-SF-` ha restituito **0** perché le minacce stanno in
**righe di tabella**, non in sezioni. È la quinta volta oggi che una regex ingenua sui miei o
altrui artefatti produce un allarme falso, dopo `S-11`, `S-14`, `S-03` e il conteggio della
severità nel threat model.

Tutti e cinque nella stessa direzione — **«manca» dove non manca** — e tutti fermati dallo stesso
riflesso: il risultato contraddiceva quello che sapevo.

**L'avvertenza è stata messa nel codice della sonda**, non solo qui, con il motivo scritto
accanto alla mappa delle famiglie: `TH-SF-*` e `TH-*` sono deliberatamente **fuori** dall'audit,
perché contarli come regole senza test produce un allarme che è già costato tempo una volta.

---

## 5. Che cosa questo audit NON copre

- **Gli invarianti del runtime non hanno ID.** I 36 test di `runtime-invariants.test.mjs` sono
  nominati in prosa, quindi la sonda li conta ma non può dire quale invariante manchi. È una
  scelta di naming che va corretta se si vuole tracciabilità anche lì — **non l'ho cambiata**
  perché quel file è fra i 15 artefatti hashati e in review.
- **22 prove sono dichiarate non implementate** nelle §16-21 del blueprint, più **11 `PENDING`**
  in §13.3: **33 in totale**. Sono già dichiarate in ogni consegna di `UJ-RUN-001` e non sono
  una scoperta di questo audit.
- **Copertura ≠ correttezza.** Che una regola abbia un test non dice che il test la eserciti
  bene. Questo audit conta la tracciabilità, non la qualità dell'asserzione.
