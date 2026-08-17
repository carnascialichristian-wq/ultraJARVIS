# APPROVAL POLICY v1 — ultraJARVIS

| Metadato | Valore |
|---|---|
| Task ID | UJ-SEC-001 (parte 2 di 3) |
| Owner | CLAUDE · Reviewer | GROK |
| Stato | REVIEW |
| Data class | C1 INTERNAL |
| Contratti eseguibili | `packages/contracts/src/policy/` |
| Base normativa | prompt canonico §15 (data class), §16 (autonomia), §16.1 (matrice), §14 (Costituzione) |

---

## 1. Principio

> **Un piano non autorizza un'azione.** (Articolo 7)
> Ogni side effect richiede una decisione di policy propria, valutata al momento
> dell'esecuzione, sull'operazione concreta — non sull'intenzione dichiarata prima.

Da cui tre conseguenze operative:

1. l'approvazione è legata a **un'operazione specifica**, non a una sessione, a un
   agente o a una categoria generica;
2. l'approvazione **scade**;
3. l'approvazione **non si eredita**: un figlio non usa il gate concesso al padre.

## 2. Le tre dimensioni della decisione

Una richiesta viene valutata su tre assi indipendenti. **Il più restrittivo vince.**

| Asse | Valori | Fonte |
|---|---|---|
| Side effect | `NONE` < `INTERNAL_WRITE` < `EXTERNAL_WRITE` < `DESTRUCTIVE` | §7.3 |
| Data class | `C0` < `C1` < `C2` < `C3` < `C4` | §15 |
| Autonomia dell'agente | `L0` < `L1` < `L2` < `L3` < `L4` | §16 |

Il risultato è uno dei seguenti **gate**:

| Gate | Significato |
|---|---|
| `ALLOW` | procedi, con audit |
| `ALLOW_WITH_AUDIT` | procedi, ma l'evento è marcato per review successiva |
| `REQUIRE_APPROVAL` | serve ApprovalCard firmata dal proprietario, non scaduta |
| `REQUIRE_HUMAN_BRIDGE` | il sistema non può agire da solo: DelegationCard |
| `DENY` | rifiuto, con motivo nominato |

## 3. Matrice di approvazione

Estende §16.1 rendendola decidibile da codice invece che da interpretazione.

### 3.1 Per tipo di azione

| Azione | Gate base | Note |
|---|---|---|
| leggere fonte pubblica | `ALLOW` | audit sempre; il contenuto entra come `UNTRUSTED_EXTERNAL` |
| leggere repository privata autorizzata | `ALLOW_WITH_AUDIT` | solo scope pre-approvato |
| scrivere draft o file su branch di lavoro | `ALLOW_WITH_AUDIT` | richiede `L2`+ e branch dedicato |
| aprire pull request | `REQUIRE_APPROVAL` | delega limitata ammessa solo se esplicita |
| scrivere su `main` | `DENY` | salvo ordine esplicito del proprietario |
| deploy preview in sandbox | `ALLOW_WITH_AUDIT` | `L2` + quota |
| pubblicare in produzione | `REQUIRE_APPROVAL` | sempre, senza eccezioni |
| inviare email, messaggio o post | `REQUIRE_APPROVAL` | approvazione su **contenuto e destinatario**, non sull'azione generica |
| creare o modificare account | `REQUIRE_APPROVAL` | default deny |
| acquistare o abilitare billing | `DENY` | vietato finché il budget resta zero (Articolo 5) |
| modificare dati reali di produzione | `REQUIRE_APPROVAL` | con backup e rollback dimostrati |
| cancellare qualsiasi cosa | `REQUIRE_APPROVAL` | preview dell'impatto obbligatoria |
| usare dati C3 o C4 | `DENY` di default | workflow separato e dedicato |
| automatizzare una UI consumer | `DENY` | non negoziabile (§3, §6.2 punto 6) |
| ruotare account o chiavi per aggirare quota | `DENY` | non negoziabile (§6.3) |

