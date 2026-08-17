# UJ-CLD-001 — CAPABILITY RECORDS (verifica completata)

| Metadato | Valore |
|---|---|
| Task ID | UJ-CLD-001 |
| Milestone | M1 / M7 |
| Owner | CLAUDE · Reviewer | **GEMINI** |
| Stato | **REVIEW** |
| Peso | 8 |
| Data di verifica | **2026-08-17** |
| Metodo | lettura diretta delle fonti primarie ufficiali |
| Documento precedente | `UJ-CLD-001-SOURCE-MANIFEST.md` (raccolta fonti) |

---

## 0. Conclusione, in cima perché cambia il piano

> **`VERIFIED_FACT`** — Un'applicazione ultraJARVIS costruita sul Claude Agent SDK
> **non può usare il login dell'abbonamento claude.ai di Christian**. La documentazione
> ufficiale lo vieta espressamente. L'unica autenticazione ammessa per prodotti di terzi
> è la **chiave API**, che è pay-per-token, che l'**Articolo 5 vieta**.

Quindi, per il programma:

| Percorso | Verdetto | Motivo |
|---|---|---|
| ultraJARVIS come app autonoma su Agent SDK | ❌ **PAID_ONLY_DISABLED** | richiede chiave API = costo incrementale |
| ultraJARVIS che automatizza la UI di Claude.ai | ❌ **UNAVAILABLE** | vietato dai termini consumer |
| Christian che usa Claude Code di persona, con esiti riportati al sistema | ✅ **HUMAN_BRIDGE** | è l'unico percorso a costo zero |

**La review focus n. 3 della PR #1 chiedeva di tenere l'accesso automatico Claude
`BLOCKED` finché il caso d'uso non fosse verificato. Ora è verificato, e la risposta non
è "sbloccalo": è che il percorso automatico non esiste a costo zero.** `HUMAN_BRIDGE`
non è un ripiego temporaneo in attesa di qualcosa di meglio — per Claude è la modalità
definitiva finché il budget resta zero.

---

## 1. Risposte alle dieci domande

| # | Domanda | Risposta | Etichetta |
|---|---|---|---|
| Q1 | L'abbonamento consumer include l'uso programmatico dell'API? | **No.** L'accesso ai crediti API è un'opzione separata e opt-in | `VERIFIED_FACT` |
| Q2 | Claude Code su quale autenticazione opera? | Login con le **stesse credenziali di Claude**; Pro e Max includono Claude Code | `VERIFIED_FACT` |
| Q3 | L'Agent SDK richiede credenziali a consumo? | **Sì per prodotti di terzi**: chiave API | `VERIFIED_FACT` |
| Q4 | Esiste un flusso ufficiale per app terze con login claude.ai? | **No**, salvo approvazione preventiva di Anthropic | `VERIFIED_FACT` |
| Q5 | I limiti sono leggibili programmaticamente? | **Nessun limite numerico pubblicato.** In Claude Code il comando `/status` mostra l'allocazione residua | `VERIFIED_FACT` |
| Q6 | I termini consentono l'uso automatizzato? | **No** per i servizi consumer: l'accesso "attraverso mezzi automatizzati o non umani, tramite bot, script o altro" è vietato salvo chiave API o permesso esplicito | `VERIFIED_FACT` |
| Q7 | Termini applicabili all'Agent SDK? | **Commercial Terms of Service**, esplicitamente distinti dai termini consumer | `VERIFIED_FACT` |
| Q8 | Esiste un percorso che può generare addebiti? | **Sì**, ed è importante: al raggiungimento del limite viene proposto di abilitare crediti API, fatturati a tariffe API standard. Richiede **consenso esplicito** | `VERIFIED_FACT` |
| Q9 | Il supporto MCP è ufficiale? | Sì, MCP è capacità documentata dell'Agent SDK e di Claude Code | `VERIFIED_FACT` |
| Q10 | Qual è il fallback? | `HUMAN_BRIDGE` — unico percorso a costo zero | `PROPOSAL` derivata |

### 1.1 Le due citazioni che decidono tutto

Sull'Agent SDK e i prodotti di terzi:

> *"Unless previously approved, Anthropic does not allow third party developers to offer
> claude.ai login or rate limits for their products, including agents built on the Claude
> Agent SDK. Use the API key authentication methods described in the Quickstart instead."*
> — `https://code.claude.com/docs/en/agent-sdk/overview`, letto il 2026-08-17

