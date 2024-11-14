from uuid import uuid4

from app.core.config import settings
from app.core.security import verify_password
from app.models.users import UserCreate
from app.services import user_services
from tests.utils import random_email, random_lower_string


async def test_get_users_superuser_me(test_client, superuser_token_headers):
    response = await test_client.get("/users/me", headers=superuser_token_headers)
    current_user = response.json()
    assert current_user
    assert current_user["isActive"] is True
    assert current_user["isSuperuser"]
    assert current_user["email"] == settings.FIRST_SUPERUSER_EMAIL


async def test_get_users_normal_user_me(test_client, normal_user_token_headers):
    response = await test_client.get("/users/me", headers=normal_user_token_headers)
    current_user = response.json()
    assert current_user
    assert current_user["isActive"] is True
    assert current_user["isSuperuser"] is False
    assert current_user["email"] is not None


async def test_get_existing_user(test_db, test_client, superuser_token_headers, test_user):
    user_id = test_user.id
    response = await test_client.get(
        f"/users/{user_id}",
        headers=superuser_token_headers,
    )
    assert 200 <= response.status_code < 300
    api_user = response.json()
    async with test_db.pool.acquire() as conn:
        existing_user = await user_services.get_user_by_email(conn, email=test_user.email)
    assert existing_user
    assert existing_user.email == api_user["email"]


async def test_get_existing_user_current_user(test_client, test_db):
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
    user_id = user.id
    login_data = {
        "username": email,
        "password": password,
    }
    response = await test_client.post("/login/access-token", data=login_data)
    tokens = response.json()
    a_token = tokens["access_token"]
    headers = {"Authorization": f"Bearer {a_token}"}

    response = await test_client.get(
        f"/users/{user_id}",
        headers=headers,
    )
    assert 200 <= response.status_code < 300
    api_user = response.json()
    async with test_db.pool.acquire() as conn:
        existing_user = await user_services.get_user_by_email(conn, email=email)
    assert existing_user
    assert existing_user.email == api_user["email"]


