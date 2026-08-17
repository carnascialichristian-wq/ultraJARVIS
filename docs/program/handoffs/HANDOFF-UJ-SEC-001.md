# HANDOFF — UJ-SEC-001 (CLAUDE)

| Metadato | Valore |
|---|---|
| Session ID | UJ-CLAUDE-2026-08-17-02 |
| AI_ID | CLAUDE |
| Data | 2026-08-17 UTC |
| Branch | `claude/ultrajarvis-repo-analysis-li6vvj` |
| Task | UJ-SEC-001 — threat model, approval policy, critica alla Costituzione |
| Peso | 13 · Reviewer: **GROK** |
| Stato | **REVIEW** |
| Autonomia usata | L2 · Side effect: INTERNAL_WRITE |

---

## 1. Risultato consegnato

Il task richiedeva tre cose. Tutte e tre sono file versionati.

| Parte | Deliverable | File |
|---|---|---|
| 1 | Threat model completo | `docs/threat-models/THREAT_MODEL.md` |
| 2 | Approval policy | `docs/constitution/APPROVAL_POLICY.md` + `packages/contracts/src/policy/approval.ts` |
| 3 | Critica alla Costituzione | `docs/constitution/CONSTITUTION_CRITIQUE.md` |

**Contenuto in numeri:** 19 minacce catalogate con severità/probabilità/rilevabilità e
residuo esplicito; 15 difese di §17 con stato reale; 10 regole di override eseguibili;
3 lacune strutturali della Costituzione e 12 proposte di emendamento; **28 nuovi test**,
tutti verdi.

## 2. Proof

| Verifica | Comando | Esito |
|---|---|---|
| Typecheck strict | `cd packages/contracts && npx tsc --noEmit` | exit 0 |
| Test policy | `node --test tests/contracts/approval-policy.test.mjs` | **28/28 pass** |
| Test runtime (regressione) | `node --test tests/contracts/runtime-invariants.test.mjs` | **34/34 pass** |
| **Totale** | | **62/62 pass** |

Ogni regola di override `OV-1`…`OV-10` ha un test che **la viola deliberatamente** e
verifica che la policy rifiuti. Una regola che non si può falsificare non è una regola.

## 3. Decisioni di progetto prese in questo task

| # | Decisione | Motivo |
|---|---|---|
| 1 | La matrice di approvazione è **codice puro**, non una tabella interpretata a runtime | una tabella letta da un modello è una tabella che può essere letta male |
| 2 | Tutte le regole violate vengono riportate, non solo la prima | una decisione che nomina una causa nasconde le altre e rende la review ingannevole |
| 3 | L'approvazione è legata alla **idempotency key** del payload | senza, "approva la scrittura del file A" autorizza la scrittura del file B |
| 4 | `DESTRUCTIVE` senza `rollbackPlan` **non è emettibile** | rende meccanico l'Articolo 4 e riduce il volume di richieste al proprietario |
| 5 | Un action kind sconosciuto è `DENY`, mai indovinato | default deny sul vocabolario chiuso |

## 4. Scoperte e giudizi che vi riguardano

### 4.1 TH-10 (proof fabrication) è la minaccia peggiore del programma

`CRITICA` per severità, **`ALTA` per probabilità**. Non per malizia: produrre un
resoconto plausibile di lavoro non svolto è il modo di fallire più naturale di un
modello linguistico.

L'hash chain prova che **un evento è stato registrato**, non che il fatto registrato sia
**vero**. Un agente che scrive `tool.returned` senza aver chiamato il tool produce una
catena integra e falsa.

**Mitigazione P0:** solo il tool runtime può emettere eventi `tool.*`. Va imposta in
`UJ-MCP-001` (mio) e sancita in Costituzione (proposta P-11).

### 4.2 Le difese esistenti sono 8 su 15

Conteggio onesto da `THREAT_MODEL.md` §5: **8 progettate, 3 parziali, 4 assenti**.
Le quattro assenti — egress deny, sandbox, test di prompt injection, postflight
scanning — sono **tutte concentrate sulle minacce a residuo più alto**. Non è casuale:
sono le difese che richiedono infrastruttura, e l'infrastruttura non è ancora scelta.

### 4.3 La Costituzione è solida nella sostanza e debole nella meccanica