Sui termini consumer e l'automazione:

> È vietato *"access the Services through automated or non-human means, whether through a
> bot, script, or otherwise"*, salvo uso di una chiave API o permesso esplicito di Anthropic.
> — `https://www.anthropic.com/legal/consumer-terms`, letto il 2026-08-17

**La prima chiude Q3 e Q4 insieme.** È anche la conferma documentale del divieto che il
mio portafoglio (§32.2) mi impone: *"non trasformare una capacità Claude Code in una
licenza universale per app terze"*. Non era una cautela prudenziale: è la regola scritta.

---

## 2. Capability Record

Schema §6 del prompt canonico. `incremental_cost` deve risultare `ZERO` o `DISABLED`.

### CAP-CLD-001 — Claude Code con abbonamento Pro/Max

```yaml
capability_id: CAP-CLD-001
provider: Anthropic
product: Claude Code (CLI / app)
capability: sviluppo assistito, lettura e scrittura file, esecuzione comandi, MCP
access_path: CLI
mode: MANUAL_TOOL            # usato deliberatamente da una persona
auth: login con le credenziali dell'abbonamento Claude
plan_evidence: "With Pro and Max plans, you now have access to both Claude on the web,
  desktop, and mobile apps and Claude Code in your terminal with one unified subscription"
incremental_cost: ZERO       # a condizione di rifiutare i crediti API
billing_required: no
quota_source: comando /status; nessun limite numerico pubblicato
terms_source: https://www.anthropic.com/legal/consumer-terms
data_policy: da approfondire con la privacy policy
regions: non verificato
secrets_needed: nessuno (login interattivo dell'utente)
automation_allowed: no       # non come servizio programmatico per un'app terza
last_verified_at: 2026-08-17
verified_by: CLAUDE, lettura diretta della fonte
status: ACTIVE
fallback: nessuno necessario — è già il percorso manuale
```

### CAP-CLD-002 — Claude Agent SDK

```yaml
capability_id: CAP-CLD-002
provider: Anthropic
product: Claude Agent SDK (TypeScript / Python)
capability: agent loop, tool integrati, subagent, MCP, hook, permessi, sessioni
access_path: SDK
mode: PAID_ONLY_DISABLED     # ← verdetto
auth: chiave API. Il login claude.ai NON è consentito per prodotti di terzi
plan_evidence: "Anthropic does not allow third party developers to offer claude.ai login
  or rate limits for their products, including agents built on the Claude Agent SDK"
incremental_cost: DISABLED   # richiederebbe pay-per-token
billing_required: yes
quota_source: rate limit dell'API, non applicabili senza chiave
terms_source: https://www.anthropic.com/legal/commercial-terms
regions: non verificato
secrets_needed: chiave API — NON acquisita, e non va acquisita
automation_allowed: sì, ma solo su percorso a pagamento
last_verified_at: 2026-08-17
verified_by: CLAUDE, lettura diretta della fonte
status: BLOCKED
fallback: CAP-CLD-004 (human bridge)
```

> **Nota architetturale, non solo di conformità.** L'Agent SDK offre esattamente le
> primitive che ho progettato in UJ-RUN-001: agent loop, subagent, permessi, MCP, hook.
> La tentazione di adottarlo è forte e va **respinta esplicitamente**, non per NIH ma
> perché il suo unico percorso di autenticazione ammesso viola l'Articolo 5.
> Resta utilissimo come **riferimento di design**, che è il ruolo che §32.2 gli assegna
> nella mia shortlist di repository.

### CAP-CLD-003 — Claude.ai (web, desktop, mobile)

```yaml
capability_id: CAP-CLD-003
provider: Anthropic
product: Claude.ai
capability: conversazione, analisi, artifact, progetti
access_path: UI
mode: MANUAL_TOOL
auth: login utente
incremental_cost: ZERO
billing_required: no
terms_source: https://www.anthropic.com/legal/consumer-terms
automation_allowed: NO — vietato esplicitamente dai termini
last_verified_at: 2026-08-17
verified_by: CLAUDE, lettura diretta della fonte
status: ACTIVE (solo uso manuale)
fallback: nessuno
```

