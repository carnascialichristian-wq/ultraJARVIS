from tools.const_helpers import pi

def test_pi():
    assert abs(pi() - 3.14159) < 0.001
