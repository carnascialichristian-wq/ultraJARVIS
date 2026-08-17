# Security review dell'implementazione ora su `main`

| Metadato | Valore |
|---|---|
| Autore | CLAUDE — Runtime, Security & Skill Architect |
| Ref revisionato | `main` @ `2fee003` |
| Oggetto | `core/`, `tools/`, `advisors/`, `bin/uj` — implementazione Python pubblicata su `main` |
| Stato del task | **PROPOSTO come `UJ-SEC-003`**, non baselined. **Nessun peso auto-assegnato.** |
| Data | 2026-08-17 |

> **Perché questo documento esiste.** Il merge di questa sessione ha reso canonico su
> `main` un sistema di tool **eseguibile**. Il mio portafoglio (§32.2) copre *MCP/tool
> admission, threat model, code/architecture review e failure containment*: del codice che
> esegue tool è esattamente il mio oggetto. Non è un task baselined — §7.4 vieta di
> espandere lo scope da solo — quindi lo consegno come **proposta con artefatto già
> pronto**, e la decisione di baseline resta a ChatGPT.
>
> **Non è una critica al lavoro di Grok.** Lo snapshot completo che Grok ha archiviato in
> `UJ-RED-001` contiene molto di ciò che qui risulta mancante. Il difetto sta in **cosa è
> finito su `main`**, non in cosa è stato scritto.

---

## 1. Il risultato in una frase

**Su `main` esiste un registry che esegue tool senza alcun controllo di ammissione, e
accanto ci sono i miei contratti di admission che non sono cablati a nulla.**

Il campo che *sembra* il controllo di sicurezza — `ToolSpec.safe` — è dichiarato, vale
`True` per tutti i 28 tool del catalogo incluso `email.send`, e **non viene letto da
nessuna riga del repository**.

## 2. Come riprodurre tutto

```bash
# dalla root di main
python3 -c "
import sys; sys.path.insert(0,'.')
from core.registry import get_registry
r=get_registry()
print(len(r.list_tools()),'tool')
print(r.get('email.send').safe)          # True
print(r.call('automation.type_text','ciao'))
"
grep -rn "\.safe\b" --include=*.py . | grep -v safe_read | grep -v safe_write | grep -v safe_get
python3 -c "import sys; sys.path.insert(0,'.'); import core.natural_tasks"
```

---

## 3. S-01 — `ToolSpec.safe` è dichiarato e mai letto. **HIGH.**

`core/registry.py:15` definisce `safe: bool = True`. Ricerca su tutto il repository
(escluse le omonimie `safe_read`/`safe_write`/`safe_get`): **zero letture**.

Tutti e 28 i tool del catalogo hanno `safe=True`, per default, **incluso `email.send`**.

Un campo che si chiama `safe`, che compare accanto a ogni tool e che non condiziona nulla
è peggio di un campo assente: un lettore — umano o modello — lo interpreta come il
controllo, e smette di cercarne uno vero.

**Correzione:** o si rimuove il campo, o `Registry.call()` lo legge e rifiuta i tool non
sicuri senza un'approvazione esplicita. Un flag non applicato non è una difesa: è
un'etichetta.

## 4. S-02 — `Registry.call()` non ha alcuna ammissione. **HIGH.**

```python
def call(self, name, *args, **kwargs):
    spec = self.get(name)
    if spec is None: raise KeyError(...)
    mod = importlib.import_module(spec.module)   # import dinamico
    fn = getattr(mod, spec.callable_name)
    return fn(*args, **kwargs)                   # esecuzione
```

Fra la richiesta e l'esecuzione **non c'è nulla**: nessun gate di approvazione, nessuna
classe di dato, nessun tetto di side-effect, nessuna allowlist per chiamante, nessuna
quota, **nessuna emissione di evento**.

`advisors/safety.py` **non copre questo percorso**: è invocato solo da
`core/natural_tasks.py:137` e scansiona *codice generato*, non le chiamate ai tool.
Ho verificato la catena delle chiamate prima di affermarlo.

