from tools.version_helpers import parse_semver

def test_parse():
    assert parse_semver("1.2.3") == (1, 2, 3)
    assert parse_semver("2") == (2, 0, 0)
