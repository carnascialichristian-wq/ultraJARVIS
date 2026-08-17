from tools.lstrip_helpers import lstrip, rstrip

def test_lrstrip():
    assert lstrip("  x") == "x"
    assert rstrip("x  ") == "x"
