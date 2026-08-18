# Publish status — ultraJARVIS

**Repo:** https://github.com/carnascialichristian-wq/ultraJARVIS  
**Target:** ultraJARVIS (not UltraJarvis_v8-grok)

## Published (2026-08-18 ~00:35 CEST)

### Security + promote
UJ-SEC-003 complete · optional `register=True` on promote

### Phase 2 (started)
- `cloud_bridge.ask_cloud_ai(..., system=)` optional system prompt
- `core.planner._plan_via_llm` + `plan()` opt-in via `UJ_PLANNER_LLM=1`
- Heuristic fallback always available
- Tests: opt-in path + default-off path

## Remaining
- Writer LLM adapter
- Real gates when ruff/black available

Continues until user says **stop**.