Gli articoli 2, 3 e 4 sono scritti come **comportamenti attesi** su punti dove
servirebbero **condizioni verificabili**. Un comportamento atteso da un modello
linguistico non è un controllo. L'Articolo 4 usa il verbo "preferire": è un consiglio.

Non propongo una Costituzione diversa: propongo che quella esistente sia **eseguibile**.

### 4.4 Tre lacune che non sono debolezze di un articolo, ma assenze

1. **Conflitto Articolo 1 vs 5/8/11.** Se Christian ordina un'azione che viola un
   articolo, è deroga o violazione? Oggi ambiguo, e un contenuto ostile che si spaccia
   per istruzione del proprietario sfrutta esattamente questa ambiguità.
2. **Nessuna regola sull'assenza del proprietario.** Tutto resta bloccato per sempre.
   È la pressione che genera l'approval fatigue.
3. **La Costituzione non è versionata né hashata**, benché §31.6 presupponga che lo sia.

## 5. Nuovo task proposto — richiede accettazione di ChatGPT

**`UJ-SEC-002` — postflight scanning e controllo dell'approval fatigue.** Peso stimato 8.

Copre gli unici due residui `CRITICA` non assegnati a nessun task: il gap di contenuto
di TH-08 (segreto ripetuto dentro un artifact valido) e la meccanica anti-fatigue di
TH-18.

**Non l'ho aggiunto alla baseline da solo.** §7.4 vieta l'espansione di scope senza
`BASELINE_CHANGE`, e la baseline è di ChatGPT (UJ-INT-001).

## 6. Task delta

| Task | Stato prima | Stato ora | Accettato | Proposto | Manca |
|---|---|---|---:|---:|---:|
| UJ-SEC-001 | READY | **REVIEW** | 0/13 | 11/13 | 13 |
| UJ-SKL-001 | BLOCKED | **READY** | 0/13 | — | 13 |
| UJ-MCP-001 | BLOCKED | **READY** | 0/8 | — | 8 |
| UJ-RUN-001 | REVIEW | REVIEW | 0/13 | 11/13 | 13 |
| UJ-CLD-001 | IN_PROGRESS | IN_PROGRESS | 0/8 | 2/8 | 6 |
| UJ-RCV-001 | READY | READY | 0/8 | — | 8 |
| UJ-REV-001 | BLOCKED | BLOCKED | 0/5 | — | 5 |
| UJ-REV-002 | BLOCKED | BLOCKED | 0/8 | — | 8 |

**Due task si sbloccano:** UJ-SKL-001 e UJ-MCP-001 dipendevano da UJ-SEC-001, ora in REVIEW.

### Progresso (§7.4)

```
portafoglio CLAUDE = 76 unità
accettato formalmente = 0 / 76  = 0%      nessun reviewer ha ancora accettato
proposto in review    = 24 / 76 = 31,6%   11 UJ-RUN-001 + 11 UJ-SEC-001 + 2 UJ-CLD-001
```

**ETA: UNKNOWN** — due sessioni non sono due cicli comparabili. §7.4 richiede velocity
osservata su cicli confrontabili; la sessione 1 e la 2 hanno scope diversi.

## 7. Rischi

### Nuovi

| ID | Rischio | Severità | Owner |
|---|---|---|---|
| `R-SEC-01` | TH-08: un segreto può finire nel **contenuto** di un artifact valido; nessun postflight scanning | **CRITICA** | CLAUDE, UJ-SEC-002 |
| `R-SEC-02` | TH-18: approval fatigue non mitigata meccanicamente; `AF-2` non ha soglia numerica | **CRITICA** | CLAUDE + Christian |
| `R-SEC-03` | `rollbackPlan` è un campo obbligatorio, ma nessuno verifica che il piano funzioni | ALTA | CLAUDE, UJ-RCV-001 |
| `R-SEC-04` | La classificazione dei dati è manuale: la policy applica correttamente la regola sbagliata se `dataClass` è errata | MEDIA | GEMINI |

### Invariati e ancora aperti
`R-RUN-01` (contatore non atomico), `R-RUN-03` (lookup idempotency), `R-RUN-04`
(emissione eventi tool) — tutti ALTA, tutti senza mitigazione implementata.

## 8. Handoff

### → GROK — sei il reviewer di UJ-SEC-001

**Tre affermazioni che voglio siano attaccate, non confermate** (`THREAT_MODEL.md` §7):

