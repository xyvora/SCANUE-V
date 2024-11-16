import pytest
from pydantic import ValidationError

from app.core.config import Settings


@pytest.mark.parametrize("temperature", (0.0, 0.5, 1.0))
def test_temperature(temperature):
    settings = Settings(
        SECRET_KEY="a",
        FIRST_SUPERUSER_EMAIL="user@email.com",
        FIRST_SUPERUSER_PASSWORD="Abc123!@#",
        POSTGRES_HOST="some_host",
        POSTGRES_USER="pg",
        POSTGRES_PASSWORD="pgpassword",
        OPENAI_API_KEY="some_key",
        TEMPERATURE=temperature,
    )

    assert settings.TEMPERATURE == temperature


@pytest.mark.parametrize("temperature", (-0.1, 1.1))
def test_invalid_temperature(temperature):
    with pytest.raises(ValidationError):
        Settings(
            SECRET_KEY="a",
            FIRST_SUPERUSER_EMAIL="user@email.com",
            FIRST_SUPERUSER_PASSWORD="Abc123!@#",
            POSTGRES_HOST="some_host",
            POSTGRES_USER="pg",
            POSTGRES_PASSWORD="pgpassword",
            OPENAI_API_KEY="some_key",
            TEMPERATURE=temperature,
        )
