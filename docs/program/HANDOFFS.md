# Handoff protocol v0.1

The goal of a handoff is exact resumption without depending on chat history.
Every handoff validates against `schemas/handoff-packet.schema.json`.

## Required behavior

- One packet transfers one task at one repository ref.
- Large output remains in versioned artifacts; the packet contains references,
  hashes, a short delta, checks, and exact next action.
- Facts, assumptions, proposals, blockers, and risks are distinct arrays.
- Accepted weight changes only when the named reviewer is identified in the
  packet and the proof reference contains that review.
- A packet cannot increase autonomy, budget, scope, data class, or tool access.
- A missing or invalid packet never becomes implicit approval or completion.

## Artifact references

Artifact references use a repository path or canonical HTTPS URL plus SHA-256
when content is final. Mutable branch names may aid navigation but are not
sufficient proof for acceptance; add commit SHA after publication.

## State transitions carried by a handoff

| From | Allowed next state in packet | Condition |
|---|---|---|
| READY | IN_PROGRESS | session charter and first concrete artifact |
| IN_PROGRESS | REVIEW | output contract produced and checks recorded |
| REVIEW | DONE | named reviewer PASS and all criteria passed |
| REVIEW | IN_PROGRESS | reviewer FAIL with failing criteria |
| any active state | BLOCKED | explicit kind, cause, resolver, safe branch |
| BLOCKED | READY | blocker resolution proof exists |

The receiving integrator rejects impossible transitions and weight arithmetic.

## Relationship to Council Packets

This minimal handoff contract supports M0 session continuity. UJ-INT-006 now
defines and tests the complete MissionPacket, DelegationCard, ResponsePacket,
ReviewResult, and SynthesisPacket family. A specialist response is both:

1. a versioned specialist artifact; and
2. a valid `handoff-packet/v1` pointing to that artifact.

Council admission and merge follow `COUNCIL_IMPORT_AND_MERGE.md`; a valid
ResponsePacket proposes task state but does not independently award accepted
weight.

## Mandatory continuity ledger

At the beginning of every session, the active AI reads `gpt.md` and
`taskgpt.md` at the verified remote ref. At the end, it appends the work,
artifact hashes, checks, errors, actual task/weight state, remaining work and
next action to both files before publishing the handoff. Grok has the same
obligation; if limited to HUMAN_BRIDGE, it must include exact append blocks in
its ResponsePacket for import by ChatGPT or Christian. The ledger is append-only
and is not an acceptance mechanism.

## Storage convention

Use `docs/program/handoffs/<task-id>/<timestamp>-<from>-to-<target>.json` when
handoff instances begin. Do not create empty placeholder packets.

Store a reusable human-bridge review request at
`prompts/review-requests/<task-id>-<reviewer>.md`. A review request is not a
state transition: the reviewer must return a schema-valid ReviewResult with
evidence before the importer considers any ledger delta.

Stage every returned ReviewResult as untrusted input and follow
`REVIEW_RESULT_IMPORT.md`. The validator requires the exact reviewed commit,
task/owner/reviewer match, local artifact hashes, all acceptance criteria, and
the no-partial-weight rule before a separate reviewed commit can update state.
