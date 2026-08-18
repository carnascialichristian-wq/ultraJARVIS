# BLOCCHI APPEND-ONLY — da inoltrare a CHATGPT

> **Christian:** questi tre blocchi vanno **aggiunti in coda** ai file indicati, senza
> sostituire nulla. Non li ho scritti io in quei file: `gpt.md`, `taskgpt.md` e
> `docs/program/RESUME_POINT.md` sono di ChatGPT, e il mio confine dice di segnalare, non di
> scrivere nel portafoglio altrui. Contengono solo fatti, controlli eseguiti, errori, stato
> reale, peso e prossima azione.

---

=== LEDGER APPEND: gpt.md ===

[2026-08-18T13:51:33Z] CLAUDE — UJ-RUN-001 delivery (blueprint part II)

- AI_ID: CLAUDE
- Task: UJ-RUN-001 | owner CLAUDE | reviewer GEMINI | weight 13
- source_commit_sha: 8ed53286ea805118d26c9a27caf4281904cf7fbe
- Branch: claude/claude-md-resume-point-tvej1u (no write to main, no merge, no PR retarget)

ARTIFACTS DELIVERED (15 cited in the packet; the one changed in this delivery):
  1. docs/architecture/RUNTIME_BLUEPRINT.md
     SHA-256: a0be04069692d89399eefe183d489d8ad8bea472c232444676883331c23c2538
     bytes: 84318, final newline present (LF)
  The other 14 artifacts are unchanged from the previous packet; their hashes are unchanged
  and are listed in the packet itself.

RESPONSE PACKET:
  docs/program/packets/UJ-RESP-RUN-001-CLAUDE.json
  SHA-256: c3ef5f71bf78ca3b1dd596f37ae32f6a9974f8fe6811856be58830d9e70f1d8d
  response_id UJ-RESPONSE-RUN-001-CLAUDE-20260818 | status REVIEW

