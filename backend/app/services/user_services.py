from __future__ import annotations

from typing import TYPE_CHECKING

from app.core.security import get_password_hash, verify_password
from app.core.utils import create_db_primary_key
from app.exceptions import DbInsertError, DbUpdateError
from app.models.users import (
    UpdatePassword,
    UserCreate,
    UserInDb,
    UserPublic,
    UserUpdate,
    UserUpdateMe,
)

if TYPE_CHECKING:
    from asyncpg import Connection as DbConnection


async def authenticate(conn: DbConnection, *, email: str, password: str) -> UserInDb | None:
    db_user = await get_user_by_email(conn, email=email)

    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None

    return db_user


async def create_user(conn: DbConnection, *, user: UserCreate) -> UserInDb:
    query = """
    INSERT INTO users (
        id,
        email,
        full_name,
        hashed_password,
        is_active,
        is_superuser
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
    """

    new_id = await conn.fetchval(
        query,
        create_db_primary_key(),
        user.email,
        user.full_name,
        get_password_hash(user.password),
        user.is_active,
        user.is_superuser,
    )

    result = await get_user_by_id(conn, user_id=new_id)

    if not result:
        raise DbInsertError("Unable to find user after inserting")

    return result


async def delete_user(conn: DbConnection, *, user_id: str) -> None:
    query = "DELETE FROM users WHERE id = $1"
    await conn.execute(query, user_id)


async def get_users(conn: DbConnection, *, offset: int, limit: int) -> list[UserInDb] | None:
    query = """
    SELECT id,
        email,
        full_name,
        hashed_password,
        hashed_openai_api_key,
        is_active,
        is_superuser,
        last_login
    FROM users
    OFFSET $1
    LIMIT $2
    """

    results = await conn.fetch(query, offset, limit)

    if not results:
        return None

    return [UserInDb(**x) for x in results]


async def get_users_public(
    conn: DbConnection,
    *,
    offset: int,
    limit: int,
) -> list[UserPublic] | None:
    db_users = await get_users(conn, offset=offset, limit=limit)
    if not db_users:
        return None

    public_users = []
    for user in db_users:
        public_users.append(UserPublic(**user.model_dump()))

    return public_users


async def get_user_by_email(conn: DbConnection, *, email: str) -> UserInDb | None:
    query = """
    SELECT id,
        email,
        full_name,
        hashed_password,
        hashed_openai_api_key,
        is_active,
        is_superuser,
        last_login
    FROM users
    WHERE email = $1
    """
    db_user = await conn.fetchrow(query, email)

    if not db_user:
        return None

    return UserInDb(**db_user)


async def get_user_public_by_email(conn: DbConnection, *, email: str) -> UserPublic | None:
    db_user = await get_user_by_email(conn, email=email)
    if not db_user:
        return None

    return UserPublic(**db_user.model_dump())


async def get_user_by_id(conn: DbConnection, *, user_id: str) -> UserInDb | None:
    query = """
    SELECT id,
        email,
        full_name,
        hashed_password,
        hashed_openai_api_key,
        is_active,
        is_superuser,
        last_login
    FROM users
    WHERE id = $1
    """
    db_user = await conn.fetchrow(query, user_id)

    if not db_user:
        return None

    return UserInDb(**db_user)


async def get_user_public_by_id(conn: DbConnection, *, user_id: str) -> UserPublic | None:
    db_user = await get_user_by_id(conn, user_id=user_id)
    if not db_user:
        return None

    return UserPublic(**db_user.model_dump())


async def update_user(
    conn: DbConnection,
    *,
    db_user: UserInDb,
    user_in: UserUpdate | UserUpdateMe | UpdatePassword,
) -> UserInDb:
    if isinstance(user_in, UpdatePassword):
        query = """
        UPDATE users
        SET hashed_password=$1
        WHERE id = $2
        """

        await conn.execute(query, get_password_hash(user_in.new_password), db_user.id)
    else:
        user_data = user_in.model_dump(exclude_unset=True)
        if "password" in user_data:
            user_data["hashed_password"] = get_password_hash(user_data.pop("password"))
        if "openai_api_key" in user_data:
            user_data["hashed_openai_api_key"] = get_password_hash(user_data.pop("openai_api_key"))
        set_clause = ", ".join([f"{key} = ${i+2}" for i, key in enumerate(user_data.keys())])
        query = f"""
        UPDATE users
        SET {set_clause}
        WHERE id = $1
        """

        await conn.execute(query, db_user.id, *user_data.values())

    updated_user = await get_user_by_id(conn, user_id=db_user.id)

    if not updated_user:
        raise DbUpdateError("Unable to find user after updating")

    return updated_user
