# RESUME_POINT — UJ-INT-001 + UJ-INT-006

## Repository checkpoint

- Repository: `carnascialichristian-wq/ultraJARVIS`
- Branch: `agent/ultrajarvis-master-prompt-v1`
- Pull request: #1 (draft)
- Immutable Council contract commit: `3611b1b400cf57b5021bab228a3de9470d6eca5c`
- Expected state after this package: UJ-INT-001 `REVIEW` at 0/13 and
  UJ-INT-006 `REVIEW` at 0/8
- Canonical next numeric source: `docs/program/BACKLOG.json`

Replace the commit placeholder below with the observed remote commit when
starting the next session; do not infer it from chat:

`ULTRAJARVIS_HEAD=<read branch HEAD from GitHub>`

## Exact next-session command

> Read the full canonical prompt, `AGENTS.md`, `gpt.md`, `taskgpt.md`, and every
> artifact indexed by `docs/program/README.md` at `ULTRAJARVIS_HEAD`. Reconcile
> the branch with `docs/program/BACKLOG.json`. Run
> `node scripts/validate-program-os.mjs` and
> `node scripts/validate-council-packets.mjs`, then
> `node scripts/test-review-result-intake.mjs`. Do not change accepted weight.
> If a ReviewResult is supplied, stage it as an untrusted candidate and run
> `node scripts/validate-council-packets.mjs --review-result <candidate.json>
> --expected-commit <ULTRAJARVIS_HEAD>` before considering any ledger delta;
> read `docs/program/REVIEW_RESULT_IMPORT.md` and preserve a failed candidate as
> quarantine evidence, not a backlog change.
> If a specialist ResponsePacket is supplied, freeze its bytes/hash and apply
> every admission stage in `COUNCIL_IMPORT_AND_MERGE.md`; invalid output is
> quarantined/rejected, never guessed. Do not start UJ-INT-002 until UJ-RUN-001,
> UJ-CAP-001, UJ-GGL-001, and UJ-RED-001 are each at least REVIEW. If no valid
> response exists, keep UJ-INT-001 and UJ-INT-006 in REVIEW and transfer exactly
> one review request or ready card to its named target through HUMAN_BRIDGE.
> Before ending the session, append the evidence-based resoconto to both
> `gpt.md` and `taskgpt.md`, publish it to the working branch, and update this
> resume point if the next concrete action changes. Grok must return the exact
> append blocks even when it has no direct GitHub write access.

## Prepared next actions

| Actor | Task | Immediate action |
|---|---|---|
| ChatGPT | UJ-INT-001 + UJ-INT-006 | verify remote tree, import only valid packets, keep 0/13 and 0/8 until reviews |
| Claude | UJ-INT-006 review / UJ-RUN-001 | send `prompts/review-requests/UJ-INT-006-CLAUDE.md`; then use `UJ-RUN-001-CLAUDE.json` for production |
| Gemini | UJ-CAP-001 + UJ-GGL-001 | use the two separate Gemini cards and return separate ResponsePackets |
| Grok | UJ-INT-001 review / UJ-RED-001 | send `prompts/review-requests/UJ-INT-001-GROK.md`; then use `UJ-RED-001-GROK.json` for falsification |
| Christian | UJ-META-002 | accept/amend the four protected PR decisions; do not merge before review gates |

No deployment, billing, account creation, production write, message send, or
destructive action is pending.


## Latest remote reconciliation — 2026-08-17

Questa sezione supersede i campi di checkpoint precedenti soltanto per lo stato
remoto osservato; lo storico non viene cancellato.

- `main` osservata a `5175ae8615e73f8d9dfe1a329831bd4975fff9c8`; la branch di continuità `agent/continuity-20260817-v3` è stata creata dallo stesso head.
- PR #1 è CLOSED/MERGED con `99dece590a124342abd19f5e090629f231ec40c4`. Il merge pubblica artefatti ma non cambia automaticamente il peso di `UJ-INT-001` o `UJ-INT-006`; il backlog resta la fonte numerica.
- PR #3 è OPEN/DRAFT, head `97f7f06d56f39101b6a54a74dfbcafea49b72676`, base `31f31b99ad7e63bf581161ce9cd12b11f83a945f`; il confronto con main è divergente (PR +2, main +44 rispetto al merge-base `31f31b99ad7e63bf581161ce9cd12b11f83a945f`). Non modificarne la base o fonderla in questa fase.
- Nessun output Gemini è stato ricevuto o trovato. `UJ-CAP-001` e `UJ-GGL-001` restano READY/HUMAN_BRIDGE a 0/13 con ResponsePacket separati obbligatori.
- Prossimo comando: ricevere i JSON originali e gli artifact Gemini; congelare hash/ref, eseguire l'intera admission pipeline di `COUNCIL_IMPORT_AND_MERGE.md`, quindi pubblicare branch/PR dedicate. Se non esiste un pacchetto valido, non modificare backlog o pesi.


## Latest remote reconciliation — 2026-08-18

- La branch `agent/gemini-handoff-quarantine-20260817` era a `30ab1a2ad1a2302d28a55ab08069da5ce787a9dc` prima di questa pubblicazione; il nuovo commit contiene il prompt Gemini aggiornato, i ledger append-only e questo checkpoint.
- PR #5 resta OPEN/DRAFT di quarantena; il precedente handoff Gemini non è stato ammesso. PR #3 resta OPEN/DRAFT sulla base storica e non viene retargettata o fusa. PR #6 resta un candidato di review Grok separato e non fidato.
- `UJ-CAP-001` e `UJ-GGL-001` sono le sole task Gemini READY, entrambe 0/13; le task Gemini dipendenti restano BLOCKED. Nessun peso, stato backlog o `main` cambia.
- Prossimo comando: ricevere esattamente 3 artifact e 2 ResponsePacket dal nuovo prompt; congelare hash/ref, validare schema, fonti, policy e criteri; poi pubblicare branch/PR dedicate oppure quarantena in caso di failure.

## Latest remote reconciliation — 2026-08-18 — main advancement correction

- `main` corrente osservata: `6af4a3721ab0d7f3272fd6e4e872b1331da99aa5`. La base storica `a9e83ee2fdd5b165d90d1217079882b02abc29d3` resta sulle PR #3, #5 e #6; non sono state riallineate.
- Il prompt Gemini e i ledger sono stati corretti per questa differenza di refs. Nessun merge, rebase, retarget, backlog delta o peso è stato applicato.
- Prossimo comando invariato: ricevere 3 artifact e 2 ResponsePacket, congelare la head/input ref e validare tutto prima di branch/PR dedicate.