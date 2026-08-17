from tools.case_helpers import to_upper, to_lower

def test_case():
    assert to_upper("a") == "A"
    assert to_lower("A") == "a"
