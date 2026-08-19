"""Configuration loader for UltraJarvis."""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, Optional


def _load_dotenv(path: Path = Path(".env")) -> None:
    if not path.exists():
        return
    try:
        for line in path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip().strip("'\"")
            if key and key not in os.environ:
                os.environ[key] = value
    except Exception:
        pass


@dataclass
class Config:
    model_provider: str = "openai"
    model_name: str = "gpt-4o-mini"
    openai_api_key: Optional[str] = None
    lmstudio_base: str = "http://localhost:1234"
    lmstudio_model: str = "llama-3.1-8b-instruct"
    llm_verbose: bool = True
    max_retries: int = 3
    flags: Dict[str, Any] = field(default_factory=dict)

    @classmethod
    def from_env(cls, dotenv_path: str | Path = ".env") -> "Config":
        _load_dotenv(Path(dotenv_path))
        return cls(
            model_provider=os.getenv("MODEL_PROVIDER", "openai").lower(),
            model_name=os.getenv("MODEL_NAME") or os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            openai_api_key=os.getenv("OPENAI_API_KEY"),
            lmstudio_base=os.getenv("LMSTUDIO_BASE", "http://localhost:1234"),
            lmstudio_model=os.getenv("LMSTUDIO_MODEL", "llama-3.1-8b-instruct"),
            llm_verbose=os.getenv("LLM_VERBOSE", "1") == "1",
            max_retries=int(os.getenv("UJ_MAX_RETRIES", "3")),
            flags={
                "devin_enabled": os.getenv("UJ_DEVIN_ENABLED", "0") == "1",
                "devin_fake": os.getenv("UJ_DEVIN_FAKE", "0") == "1",
                "devin_sandbox": os.getenv("UJ_DEVIN_SANDBOX", "0") == "1",
            },
        )


_config: Optional[Config] = None


def get_config(reload: bool = False) -> Config:
    global _config
    if _config is None or reload:
        _config = Config.from_env()
    return _config
