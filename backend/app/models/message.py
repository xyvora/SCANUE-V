from camel_converter.pydantic_base import CamelBase


class Message(CamelBase):
    """Used for generic messages."""

    message: str
