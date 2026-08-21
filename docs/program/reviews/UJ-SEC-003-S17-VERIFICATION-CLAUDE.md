# `S-17` — verifica indipendente della correzione STRICT_ZERO del cloud bridge

| Metadato | Valore |
|---|---|
| Verificatore | **CLAUDE** — Runtime, Security & Skill Architect |
| Oggetto | `agent/strict-zero-cloud-bridge-20260818` @ `1251a68` — *"fix: enforce strict-zero local-only cloud bridge"* |
| Richiesto da | ChatGPT, in `docs/program/reviews/inbox/CLOUD_BRIDGE_STRICT_ZERO_REVIEW_20260818.md`: *"UJ-SEC-001 / owner CLAUDE: verificare che il blocco soddisfi la policy e che non rompa il runtime previsto"* |
| Base di verifica | `origin/main` @ `1e40376` + il branch, merge a tre vie |
| **Esito** | **PASS — la correzione regge a tutti gli attacchi che ho costruito** |
| Peso / backlog | **invariati.** Nessun `task_ledger_delta`, nessun `BACKLOG.json` toccato |
| Data | 2026-08-18 |

---

## 1. Perché questa verifica esiste

ChatGPT ha prodotto la correzione e ha dichiarato onestamente il proprio limite:

> *"Controlli dichiarati: ispezione statica del diff e progettazione dei test; **esecuzione
> runtime/test non disponibile in questo checkout**."*

È lo stesso limite che aveva sul finding originale, ed è il motivo per cui `S-17` era stato
passato a me. La correzione era quindi **progettata ma non eseguita**. Questa è l'esecuzione.

La decisione di policy è di **Christian**, presa il 2026-08-18: *"MODEL_PROVIDER deve
diventare local di default … nessuna chiamata cloud o API pay-per-use deve avvenire
implicitamente. Se il provider locale non è disponibile, il sistema deve fallire in modo
sicuro, senza fare fallback automatico verso OpenAI o altri provider."* — decisione aperta
n. 7, ora **APPROVATA**.

## 2. La correzione fa più di quanto avessi chiesto io, ed è meglio così

`FIX-10b` che avevo proposto **metteva un interruttore** davanti all'adapter a pagamento.
La correzione di ChatGPT **cancella l'adapter**: `_call_openai` non esiste più.

È la scelta giusta, e la differenza non è stilistica. Un interruttore è una manopola: questo
albero ne ha già collezionate sette che non giravano nulla (`ToolSpec.safe`, `force`,
`SAFE_MODE`, `PROTECTED`, `lstrip`, lo scanner, il verdetto dei gate). **Un meccanismo che non
esiste non può essere riacceso per errore, per default sbagliato o per una riga di
configurazione.**

In più contiene una difesa che io **non avevo identificato**: `_validate_local_base` vincola
`LMSTUDIO_BASE` a `localhost` / `127.0.0.1` / `::1`. Senza quella, il percorso "locale" —
che dopo il fix è l'**unico** percorso — poteva essere puntato a un endpoint remoto a
pagamento con una variabile d'ambiente. È il buco che si apre proprio *perché* si chiude
l'altro, e ChatGPT l'ha visto prima di me. Lo scrivo perché è un merito suo, non mio.

## 3. Verifica 1 — il criterio che avevo scritto io

`GROK_FIX_LIST.md` → `FIX-10` prescriveva: *"lo scenario B e lo scenario C devono passare da
**3** a **0** tentativi."*

Rieseguito il probe committato, invariato, contro l'albero corretto:

```
python3 -B docs/threat-models/probes/S-17-cloud-bridge-probe.py
```

| Scenario | Prima (`main` @ `8c4224c`) | Dopo |
|---|---:|---:|
| A — default | 0 | **0** |
| B — `UJ_PLANNER_LLM=1` | **3** | **0** |
| C — `UJ_PLANNER_LLM=1` + chiave | **3** | **0** |
| D — `MODEL_PROVIDER=local` | 0 | **0** |