CHECKS EXECUTED IN THIS SESSION (command and exit code, not recalled):
  npx tsc -p packages/contracts --noEmit                      exit 0
  npx tsc -p packages/contracts                               exit 0
  node --test over tests/contracts/*.test.mjs                 140 pass, 0 fail
  node scripts/validate-response-packet.mjs <packet>          exit 0, 15/15 hashes recomputed
  coverage count of the 24 required runtime points            24/24 have a section

CHECKS NOT RUN, DECLARED:
  The 24 proofs specified in blueprint sections 16-22. They are specified, not implemented:
  no runtime exists yet. Each is marked PROVA DA IMPLEMENTARE in the document.
  Runtime implementation tests (crash injection, concurrent spawn, supervisor liveness,
  checkpoint corruption): belong to M2/M3 under UJ-RCV-001.

DEFECT FOUND AND FIXED IN MY OWN ARTIFACT (session 5):
  depth-guard.ts built its k-gram key by joining on a NUL byte. Second occurrence of error E6.
  Measured consequences: false-positive cycles, and the file was BINARY to git and grep, so it
  sat outside every text audit for four sessions. Fixed with a single shared length-prefixed
  encoder. Suite 138 -> 140. The regression test was proved to FAIL against the old code
  (expected false, actual true) before being accepted.

GATE DISCREPANCIES REPORTED, NOT WORKED AROUND:
  1. prompts/delegation-cards/UJ-RUN-001-CLAUDE.json does not exist at commit 3611b1b4, the
     commit the handoff orders it read at. It enters with d48e1e85, twelve minutes later.
     The four PINNED input hashes all match at 3611b1b4, so this is not a pin mismatch and
     BLOCKED was not returned.
  2. The handoff says "path"; the schema field is "ref" and additionalProperties is false.
  3. The handoff asks for per-criterion mapping inside the packet; the schema has no such
     field. It is in docs/program/packets/UJ-RUN-001-AC-EVIDENCE.md.
  4. UJ-RUN-001 declares five acceptance criteria in the card and two in BACKLOG.json.
     Measured by running the validator: a review written against the five assigned criteria
     is rejected as "unknown criterion". This holds for all four delegation cards.

LEDGER: UJ-RUN-001 proposed READY -> REVIEW. accepted_weight 0/13 -> 0/13, unchanged.
NO task marked DONE. NO weight self-assigned. NO reviewer consent claimed.
POLICY: no paid API, no billing, no secrets, no consumer UI automation, no heavy local
inference, data class C1, side effect INTERNAL_WRITE.

=== END LEDGER APPEND ===

---

=== LEDGER APPEND: taskgpt.md ===

[2026-08-18T13:51:33Z] COUNCIL BRIEFING — CLAUDE, UJ-RUN-001

WHAT CHANGED
  Blueprint coverage against the 24 required runtime points was MEASURED, not assumed.
  Five points had zero occurrences in the document: task decomposition, agent selection and
  assignment, end-to-end demo, zero-cost local fallback. Two were weak: inter-agent conflicts
  (1 occurrence), HUMAN_BRIDGE (2).

  Sections 16-22 were APPENDED. Sections 0-15 were not rewritten: they are cited by number
  from the ResponsePacket, from review checklist section 13, from the contract source headers
  and from the threat notes. Renumbering would break those references silently.
  Evidence that the extension was surgical: exactly 1 of 15 artifact hashes changed.

  Each new section carries responsibility, input, output, state, errors, controls and required
  proof. Section 22 maps all 24 requirements to a section and to its proofs, so a reviewer can
  count coverage instead of skimming for it.

TWO RULES IN THE NEW SECTIONS COME FROM MEASURED DEFECTS, NOT FROM PRINCIPLE
  DEC-E04 rejects an acceptance criterion whose truth depends only on the reviewer's verdict.
  Reason: 41 of 43 acceptance criteria in BACKLOG.json read "<REVIEWER> issues an
  evidence-backed PASS or PASS_WITH_ACTIONS review", and 40 of 43 tasks have only two criteria
  in total. For most of the program, half the acceptance surface restates the outcome field
  instead of describing the artifact.
  RTE-E01 refuses a METERED adapter AT REGISTRATION when autonomy is L2. Reason: in
  cloud_bridge.py on main, PROVIDER is a module-level constant defaulting to the paid provider,
  fixed once at import. Measured: 6 of 7 attacks reach a billable or remote path.

FOR GEMINI, REVIEWER OF THIS TASK
  Per-criterion evidence with path, hash and one EXECUTED check for AC-01..AC-05 is in
  docs/program/packets/UJ-RUN-001-AC-EVIDENCE.md.
  WARNING, and it is not yours to fix: a ReviewResult written against the five criteria in the
  delegation card will be rejected by scripts/validate-council-packets.mjs as "unknown
  criterion AC-03/AC-04/AC-05", because BACKLOG.json declares only two for this task. Measured
  by execution on a real case.

HONEST BALANCE
  24 of 24 requirements have a section. NOT 24 of 24 have an executed proof.
  Sections 16-22 specify 24 NEW proofs, each marked PROVA DA IMPLEMENTARE.
  The remainder rests on 140 tests passing today.
  Reporting specified work as covered would be false progress under section 31.5.

LEDGER: UJ-RUN-001 READY -> REVIEW proposed. accepted_weight 0/13, unchanged.

=== END LEDGER APPEND ===

---

=== LEDGER APPEND: docs/program/RESUME_POINT.md ===

[2026-08-18T13:51:33Z] RESUME POINT — CLAUDE, UJ-RUN-001 delivery

TASK STATE
  UJ-RUN-001  owner CLAUDE  reviewer GEMINI  weight 13
              proposed READY -> REVIEW, accepted_weight 0/13 unchanged
  source_commit_sha: 8ed53286ea805118d26c9a27caf4281904cf7fbe
  branch: claude/claude-md-resume-point-tvej1u

ARTIFACTS
  docs/architecture/RUNTIME_BLUEPRINT.md — sections 0-15 unchanged, 16-22 added
  docs/program/packets/UJ-RESP-RUN-001-CLAUDE.json — validator exit 0, 15/15 hashes
  docs/program/packets/UJ-RUN-001-AC-EVIDENCE.md — per-criterion evidence
  prompts/handoffs/CLAUDE-RUN-001-DELIVERY-20260818.md — the copy-paste blocks

VERIFIED BY EXECUTION IN THIS SESSION
  typecheck exit 0 | build exit 0 | 140/140 tests pass | packet validator exit 0
  canonical prompt sha256 a3fcdfc97b48e9b1f37e1a1798b0b5e7231309d03ab4e13683622eaf1fa69a87

NOT VERIFIED, DECLARED
  The 24 proofs specified in blueprint sections 16-22 are not implemented.
  No runtime exists yet; they belong to M2/M3 under UJ-RCV-001.

BLOCKERS THAT ARE NOT MINE
  1. Nothing applies a proposed status transition. No script in the repository writes to
     BACKLOG.json. Proof: this packet validates at exit 0 and proposes READY -> REVIEW, and
     UJ-RUN-001 is still READY in BACKLOG.json at the same ref.
  2. All four delegation cards declare five acceptance criteria; BACKLOG.json declares two.
     Any review written against the assigned criteria is rejected as "unknown criterion".
  3. The council validator resolves artifact hashes against the WORKING TREE, not against the
     commit the review pins. Whether a review imports depends on which checkout runs it.
  Analysis with the isolation experiment:
     docs/program/reviews/UJ-REV-001-ADDENDUM-LEDGER-IMPORT-PATH.md

NEXT ACTION
  1. ChatGPT: freeze bytes, verify the 15 hashes at 8ed53286ea80, publish.
  2. GEMINI: review UJ-RUN-001 against AC-01..AC-04 and issue a ReviewResult.
  3. Owner decision still open: merge the STRICT_ZERO cloud-bridge fix to main.
     S-17 and S-19 verified OPEN on main for the third consecutive session.

=== END LEDGER APPEND ===
