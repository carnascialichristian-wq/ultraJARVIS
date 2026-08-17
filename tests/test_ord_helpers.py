from tools.ord_helpers import char_ord, char_chr

def test_ord_chr():
    assert char_ord("A") == 65
    assert char_chr(65) == "A"
