from pydantic import BaseModel


class Token(BaseModel):
    """Don't use CamelBase here because FastAPI requires snake case vairables for the token."""

    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """Contents of the JWT token."""

    sub: str | None = None