Il provider risolto è `local` in tutti e quattro i casi. **Criterio soddisfatto.**

## 4. Verifica 2 — sei attacchi al confine di provider

Non mi fido di un probe che testa lo scenario felice. Ho costruito i casi che dovrebbero
*evadere* il blocco, guidando sia il planner sia il writer.

| # | Attacco | Provider risolto | Tentativi a pagamento |
|---|---|---|---:|
| 1 | `MODEL_PROVIDER=openai` **esplicito**, planner | `openai` | **0 — bloccato** |
| 2 | `MODEL_PROVIDER=openai` **esplicito**, writer | `openai` | **0 — bloccato** |
| 3 | `MODEL_PROVIDER=OpenAI` (maiuscole) | `openai` | **0 — bloccato** |
| 4 | `MODEL_PROVIDER=" openai "` (spazi) | `openai` | **0 — bloccato** |
| 5 | `MODEL_PROVIDER=anthropic` (altro cloud) | `anthropic` | **0 — bloccato** |
| 6 | solo `UJ_WRITER_LLM=1` | `local` | **0** |

**Anche il caso esplicito è bloccato**, ed è la proprietà che conta: non esiste più un valore
di `MODEL_PROVIDER` che raggiunga un provider a pagamento, perché non esiste più un adapter da
raggiungere. Il `.strip().lower()` copre i casi 3 e 4 — è deliberato, non fortuna.

## 5. Verifica 3 — tredici attacchi all'endpoint locale

Dopo il fix il percorso locale è l'**unico** percorso, quindi la sua validazione è il nuovo
confine di sicurezza. L'ho attaccata direttamente.

| Input | Atteso | Esito |
|---|---|---|
| `http://127.0.0.1:1234` | accetta | accettato |
| `http://localhost:1234` | accetta | accettato |
| `http://[::1]:1234` | accetta | accettato |
| `HTTP://LOCALHOST:1234` | accetta | accettato |
| `https://example.com/v1` | blocca | **bloccato** |
| `http://127.0.0.1@evil.com/` | blocca — trucco userinfo | **bloccato** |
| `http://localhost.evil.com/` | blocca — trucco suffisso | **bloccato** |
| `http://evil.com#127.0.0.1` | blocca — trucco fragment | **bloccato** |
| `file:///etc/passwd` | blocca — schema | **bloccato** |
| `http://0.0.0.0:1234` | ? | **bloccato** |
| `http://127.1:1234` | ? | **bloccato** |
| `http://2130706433:1234` | ? — `127.0.0.1` decimale | **bloccato** |
| `http://[::ffff:127.0.0.1]:1234` | ? — IPv4 mappato IPv6 | **bloccato** |

**13 su 13 corretti.** Le ultime quattro righe sono le interessanti: sono codifiche
alternative di loopback che un controllo *a pattern* lascerebbe passare. Falliscono perché la
validazione è un **allowlist di hostname esatti**, non una regex — che è il progetto giusto.

## 6. Verifica 4 — non rompe il runtime (la seconda metà della domanda di ChatGPT)

ChatGPT chiedeva anche *"che non rompa il runtime previsto"*. Confronto onesto, entrambi i
lati eseguiti da me, `main` in un worktree pulito:

| Albero | pytest |
|---|---|
| `origin/main` @ `1e40376`, pristine | **215 passed, 1 failed** |
| `main` + fix + le mie aggiunte | **239 passed, 1 failed** |

**Nessuna regressione.** Il delta `+24` sono i 3 test di confine di ChatGPT e i 21 test di
policy che ho aggiunto io.

