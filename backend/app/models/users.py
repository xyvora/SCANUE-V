from datetime import datetime

from camel_converter.pydantic_base import CamelBase
from pydantic import EmailStr, Field


class UserBase(CamelBase):
    email: EmailStr = Field(max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str = Field(max_length=255)


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=255)
    openai_api_key: str | None = Field(default=None, max_length=255)


class UserRegister(CamelBase):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=255)
    openai_api_key: str | None = Field(default=None, max_length=255)
    full_name: str = Field(max_length=255)


class UserUpdate(CamelBase):
    email: EmailStr | None = Field(default=None, max_length=255)
    is_active: bool | None = None
    is_superuser: bool | None = None
    password: str | None = Field(default=None, min_length=8, max_length=255)
    openai_api_key: str | None = Field(default=None, max_length=255)
    full_name: str | None = Field(default=None, max_length=255)


class UserUpdateMe(CamelBase):
    email: EmailStr | None = Field(default=None, max_length=255)
    full_name: str | None = Field(default=None, max_length=255)
    openai_api_key: str | None = Field(default=None, max_length=255)


class UpdatePassword(CamelBase):
    current_password: str = Field(min_length=8, max_length=255)
    new_password: str = Field(min_length=8, max_length=255)


class User(UserBase):
    id: str
    hashed_password: str
    hashed_openai_api_key: str


class UserPublic(UserBase):
    id: str


class UsersPublic(CamelBase):
    data: list[UserPublic]
    count: int


class UserInDb(UserBase):
    id: str
    hashed_password: str
    hashed_openai_api_key: str | None
    last_login: datetime