### CAP-CLD-004 — Human bridge verso Claude

```yaml
capability_id: CAP-CLD-004
provider: Anthropic (via Christian)
product: Claude Code o Claude.ai, usati da una persona
capability: ragionamento, progettazione, review, generazione di codice
access_path: DelegationCard copy/paste
mode: HUMAN_BRIDGE
auth: nessuna dal lato sistema — è Christian a essere autenticato
incremental_cost: ZERO
billing_required: no
automation_allowed: n/a — è per definizione non automatizzato
last_verified_at: 2026-08-17
status: ACTIVE
fallback: UNAVAILABLE
```

---

## 3. Gate di ammissibilità §6.2

Applicato a CAP-CLD-002, il caso che conta. **Un solo esito negativo impedisce
`AUTO_VERIFIED`.**

| # | Condizione | Esito |
|---|---|---|
| 1 | esiste un'interfaccia ufficiale per automazione | ✅ sì, l'Agent SDK |
| 2 | l'autenticazione è prevista per quel caso d'uso | ❌ **no**: il login claude.ai è escluso per prodotti di terzi |
| 3 | i termini consentono l'uso | ⚠️ sì, ma sotto i Commercial Terms, con chiave API |
| 4 | il piano corrente copre l'accesso | ❌ **no**: l'abbonamento non include l'uso via SDK |
| 5 | nessun addebito o billing obbligatorio | ❌ **no**: la chiave API è pay-per-token |
| 6 | nessun cookie o automazione di UI consumer | ✅ n/a |
| 7 | i limiti sono leggibili e il sistema può fermarsi prima | ❌ **no**: nessun limite numerico pubblicato |
| 8 | l'elaborazione resta cloud-side | ✅ sì |
| 9 | dati e retention compatibili | ⚠️ non verificato in dettaglio |
| 10 | esiste un test minimo e un fallback | ✅ fallback = `HUMAN_BRIDGE` |

**Quattro condizioni negative su dieci. Verdetto: `PAID_ONLY_DISABLED`, definitivo
finché il budget resta zero.**

---

## 4. Il percorso che può generare spesa — e come si chiude

`Q8` è la scoperta operativamente più importante per l'Articolo 5, perché è l'unico
modo in cui questo programma può generare un addebito per errore.

**Il meccanismo:** raggiunto il limite di abbonamento in Claude Code, viene proposto di
abilitare crediti API, fatturati a tariffe API standard, distinte dal prezzo Pro/Max.

**La difesa documentata:** l'opzione è opt-in e richiede consenso esplicito. La fonte è
esplicita sul fatto che per restare dentro l'allocazione dell'abbonamento occorre
**rifiutare l'opzione crediti API quando viene presentata**.

**Conseguenza per ultraJARVIS — controllo operativo, non solo nota:**

| # | Regola |
|---|---|
| `CLD-1` | Al prompt sui crediti API la risposta è **sempre no**, salvo decisione esplicita e registrata di Christian |
| `CLD-2` | Raggiungere il limite è un evento `BLOCKED` legittimo, **non** un problema da risolvere spendendo |
| `CLD-3` | Nessun agente e nessuna sessione può accettare l'opzione per conto del proprietario |

`CLD-2` merita enfasi: è precisamente il caso in cui l'Articolo 5 dice *"un blocco è
preferibile a una spesa inattesa"*. Il sistema deve fermarsi, non trovare un modo.

---

## 5. Effetto sul Quota Governor

`Q5` ha una conseguenza diretta su §6.3 del prompt canonico.

**Nessun limite numerico è pubblicato.** Il residuo è visibile solo interattivamente
tramite `/status` in Claude Code. Quindi:

- il Quota Governor **non può leggere** il residuo di Claude da una fonte programmatica;
- §6.3 è esplicito su cosa fare: *"se il provider non espone un contatore affidabile, il
  sistema non inventa il residuo"*;
- l'unica opzione conforme è `OBSERVED_THRESHOLD` — soglia prudente osservata — oppure
  `UNKNOWN`, entrambe già previste nel tipo `QuotaCounter` che ho definito in
  `checkpoint.ts`;
- il residuo di Claude entra nel sistema solo tramite `HUMAN_BRIDGE`: Christian legge
  `/status` e lo riporta.

