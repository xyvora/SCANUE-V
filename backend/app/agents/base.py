import asyncio
from abc import ABC, abstractmethod

from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from loguru import logger
from pydantic import SecretStr

from app.core.config import settings
from app.models.agents import AgentState
from app.types import JsonDict


class BaseAgent(ABC):
    """Base class for all PFC agents in the SCANUE-V system."""

    def __init__(self, model: SecretStr):
        """Initialize agent with specific model from environment variable."""
        self.llm = ChatOpenAI(
            model=model.get_secret_value(),
            timeout=30.0,
            max_retries=3,
            api_key=settings.OPENAI_API_KEY,
        )
        self.prompt = self._create_prompt()

    @abstractmethod
    def _create_prompt(self) -> ChatPromptTemplate:
        """Create the prompt template for the agent."""
        pass

    @abstractmethod
    async def process(self, state: AgentState) -> JsonDict:
        """Process the current state and return updated state."""
        try:
            logger.debug(f"Processing state with prompt: {self.prompt}")
            result = await self._process_with_timeout(state)
            logger.debug(f"Received response: {result}")
            return result
        except TimeoutError:
            error_msg = "Request timed out. Please try again."
            logger.debug(f"Error: {error_msg}")
            return {"response": error_msg, "error": True}
        except asyncio.CancelledError:
            error_msg = "Operation was cancelled."
            logger.debug(f"Error: {error_msg}")
            return {"response": error_msg, "error": True}
        except Exception as e:
            error_msg = f"Error processing request: {str(e)}"
            logger.debug(f"Error: {error_msg}")
            return {"response": error_msg, "error": True}

    async def _process_with_timeout(self, state: AgentState) -> JsonDict:
        """Process with timeout handling."""
        try:
            logger.debug("Sending request to OpenAI API...")
            response = await self.llm.ainvoke(
                self.prompt.format_messages(
                    task=state.task,
                    state=state,
                    previous_response=state.previous_response,
                    feedback=state.feedback,
                    feedback_history=state.feedback_history,
                ),
            )
            logger.debug(f"Received API response: {response}")
            return self._format_response(response.content)
        except TimeoutError:
            logger.debug("API request timed out")
            raise

    def _format_response(self, response: str | list[str | dict]) -> JsonDict:
        """Format the response from the LLM."""
        return {"response": response, "error": False}
