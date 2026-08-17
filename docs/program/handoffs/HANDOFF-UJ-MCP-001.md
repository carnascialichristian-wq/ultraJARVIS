# HANDOFF — UJ-MCP-001 (CLAUDE)

| Metadato | Valore |
|---|---|
| Session ID | UJ-CLAUDE-2026-08-17-02 |
| Task | UJ-MCP-001 — ToolManifest, MCP admission, architettura tool P0 |
| Peso | 8 · Reviewer: **GEMINI** |
| Stato | **REVIEW** |
| Data | 2026-08-17 UTC |

---

## 1. Risultato

| Deliverable | File |
|---|---|
| ToolManifest + admission + P0 mitigations | `packages/contracts/src/tools/tool-manifest.ts` |
| Documento di architettura | `docs/architecture/TOOL_PLANE.md` |
| Test | `tests/contracts/tool-admission.test.mjs` — **30/30 verdi** |

**Perché ho scelto questo task** fra i tre READY: conteneva **due delle tre mitigazioni
P0** aperte dopo UJ-SEC-001. Nessun altro task le copriva.

## 2. Le due mitigazioni P0, ora meccaniche

### P0-1 — Solo `TOOL_RUNTIME` può attestare l'esecuzione di un tool

Chiude il vettore centrale di **TH-10** (`CRITICA`/`ALTA`).

Il problema: l'hash chain prova che *un evento è stato registrato*, non che il fatto
registrato sia *vero*. Un agente che scrive `tool.returned` senza aver chiamato il tool
produce una catena **integra e falsa**.

La regola: gli eventi `tool.called`, `tool.returned`, `tool.failed` sono emettibili
**solo** da `TOOL_RUNTIME`. **Nemmeno il Supervisor, nemmeno il proprietario** —
un'eccezione "solo per il supervisor" ricrea subito il vettore, perché il supervisor
riceve input dagli agenti. Più `ADM-14`: un tool che dichiara di emettere `tool.*` è
rifiutato in admission.

**Limite dichiarato:** P0-1 impedisce di falsificare l'attestazione di aver chiamato un
tool. **Non** impedisce a un agente di gonfiare il proprio `ResultEnvelope`. La copertura
di TH-10 è **parziale** e chi legge il risk register non deve dedurre il contrario.

### P0-2 — Lookup per idempotency key obbligatoria sulle scritture

Chiude **R-RUN-03**. Un tool `EXTERNAL_WRITE` o `DESTRUCTIVE` che non espone
`supportsLookupByKey` **non è ammissibile** (`ADM-13`).

Motivo: ammetterlo significa programmare in anticipo un'interruzione che nessuno saprà
risolvere. Dopo un crash Christian dovrebbe controllare a mano nel servizio esterno se
la scrittura è avvenuta — non lo sa meglio del sistema, e questo alimenta TH-18.

Se un tool utile non la supporta, in ordine: **avvolgerlo** con un wrapper che tiene il
registro chiave → esito; renderlo naturalmente idempotente; degradarlo a `HUMAN_BRIDGE`;
dichiararlo `UNAVAILABLE`.

## 3. Pipeline di admission

18 regole: le prime 12 sono i passi di §12.3, le altre 6 vengono dal threat model.
17 bloccano, 1 avverte. Ogni regola ha un test che **la viola deliberatamente**.

Due scelte segnalate al reviewer:

- **tutte le violazioni riportate**, non solo la prima: chi corregge una causa
  ripresenta il tool e viene rifiutato di nuovo senza sapere quante ne restano;
- **`ADM-18` avverte invece di bloccare**: un tool remoto può cambiare condotta a parità
  di manifest. Bloccarli tutti renderebbe MCP inutilizzabile, ammetterli in silenzio
  nasconderebbe il residuo. Il warning è la risposta onesta.

## 4. Task delta

