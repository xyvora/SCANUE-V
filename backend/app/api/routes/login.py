from datetime import timedelta
from typing import Annotated, Any

from fastapi import Depends, HTTPException, Response
from fastapi.security import OAuth2PasswordRequestForm
from loguru import logger
from starlette.status import HTTP_400_BAD_REQUEST

from app.api.deps import CurrentUser, DbConn
from app.core import security
from app.core.config import settings
from app.core.utils import APIRouter
from app.models.token import Token
from app.models.users import UserPublic
from app.services import user_services

router = APIRouter(tags=["Login"], prefix=f"{settings.API_V1_PREFIX}")


@router.post("/login/access-token")
async def login_access_token(
    *, response: Response, conn: DbConn, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    """OAuth2 compatible token login, get an access token for future requests."""

    logger.debug("Authenticating user")
    user = await user_services.authenticate(
        conn, email=form_data.username, password=form_data.password
    )
    if not user:
        logger.debug("Incorrect email or password")
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Incorrect email or password")
    elif not user.is_active:
        logger.debug("Inactive user")
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Inactive user")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    access_token = security.create_access_token(str(user.id), expires_delta=access_token_expires)

    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        secure=settings.PRODUCTION_MODE,
    )

    return Token(access_token=access_token)


@router.post("/login/test-token", response_model=UserPublic)
async def test_token(*, current_user: CurrentUser) -> Any:
    """Test access token."""
    return current_user
