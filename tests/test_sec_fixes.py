"""Regression tests for UJ-SEC-003 fixes (FIX-1..FIX-9)."""
from __future__ import annotations

import pytest
from pathlib import Path


def test_fix1_promote_blocks_dangerous(tmp_path):
    from core.natural_tasks import promote_job_to_tools
    root = tmp_path
    (root / "tools").mkdir()
    job = root / "j"
    job.mkdir()
    (job / "tool.py").write_text("import os\ndef h(c):\n return os.system(c)\n")
    with pytest.raises(PermissionError, match="dangerous"):
        promote_job_to_tools(job, "evil", root=root)
    # force still allowed for explicit override
    dest = promote_job_to_tools(job, "evil", root=root, force=True)
    assert dest.exists()


def test_fix2_promoted_header_compiles(tmp_path):
    from core.natural_tasks import promote_job_to_tools
    root = tmp_path
    (root / "tools").mkdir()
    job = root / "j"
    job.mkdir()
    (job / "tool.py").write_text("def add(a, b):\n    return a + b\n")
    dest = promote_job_to_tools(job, "mathx", root=root)
    compile(dest.read_text(), str(dest), "exec")


def test_fix3_safe_read_escapes_root():
    from tools.files import safe_read
    with pytest.raises(PermissionError):
        safe_read("/etc/hostname")
    with pytest.raises(PermissionError):
        safe_read("../../../etc/hostname")


def test_fix4_registry_blocks_force():
    from core.registry import get_registry
    import core.registry as reg
    reg._default = None
    with pytest.raises(PermissionError, match="privileged"):
        get_registry().call("files.safe_write", "notes/x.txt", "x", force=True)


def test_fix5_browser_allowlist():
    from tools.browser import is_allowed
    assert not is_allowed("https://wexample.com")
    assert not is_allowed("https://wwwexample.com")
    assert is_allowed("https://www.github.com")
    assert is_allowed("https://github.com")


def test_fix6_gates_structured(tmp_path):
    from core.gates import run_gates
    r = run_gates(tmp_path, use_real=False)
    assert isinstance(r, dict)
    assert r["ok"] is None
    assert "text" in r


def test_fix7_unsafe_tools_blocked():
    from core.registry import get_registry
    import core.registry as reg
    reg._default = None
    with pytest.raises(PermissionError, match="not marked safe"):
        get_registry().call("email.send", None)


def test_fix9_extra_patterns():
    from advisors.safety import scan_text
    hits = scan_text("import subprocess; subprocess.Popen(['x'])")
    assert any("subprocess" in h.lower() for h in hits)
    hits2 = scan_text("importlib.import_module('os').system('x')")
    assert any("importlib" in h.lower() for h in hits2)
