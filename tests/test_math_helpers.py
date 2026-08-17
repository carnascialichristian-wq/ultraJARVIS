"""Tests for tools.math_helpers."""

from __future__ import annotations

import pytest

from tools.math_helpers import is_even, factorial, fib, is_palindrome


def test_is_even():
    assert is_even(2) and not is_even(3)


def test_factorial():
    assert factorial(0) == 1
    assert factorial(5) == 120
    with pytest.raises(ValueError):
        factorial(-1)


def test_fib():
    assert fib(0) == 0
    assert fib(10) == 55


def test_palindrome():
    assert is_palindrome("Racecar")
    assert not is_palindrome("hello")


def test_clamp():
    from tools.math_helpers import clamp
    assert clamp(5, 0, 3) == 3
    assert clamp(-1, 0, 3) == 0
    assert clamp(2, 0, 3) == 2


def test_gcd():
    from tools.math_helpers import gcd
    assert gcd(12, 8) == 4
    assert gcd(7, 3) == 1


def test_lcm():
    from tools.math_helpers import lcm
    assert lcm(4, 6) == 12
    assert lcm(0, 5) == 0
    assert lcm(7, 1) == 7


def test_is_prime():
    from tools.math_helpers import is_prime
    assert is_prime(2) and is_prime(3) and is_prime(17)
    assert not is_prime(1) and not is_prime(0) and not is_prime(15)
    assert not is_prime(-3)
