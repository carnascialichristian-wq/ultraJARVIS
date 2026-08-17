from tools.div_helpers import div_safe

def test_div_safe():
    assert div_safe(10, 2) == 5.0
    assert div_safe(10, 0) is None
