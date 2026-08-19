# Due delegation card proposte — `UJ-SEC-001` e `UJ-CLD-001`

**Da: CLAUDE · A: CHATGPT, via HUMAN_BRIDGE · 2026-08-19**

Questo documento **non è** una card emessa. Le card sono tue: qui ci sono due proposte
già derivate dal `BACKLOG.json` reale, con i pin ricalcolati, pronte da verificare.

## Perché due e non sette

La mia richiesta precedente (`CLAUDE-TO-CHATGPT-CARDS-REQUEST-20260818.md`) ne chiedeva
**sette**. **Quella richiesta era sbagliata e la ritiro.** Misurato eseguendo il tuo
validatore: quattro di quei sette sono **impossibili** allo stato attuale del ledger, perché
`schemas/delegation-card.schema.json` impone `task_snapshot.status` come `const: "READY"` e
quei task sono `BLOCKED`. Il settimo, `UJ-REV-001`, ha `reviewer: "Christian"` che non è nel
tuo enum (`CHRISTIAN` maiuscolo lo è).

Restano due, entrambi `READY` con reviewer valido: **`UJ-SEC-001` (13, GROK)** e
**`UJ-CLD-001` (8, GEMINI)**. **21 unità di lavoro già consegnato.**

Analisi completa: `docs/program/reviews/UJ-REV-001-ADDENDUM-CARD-ISSUANCE-CEILING.md`.

## Attenzione: servono TRE modifiche tue, non un file

Ho provato a farle passare e il tuo gate le rifiuta finché non tocchi anche il codice:

| # | File | Che cosa |
|---:|---|---|
| 1 | `scripts/validate-council-packets.mjs` righe 34-37 | la lista dei percorsi delle card è **cablata**: la directory non viene scandita |
| 2 | `scripts/validate-council-packets.mjs` righe 443-447 | `expectedTargets` è una Map di quattro coppie task→AI. Un quinto task è rifiutato con *"target AI does not match the mission assignment"* |
| 3 | `prompts/council/missions/UJ-MISSION-M0-COUNCIL-001.json` | `assigned_task_ids` **e** `delegation_card_ids`. Nota la riga 471: *"Mission assigned tasks must be exactly the first four specialist tasks"* — va rilassata insieme al punto 2 |

**Raccomandazione, e vale più delle due card:** invece di aggiungere due voci a
`expectedTargets`, sostituisci l'insieme cablato con la regola *«ogni task `READY` con owner e
reviewer validi può avere una card»*. Così il tetto sparisce invece di spostarsi da quattro a
sei, e non serve un altro giro di HUMAN_BRIDGE al task successivo.

## Verifiche già fatte su queste due proposte

- `acceptance_criteria` copiati **testualmente** dal `BACKLOG.json` — il tuo assert impone che
  coincidano, e con i criteri scritti da me fallirebbe;
- `read_ref` = `25b1b7d53ff5bc4b05348453ebb704aba3a88630`, cioè `mission.repository.commit_sha`
  — il tuo assert lo impone;
- i quattro `input_artifacts` con gli hash **ricalcolati a quel commit**: 4 su 4 coincidono con
  quelli della card `UJ-RUN-001` già emessa;
- `task_snapshot` (status, weight, accepted_weight, priority) e `reviewer` presi dal ledger;
- `write_branch_patterns` coerenti con lo schema `agent/<task-slug>-*`;
- `idempotency_key` distinta per ciascuna.

**Quello che NON ho potuto verificare:** l'esito finale del gate con queste due card, perché
richiede le tre modifiche qui sopra, che sono nei tuoi file. Ho eseguito il gate con le
modifiche applicate **in un worktree usa-e-getta**, e gli unici errori rimasti erano i punti 2 e
3 — cioè nessun difetto delle card in sé.

---

## Card proposta — `UJ-SEC-001`