**Questo conferma una scelta di progetto fatta prima di conoscere il dato.** Il campo
`source: "PROVIDER_COUNTER" | "OBSERVED_THRESHOLD" | "UNKNOWN"` esiste già proprio per
non dover inventare un numero. È il tipo di conferma che vale più di una previsione
azzeccata: il contratto non ha dovuto cambiare.

---

## 6. Scoperta secondaria: le fonti si spostano in tempo reale

`OBSERVATION`, misurata durante questa verifica.

L'URL dell'Agent SDK registrato **ieri** nel source manifest ha prodotto due redirect
consecutivi:

```
docs.claude.com/en/api/agent-sdk/overview
   → 301 → platform.claude.com/docs/en/api/agent-sdk/overview
   → 307 → code.claude.com/docs/en/agent-sdk/overview
```

Il dominio della documentazione è cambiato **fra la raccolta fonti e la lettura**, cioè
nell'arco di un giorno. Sommato ai due 404 già trovati nel manifest, fa **tre URL
ufficiali instabili su venti in ventiquattro ore**.

**→ GEMINI, per il Capability Registry:** questa è la dimostrazione empirica del motivo
per cui §4.1 punto 5 vieta di congelare i limiti e gli URL nel piano o nel codice. Un
Capability Record senza `last_verified_at` non è "leggermente datato": è **inattendibile
per costruzione**. La freschezza va trattata come un dato di prima classe, non come
metadato decorativo.

---

## 7. Task delta e stato

| Voce | Valore |
|---|---|
| Fatto | Q1–Q10 risposte con fonte primaria e data; 4 Capability Record; gate §6.2 applicato |
| Non fatto | S-10 (console billing) richiede login → **`HUMAN_BRIDGE` con Christian** |
| Peso | 7/8 proposti (2 dalla raccolta fonti + 5 dalla verifica) |
| Restante | 1 unità: conferma via bridge dello stato di billing dell'account |

**Perché non 8/8.** L'unica cosa che non posso verificare è lo stato reale del billing
sull'account di Christian: richiede un login che non ho e non devo avere. È esattamente
il tipo di residuo che va lasciato visibile invece di arrotondato.

## 8. Handoff

### → GEMINI (reviewer, e owner del Capability Registry)

- I 4 record sono nel formato §6 e pronti da inglobare in `UJ-CAP-001`.
- **Verdetto da non ammorbidire:** CAP-CLD-002 è `PAID_ONLY_DISABLED`, con 4 condizioni
  negative su 10 nel gate §6.2. Non è "da rivedere più avanti": è chiuso finché il
  budget resta zero.
- **§6 ti riguarda direttamente:** tre URL ufficiali su venti sono diventati instabili in
  ventiquattro ore. Progetta il registry perché la freschezza sia verificabile, non
  dichiarata.
- Resta aperta 1 unità che richiede un bridge con Christian.

### → CHATGPT

Il risultato ha una conseguenza architetturale, non solo di conformità: **ultraJARVIS non
può essere un'applicazione autonoma che chiama Claude.** Per Claude il sistema è
necessariamente un orchestratore di `HUMAN_BRIDGE`. Se il Program OS assume un percorso
automatico verso Claude, va corretto.

### → GROK

Una delle tue tesi da falsificare in `UJ-RED-001` — *"zero-card e automatico sono
compatibili?"* — ha ora una risposta parziale documentata: **per Claude, no**. Ti
consegno il caso già verificato, così puoi concentrarti sugli altri provider.

### → CHRISTIAN

**Due cose concrete, nessuna urgente:**

1. **Al prompt sui crediti API in Claude Code, la risposta è sempre no** salvo tua
   decisione esplicita. È l'unico modo in cui questo programma può generare un addebito.
2. Quando vuoi chiudere l'ultima unità di UJ-CLD-001, serve che tu guardi lo stato di
   billing del tuo account e me lo riporti. Non è urgente e non blocca nulla.

**Una nota che ti riguarda come proprietario:** avevi chiesto un sistema a costo
incrementale zero. La verifica dice che, per la parte Claude, questo è compatibile
**solo** con te nel ciclo. Non è un limite del progetto: è la conseguenza diretta del
vincolo che hai posto, e il piano l'aveva previsto prevedendo `HUMAN_BRIDGE` come
modalità di prima classe.
