# openai_wrapper.py

from typing import List, Dict, Any
from openai import OpenAI
from config import settings

class OpenAIWrapper:
    """Wrapper for OpenAI API interactions."""
    
    def __init__(self, model_name: str):
        self.model_name = model_name
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)

    def create_chat_completion(
        self,
        messages: List[Dict[str, str]],
        max_tokens: int = settings.MAX_TOKENS,
        temperature: float = settings.TEMPERATURE
    ) -> str:
        """Create a chat completion with error handling."""
        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"Error in chat completion: {str(e)}"
