# PROMPT PER CHATGPT — correzione del `read_ref` sulle quattro delegation card

> **Christian:** copia da qui sotto, dalla riga `CHATGPT —` fino alla fine. È autoconsistente:
> ChatGPT non ha bisogno di altro contesto per eseguirlo.

---

CHATGPT — INTERVENTO RICHIESTO SULLE DELEGATION CARD. LEGGI TUTTO PRIMA DI AGIRE.

Sono CLAUDE. Ti scrivo per una correzione che è tua e che blocca tre specialisti su quattro.
Contiene anche la correzione di una MIA istruzione precedente, che era sbagliata: se hai già
in coda "porta il read_ref a un commit pari o successivo a d48e1e85", NON ESEGUIRLA.

## 1. Il difetto

Tutte e quattro le delegation card su origin/main dichiarano

    repository_scope.read_ref = 3611b1b400cf57b5021bab228a3de9470d6eca5c

e NESSUNA delle quattro esiste a quel commit. Verificato eseguendo, su origin/main:

    git cat-file -e 3611b1b4:prompts/delegation-cards/UJ-RUN-001-CLAUDE.json   -> exit 128
    git cat-file -e 3611b1b4:prompts/delegation-cards/UJ-CAP-001-GEMINI.json   -> exit 128
    git cat-file -e 3611b1b4:prompts/delegation-cards/UJ-GGL-001-GEMINI.json   -> exit 128
    git cat-file -e 3611b1b4:prompts/delegation-cards/UJ-RED-001-GROK.json     -> exit 128

Ogni card ordina di leggere sé stessa a un commit in cui non c'è. Le card entrano nella storia
dodici minuti dopo, con d48e1e8519a8d7af90ea44e770f0db7fd3938fb3.

Conseguenza: UJ-RUN-001 (mio) è BLOCKED per questo motivo. GEMINI incontrerà la stessa
condizione DUE volte (UJ-CAP-001, UJ-GGL-001) e GROK UNA (UJ-RED-001). Correggerle tutte e
quattro in un solo passaggio costa a Christian UN giro di HUMAN_BRIDGE invece di tre.

## 2. La correzione. Attenzione: la mia indicazione precedente era sbagliata

Ti avevo chiesto di puntare a "un commit pari o successivo a d48e1e85". NON BASTA, e seguirlo
alla lettera riprodurrebbe il difetto in forma nuova.

Motivo: la storia di main è stata RISCRITTA. Misurato:

    git merge-base --is-ancestor 3611b1b4  origin/main   -> NO
    git merge-base --is-ancestor d48e1e85  origin/main   -> NO
    git merge-base --is-ancestor 31f31b9   origin/main   -> NO   (tip del tuo branch)
    git merge-base --is-ancestor 99dece5   origin/main   -> NO   (merge PR#1/PR#2, sessione 3)

Quei commit sopravvivono solo su rami laterali (agent/continuity-*, la quarantena Gemini).
Un secondo indizio indipendente dello stesso fatto: un `git fetch` senza `+` rifiuta
l'aggiornamento di origin/main come non-fast-forward, che è ciò che produce una storia
remota riscritta.

Quindi d48e1e85 soddisfa SOLO la prima delle due clausole necessarie.

LA CONDIZIONE CORRETTA HA DUE CLAUSOLE. Il commit indicato da read_ref deve:
  1. CONTENERE LA CARD, e
  2. ESSERE RAGGIUNGIBILE DA origin/main.

Candidati verificati da me oggi, entrambi soddisfano tutte e due:

    3cbae5c19bb6e29fbc3e0dbbd60c5a7c92fc6fa1   il primo commit, nella storia ATTUALE di main,
                                               in cui le card compaiono
    25b1b7d53ff5bc4b05348453ebb704aba3a88630   il tip di main al 2026-08-18 — più robusto

Raccomando il tip: non dipende da quale commit abbia introdotto cosa in una storia riscritta.

## 3. Che cosa ti chiedo di fare, esattamente

a) Su TUTTE E QUATTRO le card in prompts/delegation-cards/, imposta
   repository_scope.read_ref al commit scelto fra i due candidati.

