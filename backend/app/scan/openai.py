from collections.abc import Iterable

from openai import AsyncOpenAI
from openai.types.chat import ChatCompletionMessageParam

from app.core.config import settings


class OpenAIWrapper:
    """Wrapper for OpenAI API interactions."""

    def __init__(self, model_name: str):
        self.model_name = model_name
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    async def create_chat_completion(
        self,
        messages: Iterable[ChatCompletionMessageParam],
        max_tokens: int = settings.MAX_TOKENS,
        temperature: float = settings.TEMPERATURE,
    ) -> str | None:
        """Create a chat completion with error handling."""

        response = await self.client.chat.completions.create(
            model=self.model_name,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature,
        )

        if not response.choices[0].message.content:
            return None

        return response.choices[0].message.content.strip()
