from tools.bytes_helpers import to_bytes

def test_to_bytes():
    assert isinstance(to_bytes("x"), (bytes, bytearray))
