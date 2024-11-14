from fastapi import Depends, HTTPException
from loguru import logger
from starlette.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND,
    HTTP_409_CONFLICT,
    HTTP_500_INTERNAL_SERVER_ERROR,
)

from app.api.deps import CurrentUser, DbConn, get_current_active_superuser
from app.core.config import settings
from app.core.security import verify_password
from app.core.utils import APIRouter
from app.models.message import Message
from app.models.users import (
    UpdatePassword,
    UserCreate,
    UserInDb,
    UserPublic,
    UserRegister,
    UsersPublic,
    UserUpdate,
    UserUpdateMe,
)
from app.services import user_services

router = APIRouter(tags=["Users"], prefix=f"{settings.API_V1_PREFIX}/users")


@router.get("/", dependencies=[Depends(get_current_active_superuser)])
async def read_users(*, db_conn: DbConn, offset: int = 0, limit: int = 100) -> UsersPublic:
    """Retrieve users."""

    logger.debug(f"Getting users with offset {offset} and limit {limit}")
    try:
        users = await user_services.get_users_public(db_conn, offset=offset, limit=limit)
    except Exception as e:
        logger.error(
            f"An error occurred while retrieving users with skip: {offset} and limit: {limit}: {e}"
        )
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving users",
        ) from e

    count = len(users) if users else 0
    data = users if users else []

    return UsersPublic(data=data, count=count)


@router.post("/", dependencies=[Depends(get_current_active_superuser)], response_model=UserPublic)
async def create_user(*, db_conn: DbConn, user_in: UserCreate) -> UserInDb:
    """Create a new user."""

    logger.debug("Creating new user")
    try:
        user = await user_services.get_user_by_email(db_conn, email=user_in.email)
    except Exception as e:
        logger.error(
            f"An error occurred while checking if the email {user_in.email} already exists for creating a user: {e}"
        )
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the user.",
        ) from e

    if user:
        logger.debug(f"User with email address {user_in.email} already exists")
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists in the system",
        )

    try:
        created_user = await user_services.create_user(db_conn, user=user_in)
    except Exception as e:
        logger.error(
            f"An error occurred while creating the user with email address {user_in.email}: {e}"
        )
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the user",
        ) from e

    return created_user


@router.patch("/me", response_model=UserPublic)
async def update_user_me(
    *, db_conn: DbConn, user_in: UserUpdateMe, current_user: CurrentUser
) -> UserInDb:
    """Update own user."""

    logger.debug("Updating current user")
    if user_in.email:
        try:
            existing_user = await user_services.get_user_by_email(db_conn, email=user_in.email)
        except Exception as e:
            logger.error(
                f"An error occurred while updating me, checking if the email already exists: {e}"
            )
            raise HTTPException(
                status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while updating the user",
            ) from e

        if existing_user and existing_user.id != current_user.id:
            logger.debug(f"User with email address {user_in.email} already exists")
            raise HTTPException(
                status_code=HTTP_409_CONFLICT,
                detail="A user with this email address already exists",
            )

    try:
        updated_user = await user_services.update_user(
            db_conn, db_user=current_user, user_in=user_in
        )
    except Exception as e:
        logger.error(f"An error occurred while updating me: {e}")
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating the user",
        ) from e

    return updated_user


@router.patch("/me/password")
async def update_password_me(
    *,
    db_conn: DbConn,
    user_in: UpdatePassword,
    current_user: CurrentUser,
) -> Message:
    """Update own password."""

    if not verify_password(user_in.current_password, current_user.hashed_password):
        logger.debug("Passwords do not match")
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Incorrect password")
    if user_in.current_password == user_in.new_password:
        logger.debug("Password not changed")
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail="New password cannot be the same as the current one",
        )

    try:
        logger.debug("Updating password")
        await user_services.update_user(db_conn, db_user=current_user, user_in=user_in)
    except Exception as e:
        logger.error(f"An error occurred updating the password: {e}")
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating the password",
        ) from e

    return Message(message="Password updated successfully")


@router.get("/me", response_model=UserPublic)
async def read_user_me(*, current_user: CurrentUser) -> UserInDb:
    """Get current user."""

    return current_user


