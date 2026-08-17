# Grok v8 external snapshot import

## Purpose

This is the owner-requested, byte-preserving import of Grok's published
working repository into the canonical ultraJARVIS repository. It is a
**review-only source snapshot**, not an activation, architecture decision, or
task acceptance.

| Field | Value |
|---|---|
| Source repository | [carnascialichristian-wq/UltraJarvis_v8-grok](https://github.com/carnascialichristian-wq/UltraJarvis_v8-grok) |
| Source ref / commit | `main` / `e3311c46a394a6dd1ef89c4e9415f2e257450605` |
| Declared upstream in source docs | [mootmoot1/UltraJarvis_v8](https://github.com/mootmoot1/UltraJarvis_v8) |
| Imported directory | `imports/grok-v8/` |
| Imported source files | 84 |
| Imported source bytes | 68062 |
| Destination branch | `agent/uj-red-001-grok-v8-snapshot` |
| Activation state | **NOT_ACTIVE** |
| Data class / side effect | C1 / INTERNAL_WRITE only |
| Task-weight effect | none |

## What was preserved

- All 84 UTF-8 blobs at the pinned source commit are copied under
  `imports/grok-v8/` with source paths preserved.
- `imports/grok-v8/IMPORT_MANIFEST.json` records original Git blob SHA, path, mode,
  and byte count.
- The import does not overwrite the canonical root `README.md`, Program OS,
  backlog, Council schemas, or `main`.

## Verification performed

- Complete source tree and all 84 blobs read before publish.
- Source path/mode validation and common credential/private-key scan: **PASS,
  0 findings**. This is a limited static scan, not a security certification.
- No imported Python, CLI, test, dependency install, network call, browser
  operation, billing operation, account creation, or destructive operation was
  executed.
- Verify published integrity by comparing every target blob SHA with the
  manifest's source Git blob SHA.

## Material compatibility and evidence limits

The active ultraJARVIS baseline is TypeScript, Node.js and pnpm; the Grok
snapshot is Python and remains isolated until an ADR/porting plan is reviewed.

The source documentation claims “206 tests” and “135 tools”, but the pinned
tree contains **no test files**, `core/registry.py` has **seven** committed
`ToolSpec` entries, and `bin/uj` imports `core.natural_tasks`, which is
absent. Those claims are unverified and are not accepted proof. This is not a
schema-valid `ResponsePacket`, `ReviewResult`, or completion of
`UJ-RED-001`; its status remains unchanged.

The source declares an external upstream and no GitHub license endpoint was
found for source or upstream. Keep this import private; do not redistribute it
until provenance/licensing is independently resolved.

## Safe next action

1. Keep the snapshot inert.
2. Request from Grok a schema-valid `UJ-RED-001` ResponsePacket and review
   output, plus an evidence reconciliation for this snapshot.
3. Review it against zero-cost, no-consumer-automation and TypeScript-baseline
   constraints.
4. Port only selected components in a scoped TypeScript task with tests, ADR,
   and independent review. Do not activate the imported Python CLI directly.

## Recovery

This is additive and branch-only: close the import PR or delete its branch.
The source repository and `main` are untouched.
