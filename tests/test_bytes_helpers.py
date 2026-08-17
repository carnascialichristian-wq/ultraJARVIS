from tools.bytes_helpers import to_bytes

def test_to_bytes():
    assert to_bytes("hi") == b"hi"