@router.delete("/me")
async def delete_user_me(*, db_conn: DbConn, current_user: CurrentUser) -> Message:
    """Delete own user."""

    logger.debug("Deleting current user")
    if current_user.is_superuser:
        logger.debug("Super users are not allowed to delete themselves")
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN,
            detail="Super users are not allowed to delete themselves",
        )

    try:
        await user_services.delete_user(db_conn, user_id=current_user.id)
    except Exception as e:
        logger.error(f"An error occurred while deleting the user: {e}")
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while deleting the user",
        ) from e
    return Message(message="User deleted successfully")


@router.post("/signup", response_model=UserPublic)
async def register_user(*, db_conn: DbConn, user_in: UserRegister) -> UserInDb:
    """Create new user without the need to be logged in."""

    logger.debug("Registering user")
    try:
        user = await user_services.get_user_by_email(db_conn, email=user_in.email)
    except Exception as e:
        logger.error(
            f"An error occurred while checking if user with email {user_in.email} exists for registering: {e}"
        )
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred while registering"
        ) from e

    if user:
        logger.debug(f"User with email address {user_in.email} already exists")
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail="The user with this email already exists in the system",
        )
    user_create = UserCreate(**user_in.model_dump())
    try:
        created_user = await user_services.create_user(db_conn, user=user_create)
    except Exception as e:
        logger.error(f"An error occurred while creating the user in registration: {e}")
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred while registering"
        ) from e

    return created_user


@router.get("/{user_id}")
async def read_user_by_id(
    *, db_conn: DbConn, user_id: str, current_user: CurrentUser
) -> UserPublic:
    """Get a specific user by id."""

    logger.debug(f"Getting user with id {user_id}")
    try:
        user = await user_services.get_user_public_by_id(db_conn, user_id=user_id)
    except Exception as e:
        logger.error(f"An error occurred while retrieving user with id {user_id}: {e}")
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving the user",
        ) from e

    if user is None:
        logger.debug(f"User with id {user_id} not found")
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="The user with this id does not exist in the system",
        )

    if user.id == current_user.id:
        return user
    if not current_user.is_superuser:
        logger.debug("Current user is not an admin and does not have enough provileges to get user")
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges",
        )
    return user


@router.patch(
    "/{user_id}",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=UserPublic,
)
async def update_user(
    *,
    db_conn: DbConn,
    user_id: str,
    user_in: UserUpdate,
) -> UserInDb:
    """Update a user."""

    logger.debug(f"Updating user {user_id}")
    try:
        db_user = await user_services.get_user_by_id(db_conn, user_id=user_id)
    except Exception as e:
        logger.error(f"An error occurred while retrieving user {user_id} for updating: {e}")
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving the user for updating",
        ) from e

    if not db_user:
        logger.debug(f"User with id {user_id} not found")
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="The user with this id does not exist in the system",
        )
    if user_in.email:
        existing_user = await user_services.get_user_by_email(db_conn, email=user_in.email)
        if existing_user and existing_user.id != user_id:
            logger.debug(f"A user with email {user_in.email} already exists")
            raise HTTPException(
                status_code=HTTP_409_CONFLICT, detail="User with this email already exists"
            )

    try:
        db_user = await user_services.update_user(db_conn, db_user=db_user, user_in=user_in)
    except Exception as e:
        logger.error(f"An error occurred while updating user {user_id}: {e}")
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating the user",
        ) from e

    return db_user


@router.delete("/{user_id}", dependencies=[Depends(get_current_active_superuser)])
async def delete_user(*, db_conn: DbConn, current_user: CurrentUser, user_id: str) -> Message:
    """Delete a user."""

    logger.debug(f"Deleting user with id {user_id}")
    try:
        user = await user_services.get_user_by_id(db_conn, user_id=user_id)
    except Exception as e:
        logger.error(f"An error occurred while retrieving user {user_id} for deleting: {e}")
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving the user for deleting",
        ) from e

    if not user:
        logger.debug(f"User with id {user_id} not found")
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="User not found")
    if user == current_user:
        logger.debug("Super users are not allowed to delete themselves")
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN,
            detail="Super users are not allowed to delete themselves",
        )
    try:
        await user_services.delete_user(db_conn, user_id=user_id)
    except Exception as e:
        logger.error(f"An error occurred while delete the user: {e}")
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while deleting the user",
        ) from e
    return Message(message="User deleted successfully")
