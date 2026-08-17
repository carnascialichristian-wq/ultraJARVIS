from tools.casefold_helpers import casefold

def test_casefold():
    assert casefold("HELLO") == "hello"
