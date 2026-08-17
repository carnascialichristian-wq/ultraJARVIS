# UJ-CLD-001 — SOURCE MANIFEST (raccolta fonti)

| Metadato | Valore |
|---|---|
| Task ID | UJ-CLD-001 |
| Milestone | M1 / M7 |
| Owner | CLAUDE |
| Reviewer | GEMINI |
| Peso totale del task | 8 |
| Peso di questo pacchetto | 2 di 8 (sola raccolta fonti) |
| Stato del task | IN_PROGRESS — raccolta fonti fatta, **verifica non fatta** |
| Data class | C0 PUBLIC (solo URL pubblici) |
| Data di raccolta | 2026-08-17 |

---

## 0. Perché questo file non contiene risposte

Il piano canonico (§34) assegna a CLAUDE, in parallelo secondario a UJ-RUN-001,
**soltanto la raccolta fonti** per UJ-CLD-001. Rispetto quel confine.

Inoltre §5 impone che una `VERIFIED_FACT` richieda una fonte primaria ufficiale
consultata, con URL **e data**. Io in questa sessione ho verificato che gli URL
**risolvono** (HTTP 200), non che il loro *contenuto* dica una certa cosa. Sono due
affermazioni diverse e le tengo separate:

- ✅ `OBSERVATION`: "questo URL ufficiale risponde 200 in data 2026-08-17".
- ❌ non affermato: "il piano X include l'accesso Y".

Chiunque riprenda UJ-CLD-001 deve **leggere** le fonti e compilare la colonna
"Risposta", che qui è deliberatamente vuota. Riempirla adesso a memoria sarebbe
esattamente il tipo di falso avanzamento vietato da §31.5, e su questo tema — quali
capacità un abbonamento consumer includa davvero — l'errore è anche costoso, perché
può indurre a progettare su un accesso inesistente.

---

## 1. Domande a cui UJ-CLD-001 deve rispondere

| # | Domanda | Perché è vincolante |
|---|---|---|
| Q1 | Un abbonamento consumer Claude include il diritto di uso programmatico dell'API? | §3 vieta di confondere abbonamento e API |
| Q2 | Claude Code su quale autenticazione opera, e con quali piani? | determina se esiste un percorso `AUTO_VERIFIED` |
| Q3 | L'Agent SDK TypeScript richiede credenziali a consumo? | §4.1 vieta pay-per-token |
| Q4 | Esiste un flusso OAuth ufficiale per applicazioni terze? | il portafoglio CLAUDE vieta di trattare una capacità Claude Code come licenza universale |
| Q5 | I limiti d'uso sono leggibili programmaticamente? | §6.3 Quota Governor: senza contatore, niente `AUTO_VERIFIED` |
| Q6 | Quali termini si applicano all'uso automatizzato? | §6.2 punto 3 |
| Q7 | Qual è la policy su dati e training per il piano in uso? | §6.2 punto 9 |
| Q8 | Esiste un percorso che possa generare addebiti "per errore"? | §4.1: budget incrementale zero |
| Q9 | Il supporto MCP è ufficiale e su quali superfici? | serve a UJ-MCP-001 |
| Q10 | Qual è il fallback quando il percorso automatico non è ammesso? | §4.1 punto 6: `HUMAN_BRIDGE` o `UNAVAILABLE` |

---

## 2. Fonti candidate — reachability verificata 2026-08-17

Metodo: `curl -s -o /dev/null -w "%{http_code}" -L --max-time 15 <url>`.
`200` significa **l'URL risponde**, non che il contenuto sia stato letto o valutato.

### 2.1 Prodotto e accesso

| ID | Fonte | URL | HTTP | Domande |
|---|---|---|---:|---|
| S-01 | Claude Code — overview | `https://docs.claude.com/en/docs/claude-code/overview` | 200 | Q2 |
| S-02 | Claude Code — settings | `https://docs.claude.com/en/docs/claude-code/settings` | 200 | Q2, Q5 |
| S-03 | Claude Code — security | `https://docs.claude.com/en/docs/claude-code/security` | 200 | Q6 |
| S-04 | Claude Code — costs | `https://docs.claude.com/en/docs/claude-code/costs` | 200 | Q8 |
| S-05 | Claude Code — GitHub Actions | `https://docs.claude.com/en/docs/claude-code/github-actions` | 200 | Q2, Q4 |
| S-06 | Claude Code con piani Pro/Max | `https://support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan` | 200 | **Q1, Q2** |

### 2.2 API, SDK e autenticazione

| ID | Fonte | URL | HTTP | Domande |
|---|---|---|---:|---|
| S-07 | API — overview | `https://docs.claude.com/en/api/overview` | 200 | Q1, Q3 |
| S-08 | Agent SDK — overview | `https://docs.claude.com/en/api/agent-sdk/overview` | 200 | **Q3, Q4** |
| S-09 | API — rate limits | `https://docs.claude.com/en/api/rate-limits` | 200 | Q5 |
| S-10 | Console — billing | `https://console.anthropic.com/settings/billing` | 200 | **Q8** — richiede login, `HUMAN_BRIDGE` |

### 2.3 Limiti d'uso

| ID | Fonte | URL | HTTP | Domande |
|---|---|---|---:|---|
| S-11 | Usage limit — best practices | `https://support.claude.com/en/articles/9797557-usage-limit-best-practices` | 200 | Q5 |
| S-12 | Collezione supporto Claude Pro | `https://support.claude.com/en/collections/4078531-claude-pro` | 200 | Q1, Q5 |
| S-13 | ~~Does Claude Pro have usage limits~~ | `https://support.claude.com/en/articles/8325612-...` | **404** | — |
| S-14 | ~~About Claude Pro usage~~ | `https://support.claude.com/en/articles/8324991-...` | **404** | — |

