import pytest
from pydantic import SecretStr, ValidationError

from app.core.config import Settings


@pytest.mark.parametrize("temperature", (0.0, 0.5, 1.0))
def test_temperature(temperature):
    settings = Settings(
        SECRET_KEY=SecretStr("a"),
        FIRST_SUPERUSER_EMAIL="user@email.com",
        FIRST_SUPERUSER_PASSWORD=SecretStr("Abc123!@#"),
        POSTGRES_HOST="some_host",
        POSTGRES_USER="pg",
        POSTGRES_PASSWORD=SecretStr("pgpassword"),
        VALKEY_HOST="valkey",
        VALKEY_PASSWORD=SecretStr("valkeypassword"),
        OPENAI_API_KEY=SecretStr("some_key"),
        TEMPERATURE=temperature,
    )

    assert settings.TEMPERATURE == temperature


@pytest.mark.parametrize("temperature", (-0.1, 1.1))
def test_invalid_temperature(temperature):
    with pytest.raises(ValidationError):
        Settings(
            SECRET_KEY=SecretStr("a"),
            FIRST_SUPERUSER_EMAIL="user@email.com",
            FIRST_SUPERUSER_PASSWORD=SecretStr("Abc123!@#"),
            POSTGRES_HOST="some_host",
            POSTGRES_USER="pg",
            POSTGRES_PASSWORD=SecretStr("pgpassword"),
            VALKEY_HOST="valkey",
            VALKEY_PASSWORD=SecretStr("valkeypassword"),
            OPENAI_API_KEY=SecretStr("some_key"),
            TEMPERATURE=temperature,
        )