### 3.2 Regole trasversali che sovrascrivono la tabella

Valutate **prima** della matrice; se una scatta, decide.

| # | Regola | Esito |
|---|---|---|
| `OV-1` | l'operazione può generare costo, billing o overage | `DENY` — Articolo 5 |
| `OV-2` | l'operazione richiede inferenza pesante locale | `DENY` — §4.2 |
| `OV-3` | l'operazione usa cookie, scraping UI o sessioni consumer | `DENY` — §3 |
| `OV-4` | `dataClass ≥ C3` e non è un workflow C3/C4 dedicato | `DENY` — §15 |
| `OV-5` | l'agente ha `roleStatus = CANDIDATE` e `sideEffect > NONE` | `DENY` — §3.3 blueprint |
| `OV-6` | il kill switch è attivo | `DENY` — §6.5 blueprint |
| `OV-7` | l'operazione è `DESTRUCTIVE` e manca un `rollbackPlan` | `DENY` — Articolo 4 |
| `OV-8` | `sideEffect > maxSideEffect` dell'agente | `DENY` — Articolo 8 |
| `OV-9` | `dataClass > maxDataClass` dell'agente | `DENY` — Articolo 8 |
| `OV-10` | il percorso automatico non è `AUTO_VERIFIED` | `REQUIRE_HUMAN_BRIDGE` — §4.1 punto 6 |

`OV-7` merita una nota. L'Articolo 4 chiede reversibilità; qui la rendo **meccanica**:
una richiesta distruttiva senza piano di rollback **non è approvabile**, quindi non
raggiunge nemmeno il proprietario. Questo riduce il volume di ApprovalCard e quindi la
superficie di TH-18 (approval fatigue): meno richieste, ma tutte serie.

### 3.3 Autonomia richiesta per side effect

| Side effect | Autonomia minima | Motivo |
|---|---|---|
| `NONE` | `L0` | analisi e proposta |
| `INTERNAL_WRITE` | `L2` | ambiente isolato e reversibile |
| `EXTERNAL_WRITE` | `L3` | azione esterna, sempre dopo approvazione |
| `DESTRUCTIVE` | `L3` + `REQUIRE_APPROVAL` + `rollbackPlan` | mai delegabile a `L4` |

`L4 — Bounded Delegation` è ammesso **solo** per categorie ristrette pre-approvate con
quota e rollback, e **mai** per `DESTRUCTIVE`. `L5` non esiste nel type system.

## 4. ApprovalCard — requisiti di validità

Una ApprovalCard che non soddisfa questi requisiti **non è emettibile**. Non è un
controllo sul proprietario: è un controllo sul sistema che gli chiede qualcosa.

| Requisito | Perché |
|---|---|
| operazione concreta, non categoria | "aprire la PR #12 sul branch X" non "gestire le PR" |
| `impactSummary` in linguaggio naturale | il proprietario deve capire senza leggere il codice |
| `reversible: boolean` esplicito | distingue ciò che è recuperabile da ciò che non lo è |
| `rollbackPlan` obbligatorio se `reversible = false` o `DESTRUCTIVE` | Articolo 4 reso meccanico |
| `dataClass` dichiarata | il proprietario deve sapere cosa sta esponendo |
| `expiresAt` obbligatoria | un'approvazione eterna è una delega permanente non dichiarata |
| ambito legato a `(runId, taskId, operazione)` | non riutilizzabile altrove |

### 4.1 Verifica al momento dell'uso

Un'approvazione concessa viene **rivalidata** prima dell'esecuzione:

```
approvazione valida ⟺
      firmata dal proprietario
  ∧   now < expiresAt
  ∧   scope.runId    = operazione.runId
  ∧   scope.taskId   = operazione.taskId
  ∧   scope.operation = operazione.nome
  ∧   idempotencyKey  = quella dichiarata al momento della richiesta
```

L'ultima condizione è la meno ovvia e la più importante: impedisce che
un'approvazione ottenuta per un payload venga usata per un payload diverso della
stessa operazione. Senza, "approva la scrittura del file A" autorizza la scrittura
del file B.

