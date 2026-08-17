from tools.url_helpers import host_of, is_https

def test_host():
    assert host_of("https://WWW.Example.com/x") == "www.example.com"

def test_https():
    assert is_https("https://a.com")
    assert not is_https("http://a.com")