**L'unico test fallito è pre-esistente su `main`** (`test_developer_docs::
test_developer_md_exists`) e **non c'entra con il bridge**: fallisce identico sul `main`
pristine. Verificato nel worktree, non assunto.

## 7. Quello che il fix NON copriva — e che ho chiuso

`core/config.py` legge la **stessa** variabile e il branch non lo toccava:

```python
model_provider: str = "openai"                                    # riga 30
model_provider=os.getenv("MODEL_PROVIDER", "openai").lower(),      # riga 43
```

**Oggi è inerte** — ho verificato con `grep` che nessun consumatore legge
`Config.model_provider` — quindi non era una vulnerabilità attiva, e lo dico invece di
gonfiarla. Ma è una decisione applicata a metà: due punti del codice leggono la stessa
variabile e le due risposte divergono. È la stessa forma di `S-16`: si corregge nello schema
**prima** che il cablaggio esista, perché dopo costa di più e nessuno si ricorda del secondo
punto.

Applicato, coerentemente con la decisione n. 7:

```python
model_provider: str = "local"
model_provider=os.getenv("MODEL_PROVIDER", "local").strip().lower(),
lmstudio_base: str = "http://127.0.0.1:1234"     # era localhost, allineato al bridge
```

## 8. Test aggiornati

**`tests/test_config.py::test_defaults` asseriva `== "openai"`.** Era un test che codificava
la **vecchia policy**: la decisione n. 7 lo rende falso per costruzione. Aggiornato a
`== "local"`, con nel docstring il motivo e la data — un test cambiato senza spiegazione è un
test che la prossima sessione "ripristina".

**Aggiunto `tests/test_cloud_bridge_strict_zero_policy.py`, 21 test**, che bloccano ciò che ho
verificato a mano, così che nessuno debba rifarlo:

- il default risolve a `local` **leggendo davvero l'ambiente** (i test di ChatGPT
  monkeypatchano `PROVIDER`; i miei ricaricano il modulo, che è il percorso in cui il difetto
  originale è nato);
- `_call_openai` **non esiste** — la proprietà è l'assenza, non il gating;
- 7 provider non-local, incluse varianti di maiuscole e spazi, non raggiungono alcun adapter;
- **fail-safe**: se il provider locale solleva, si torna stringa vuota e non esiste nessun
  adapter cloud a cui ricadere — il requisito esplicito di Christian;
- i 13 casi di endpoint sopra;
- `core/config.py` concorda con il bridge.

## 9. Cosa resta aperto di `FIX-10`

| | Stato |
|---|---|
| `FIX-10a` — default locale | **applicato e verificato**, in entrambi i punti |
| `FIX-10b` — nessuna chiamata pay-per-use implicita | **superato in meglio**: l'adapter è stato rimosso |
| `FIX-10c` — retry moltiplica l'addebito | **non più applicabile al percorso a pagamento** (non esiste); il `@retry(3)` resta sul percorso locale, dove non costa nulla |
| `FIX-10d` — esito strutturato invece di `""` | **APERTO.** `ask_cloud_ai` restituisce ancora `""` sia se il provider è bloccato sia se il locale è caduto. Non costa più denaro, ma resta indistinguibile |
| `FIX-10e` — evento per tentativo | **APERTO**, confluisce in `S-07` |

`R-SEC-05` passa da **CRITICA aperta** a **chiusa e verificata**. `S-17` §12 e §13 restano nel
documento come storia: la review si estende, non si riscrive.

## 10. Cosa NON ho fatto

- **Non ho eseguito nessuna chiamata reale** a nessun provider, e non ho installato `openai`.
  Il modulo usato nei probe è finto e non apre socket.
- **Non ho mergiato nulla su `main`** e non ho toccato `BACKLOG.json`, status o pesi.
- **Non ho corretto i 6 moduli di test non importabili** trovati su `main`
  (`test_bool_not_helpers` importa `bool_not`, il modulo definisce `not_`; idem
  `to_bytes`/`human_bytes`, e altri quattro). Sono di Grok, pre-esistenti, e fuori dalla
  decisione n. 7 — ma vanno segnalati, perché **un `pytest` senza argomenti su `main` non
  arriva a collezionare**, e una claim di "N test verdi" non è riproducibile finché restano.
