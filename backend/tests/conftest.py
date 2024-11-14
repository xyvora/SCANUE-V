import pytest
from httpx import ASGITransport, AsyncClient

from app.core.config import settings
from app.core.db import db
from app.main import app
from app.models.users import UserCreate, UserUpdate
from app.services import user_services
from tests.utils import get_superuser_token_headers, random_email, random_lower_string


async def user_authentication_headers(test_client, email, password):
    data = {"username": email, "password": password}

    result = await test_client.post("/login/access-token", data=data)
    response = result.json()
    auth_token = response["access_token"]
    return {"Authorization": f"Bearer {auth_token}"}


@pytest.fixture(autouse=True)
async def test_db():
    await db.create_pool()
    await db.apply_migrations()
    await db.create_first_superuser()
    yield db
    if not db.pool:
        await db.create_pool()

    async with db.pool.acquire() as conn:  # type: ignore
        tables = ", ".join(("users",))
        await conn.execute(f"TRUNCATE {tables}")
    await db.close_pool()


@pytest.fixture
async def test_client():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url=f"http://127.0.0.1{settings.API_V1_PREFIX}"
    ) as client:
        yield client


@pytest.fixture
async def superuser_token_headers(test_client):
    return await get_superuser_token_headers(test_client)


@pytest.fixture
async def test_user(test_db):
    email = random_email()
    password = random_lower_string()
    openai_api_key = random_lower_string()
    full_name = random_lower_string()
    async with test_db.pool.acquire() as conn:
        user = await user_services.create_user(
            conn,
            user=UserCreate(
                email=email,
                password=password,
                openai_api_key=openai_api_key,
                full_name=full_name,
            ),
        )
    return user


@pytest.fixture
async def normal_user_token_headers(test_db, test_client):
    password = random_lower_string()
    openai_api_key = random_lower_string()
    full_name = random_lower_string()
    email = random_email()
    async with test_db.pool.acquire() as conn:
        user = await user_services.get_user_by_email(conn, email=email)
        if not user:
            user = await user_services.create_user(
                conn,
                user=UserCreate(
                    email=email,
                    password=password,
                    openai_api_key=openai_api_key,
                    full_name=full_name,
                ),
            )
        else:
            user_in = UserUpdate(password=password, openai_api_key=openai_api_key)
            if not user.id:
                raise Exception("User id not set")
            user = await user_services.update_user(conn, db_user=user, user_in=user_in)

    return await user_authentication_headers(
        test_client=test_client, email=email, password=password
    )