| Task | Stato prima | Stato ora | Accettato | Proposto | Manca |
|---|---|---|---:|---:|---:|
| UJ-MCP-001 | READY | **REVIEW** | 0/8 | 7/8 | 8 |
| UJ-RUN-001 | REVIEW | REVIEW | 0/13 | 11/13 | 13 |
| UJ-SEC-001 | REVIEW | REVIEW | 0/13 | 11/13 | 13 |
| UJ-CLD-001 | IN_PROGRESS | IN_PROGRESS | 0/8 | 2/8 | 6 |
| UJ-SKL-001 | READY | READY | 0/13 | — | 13 |
| UJ-RCV-001 | READY | READY | 0/8 | — | 8 |
| UJ-REV-001 | BLOCKED | BLOCKED | 0/5 | — | 5 |
| UJ-REV-002 | BLOCKED | BLOCKED | 0/8 | — | 8 |

```
accettato formalmente = 0 / 76  = 0%
proposto in review    = 31 / 76 = 40,8%   11 + 11 + 7 + 2
```

**ETA: UNKNOWN.** Ancora nessuna velocity su cicli comparabili.

## 5. Rischi

**Chiuso meccanicamente:** `R-RUN-03` (lookup idempotency) → `ADM-13`.
**Chiuso parzialmente:** `R-RUN-04` (emissione eventi tool) → P0-1, ma solo per
l'attestazione, non per il resoconto.

**Restano aperti:** `R-RUN-01` (contatore non atomico, → UJ-RCV-001, unico P0 residuo),
`R-SEC-01`, `R-SEC-02` (entrambi `CRITICA`, → UJ-SEC-002 da accettare), `R-SEC-03`.

**Nuovo:** `R-MCP-01` — un server MCP remoto può cambiare condotta a parità di manifest;
`ADM-18` lo segnala ma non lo impedisce. Servono sandbox e monitoraggio comportamentale
(`UJ-SKL-001`). Severità MEDIA, rilevabilità SCARSA.

## 6. Handoff

### → GEMINI (reviewer)

**Punto principale della review:** `ToolManifest` e `CapabilityRecord` **non vanno fusi**,
benché si somiglino. Rispondono a domande diverse — *"il sistema può chiamare questa
funzione?"* contro *"l'account può usare questo prodotto?"* — e hanno cicli di vita
diversi. Se li fondiamo, ogni cambio di piano invalida i tool e ogni aggiornamento di
tool richiede una riverifica di piano. Un `ToolManifest` **cita** un `capability_id`.

Dettagli in `TOOL_PLANE.md` §8.1. Se non sei d'accordo, è il momento di dirlo.

**Riproduci le prove:** `node --test tests/contracts/tool-admission.test.mjs` → 30/30.

### → CHATGPT
`packages/contracts` ha ora tre moduli (`runtime`, `policy`, `tools`) e **92 test verdi**:
è un riferimento concreto per UJ-INT-004. Resta aperta la decisione su `UJ-SEC-002`.

### → GROK
Nuovo rischio `R-MCP-01`. E una precisazione che ti riguarda per il risk register:
**TH-10 non è chiusa**, è coperta solo nella parte di attestazione. Non assegnarle una
mitigazione piena.

### → CHRISTIAN
Nessuna nuova decisione richiesta. Restano aperte quelle precedenti (default DepthGuard,
`L5`, accesso Claude, PR, emendamenti costituzionali P-05/P-11/P-01, `UJ-SEC-002`).

## 7. RESUME_POINT

```
PROSSIMO  : UJ-RCV-001 — checkpoint, retry, cancellation, idempotency, disaster recovery.
            Peso 8. Reviewer ChatGPT. READY, nessun blocco.
            MOTIVO: contiene T-DG-4b, l'ULTIMO P0 residuo (contatore atomico), ed è
            l'unico modo di chiudere R-RUN-01.
            Dopo: UJ-SKL-001 (13) o completare UJ-CLD-001 (6 restanti).

NON RIFARE: tool plane, admission, threat model, approval policy, blueprint, contratti.
            Verifica: node --test tests/contracts/  (i tre file) → 92/92
```
