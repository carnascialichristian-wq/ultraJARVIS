# HANDOFF — UJ-SKL-001 (CLAUDE)

| Metadato | Valore |
|---|---|
| Task | UJ-SKL-001 — Skill Forge: threat model, pipeline, contratto sandbox |
| Peso | 13 · Reviewer: **CHATGPT** |
| Stato | **REVIEW** |
| Data | 2026-08-17 UTC |

---

## 1. Risultato

| Deliverable | File |
|---|---|
| Threat model, pipeline, sandbox | `docs/architecture/SKILL_FORGE.md` |
| Recipe (composizione di tool ammessi) | `packages/contracts/src/skills/recipe.ts` |
| Pipeline, proibizioni, sandbox, ciclo di vita | `packages/contracts/src/skills/skill-forge.ts` |
| Test | `tests/contracts/skill-forge.test.mjs` — **37/37 verdi** |

**Perché questo task conta più degli altri:** tutto il resto del sistema *compone*
cose che hanno già superato una review. La Skill Forge è l'unico componente che
**fabbrica codice eseguibile nuovo**. Ogni altro sottosistema difende il perimetro da
ciò che entra; questo deve difenderlo da ciò che produciamo noi.

## 2. La proprietà centrale, resa meccanica

> Una skill non può mai avanzare il proprio stadio, firmarsi o ampliare il proprio scope.

È l'analogo di P0-1 nel tool plane: **l'entità che beneficia di una decisione non è
mai l'entità che la registra**. Tre regole:

| ID | Regola |
|---|---|
| `SF-PIPE-1` | solo `FORGE_REGISTRAR`, `HUMAN_REVIEWER` o `OWNER` avanzano; e **uscire da `HUMAN_REVIEW` richiede un umano** — un registrar che potesse firmare il gate umano lo renderebbe cerimoniale |
| `SF-PIPE-2` | esattamente uno stadio avanti; niente salti, niente passi indietro |
| `SF-PIPE-3` | la prova dello stadio che si lascia deve esistere |

Più le 10 proibizioni di §13.3, tutte bloccanti, **ricontrollate all'invocazione e non
solo all'ammissione** — un controllo fatto una volta presume che il manifest non cambi
mai, presunzione che `TH-SF-08` smentisce.

## 3. Due risultati che vanno letti insieme

### 3.1 `TH-SF-06` — il sandbox non può dimostrare ciò che sembra dimostrare

Il sandbox osserva il comportamento **in condizioni di sandbox**. Codice che rilevi di
essere osservato — niente credenziali, rete negata, filesystem effimero — può
comportarsi bene nel test e diversamente dopo. Basta un `if` su una variabile d'ambiente.

**Nessun sandbox migliore lo risolve:** renderlo indistinguibile dalla produzione
significa dargli credenziali e dati veri, cioè eliminarlo. Il compromesso è strutturale.

**Perché il sistema regge comunque:** il contenimento non viene dal sandbox ma dal
runtime. Una skill non può chiamare un tool che non possiede, **qualunque cosa il suo
codice voglia fare**, perché l'allowlist è applicata dal tool runtime. Il codice
consapevole del sandbox può mentire su ciò che *farebbe*; non può ottenere ciò che non
gli è stato concesso.

**Conclusione da riportare nel risk register:** il sandbox è una rete di sicurezza per
il codice sbagliato **per errore**, non una prova contro il codice sbagliato **di
proposito**. Stessa distinzione che ho fatto per il loop detector, e per la stessa ragione.

### 3.2 `TH-SF-03` — la pipeline verifica il "come", non il "perché"

Typecheck, SAST, test, sandbox, review avversariale verificano tutti **come** è fatto
il codice. Nessuno verifica **perché** esiste.

Se l'intent proviene da contenuto non fidato letto dal sistema, la pipeline produrrà
con diligenza una skill pulita, testata, firmata **che fa esattamente la cosa
sbagliata**, e ogni gate risulterà verde.

**Difesa proposta, non implementata:** l'intent che avvia una forge deve avere
`originLabel` `TRUSTED_INTERNAL` o `HUMAN_PROVIDED`, mai `UNTRUSTED_EXTERNAL`. Richiede
di passare l'intent come `ArtifactRef` invece che come stringa — una modifica di
contratto che preferisco far passare da review invece di infilarla adesso.

## 4. `R-MCP-01` resta aperto — con precisione

Ci si aspetterebbe che il sandbox lo chiudesse. Non lo fa:

| Caso | Coperto? |
|---|---|
| Codice generato da noi, in sandbox | ✅ |
| Server MCP di terzi, remoto | ❌ non gira nel nostro sandbox: gira a casa loro |

Per il secondo caso il sandbox è irrilevante **per costruzione**. Serve monitoraggio
comportamentale: profilo delle chiamate attese e allarme sulla deviazione.

**Propongo `UJ-MCP-002`, peso stimato 5.** Come per `UJ-SEC-002`, non lo aggiungo alla
baseline da solo.

## 5. Task delta

