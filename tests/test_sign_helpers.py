from tools.sign_helpers import sign

def test_sign():
    assert sign(5) == 1
    assert sign(-2) == -1
    assert sign(0) == 0
