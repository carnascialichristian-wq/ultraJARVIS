# UltraJarvis Developer Pipeline

Self-upgrade / job execution pipeline.

## Stages

```
Architect → Write → Gates → Critic → Verify
```

| Stage | Module | Notes |
|-------|--------|-------|
| Architect | `core.planner` | Plan dataclass + plan.md |
| Write | `core.natural_tasks` | Controlled writes under job dir (tool.py + test_tool.py) |
| Gates | `core.gates` | ruff/black/pytest when installed, else stub |
| Critic | `advisors.critic` | Rule-based verdict + suggested_next |
| Verify | `core.verify` | PASS/FAIL + verify.txt |

## CLI

```bash
python bin/uj health
python bin/uj status
python bin/uj seed "Add a utility that …"
python bin/uj run --all
python bin/uj tools [--tag io|email|memory|…]
python bin/uj promote <job_id>
```

## Continuity

- `docs/GROK_CONTINUITY.md` + `taskgrok.md` — hand-off for other sessions/AIs
- Grok must update both at the end of every session

## Repo

- Working copy: https://github.com/carnascialichristian-wq/UltraJarvis_v8-grok
- Original: https://github.com/mootmoot1/UltraJarvis_v8

## Tests

```bash
python -m pytest -q
```
