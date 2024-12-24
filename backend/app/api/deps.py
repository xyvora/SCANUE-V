from collections.abc import AsyncGenerator
from typing import Annotated

import asyncpg
import jwt
import valkey.asyncio as valkey
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from loguru import logger
from pydantic import ValidationError
from starlette.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND,
    HTTP_503_SERVICE_UNAVAILABLE,
)

from app.core.cache import cache
from app.core.config import settings
from app.core.db import db
from app.core.security import ALGORITHM
from app.models.token import TokenPayload
from app.models.users import UserInDb
from app.services.user_services import get_user_by_id

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_PREFIX}/login/access-token")
TokenDep = Annotated[str, Depends(reusable_oauth2)]


async def get_db_conn() -> AsyncGenerator[asyncpg.Connection]:
    if db.pool is None:
        logger.error("No database pool created")
        raise HTTPException(
            status_code=HTTP_503_SERVICE_UNAVAILABLE, detail="The database is currently unavailable"
        )
    async with db.pool.acquire() as connection:
        yield connection


DbConn = Annotated[asyncpg.Connection, Depends(get_db_conn)]


async def get_cache_client() -> AsyncGenerator[valkey.Valkey]:
    if cache.client is None:
        logger.error("No cache client created")
        raise HTTPException(
            status_code=HTTP_503_SERVICE_UNAVAILABLE, detail="The cache is currently unavailable"
        )

    yield cache.client


CacheClient = Annotated[valkey.Valkey, Depends(get_cache_client)]


async def get_current_user(conn: DbConn, token: TokenDep) -> UserInDb:
    try:
        logger.debug("Decoding JWT token")
        payload = jwt.decode(
            token, key=settings.SECRET_KEY.get_secret_value(), algorithms=[ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (InvalidTokenError, ValidationError) as e:
        logger.debug(f"Error decoding token: {e}")
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        ) from e
    if not token_data.sub:
        logger.debug("Token does not countain sub data")
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN, detail="Count not validate credientials"
        )
    user_id = token_data.sub
    user = await get_user_by_id(conn, user_id=user_id)
    if not user:
        logger.debug("User not found")
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="User not found")
    if not user.is_active:
        logger.debug("User is inactive")
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Inactive user")
    return user


CurrentUser = Annotated[UserInDb, Depends(get_current_user)]


def get_current_active_superuser(current_user: CurrentUser) -> UserInDb:
    if not current_user.is_superuser:
        logger.debug("The current user is not a super user")
        raise HTTPException(status_code=403, detail="The user doesn't have enough privileges")
    return current_user
