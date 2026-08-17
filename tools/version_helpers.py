"""Version helpers."""
from __future__ import annotations
from typing import Tuple

def parse_semver(v: str) -> Tuple[int, int, int]:
    parts = (v or "0").split(".")
    nums = []
    for i in range(3):
        try:
            nums.append(int(parts[i]) if i < len(parts) else 0)
        except ValueError:
            nums.append(0)
    return nums[0], nums[1], nums[2]