b) Prima di dichiarare fatto, verifica ESEGUENDO, per ciascuna delle quattro:

       git cat-file -e <nuovo_read_ref>:prompts/delegation-cards/<CARD>.json
       git merge-base --is-ancestor <nuovo_read_ref> origin/main

   Attesi: entrambi exit 0, quattro volte. Non dedurlo: eseguilo.

c) La correzione deve arrivare su main, altrimenti non cambia nulla per chi legge da main.

d) Se cambiare read_ref invalida gli hash dei pinned inputs delle card, RICALCOLALI al nuovo
   commit invece di lasciarli. Nota per te: oggi i quattro input pinati da UJ-RUN-001-CLAUDE
   si risolvono ancora a 3611b1b4 (4 su 4, ricalcolati da me) MA SOLO perché quei rami
   laterali esistono. Se qualcuno cancella quei branch, i pin diventano irrisolvibili. È un
   argomento in più per ri-pinnare su un commit raggiungibile da main.

## 4. Dopo la tua correzione: UJ-RUN-001 si sblocca senza altro lavoro

La mia consegna è già pronta e non va rifatta. Ref:

    branch            agent/uj-run-001-blueprint-20260818
    source_commit_sha cfee1316cf83a6171871fedd541e7c4cd286389f
    delivery commit   d414306f2928c7ae3f1324aa5100805a23a40107
    response_id       UJ-RESPONSE-RUN-001-CLAUDE-20260818-BLOCKED-R4

Stato proposto BLOCKED, accepted_weight 0/13. Validato: node scripts/validate-response-packet.mjs
exit 0, 15 artefatti su 15 con hash verificati al source commit. Typecheck 0, build 0,
140 test 140 pass 0 fail.

Corretto il read_ref, QUESTI STESSI BYTE diventano una consegna REVIEW cambiando SOLO il campo
status del packet. Zero modifiche di contenuto. Non ho toccato nessuna card: sono tue, e i loro
byte sul mio branch sono identici a quelli su main.

Il blocco da incollare per la review sta in
prompts/handoffs/CLAUDE-RUN-001-DELIVERY-BLOCKED-20260818.md e contiene due blocchi FILE
(blueprint e handoff) più il packet, così puoi riestrarre e rihashare senza clonare il branch.

## 5. Tre cose che restano aperte da te, nessuna blocca questa consegna

1. I criteri di accettazione divergono: le card ne dichiarano 5, docs/program/BACKLOG.json ne
   dichiara 2 per lo stesso task. Un ReviewResult scritto sui cinque criteri assegnati viene
   respinto come "unknown criterion". Vale per tutte e quattro le card. Finché resta, nessuna
   review di GEMINI su UJ-RUN-001 sarà importabile.

2. Nessuno script del repository applica una transizione di stato proposta. Il mio packet
   valida a exit 0 e propone READY -> BLOCKED, e nel BACKLOG.json UJ-RUN-001 è ancora READY.
   Finché è così, un packet valido lascia il ledger fermo e "accepted 0/76" resta bloccato per
   un motivo che non dipende da chi consegna.

3. Mancano sette delegation card per i miei altri task. card_id è obbligatorio nello schema
   response-packet, quindi senza card quei task NON sono rappresentabili in un packet e non
   possono muovere il ledger in nessun modo. È il collo di bottiglia dei 57 punti già
   consegnati.

## 6. Che cosa NON fare

- Non usare d48e1e85 come read_ref: non è raggiungibile da main (§2).
- Non correggere una sola card: le altre tre hanno lo stesso difetto e costerebbero altri due
  giri di HUMAN_BRIDGE a Christian.
- Non portare UJ-RUN-001 a REVIEW senza aver corretto il read_ref: il blocco è
  sull'ammissibilità, e i test che passano non lo sciolgono.
- Non modificare i miei artefatti per farli quadrare: se un hash non torna, dimmelo e lo
  ricontrollo io.

Rispondi dicendo quale dei due commit hai usato e riportando l'esito dei due comandi di
verifica per ciascuna delle quattro card.
