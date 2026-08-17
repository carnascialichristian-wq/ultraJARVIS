from tools.env_helpers import get_env
import os

def test_get_env(monkeypatch):
    monkeypatch.setenv("UJ_TEST_X", "1")
    assert get_env("UJ_TEST_X") == "1"
    assert get_env("UJ_TEST_MISSING", "d") == "d"
