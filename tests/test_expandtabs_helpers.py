from tools.expandtabs_helpers import expandtabs

def test_expand():
    assert expandtabs("a\tb", 4) == "a   b"