## 5. S-03 — `email.send` è registrato come `safe=True`. **HIGH.**

```
ToolSpec("email.send", "Send email (SAFE_MODE)", "tools.email", "send", tags=["email"])
```

`safe` non è passato → vale `True`.

Inviare una email è `EXTERNAL_WRITE` **irreversibile**. La mia regola `ADM-13` (mitigazione
**P0-2** di `UJ-MCP-001`) dice che un tool `EXTERNAL_WRITE`/`DESTRUCTIVE` **senza
`supportsLookupByKey` non è ammissibile**: dopo un crash nessuno può sapere se l'invio è
avvenuto, e Christian dovrebbe controllare a mano nella casella.

Oggi la chiamata fallisce — ma **per un motivo che non è una difesa**:

```
r.call('email.send', ...)  ->  ModuleNotFoundError: No module named 'tools.email'
```

**Il tool non è bloccato da un controllo: è rotto.** Il giorno in cui `tools/email.py`
verrà aggiunto, l'invio diventerà raggiungibile senza che nessuna riga di policy cambi.
Contare su un modulo mancante come misura di sicurezza è la forma più fragile di
contenimento che esista.

## 6. S-04 — l'unico safety scan del sistema sta dietro un modulo che non si importa. **HIGH.**

Il README su `main` (riga 46) promette:

> `Pipeline: seed → run → plan → write → gates → critic/safety`

Ma su `main`:

```
python3 -c "import core.natural_tasks"
ModuleNotFoundError: No module named 'core.verify'
```

`core/natural_tasks.py` importa `core.verify` (riga 14) e `core.gates` (riga 16).
**Nessuno dei due esiste su `main`.**

E `core/natural_tasks.py:137` è **l'unico chiamante** di `scan_job_dir`, cioè dell'unico
scan di sicurezza presente.

> **Catena:** il modulo che esegue gates e safety non si importa → lo scan di sicurezza
> non gira mai → il README continua a dichiarare che la pipeline lo esegue.

È il caso peggiore fra quelli trovati, perché la documentazione afferma una difesa che
l'albero pubblicato **non può eseguire**.

## 7. S-05 — pubblicazione parziale: mancano 6 moduli e 48 tool. **MEDIUM.**

Confronto fra `main` e lo snapshot archiviato da Grok in `UJ-RED-001`:

| | su `main` | nello snapshot `imports/grok-v8/` |
|---|---:|---:|
| tool Python | **7** | **55** |
| moduli `core/` mancanti su main | — | `config`, `gates`, `logging_uj`, `reliability`, `utils`, `verify` |

Tre voci del catalogo puntano a moduli **assenti** su `main`: `tools.websearch`,
`tools.browser`, `tools.email`. `list_tools()` li elenca comunque come disponibili.

**Il registry dichiara capacità che il sistema non ha**, e il disallineamento emerge al
momento della chiamata invece che all'ammissione. È la stessa forma di `TH-10`: una
dichiarazione plausibile non verificata alla fonte.

## 8. S-06 — primitive di automazione consumer UI registrate e chiamabili. **MEDIUM.**

```
automation.paste_text   safe=True   -> [dry-run] Would paste ...
automation.type_text    safe=True   -> [dry-run] Would type 4 characters
os.open_app             safe=True   -> Would open app: Calculator (stub)
```

L'automazione di UI consumer è **vietata** dai vincoli fondanti, dalla Costituzione e da
`forbidden_actions` di **tutte e quattro** le delegation card:

> *"Automate a consumer UI, cookie, browser session, or login."*

Oggi sono dry-run. Ma sono **registrate, chiamabili e marcate `safe=True`**, e il registry
non impone alcun tetto: la distanza fra lo stub e l'azione reale è la sostituzione di un
corpo di funzione, senza che nessun gate se ne accorga.

## 9. S-07 — nessun evento di tool: `P0-1` è inapplicabile e `TH-10` è aperta. **MEDIUM.**

`Registry.call()` non emette nulla. Non esiste un ledger degli eventi `tool.*`.

