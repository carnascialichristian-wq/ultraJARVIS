# Quarantine audit — UJ-CAP-001 Gemini resend

- Audit timestamp: 2026-08-18T10:28:31Z
- Raw attachment SHA-256: 7f47cc955eabe289c9a8f457db87072e33ba00e72da818ef0dd7c87717ba7741
- Input commit named by Gemini: 3611b1b400cf57b5021bab228a3de9470d6eca5c
- Admission result: REJECTED / QUARANTINED for direct Council import.

## Rejection reasons

- IDs used UJ-RESP-... instead of schema-required UJ-RESPONSE-....
- Structured fields were strings or incompatible shapes; task_ledger_delta was not an array.
- Line-wrapped registry JSON did not parse as received until repaired.
- Reported artifact hashes/byte counts did not match extracted final bytes; original files had no final newline.

## Retained evidence
- Original registry MD SHA-256: 6c963a9084996d858cce340d5d9395e996f0c5d622a7093705f5d78be1318ffd
- Original registry JSON SHA-256: edda8466275b72556b91a8c8e99091f4050d82cf74e44fce21567067c57ced27
- Original evidence SHA-256: 4652d087e3bab5336806bb0bad93519bad49268310a446f0cccd5dd95f5a1bb6
- Original packet labels: UJ-CAP-001, UJ-GGL-001
- Original response IDs: UJ-RESP-CAP-001-GEMINI-001, UJ-RESP-GGL-001-GEMINI-001

## Corrective action

The CAP branch publishes a corrected Markdown/JSON registry pair and a schema-valid replacement packet.
- No BACKLOG.json, accepted weight, or task completion state was changed.
- The replacement is a new REVIEW candidate, not a silent acceptance of quarantined bytes.
