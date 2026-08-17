# Publish status — ultraJARVIS

**Repo:** https://github.com/carnascialichristian-wq/ultraJARVIS  
**Source:** local UltraJarvis_v8 work (NOT published to UltraJarvis_v8-grok in this wave)

## Published on this repo

### Docs
- README.md, STATUS.md, taskgrok.md, Makefile, pytest.ini

### Advisors
- critic.py (suggests uj promote), safety.py, style.py

### Core
- health.py, job_worker.py, memory.py (list_tags), planner.py
- metrics.py, skills.py, registry.py (catalog of published tools)
- natural_tasks.py (pipeline + promote_job_to_tools)
- __init__.py

### CLI
- bin/uj (health, status, seed, run, tools, memory, snapshot, skills, **promote**)

### Tools
- files.py (guarded I/O + PROTECTED)
- math_helpers.py (incl. lcm, is_prime)
- list_helpers.py, dict_helpers.py
- automation.py, os_control.py

## Still local-only / partial
- Full 135-tool registry catalog (remote has the tools that exist on this repo)
- Remaining ~80 tools/*_helpers.py
- Full tests/* suite (~206 tests)
- core/gates.py, verify.py, reliability.py, utils.py, config.py, logging_uj.py (may still be missing)

## Next
Continue batch-publishing remaining core + tools + tests to this same repo.