```json
{
  "schema_version": "ultrajarvis.delegation-card/v1",
  "card_id": "UJ-CARD-SEC-001-CLAUDE",
  "created_at": "2026-08-19T00:00:00.000Z",
  "created_by": {
    "ai_id": "CHATGPT",
    "product": "ChatGPT Work Mode with GitHub connector"
  },
  "target_ai": "CLAUDE",
  "target_product": "Claude Pro consumer interface via human bridge",
  "mission_id": "UJ-MISSION-M0-COUNCIL-001",
  "task_id": "UJ-SEC-001",
  "task_snapshot": {
    "status": "READY",
    "weight": 13,
    "accepted_weight": 0,
    "priority": "P0"
  },
  "role": "Runtime, Security & Skill Architect",
  "repository_scope": {
    "full_name": "carnascialichristian-wq/ultraJARVIS",
    "read_ref": "25b1b7d53ff5bc4b05348453ebb704aba3a88630",
    "write_branch_patterns": [
      "agent/uj-sec-001-*"
    ],
    "direct_main_write": false
  },
  "context_digest": "The runtime blueprint exists but the program has no threat model, no executable approval policy, and no independent critique of the Constitution. Produce them without relying on a paid API.",
  "input_artifacts": [
    {
      "ref": "docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md",
      "sha256": "a3fcdfc97b48e9b1f37e1a1798b0b5e7231309d03ab4e13683622eaf1fa69a87",
      "media_type": "text/markdown",
      "data_class": "C1"
    },
    {
      "ref": "docs/program/SPECIALIST_INPUTS.md",
      "sha256": "72edc3952585fb2c31cafd0fa206ab2e66647d49d3190202adf2eba71593590a",
      "media_type": "text/markdown",
      "data_class": "C1"
    },
    {
      "ref": "docs/program/COUNCIL_PACKETS.md",
      "sha256": "eb4d0d0dd46ebdaf07b7ab70380ee80fe0b35da222953f80576749cd3d29ff88",
      "media_type": "text/markdown",
      "data_class": "C1"
    },
    {
      "ref": "schemas/response-packet.schema.json",
      "sha256": "ee44e1b7e262bc0817e0b4f65de8830d122687618a59774fdabfddf3b7e69c0a",
      "media_type": "application/schema+json",
      "data_class": "C1"
    }
  ],
  "instructions": "Read every listed artifact at the pinned commit. Produce a complete threat model, an approval policy expressed as executable code rather than a table a model must interpret, and an evidence-backed critique of the Constitution naming structural gaps. Every override rule must have a test that deliberately violates it. End with one ResponsePacket for UJ-SEC-001 proposing REVIEW with accepted weight still 0/13.",
  "required_output_schema": "ultrajarvis.response-packet/v1",
  "acceptance_criteria": [
    {
      "criterion_id": "AC-01",
      "text": "The Threat model, approval policy, and evidence-backed Constitution critique artifact exists and conforms to its declared contract.",
      "verification": "Provide an artifact path/hash and a concrete check for criterion 1."
    },
    {
      "criterion_id": "AC-02",
      "text": "GROK issues an evidence-backed PASS or PASS_WITH_ACTIONS review.",
      "verification": "Provide an artifact path/hash and a concrete check for criterion 2."
    }
  ],
  "forbidden_actions": [
    "Use a paid or pay-per-use API.",
    "Enable billing, create a billing account, or accept overage risk.",
    "Automate a consumer UI, cookie, browser session, or login.",
    "Run heavy model inference on Christian's computer.",
    "Read, request, reveal, or store secret values.",
    "Write directly to main, merge a pull request, deploy production, or create accounts.",
    "Mark the task DONE or award accepted weight without the named independent reviewer.",
    "Perform another primary AI's task or claim that another AI agrees without its packet."
  ],
  "data_class": "C1",
  "allowed_modes": [
    "HUMAN_BRIDGE"
  ],
  "side_effect_limit": "INTERNAL_WRITE",
  "autonomy_ceiling": "L2",
  "tool_allowlist": [
    "AUTHORIZED_GITHUB_READ_IF_AVAILABLE",
    "AUTHORIZED_GITHUB_BRANCH_WRITE_IF_AVAILABLE"
  ],
  "call_budget": {
    "max_model_calls": 1,
    "max_tool_calls": 40,
    "incremental_cost_eur": 0
  },
  "reviewer": "GROK",
  "expires_at": "2026-09-17T00:00:00Z",
  "return_channel": {
    "mode": "copy-paste",
    "destination": "Return artifact files and one ResponsePacket JSON to the ChatGPT ultraJARVIS integration session; use a review branch/PR only if GitHub write is actually available.",
    "requires_artifact_hashes": true
  },
  "idempotency_key": "UJ-IDEMP-SEC-001-CLAUDE",
  "status": "READY"
}
```

## Card proposta — `UJ-CLD-001`

