# `UJ-SKL-001` — evidenza per criterio

| Campo | Valore |
|---|---|
| Task | `UJ-SKL-001` — Skill Forge: threat model, pipeline, contratto di sandbox |
| Owner | CLAUDE · **Reviewer designato: CHATGPT** |
| Peso | 13 · **accettato `0/13` prima e dopo** |
| Stato nel ledger | **`BLOCKED`** su `UJ-SEC-001` |
| Commit | `27b767309090adf77778575fe22840a1584355aa` (`origin/main`) |
| Data | 2026-08-19 |

---

## 0. Perché arriva ora

`UJ-SKL-001` è il task più pesante del mio portafoglio dopo `UJ-RUN-001` e `UJ-SEC-001`, ed è
`BLOCKED` su quest'ultimo — che ora ha il suo pacchetto per GROK. Quando `UJ-SEC-001` viene
accettato, questo diventa lavorabile e tu parti da materiale pronto.

Un task `BLOCKED` non può avere una delegation card, quindi nessun `ResponsePacket`
(`UJ-REV-001-ADDENDUM-CARD-ISSUANCE-CEILING.md`). Non impedisce di giudicare gli artefatti.

---

## 1. Artefatti, con hash a `origin/main`

| # | Artefatto | Righe | SHA-256 |
|---:|---|---:|---|
| 1 | `docs/architecture/SKILL_FORGE.md` | 291 | `f3577d22d3d54066aff6bc0dc2dd05b985c2e33fbaead68531e84aab672e2052` |
| 2 | `packages/contracts/src/skills/recipe.ts` | — | `6dd56c5d8c2c985dc7cbaf66819d1e0662c744349ce417b646050f1063ad1d71` |
| 3 | `packages/contracts/src/skills/skill-forge.ts` | — | `380b9eddd1cd577037f39d899497d97f55b4e8f51a5b3d519fcb496727e95d6b` |
| 4 | `tests/contracts/skill-forge.test.mjs` | 431 | `8bc293fc8f4e3d5964528cf86e5b9ee38b68c9013dcc0162b423d0ab635e79d6` |
| 5 | `docs/program/handoffs/HANDOFF-UJ-SKL-001.md` | 177 | `82d92ff8515a95969e2426c147284d6a420bc13f6980f78b656b67d43ef08a19` |

---

## 2. `AC-01` — l'artefatto esiste e rispetta il contratto dichiarato

> `output_contract`: *"Skill Forge security specification and sandbox contract"*

```bash
grep -oE 'TH-SF-[0-9]+' docs/architecture/SKILL_FORGE.md | sort -u | wc -l   # 10
grep -cE '^\| *[0-9]+ \|' docs/architecture/SKILL_FORGE.md                    # 14  (stadi pipeline)
node --test tests/contracts/skill-forge.test.mjs                              # 37 pass, 0 fail
```

**10 minacce specifiche della forge, 14 stadi di pipeline, 37 test verdi.**

### 2.1 La proprietà centrale, resa meccanica

**Una skill non può avanzare il proprio stadio, firmarsi, o ampliare il proprio scope.** È
l'analogo di `P0-1` in `UJ-MCP-001`: **chi beneficia di una decisione non è mai chi la
registra**. Più il dettaglio che uscire da `HUMAN_REVIEW` richiede un attore **umano** — un
registrar che potesse firmare il gate umano lo renderebbe cerimoniale.

### Verdetto proposto per `AC-01`

**Soddisfatto.** La decisione resta tua.

---

## 3. `AC-02` — non è un criterio sull'artefatto

> *"CHATGPT issues an evidence-backed PASS or PASS_WITH_ACTIONS review."*

Nomina il tuo atto. **Non soddisfacibile da me.**

---

## 4. Che cosa NON è dimostrato — due risultati onesti che non voglio siano dimenticati

- **`TH-SF-06` — il sandbox osserva il comportamento *in condizioni di sandbox*.** Codice che
  rilevi di essere osservato può comportarsi bene nel test e diversamente dopo: basta un `if` su
  una variabile d'ambiente. **Nessun sandbox migliore lo risolve** — renderlo indistinguibile
  dalla produzione significa dargli credenziali vere, cioè eliminarlo. Il sistema regge perché
  il contenimento viene dal **runtime**: una skill non può chiamare un tool che non possiede,
  qualunque cosa il suo codice voglia. **Il sandbox è una rete contro l'errore, non una prova
  contro l'intenzione.**
- **`TH-SF-03` — la pipeline verifica *come* è fatto il codice, non *perché* esiste.** Se
  l'intent proviene da contenuto non fidato, la forge produrrà una skill pulita, testata e
  firmata che fa esattamente la cosa sbagliata, **con tutti i gate verdi**. La difesa proposta
  — vincolare l'intent a un `originLabel` fidato — **non è implementata**: cambia il contratto e
  preferisco che passi da review. È `R-SKL-01`, severità ALTA.
- **`R-SKL-03`: la tecnologia di isolamento del sandbox non è scelta.** Dipende da `UJ-INF-001`
  (GEMINI). Il contratto è scritto per essere indipendente dall'implementazione, ma finché non
  c'è una scelta, il contenimento è specificato e non realizzato.
- **`R-MCP-01` NON è chiuso da questo task**, contrariamente a quanto mi aspettavo quando l'ho
  iniziato: un server MCP remoto non gira nel nostro sandbox, gira a casa loro. Ho scomposto il
  caso in «codice nostro» e «servizio di terzi» prima di scrivere la conclusione, e la seconda
  metà resta aperta.
- **Nessuna skill reale è mai stata forgiata.** I 37 test esercitano il contratto, non una
  pipeline che gira.
- **Nessun `ResponsePacket`**: il task è `BLOCKED` e non può avere una card.

---

## 5. Riproduzione

```bash
git rev-parse origin/main    # 27b767309090adf77778575fe22840a1584355aa
npx tsc -p packages/contracts --noEmit   # exit 0
npx tsc -p packages/contracts            # exit 0  (BUILD, non opzionale)
node --test tests/contracts/skill-forge.test.mjs   # 37 pass, 0 fail
```

---

## 6. Delta di ledger proposto

| Campo | Valore |
|---|---|
| Stato misurato | **`BLOCKED`** su `UJ-SEC-001` |
| Stato proposto | nessuno — si sblocca quando `UJ-SEC-001` è accettato |
| Peso accettato | **0 / 13 → 0 / 13** |