async def test_get_existing_user_permissions_error(
    test_client, normal_user_token_headers, test_user
):
    response = await test_client.get(
        f"/users/{test_user.id}",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 403
    assert response.json() == {"detail": "The user doesn't have enough privileges"}


async def test_create_user_existing_username(test_client, superuser_token_headers, test_db):
    username = random_email()
    password = random_lower_string()
    openai_api_key = random_lower_string()
    full_name = random_lower_string()
    async with test_db.pool.acquire() as conn:
        await user_services.create_user(
            conn,
            user=UserCreate(
                email=username,
                password=password,
                openai_api_key=openai_api_key,
                full_name=full_name,
            ),
        )
    data = {
        "email": username,
        "password": password,
        "openai_api_key": openai_api_key,
        "fullName": full_name,
    }
    response = await test_client.post(
        "/users/",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 400
    created_user = response.json()
    assert "A user with this email address already exists" in created_user["detail"]


async def test_create_user_by_normal_user(test_client, normal_user_token_headers):
    username = random_email()
    password = random_lower_string()
    openai_api_key = random_lower_string()
    full_name = random_lower_string()
    data = {
        "email": username,
        "password": password,
        "openai_api_key": openai_api_key,
        "fullName": full_name,
    }
    response = await test_client.post(
        "/users/",
        headers=normal_user_token_headers,
        json=data,
    )
    assert response.status_code == 403


async def test_retrieve_users(test_client, superuser_token_headers, test_db):
    username = random_email()
    password = random_lower_string()
    openai_api_key = random_lower_string()
    full_name = random_lower_string()
    username2 = random_email()
    password2 = random_lower_string()
    openai_api_key2 = random_lower_string()
    full_name2 = random_lower_string()
    async with test_db.pool.acquire() as conn:
        await user_services.create_user(
            conn,
            user=UserCreate(
                email=username,
                password=password,
                openai_api_key=openai_api_key,
                full_name=full_name,
            ),
        )

        await user_services.create_user(
            conn,
            user=UserCreate(
                email=username2,
                password=password2,
                openai_api_key=openai_api_key2,
                full_name=full_name2,
            ),
        )

    response = await test_client.get("/users/", headers=superuser_token_headers)
    all_users = response.json()

    assert len(all_users["data"]) > 1
    assert "count" in all_users
    for item in all_users["data"]:
        assert "email" in item


async def test_update_user_me(test_client, normal_user_token_headers, test_db):
    full_name = "Updated"
    email = random_email()
    data = {"fullName": full_name, "email": email}
    response = await test_client.patch(
        "/users/me",
        headers=normal_user_token_headers,
        json=data,
    )
    assert response.status_code == 200
    updated_user = response.json()
    assert updated_user["email"] == email
    assert updated_user["fullName"] == full_name

    async with test_db.pool.acquire() as conn:
        user_db = await user_services.get_user_by_email(conn, email=email)
    assert user_db
    assert user_db.email == email
    assert user_db.full_name == full_name


async def test_update_password_me(test_client, superuser_token_headers, test_db):
    new_password = random_lower_string()
    data = {
        "current_password": settings.FIRST_SUPERUSER_PASSWORD,
        "new_password": new_password,
    }
    response = await test_client.patch(
        "/users/me/password",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    updated_user = response.json()
    assert updated_user["message"] == "Password updated successfully"

    async with test_db.pool.acquire() as conn:
        user_db = await user_services.get_user_by_email(conn, email=settings.FIRST_SUPERUSER_EMAIL)
    assert user_db
    assert user_db.email == settings.FIRST_SUPERUSER_EMAIL
    assert verify_password(new_password, user_db.hashed_password)


async def test_update_password_me_incorrect_password(test_client, superuser_token_headers):
    bad_password = random_lower_string()
    new_password = random_lower_string()
    data = {"current_password": bad_password, "new_password": new_password}
    response = await test_client.patch(
        "/users/me/password",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 400
    updated_user = response.json()
    assert updated_user["detail"] == "Incorrect password"


async def test_update_user_me_email_exists(test_client, test_db, normal_user_token_headers):
    email = random_email()
    password = random_lower_string()
    openai_api_key = random_lower_string()
    full_name = random_lower_string()
    async with test_db.pool.acquire() as conn:
        await user_services.create_user(
            conn,
            user=UserCreate(
                email=email,
                password=password,
                openai_api_key=openai_api_key,
                full_name=full_name,
            ),
        )
    data = {"email": email}
    response = await test_client.patch(
        "/users/me",
        headers=normal_user_token_headers,
        json=data,
    )
    assert response.status_code == 409
    assert response.json()["detail"] == "A user with this email address already exists"


async def test_update_password_me_same_password_error(test_client, superuser_token_headers):
    data = {
        "currentPassword": settings.FIRST_SUPERUSER_PASSWORD,
        "newPassword": settings.FIRST_SUPERUSER_PASSWORD,
    }
    response = await test_client.patch(
        "/users/me/password",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 400
    updated_user = response.json()
    assert updated_user["detail"] == "New password cannot be the same as the current one"


async def test_register_user(test_client, test_db):
    username = random_email()
    password = random_lower_string()
    openai_api_key = random_lower_string()
    full_name = random_lower_string()
    data = {
        "email": username,
        "password": password,
        "openaiApiKey": openai_api_key,
        "fullName": full_name,
    }
    response = await test_client.post(
        "/users/signup",
        json=data,
    )
    assert response.status_code == 200
    created_user = response.json()
    assert created_user["email"] == username
    assert created_user["fullName"] == full_name

    async with test_db.pool.acquire() as conn:
        user_db = await user_services.get_user_by_id(conn, user_id=created_user["id"])
    assert user_db
    assert user_db.email == username
    assert user_db.full_name == full_name
    assert verify_password(password, user_db.hashed_password)


async def test_register_user_already_exists_error(test_client):
    password = random_lower_string()
    openai_api_key = random_lower_string()
    full_name = random_lower_string()
    data = {
        "email": settings.FIRST_SUPERUSER_EMAIL,
        "password": password,
        "openaiApiKey": openai_api_key,
        "fullName": full_name,
    }
    response = await test_client.post(
        "/users/signup",
        json=data,
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "The user with this email already exists in the system"


async def test_update_user(test_client, superuser_token_headers, test_db, test_user):
    data = {"fullName": "Updated_full_name"}
    response = await test_client.patch(
        f"/users/{test_user.id}",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    updated_user = response.json()

    assert updated_user["fullName"] == "Updated_full_name"

    async with test_db.pool.acquire() as conn:
        user_db = await user_services.get_user_by_email(conn, email=test_user.email)
    assert user_db
    assert user_db.full_name == "Updated_full_name"


async def test_update_user_not_exists(test_client, superuser_token_headers):
    data = {"fullName": "Updated_full_name"}
    response = await test_client.patch(
        f"/users/{str(uuid4())}",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "The user with this id does not exist in the system"


async def test_update_user_email_exists(test_client, superuser_token_headers, test_db):
    username = random_email()
    password = random_lower_string()
    openai_api_key = random_lower_string()
    full_name = random_lower_string()
    username2 = random_email()
    password2 = random_lower_string()
    openai_api_key2 = random_lower_string()
    full_name_2 = random_lower_string()
    async with test_db.pool.acquire() as conn:
        user = await user_services.create_user(
            conn,
            user=UserCreate(
                email=username,
                password=password,
                openai_api_key=openai_api_key,
                full_name=full_name,
            ),
        )

        user2 = await user_services.create_user(
            conn,
            user=UserCreate(
                email=username2,
                password=password2,
                openai_api_key=openai_api_key2,
                full_name=full_name_2,
            ),
        )

    data = {"email": user2.email}
    response = await test_client.patch(
        f"/users/{user.id}",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 409
    assert response.json()["detail"] == "User with this email already exists"


async def test_delete_user_me(test_client, test_db):
    username = random_email()
    password = random_lower_string()
    openai_api_key = random_lower_string()
    full_name = random_lower_string()
    async with test_db.pool.acquire() as conn:
        user = await user_services.create_user(
            conn,
            user=UserCreate(
                email=username,
                password=password,
                openai_api_key=openai_api_key,
                full_name=full_name,
            ),
        )
        user_id = user.id

        login_data = {
            "username": username,
            "password": password,
        }
        response = await test_client.post("/login/access-token", data=login_data)
        tokens = response.json()
        a_token = tokens["access_token"]
        headers = {"Authorization": f"Bearer {a_token}"}

        response = await test_client.delete(
            "/users/me",
            headers=headers,
        )
        assert response.status_code == 200
        deleted_user = response.json()
        assert deleted_user["message"] == "User deleted successfully"
        result = await user_services.get_user_by_id(conn, user_id=user_id)
    assert result is None


async def test_delete_user_me_as_superuser(test_client, superuser_token_headers):
    response = await test_client.delete(
        "/users/me",
        headers=superuser_token_headers,
    )
    assert response.status_code == 403
    response = response.json()
    assert response["detail"] == "Super users are not allowed to delete themselves"


async def test_delete_user_super_user(test_client, superuser_token_headers, test_db, test_user):
    user_id = test_user.id
    response = await test_client.delete(
        f"/users/{user_id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    deleted_user = response.json()
    assert deleted_user["message"] == "User deleted successfully"
    async with test_db.pool.acquire() as conn:
        result = await user_services.get_user_by_id(conn, user_id=user_id)
    assert result is None


async def test_delete_user_not_found(test_client, superuser_token_headers):
    response = await test_client.delete(
        f"/users/{str(uuid4())}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "User not found"


async def test_delete_user_current_super_user_error(test_client, superuser_token_headers, test_db):
    async with test_db.pool.acquire() as conn:
        super_user = await user_services.get_user_by_email(
            conn, email=settings.FIRST_SUPERUSER_EMAIL
        )
    assert super_user
    user_id = super_user.id

    response = await test_client.delete(
        f"/users/{user_id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Super users are not allowed to delete themselves"


async def test_delete_user_without_privileges(test_client, normal_user_token_headers, test_user):
    response = await test_client.delete(
        f"/users/{test_user.id}",
        headers=normal_user_token_headers,
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "The user doesn't have enough privileges"
