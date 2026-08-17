from tools.case_helpers import to_case

def test_to_case():
    assert to_case("Hi", "upper") == "HI"
