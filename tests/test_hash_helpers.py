from tools.hash_helpers import sha256_text, md5_text

def test_sha256():
    assert len(sha256_text("abc")) == 64

def test_md5():
    assert len(md5_text("abc")) == 32
