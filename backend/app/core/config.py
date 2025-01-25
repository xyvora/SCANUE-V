import warnings
from pathlib import Path
from typing import Annotated, Any, Final, Literal, Self

from dotenv import find_dotenv, load_dotenv
from pydantic import (
    AnyUrl,
    BeforeValidator,
    EmailStr,
    SecretStr,
    computed_field,
    field_validator,
    model_validator,
)
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv(find_dotenv(".env"))


def _parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file_encoding="utf-8", extra="ignore")

    API_V1_PREFIX: str = "/api/v1"
    TITLE: Final = "SCAN"
    SECRET_KEY: SecretStr
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    ENVIRONMENT: Literal["local", "production"] = "local"
    DOMAIN: str = "127.0.0.1"
    FIRST_SUPERUSER_EMAIL: EmailStr
    FIRST_SUPERUSER_PASSWORD: SecretStr
    ORGANIZATION: Final = "SCAN"
    BACKEND_CORS_ORIGINS: Annotated[list[AnyUrl] | str, BeforeValidator(_parse_cors)] = []
    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"
    LOG_PATH: str | Path | None = None
    LOG_TO_SCREEN_AND_FILE: bool = False
    PRODUCTION_MODE: bool = True
    POSTGRES_HOST: str
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str
    POSTGRES_PASSWORD: SecretStr
    POSTGRES_DB: str = "scan"
    VALKEY_HOST: str
    VALKEY_PASSWORD: SecretStr
    VALKEY_PORT: int = 6379
    FRONTEND_HOST: str = "http:/127.0.0.1:3000"
    OPENAI_API_KEY: SecretStr
    DLPFC_MODEL: SecretStr = SecretStr("gpt-3.5-turbo")
    VMPFC_MODEL: SecretStr = SecretStr("gpt-3.5-turbo")
    OFC_MODEL: SecretStr = SecretStr("gpt-3.5-turbo")
    ACC_MODEL: SecretStr = SecretStr("gpt-3.5-turbo")
    MPFC_MODEL: SecretStr = SecretStr("gpt-3.5-turbo")
    MAX_TOKENS: int = 500
    TEMPERATURE: float = 0.7

    @computed_field  # type: ignore[prop-decorator]
    @property
    def all_cors_origins(self) -> list[str]:
        return [str(origin).rstrip("/") for origin in self.BACKEND_CORS_ORIGINS] + [
            self.FRONTEND_HOST
        ]

    @computed_field  # type: ignore[prop-decorator]
    @property
    def server_host(self) -> str:
        # Use HTTPS for anything other than local development
        if self.ENVIRONMENT == "local":
            return f"http://{self.DOMAIN}"
        return f"https://{self.DOMAIN}"

    def _check_default_secret(self, var_name: str, value: str | None) -> None:
        if value == "changethis":
            message = (
                f'The value of {var_name} is "changethis", '
                "for security, please change it, at least for deployments."
            )
            if self.ENVIRONMENT == "local":
                warnings.warn(message, stacklevel=1)
            else:
                raise ValueError(message)

    @field_validator("TEMPERATURE", mode="before")
    @classmethod
    def validate_temperature(cls, temperature: float) -> float:
        if not (0 <= temperature <= 1.0):
            raise ValueError("Temperature must be between 0.0 and 1.0")

        return temperature

    @model_validator(mode="after")
    def _enforce_non_default_secrets(self) -> Self:
        self._check_default_secret("SECRET_KEY", self.SECRET_KEY.get_secret_value())
        self._check_default_secret(
            "FIRST_SUPERUSER_PASSWORD", self.FIRST_SUPERUSER_PASSWORD.get_secret_value()
        )
        self._check_default_secret("POSTGRES_USER", self.POSTGRES_USER)
        self._check_default_secret("POSTGRES_PASSWORD", self.POSTGRES_PASSWORD.get_secret_value())
        self._check_default_secret("VALKEY_PASSWORD", self.VALKEY_PASSWORD.get_secret_value())

        return self


settings = Settings()  # type: ignore
