from tools.identity_helpers import identity

def test_identity():
    assert identity(42) == 42
    assert identity("x") == "x"
