from langchain.prompts import ChatPromptTemplate
from loguru import logger

from app.agents.base import BaseAgent
from app.core.config import settings
from app.models.agents import AgentState
from app.types import JsonDict


class DLPFCAgent(BaseAgent):
    """Dorsolateral Prefrontal Cortex Agent - Central Controller"""

    def __init__(self) -> None:
        super().__init__(model=settings.DLPFC_MODEL)

    def _create_prompt(self) -> ChatPromptTemplate:
        template = """You are the Dorsolateral Prefrontal Cortex (DLPFC) Agent, responsible for:
        1. Breaking down complex tasks into subtasks
        2. Delegating subtasks to specialized agents
        3. Integrating responses from all agents

        Current Task: {task}
        Current State: {state}

        Previous Response (if any): {previous_response}
        User Feedback (if any): {feedback}

        Feedback History:
        {feedback_history}

        Consider any feedback provided and adjust your approach accordingly.

        Provide:
        1. list of subtasks (incorporating feedback if relevant)
        2. Agent assignments
        3. Integration plan
        """
        return ChatPromptTemplate.from_template(template)

    async def process(self, state: AgentState) -> JsonDict:
        response = await self.llm.ainvoke(
            self.prompt.format_messages(
                task=state.task,
                state=state,
                previous_response=state.previous_response or "No previous response",
                feedback=state.feedback or "No feedback provided",
                feedback_history=state.feedback_history,
            )
        )

        return _process_response(response.content)


class VMPFCAgent(BaseAgent):
    """Ventromedial Prefrontal Cortex Agent - Emotional Regulation"""

    def __init__(self) -> None:
        super().__init__(model=settings.VMPFC_MODEL)

    def _create_prompt(self) -> ChatPromptTemplate:
        template = """You are the VMPFC Agent, responsible for emotional regulation and risk assessment.

        Task: {task}
        Current State: {state}
        Previous Response: {previous_response}
        Feedback: {feedback}
        Feedback History: {feedback_history}

        Analyze the emotional and risk components of the task.
        """
        return ChatPromptTemplate.from_template(template)

    async def process(self, state: AgentState) -> JsonDict:
        try:
            return await super().process(state)
        except Exception as e:
            logger.error(f"Error in VMPFCAgent processing: {str(e)}")
            return {"error": True, "response": str(e)}


class OFCAgent(BaseAgent):
    """Orbitofrontal Cortex Agent - Reward Processing"""

    def __init__(self) -> None:
        super().__init__(model=settings.OFC_MODEL)

    def _create_prompt(self) -> ChatPromptTemplate:
        template = """You are the OFC Agent, responsible for reward-based decision making.

        Task: {task}
        Current State: {state}
        Previous Response: {previous_response}
        Feedback: {feedback}
        Feedback History: {feedback_history}

        Evaluate potential rewards and outcomes.
        """
        return ChatPromptTemplate.from_template(template)

    async def process(self, state: AgentState) -> JsonDict:
        return await super().process(state)


class ACCAgent(BaseAgent):
    """Anterior Cingulate Cortex Agent - Conflict Detection"""

    def __init__(self) -> None:
        super().__init__(model=settings.ACC_MODEL)

    def _create_prompt(self) -> ChatPromptTemplate:
        template = """You are the ACC Agent, responsible for detecting and resolving conflicts.

        Task: {task}
        Current State: {state}
        Previous Response: {previous_response}
        Feedback: {feedback}
        Feedback History: {feedback_history}

        Identify potential conflicts and propose resolutions.
        """
        return ChatPromptTemplate.from_template(template)

    async def process(self, state: AgentState) -> JsonDict:
        return await super().process(state)


class MPFCAgent(BaseAgent):
    """Medial Prefrontal Cortex Agent - Value-based Decision Making"""

    def __init__(self) -> None:
        super().__init__(model=settings.MPFC_MODEL)

    def _create_prompt(self) -> ChatPromptTemplate:
        template = """You are the MPFC Agent, responsible for value-based decision making.

        Task: {task}
        Current State: {state}
        Previous Response: {previous_response}
        Feedback: {feedback}
        Feedback History: {feedback_history}

        Assess alignment with goals and values, and make final recommendations.
        """
        return ChatPromptTemplate.from_template(template)

    async def process(self, state: AgentState) -> JsonDict:
        return await super().process(state)


def _process_response(response: str | list[str | dict]) -> JsonDict:
    def format_line(text: str) -> str | None:
        if text[0].isdigit() or text[0] in ("-", "*", "•"):
            return text.lstrip("0123456789.-*• ").strip()

        return None

    if isinstance(response, list):
        lines = []
        for r in response:
            if isinstance(r, str):
                split = r.split("\n")
                lines.extend(split)
            else:
                # TODO: need to figure out how to properly handle this
                raise ValueError("Can't handle dicts")
    else:
        lines = response.split("\n")

    subtasks = []
    assignments = []
    integration = []

    for line in lines:
        line = line.strip()
        if not line:
            continue

        formatted_line = format_line(line)
        if line.lower().startswith("subtasks"):
            if formatted_line:
                subtasks.append(formatted_line)
        elif line.lower().startswith("agent assignments"):
            if formatted_line:
                assignments.append(formatted_line)
        elif line.lower().startswith("integration plan"):
            if formatted_line:
                integration.append(formatted_line)

        formatted_response = {
            "subtasks": subtasks,
            "assignments": assignments,
            "integration": integration,
        }

    return formatted_response