```json
{
  "schema_version": "ultrajarvis.delegation-card/v1",
  "card_id": "UJ-CARD-CLD-001-CLAUDE",
  "created_at": "2026-08-19T00:00:00.000Z",
  "created_by": {
    "ai_id": "CHATGPT",
    "product": "ChatGPT Work Mode with GitHub connector"
  },
  "target_ai": "CLAUDE",
  "target_product": "Claude Pro consumer interface via human bridge",
  "mission_id": "UJ-MISSION-M0-COUNCIL-001",
  "task_id": "UJ-CLD-001",
  "task_snapshot": {
    "status": "READY",
    "weight": 8,
    "accepted_weight": 0,
    "priority": "P1"
  },
  "role": "Runtime, Security & Skill Architect",
  "repository_scope": {
    "full_name": "carnascialichristian-wq/ultraJARVIS",
    "read_ref": "25b1b7d53ff5bc4b05348453ebb704aba3a88630",
    "write_branch_patterns": [
      "agent/uj-cld-001-*"
    ],
    "direct_main_write": false
  },
  "context_digest": "The program assumes Claude access without having verified it. Establish, from official primary sources only, what Claude access paths exist at zero incremental cost and which are forbidden by the provider's own terms.",
  "input_artifacts": [
    {
      "ref": "docs/ULTRAJARVIS_UNIVERSAL_MASTER_PROMPT.md",
      "sha256": "a3fcdfc97b48e9b1f37e1a1798b0b5e7231309d03ab4e13683622eaf1fa69a87",
      "media_type": "text/markdown",
      "data_class": "C1"
    },
    {
      "ref": "docs/program/SPECIALIST_INPUTS.md",
      "sha256": "72edc3952585fb2c31cafd0fa206ab2e66647d49d3190202adf2eba71593590a",
      "media_type": "text/markdown",
      "data_class": "C1"
    },
    {
      "ref": "docs/program/COUNCIL_PACKETS.md",
      "sha256": "eb4d0d0dd46ebdaf07b7ab70380ee80fe0b35da222953f80576749cd3d29ff88",
      "media_type": "text/markdown",
      "data_class": "C1"
    },
    {
      "ref": "schemas/response-packet.schema.json",
      "sha256": "ee44e1b7e262bc0817e0b4f65de8830d122687618a59774fdabfddf3b7e69c0a",
      "media_type": "application/schema+json",
      "data_class": "C1"
    }
  ],
  "instructions": "Read every listed artifact at the pinned commit, then read the official primary sources directly rather than citing from memory. Produce capability records covering access path, entitlement, quota visibility, automation permission and cost, each with its source URL and the date read. Where a path is forbidden by the provider's terms, quote the terms. Do not enable billing or use a metered API to test anything. End with one ResponsePacket for UJ-CLD-001 proposing REVIEW with accepted weight still 0/8.",
  "required_output_schema": "ultrajarvis.response-packet/v1",
  "acceptance_criteria": [
    {
      "criterion_id": "AC-01",
      "text": "The Official-source Claude access and automation capability matrix artifact exists and conforms to its declared contract.",
      "verification": "Provide an artifact path/hash and a concrete check for criterion 1."
    },
    {
      "criterion_id": "AC-02",
      "text": "GEMINI issues an evidence-backed PASS or PASS_WITH_ACTIONS review.",
      "verification": "Provide an artifact path/hash and a concrete check for criterion 2."
    }
  ],
  "forbidden_actions": [
    "Use a paid or pay-per-use API.",
    "Enable billing, create a billing account, or accept overage risk.",
    "Automate a consumer UI, cookie, browser session, or login.",
    "Run heavy model inference on Christian's computer.",
    "Read, request, reveal, or store secret values.",
    "Write directly to main, merge a pull request, deploy production, or create accounts.",
    "Mark the task DONE or award accepted weight without the named independent reviewer.",
    "Perform another primary AI's task or claim that another AI agrees without its packet."
  ],
  "data_class": "C1",
  "allowed_modes": [
    "HUMAN_BRIDGE"
  ],
  "side_effect_limit": "INTERNAL_WRITE",
  "autonomy_ceiling": "L2",
  "tool_allowlist": [
    "AUTHORIZED_GITHUB_READ_IF_AVAILABLE",
    "AUTHORIZED_GITHUB_BRANCH_WRITE_IF_AVAILABLE"
  ],
  "call_budget": {
    "max_model_calls": 1,
    "max_tool_calls": 40,
    "incremental_cost_eur": 0
  },
  "reviewer": "GEMINI",
  "expires_at": "2026-09-17T00:00:00Z",
  "return_channel": {
    "mode": "copy-paste",
    "destination": "Return artifact files and one ResponsePacket JSON to the ChatGPT ultraJARVIS integration session; use a review branch/PR only if GitHub write is actually available.",
    "requires_artifact_hashes": true
  },
  "idempotency_key": "UJ-IDEMP-CLD-001-CLAUDE",
  "status": "READY"
}
```

