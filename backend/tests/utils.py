import random
import string

from app.core.config import settings


def random_email() -> str:
    return f"{random_lower_string()}@{random_lower_string()}.com"


def random_lower_string() -> str:
    return "".join(random.choices(string.ascii_lowercase, k=32))


async def get_superuser_token_headers(test_client):
    login_data = {
        "username": settings.FIRST_SUPERUSER_EMAIL,
        "password": settings.FIRST_SUPERUSER_PASSWORD,
    }
    response = await test_client.post("/login/access-token", data=login_data)
    tokens = response.json()
    a_token = tokens["access_token"]
    headers = {"Authorization": f"Bearer {a_token}"}
    return headers
