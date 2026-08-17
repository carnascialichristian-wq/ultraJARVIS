from tools.pct_helpers import percent

def test_pct():
    assert percent(1, 4) == 25.0
    assert percent(1, 0) == 0.0