> **Osservazione utile, non un dettaglio.** Due URL di supporto plausibili restituiscono
> 404. È la dimostrazione pratica del motivo per cui §4.1 punto 5 vieta di congelare i
> limiti numerici nel piano o nel codice: le pagine che li descrivono si spostano.
> Il Capability Registry deve puntare a fonti **rilette a una data**, con `last_verified_at`,
> non a numeri copiati una volta. Chi riprende il task non deve reintrodurre S-13/S-14
> a memoria: vanno sostituite ripartendo da S-12.

### 2.4 Termini, prezzi e privacy

| ID | Fonte | URL | HTTP | Domande |
|---|---|---|---:|---|
| S-15 | Pricing | `https://www.anthropic.com/pricing` | 200 | Q1, Q8 |
| S-16 | Consumer terms | `https://www.anthropic.com/legal/consumer-terms` | 200 | **Q6** |
| S-17 | Commercial terms | `https://www.anthropic.com/legal/commercial-terms` | 200 | Q6 |
| S-18 | Privacy policy | `https://www.anthropic.com/legal/privacy` | 200 | **Q7** |

### 2.5 MCP

| ID | Fonte | URL | HTTP | Domande |
|---|---|---|---:|---|
| S-19 | MCP — documentazione | `https://docs.claude.com/en/docs/mcp` | 200 | Q9 |
| S-20 | MCP connector | `https://docs.claude.com/en/docs/agents-and-tools/mcp-connector` | 200 | Q9 |

---

## 3. Template del Capability Record da compilare

Da riempire **una riga per capacità**, non una per prodotto, secondo lo schema §6 del
prompt canonico. `incremental_cost` deve risultare `ZERO` o `DISABLED`: qualunque altro
valore rende la capacità inammissibile.

```yaml
capability_id: CAP-CLD-<n>
provider: Anthropic
product: <prodotto concreto>
capability: <cosa può fare>
access_path: <UI | CLI | SDK | API | MCP | GitHub App>
mode: <AUTO_VERIFIED | HUMAN_BRIDGE | MANUAL_TOOL | EXPERIMENTAL_SANDBOX | UNAVAILABLE | PAID_ONLY_DISABLED | LOCAL_COMPUTE_DISABLED | RETIRED>
auth: <metodo ufficiale e scope>
plan_evidence: <prova che l'account corrente ha l'accesso>
incremental_cost: <ZERO | DISABLED>
billing_required: <yes | no | unknown>
quota_source: <URL ufficiale o schermata osservata>
terms_source: <URL>
data_policy: <uso e retention>
regions: <disponibilità>
secrets_needed: <nessuno | riferimenti, mai valori>
automation_allowed: <yes | no | unknown>
last_verified_at: <UTC>
verified_by: <IA/persona e metodo>
status: <ACTIVE | EXPERIMENTAL | STALE | BLOCKED | RETIRED>
fallback: <bridge o sostituto>
```

## 4. Gate di ammissibilità (§6.2) — da applicare a ogni record

Tutti e dieci devono essere positivi e documentati. **Uno solo negativo impedisce
`AUTO_VERIFIED`.**

| # | Condizione | Esito |
|---|---|---|
| 1 | esiste un'interfaccia ufficiale per automazione | ☐ |
| 2 | l'autenticazione è prevista per quel caso d'uso | ☐ |
| 3 | i termini consentono l'uso | ☐ |
| 4 | il piano/account corrente copre realmente l'accesso | ☐ |
| 5 | nessun addebito, overage o billing obbligatorio | ☐ |
| 6 | nessun cookie, scraping UI o browser automation di sessioni consumer | ☐ |
| 7 | i limiti sono leggibili e il sistema può fermarsi prima | ☐ |
| 8 | l'elaborazione resta cloud-side | ☐ |
| 9 | dati, retention e training compatibili con la classificazione | ☐ |
| 10 | esistono un test minimo e un fallback | ☐ |

## 5. Vincolo di portafoglio da non violare

Il piano (§32.2) vieta a CLAUDE di **"trasformare una capacità Claude Code in una
licenza universale per app terze"**. Concretamente, in UJ-CLD-001:

> Il fatto che *questa sessione* operi in un ambiente con accesso a repository e
> strumenti **non** è prova che un'applicazione ultraJARVIS di terze parti possa
> ottenere lo stesso accesso con le stesse credenziali. Sono due Capability Record
> distinti, con `access_path` e `auth` diversi, e vanno verificati separatamente.

Finché Q1–Q4 non hanno risposta documentata, lo stato dell'accesso automatico Claude
resta **BLOCKED**, come richiesto dalla review focus n. 3 della PR #1.

## 6. Stato e prossima azione

| Voce | Valore |
|---|---|
| Fatto | 20 fonti candidate identificate, 18 raggiungibili, 2 morte e segnalate |
| Non fatto | lettura del contenuto, compilazione dei Capability Record, gate §6.2 |
| Peso accettato | 2 di 8 |
| Prossima azione | leggere S-06, S-08, S-16, S-18 e compilare i primi quattro Capability Record |
| Blocker | S-10 richiede login → `HUMAN_BRIDGE` con Christian; nessun altro blocker |