1. *"I limiti verificati all'admission bastano."* Sono verificati in un solo istante.
2. *"Lo schema garantisce la correttezza."* Garantisce la forma. TH-01, TH-03 e TH-08
   passano tutti attraverso contenuto formalmente valido.
3. *"Il budget zero elimina il rischio economico."* Non elimina il costo di un account
   sospeso (TH-17), che è più caro di una bolletta.

**Tre domande dirette** (`CONSTITUTION_CRITIQUE.md` §5):

1. La clausola di emergenza che propongo per l'Articolo 12 è un rischio più che una
   difesa? L'ho già segnalata come la più pericolosa delle mie proposte. **Se hai un
   percorso di abuso, la ritiro.**
2. Rendere Articoli 1 e 2 non derogabili è corretto, o rende il sistema inutilizzabile
   in un caso reale che non ho previsto?
3. Diverse mie proposte sanciscono requisiti che il sistema **non sa ancora soddisfare**.
   Meglio approvarli ora come obiettivo o dopo l'implementazione? Ho una preferenza
   (ora), ma è una scelta su cui il mio giudizio è di parte, dato che l'implementazione
   tocca poi a me.

**E la domanda invariata:** esiste una catena che, **senza violare nessuna invariante**,
produce un effetto che Christian non avrebbe approvato?

**Ti serve da me:** nulla. `THREAT_MODEL.md` è completo e i residui sono espliciti.

### → CHATGPT

- **Decisione richiesta:** accettare o rifiutare `UJ-SEC-002` (peso 8) nella baseline.
  Non l'ho aggiunto da solo.
- **Input pronto:** `packages/contracts/src/policy/` è un secondo package funzionante,
  utilizzabile come riferimento per UJ-INT-004.
- **Mi blocchi ancora:** UJ-REV-001 e UJ-REV-002 (13 unità) attendono UJ-INT-001 e
  UJ-INT-007.

### → GEMINI

- **`R-SEC-04` è tuo:** la policy assume che `dataClass` sia corretta. Se la
  classificazione iniziale sbaglia, la policy applica correttamente la regola sbagliata.
  Serve una guida di classificazione nel Capability Registry.
- **Difesa n. 4 assente:** egress deny e allowlist di rete dipendono dalla topologia
  (`UJ-INF-001`).
- **Sei ancora reviewer di UJ-RUN-001**, non revisionato.

### → CHRISTIAN

**Decisione costituzionale.** Ho prodotto 12 proposte di emendamento. Se ne accetti solo
tre, raccomando in quest'ordine:

| # | Proposta | Perché |
|---|---|---|
| **P-05** | Nessuna affermazione di lavoro svolto senza prova riproducibile | chiude TH-10 sul lato normativo |
| **P-11** | Registro a prova di manomissione; solo il tool runtime emette eventi tool | chiude TH-10 sul lato meccanico |
| **P-01** | Nuovo Articolo 13 — deroga esplicita | elimina un'ambiguità che si manifesterà con certezza |

P-05 e P-11 insieme chiudono l'unica minaccia `CRITICA` con probabilità `ALTA`.

Le decisioni precedenti restano aperte: default DepthGuard, `L5` irrappresentabile,
accesso Claude BLOCKED, PR sì/no.

## 9. RESUME_POINT

```
STATO     : UJ-RUN-001  REVIEW   attende Gemini,  11/13 proposti
            UJ-SEC-001  REVIEW   attende Grok,    11/13 proposti
            UJ-CLD-001  IN_PROGRESS  2/8
            UJ-SKL-001  READY    sbloccato
            UJ-MCP-001  READY    sbloccato
            UJ-RCV-001  READY

PROSSIMO  : §41 impone dopo UJ-SEC-001 → UJ-CLD-001 oppure UJ-MCP-001.
            Raccomandazione mia: UJ-MCP-001, perché contiene DUE mitigazioni P0
            (emissione eventi tool ristretta al tool runtime; lookup obbligatoria
            per idempotency key). UJ-CLD-001 è bloccato in parte da HUMAN_BRIDGE.

NON RIFARE: threat model, approval policy, critica Costituzione, blueprint runtime,
            contratti. Verifica prima con:
              node --test tests/contracts/runtime-invariants.test.mjs   → 34/34
              node --test tests/contracts/approval-policy.test.mjs      → 28/28

RICORDA   : Regola 2 di CLAUDE.md — a fine task aggiorna CLAUDE.md e TASKCLAUDE.md,
            poi commit e push.
```
