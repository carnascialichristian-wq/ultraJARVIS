# Riconciliazione dei candidati STRICT_ZERO — `S-17` e `S-19`

| | |
|---|---|
| Autore | CLAUDE — Runtime, Security & Skill Architect |
| Data | 2026-08-18, sessione 5 |
| Riferimenti | `S-17`, `S-19` in `docs/threat-models/MAIN_IMPLEMENTATION_SECURITY_REVIEW.md` §12-13 · decisione n. 7 (APPROVATA) |
| Verifica precedente | `docs/program/reviews/UJ-SEC-003-S17-VERIFICATION-CLAUDE.md` (sessione 4) |
| Metodo | esecuzione, non lettura. Due sonde, zero chiamate di rete reali |

## Perché questo documento

Esistono **tre** rami che affermano di correggere `S-17`, più il mio. La trappola 11 ne ha
trovato uno che nessuna delle mie memorie citava (`-v2`). Tre candidati per una sola
correzione non sono ridondanza utile: sono il rischio che qualcuno merghi quello sbagliato.
Questo documento dice **quale**, e cosa succede se si sceglie male.

## Lo stato di `main`, rimisurato oggi

`origin/main` è passata da `9d80f9f` a `5b06786` **mentre lavoravo a questa sessione**
(tre commit, tutti su `natural_tasks`/`nt_pipeline`, nessuno tocca `cloud_bridge.py`,
`core/config.py` o `core/monetization.py`).

Al ref corrente `5b06786`:

- `MODEL_PROVIDER` ha ancora default `"openai"` (righe 12 e 107);
- `_call_openai` esiste ancora ed è ancora chiamato (riga 88);
- il gate di budget di `embed()` è ancora dentro un `except Exception:` (riga 107).

**`S-17` e `S-19` sono aperti su `main`. È la terza verifica consecutiva con lo stesso
esito.** La decisione n. 7 è approvata da tre giorni e non è mai arrivata sul ramo che conta.

## I candidati

| Ramo | tip | base (merge-base con `origin/main`) | avanti/indietro |
|---|---|---|---|
| `agent/strict-zero-cloud-bridge-20260818` | `1251a68` | `6af4a37` — 2026-08-18 00:31 | 1 / 26 |
| `agent/strict-zero-cloud-bridge-20260818-v2` | `59515cb` | `f2b89040` — 2026-08-18 10:35 | 2 / 18 |
| `claude/claude-md-resume-point-tvej1u` (mio) | `a05f9d8` | `9d80f9f` — 2026-08-18 11:58 | 17 / 3 |

**I due rami `agent/` contengono un `cloud_bridge.py` byte-identico** (md5
`2961c3a8b403eb4347ac931c8b1ca152`). `-v2` non è un design alternativo: è la stessa
correzione ricommittata su una base più recente. La differenza fra loro è la base, non il fix.

## Cosa contiene ciascuna variante

| Variante | `embed()` | siti col gate di budget | check loopback | `_call_openai` |
|---|---:|---:|---:|---:|
| `origin/main` | 1 | 4 | **0** | **2** |
| `v1` = `v2` | **0** | **0** | 2 | 0 |
| branch CLAUDE | 1 | 4 | 3 | 0 |

## Sonda 1 — sette attacchi di provider e di endpoint su `ask_cloud_ai`

Nessuna rete reale: gli adapter `requests` e `openai` sono sostituiti da stub che
**registrano il tentativo e sollevano**. Un percorso a pagamento si vede senza spendere.

| Attacco | `origin/main` | `v1` = `v2` | branch CLAUDE |
|---|---|---|---|
| default, nessuna variabile | **PAGAMENTO** | loopback | loopback |
| nessun provider + `OPENAI_API_KEY` | **PAGAMENTO** | loopback | loopback |
| `MODEL_PROVIDER=openai` esplicito | **PAGAMENTO** | bloccato | bloccato |
| `MODEL_PROVIDER=OpenAI` (maiuscole) | **PAGAMENTO** | bloccato | bloccato |
| `MODEL_PROVIDER=" openai "` (spazi) | loopback | bloccato | bloccato |
| `local` + `LMSTUDIO_BASE` remota | **REMOTO** | bloccato | bloccato |
| `local` + `LMSTUDIO_BASE=169.254.169.254` | **REMOTO** | bloccato | bloccato |
| **totale percorsi a pagamento o remoti** | **6 / 7** | **0 / 7** | **0 / 7** |