## 5. Anti-fatigue — controllo di TH-18

L'approval fatigue è una minaccia `CRITICA` con rilevabilità `SCARSA`: se l'umano
approva, il sistema registra un'approvazione valida e non esiste segnale tecnico che
distingua il consenso consapevole da quello stanco. La difesa deve quindi essere
**preventiva**, cioè ridurre il numero di richieste, non rilevarne la qualità.

| # | Misura | Effetto |
|---|---|---|
| `AF-1` | `OV-7`: niente rollback ⇒ niente richiesta | elimina alla fonte le richieste non approvabili |
| `AF-2` | budget massimo di ApprovalCard per finestra temporale | oltre la soglia il run si ferma invece di insistere |
| `AF-3` | raggruppamento di richieste omogenee in una sola card | meno interruzioni, stesso controllo |
| `AF-4` | le irreversibili sono visivamente separate dalle reversibili | l'attenzione va dove conta |
| `AF-5` | una richiesta negata non si ripropone identica | il retry su `POLICY_DENIED` è vietato (§8.4 blueprint) |
| `AF-6` | scadenza di una card ⇒ il ramo va `BLOCKED`, gli altri proseguono | non forza una risposta per sbloccare il lavoro |

`AF-5` e `AF-6` insieme chiudono la pressione: il sistema non può insistere né mettere
il proprietario davanti a un "approva o tutto si ferma".

## 6. Rapporto con la Costituzione

Ogni riga della matrice deriva da un articolo. Mappa esplicita, così che una modifica
alla Costituzione mostri subito cosa si rompe:

| Articolo | Dove è implementato |
|---|---|
| 1 — Autorità | solo il proprietario firma; nessun auto-approve |
| 2 — Onestà | ogni decisione registrata nel ledger con motivo nominato |
| 3 — Minimo privilegio | autonomia minima per side effect (§3.3) |
| 4 — Reversibilità | `OV-7`, `rollbackPlan` obbligatorio |
| 5 — Zero costo | `OV-1`, `DENY` su billing |
| 6 — Privacy e segreti | `OV-4`, `DENY` su C3/C4 fuori workflow |
| 7 — Piano ≠ esecuzione | gate valutato sull'operazione, non sul piano |
| 8 — No auto-escalation | `OV-8`, `OV-9` |
| 9 — Tracciabilità | scope legato a `(runId, taskId, operazione)` |
| 10 — Sostituibilità | la policy non nomina provider |
| 11 — Supply chain | admission dei tool, fuori da questo documento (`UJ-MCP-001`) |
| 12 — Evoluzione controllata | questa policy si modifica con lo stesso iter della Costituzione |

## 7. Limiti dichiarati di questa policy v1

Onestà su cosa **non** fa, perché GROK lo troverebbe comunque:

1. **Non copre l'admission dei tool.** Decide se un'operazione è permessa, non se un
   tool è affidabile. Quello è `UJ-MCP-001`.
2. **Non classifica i dati.** Assume che `dataClass` sia corretta. Se la
   classificazione iniziale è sbagliata (TH-09), la policy applica correttamente la
   regola sbagliata.
3. **Non protegge dal contenuto.** Un'operazione permessa su un payload avvelenato
   resta permessa (TH-01, TH-08).
4. **`AF-2` non ha ancora una soglia numerica.** Fissarla richiede osservazione reale:
   inventarla adesso sarebbe un numero senza fonte, vietato da §4.1 punto 5.
5. **Nessuna meccanica di canary/rollback esiste**: `rollbackPlan` oggi è un campo
   obbligatorio, cioè una promessa dichiarata, non una capacità verificata.

Il punto 5 è il più scomodo e lo lascio in evidenza: `OV-7` impone di dichiarare un
piano di rollback, ma nessuno verifica che il piano funzioni. È una difesa di processo
travestita da difesa tecnica finché non esiste la meccanica di compensazione.