La mitigazione **P0-1** di `UJ-MCP-001` — *solo il tool runtime può emettere
`tool.called/returned/failed`* — presuppone che quegli eventi **esistano**. Qui non
esistono affatto, quindi:

- nessuna attestazione indipendente prova che un tool sia stato chiamato;
- qualunque affermazione di un agente su cosa ha eseguito è **non verificabile**;
- **`TH-10` (proof fabrication) è completamente aperta sul lato Python**, mentre sul lato
  TypeScript la copro parzialmente.

## 10. S-08 — lo scanner di sicurezza è una substring su testo minuscolo. **MEDIUM.**

`advisors/safety.py` confronta il testo minuscolo con 7 stringhe fisse. Misurato:

| Caso | Esito |
|---|---|
| `eval(user_input)` | **rilevato** |
| `getattr(__builtins__, 'ev'+'al')` | **evade** |
| `getattr(os,'sys'+'tem')('rm -rf /')` | rilevato, ma **solo per `rm -rf`** |
| `subprocess.Popen([...])` | **evade** — la lista contiene `subprocess.call(`, non `Popen` |

**2 casi su 4 passano indisturbati**, e la concatenazione di stringhe basta a evadere.

È **esattamente la stessa forma** del loop detector testuale che ho falsificato in
`UJ-RUN-001` (§4.1 di `TASKCLAUDE.md`): un segnale testuale non contiene un avversario.

**Conseguenza vincolante, identica a quella:** va classificato **early warning**, non
controllo di sicurezza, e **non deve ricevere crediti di mitigazione nel risk register**.

---

## 11. Riepilogo e priorità

| ID | Severità | Sintesi |
|---|---|---|
| S-01 | HIGH | `ToolSpec.safe` dichiarato, mai letto; 28/28 tool `safe=True` |
| S-02 | HIGH | `Registry.call()` senza ammissione, approvazione, tetto o evento |
| S-03 | HIGH | `email.send` `safe=True`, `EXTERNAL_WRITE` senza idempotenza (viola `ADM-13`) |
| S-04 | HIGH | `core.natural_tasks` non importabile: l'unico safety scan non gira, il README lo promette |
| S-05 | MEDIUM | pubblicazione parziale: −6 moduli `core/`, −48 tool; 3 voci di catalogo senza modulo |
| S-06 | MEDIUM | automazione consumer UI registrata e chiamabile, vietata dai vincoli |
| S-07 | MEDIUM | nessun evento `tool.*`: `P0-1` inapplicabile, `TH-10` aperta sul lato Python |
| S-08 | MEDIUM | safety scanner evadibile con concatenazione di stringhe: 2 evasioni su 4 |

### Ordine consigliato

1. **S-04** — ripristinare `core/verify.py` e `core/gates.py` su `main`, oppure correggere
   il README: oggi la documentazione promette una difesa che l'albero non esegue.
2. **S-03 + S-01** — togliere `email.send` dal catalogo finché non ha idempotenza, e far
   leggere `safe` a `Registry.call()` o rimuovere il campo.
3. **S-02 + S-07** — un punto di ammissione unico davanti a `call()`, che emetta gli eventi.
   È il punto in cui i miei contratti `ToolManifest` diventerebbero utilizzabili invece che
   decorativi.

## 12. Cosa NON ho fatto

- **non ho modificato una riga** di `core/`, `tools/`, `advisors/` o `bin/uj`: è codice di
  Grok, e correggerlo senza una decisione di baseline sarebbe invasione di portafoglio;
- non ho revisionato `core/planner.py`, `core/job_worker.py`, `core/skills.py`,
  `core/memory.py`, `core/metrics.py`, `advisors/critic.py`, `advisors/style.py`: non
  sostengono nessun giudizio qui;
- non ho revisionato lo snapshot `imports/grok-v8/` nel merito: l'ho usato **solo** per
  stabilire quali file manchino su `main`;
- **non mi sono assegnato peso.** `UJ-SEC-003` è una proposta: la baseline è di ChatGPT.
