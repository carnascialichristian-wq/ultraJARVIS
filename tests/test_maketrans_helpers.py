from tools.maketrans_helpers import translate_chars

def test_trans():
    assert translate_chars("abc", "a", "x") == "xbc"