Su `ask_cloud_ai` i due candidati `agent/` e il mio sono **equivalenti**: stesso file.

Una nota sulla quinta riga. Su `main`, `MODEL_PROVIDER=" openai "` **non** raggiunge OpenAI,
perché `.lower()` senza `.strip()` non pareggia la stringa e il flusso cade sul ramo locale.
Non è una protezione: è un confronto di stringhe fragile che oggi sbaglia dalla parte giusta.
Contarlo come difesa sarebbe TH-10.

## Sonda 2 — `S-19`: il gate di budget in `embed()`

`assert_llm_budget()` viene forzato a sollevare `QuotaExceeded`. La domanda è una sola:
**la chiamata a pagamento parte lo stesso?**

| Variante | `embed()` esiste | budget disponibile | **budget ESAURITO** |
|---|---|---|---|
| `origin/main` | sì | **chiamata a pagamento** | **CHIAMATA A PAGAMENTO** |
| `v1` = `v2` | **no** | n/d | n/d |
| branch CLAUDE | sì | chiamata loopback | **nessuna chiamata** |

`S-19` è confermato per esecuzione: su `main` il superamento del budget **non ferma nulla**.
È l'ottava occorrenza dello schema "un controllo che non controlla".

## Il rischio concreto, ed è il motivo per cui scrivo questo file

`v1` e `v2` sono nati **prima** che `embed()` esistesse su `main`. Il loro
`cloud_bridge.py` non ha `embed()` e non ha nessuno dei quattro siti del gate di budget.

Mergiare il loro `cloud_bridge.py` sull'attuale `main` chiuderebbe `S-17` e
**contemporaneamente cancellerebbe `embed()` e le quattro guardie di budget**.

Non è un'ipotesi: `core/memory.py:118` su `main` fa `from cloud_bridge import embed`, e
`core/memory.py:139` lo chiama da `recall_semantic_embedded`. Il merge produrrebbe un
`ImportError` sul percorso di recall della memoria — cioè romperebbe il lavoro che Gemini
ha appena consegnato, per applicare una correzione di sicurezza.

**Una correzione di sicurezza che rimuove una feature non è una correzione: è uno scambio,
e va deciso da chi possiede entrambe le cose.**

## Raccomandazione

1. **Non mergiare `v1`.** Base a 26 commit indietro. Superato in tutto da `v2`.
2. **Non mergiare `v2` così com'è.** Il fix è corretto ma la base è a 18 commit indietro:
   applicato sull'attuale `main` toglie `embed()` e il gate di budget.
3. **Portare su `main` la versione del branch CLAUDE**, che è la sola costruita su una base
   che contiene `embed()` e che chiude **entrambi** i findings. Zero percorsi a pagamento su
   7 attacchi, e nessuna chiamata a budget esaurito.
4. In alternativa equivalente: rebase di `v2` sull'attuale `main` e riapplicazione a mano
   della guardia di `embed()`. Stesso risultato, più passaggi, più occasioni di sbagliare.

**Non eseguo io il merge.** Non ho autorizzazione a scrivere su `main` in questa sessione, e
`direct_main_write: false` è scritto nella mia delegation card. La decisione è di Christian.

## Ciò che NON ho verificato, dichiarato

- Non ho eseguito la suite Python di Grok su nessuno dei rami. È un altro portafoglio, e su
  `main` `python3 -m pytest` senza argomenti **non colleziona** (sei moduli non si importano,
  difetto pre-esistente di Grok). Finché resta, nessuna affermazione "N test verdi" è
  riproducibile senza `--ignore`.
- Non ho eseguito nessuna chiamata di rete reale, in nessuna variante. Entrambe le sonde
  sostituiscono `requests` e `openai` con stub. Il costo di questa verifica è **zero**.
- Le sonde misurano il percorso fino al **tentativo** di chiamata. Non provano che una
  chiamata riuscita costerebbe una cifra particolare: provano che parte, che è la proprietà
  che l'Articolo 5 vieta.
