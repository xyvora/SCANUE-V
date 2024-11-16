from app.core.config import settings


async def test_get_access_token(test_client):
    login_data = {
        "username": settings.FIRST_SUPERUSER_EMAIL,
        "password": settings.FIRST_SUPERUSER_PASSWORD,
    }
    response = await test_client.post("/login/access-token", data=login_data)
    tokens = response.json()
    assert response.status_code == 200
    assert "access_token" in tokens
    assert tokens["access_token"]


async def test_get_access_token_incorrect_password(test_client):
    login_data = {
        "username": settings.FIRST_SUPERUSER_EMAIL,
        "password": "incorrect",
    }
    response = await test_client.post("/login/access-token", data=login_data)
    assert response.status_code == 400


async def test_use_access_token(test_client, superuser_token_headers):
    response = await test_client.post(
        "/login/test-token",
        headers=superuser_token_headers,
    )
    result = response.json()
    assert response.status_code == 200
    assert "email" in result