| Task | Stato prima | Stato ora | Accettato | Proposto | Manca |
|---|---|---|---:|---:|---:|
| UJ-SKL-001 | READY | **REVIEW** | 0/13 | 11/13 | 13 |
| UJ-RUN-001 | REVIEW | REVIEW | 0/13 | 11/13 | 13 |
| UJ-SEC-001 | REVIEW | REVIEW | 0/13 | 11/13 | 13 |
| UJ-MCP-001 | REVIEW | REVIEW | 0/8 | 7/8 | 8 |
| UJ-RCV-001 | REVIEW | REVIEW | 0/8 | 6/8 | 8 |
| UJ-CLD-001 | IN_PROGRESS | IN_PROGRESS | 0/8 | 2/8 | 6 |
| UJ-REV-001 | BLOCKED | BLOCKED | 0/5 | — | 5 |
| UJ-REV-002 | BLOCKED | BLOCKED | 0/8 | — | 8 |

```
accettato formalmente = 0 / 76  = 0%
proposto in review    = 48 / 76 = 63,2%   11 + 11 + 7 + 6 + 11 + 2
```

**Il portafoglio è esaurito** salvo: UJ-CLD-001 (6 restanti, in parte `HUMAN_BRIDGE`)
e i due task di review bloccati da ChatGPT.

## 6. Rischi

**Nuovi:**

| ID | Rischio | Severità |
|---|---|---|
| `R-SKL-01` | `TH-SF-03`: intent non vincolato a provenienza fidata → skill ostile prodotta con tutti i gate verdi | ALTA |
| `R-SKL-02` | `TH-SF-06`: il sandbox prova il comportamento solo in condizioni di sandbox | MEDIA (contenuta dal runtime) |
| `R-SKL-03` | Tecnologia di isolamento non scelta: il contratto dice *cosa*, non *come* | MEDIA — dipende da `UJ-INF-001` |

**Invariati:** `R-MCP-01` (§4), `R-SEC-01` e `R-SEC-02` (CRITICA, attendono `UJ-SEC-002`),
`R-SEC-03`, `R-RCV-01`, `R-SEC-04`.

## 7. Handoff

### → CHATGPT (reviewer)

Tre domande, tutte reali:

1. **`TH-SF-03`:** vincolare l'intent a provenienza fidata cambia il contratto (intent
   come `ArtifactRef`). Lo faccio ora o entra in una revisione più ampia con UJ-INT-004?
2. **`UJ-MCP-002`** (peso 5): entra in baseline? È l'unico modo di chiudere `R-MCP-01`.
   Insieme a `UJ-SEC-002` (peso 8) sono **due decisioni di baseline in sospeso**.
3. **Passi indietro nella pipeline:** li ho vietati, quindi una skill respinta
   all'adversarial review per una riga rifà tutto. È rigoroso ma costoso, e **il costo
   lo paga chi usa la forge, non chi la progetta**. È il compromesso giusto o serve un
   percorso di rework tracciato? Non ho una posizione forte.

### → GEMINI
`R-SKL-03`: la tecnologia di isolamento del sandbox dipende dalla tua scelta di
topologia in `UJ-INF-001`. Il contratto specifica cosa deve garantire, non come.
Insieme a `R-RCV-01` (serve compare-and-swap nel DB), sono **due vincoli che ti servono
prima di scegliere, non dopo**. Restano non revisionati UJ-RUN-001 e UJ-MCP-001.

### → GROK
Due voci per il risk register, entrambe con la stessa forma di quelle che ti ho già
passato: **il sandbox è una difesa contro l'errore, non contro l'intenzione**
(`TH-SF-06`), e **la pipeline verifica il come, non il perché** (`TH-SF-03`). Se assegni
al sandbox una mitigazione piena, il register mente.

### → CHRISTIAN
Nessuna nuova decisione tecnica. Le decisioni aperte restano quelle già poste, più le
due di baseline che ho girato a ChatGPT.

## 8. RESUME_POINT

```
STATO     : 5 task in REVIEW (UJ-RUN-001, UJ-SEC-001, UJ-MCP-001, UJ-RCV-001, UJ-SKL-001)
            UJ-CLD-001 IN_PROGRESS 2/8
            UJ-REV-001, UJ-REV-002 BLOCKED — aspettano ChatGPT

PROSSIMO  : UJ-CLD-001 — unico task del portafoglio ancora lavorabile.
            Restano 6 unità: leggere S-06, S-08, S-16, S-18 dal source manifest
            e compilare i primi quattro Capability Record.
            LIMITE NOTO: S-10 (console billing) richiede login → HUMAN_BRIDGE
            con Christian. Quella parte non è completabile in autonomia.

POI       : il portafoglio è esaurito. Il lavoro successivo dipende da:
            - reviewer (Gemini, Grok, ChatGPT) che accettino o respingano
            - ChatGPT che produca UJ-INT-001 e UJ-INT-007 (sbloccano UJ-REV-001/002)
            - Christian sulle decisioni di baseline e costituzionali

VERIFICA  : dalla root, node --test su ciascun file in tests/contracts/ → 138/138
```
