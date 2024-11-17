from collections.abc import Callable, Coroutine
from functools import cached_property
from typing import Annotated, Any, TypedDict, cast

from langchain.tools import Tool
from langchain_core.messages import AIMessage
from langgraph.prebuilt import ToolNode

from app.core.config import settings
from app.scan.openai import OpenAIWrapper
from app.types import RoleName


class AgentState(TypedDict):
    current_role: RoleName
    input: str
    history: list[tuple[str, str]]  # List of (role, message) tuples
    next: str | None


class ToolInput(TypedDict):
    input: str  # The topic or content to analyze
    history: list[tuple[str, str]]  # List of (role, message) tuples
    role: str  # The PFC role performing the analysis


class AgentConfig(TypedDict):
    role: str
    model: str
    backstory: str
    goal: str
    temperature: float
    max_tokens: int


class RolesConfig(TypedDict):
    DLPFC: AgentConfig
    VMPFC: AgentConfig
    OFC: AgentConfig
    ACC: AgentConfig
    MPFC: AgentConfig


class PFCAgents:
    """Implements a network of PFC region agents that collaborate in cognitive processing.

    Each agent represents a distinct prefrontal cortex region with specialized functions.
    """

    def __init__(self, topic: str) -> None:
        self.topic = topic

    @cached_property
    def agents(
        self,
    ) -> dict[RoleName, Callable[[AgentState], Coroutine[None, None, AgentState]]]:
        agents_dict = {}
        for role in ("DLPFC", "VMPFC", "OFC", "ACC", "MPFC"):
            agents_dict[cast(RoleName, role)] = self.create_agent_function(cast(RoleName, role))

        return agents_dict

    def create_agent_function(
        self, role_name: RoleName
    ) -> Callable[[AgentState], Coroutine[None, None, AgentState]]:
        config = self.create_agent(role_name)

        async def agent_function(state: AgentState) -> AgentState:
            current_input = state["input"]
            history = state["history"]

            context_messages = []
            for role, message in history:
                context_messages.append(f"{role}:\n{message}\n")
            context = "\n".join(context_messages) if context_messages else ""

            messages = [
                {"role": "system", "content": config["backstory"] + "\n" + config["goal"]},
                {
                    "role": "user",
                    "content": (
                        f"Previous Analysis:\n{context}\n\n"
                        f"Current Topic: {current_input}\n\n"
                        f"Provide your analysis as {role_name}, considering the previous analyses "
                        f"and focusing on your specific role in the decision-making process."
                    ),
                },
            ]

            llm_response = await config["llm"].create_chat_completion(
                messages=messages,
                max_tokens=settings.MAX_TOKENS,
                temperature=settings.TEMPERATURE,
            )

            tool_response = await config["tool_node"].ainvoke(
                {"messages": [AIMessage(content=llm_response, history=history, role=role_name)]}
            )
            next_agent = _determine_next_agent(role_name)

            return AgentState(
                current_role=role_name,
                input=tool_response,
                history=history + [(role_name, tool_response["messages"])],
                next=next_agent,
            )

        return agent_function

    def create_agent(self, role_name: RoleName) -> dict[str, Any]:
        """Creates base agent configuration with enhanced setup."""
        model_name = getattr(settings, f"{role_name}_MODEL")
        client = OpenAIWrapper(model_name=model_name)
        tools = _get_tools(role_name)
        tool_node = ToolNode(tools)
        backstory = _get_backstory(role_name)
        goal = _get_goal(role_name)

        return {
            "role": role_name,
            "llm": client,
            "tools": tools,
            "tool_node": tool_node,
            "backstory": f"You are the {role_name}, specializing in {backstory} for the topic '{self.topic}'.",
            "goal": goal,
        }

    def communicate(self, state: AgentState) -> AgentState:
        state["next"] = _determine_next_agent(cast(RoleName, state["current_role"]))

        return state


def _get_prompt_templates(context: str, topic: str, role_name: RoleName) -> dict[str, str]:
    return {
        "analysis": f"""
        Previous Analysis:
        {context}

        Current Topic: {topic}
        Role: {role_name}

        Instructions:
        1. Review previous analyses if available
        2. Analyze from your role's perspective
        3. Consider interactions with other PFC regions
        4. Provide structured insights

        Format your response with clear sections and bullet points.
        """,
        "integration": """
        As the DLPFC, integrate the following analyses:
        {context}

        Focus on:
        1. Key patterns and insights
        2. Conflicts or contradictions
        3. Integrated recommendations
        4. Next steps
        """,
        "error": "Error in {role} processing: {error}",
    }


async def _complex_analyzer(
    tool_input: Annotated[ToolInput, "Input for complex analysis"],
) -> str:
    return await _build_analyzer(tool_input, "analysis", settings.DLPFC_MODEL)


async def _integration_analyzer(
    tool_input: Annotated[ToolInput, "Input for integration analysis"],
) -> str:
    return await _build_analyzer(tool_input, "integration", settings.MPFC_MODEL)


async def _emotional_analyzer(
    tool_input: Annotated[ToolInput, "Input for emotional analysis"],
) -> str:
    return await _build_analyzer(tool_input, "emotional", settings.VMPFC_MODEL)


async def _reward_analyzer(
    tool_input: Annotated[ToolInput, "Input for reward analysis"],
) -> str:
    return await _build_analyzer(tool_input, "reward", settings.OFC_MODEL)


async def _conflict_analyzer(
    tool_input: Annotated[ToolInput, "Input for conflict analysis"],
) -> str:
    return await _build_analyzer(tool_input, "conflict", settings.ACC_MODEL)


async def _social_analyzer(
    tool_input: Annotated[ToolInput, "Input for social analysis"],
) -> str:
    return await _build_analyzer(tool_input, "social", settings.MPFC_MODEL)


async def _build_analyzer(tool_input: ToolInput, prompt_template: str, model: str) -> str:
    topic = tool_input["input"]
    role = tool_input["role"]
    history = tool_input["history"]
    context_messages = [f"{prev_role}:\n{message}\n" for prev_role, message in history]
    context = "\n".join(context_messages) if context_messages else ""
    prompt_template = _get_prompt_templates(context, topic, cast(RoleName, role))[prompt_template]
    prompt = prompt_template.format(context=context, role=role, topic=topic)
    openai_wrapper = OpenAIWrapper(model_name=model)
    analysis_report = await openai_wrapper.create_chat_completion(
        messages=[
            {
                "role": "system",
                "content": f"You are the {role}, focusing on specialized analysis. "
                f"Format your response with clear sections and bullet points.",
            },
            {"role": "user", "content": prompt},
        ],
        max_tokens=settings.MAX_TOKENS,
        temperature=settings.TEMPERATURE,
    )
    return f"{role} Analysis:\n{analysis_report}"


def _get_tools(role_name: RoleName) -> list[Tool]:
    tools = [
        Tool(
            name="complex_analyzer",
            description="Conducts comprehensive analysis based on role specialization",
            func=None,  # langchain forces you to set this to None when using a coroutine
            coroutine=_complex_analyzer,
            input_schema=ToolInput,
        )
    ]

    if role_name == "DLPFC":
        tools.append(
            Tool(
                name="integration_analyzer",
                description="Integrates information from other PFC regions",
                func=None,
                coroutine=_integration_analyzer,
                input_schema=ToolInput,
            )
        )
        return tools

    if role_name == "VMPFC":
        tools.append(
            Tool(
                name="emotional_analyzer",
                description="Analyzes emotional implications",
                func=None,
                coroutine=_emotional_analyzer,
                input_schema=ToolInput,
            )
        )
        return tools

    if role_name == "OFC":
        tools.append(
            Tool(
                name="reward_analyzer",
                description="Analyzes reward implications",
                func=None,
                coroutine=_reward_analyzer,
                input_schema=ToolInput,
            )
        )
        return tools

    if role_name == "ACC":
        tools.append(
            Tool(
                name="confict_analyzer",
                description="Analyzes conflict implications",
                func=None,
                coroutine=_conflict_analyzer,
                input_schema=ToolInput,
            )
        )
        return tools

    tools.append(
        Tool(
            name="social_analyzer",
            description="Analyzes social implications",
            func=None,
            coroutine=_social_analyzer,
            input_schema=ToolInput,
        )
    )

    return tools


def _determine_next_agent(current_role: RoleName) -> str | None:
    if current_role == "DLPFC":
        return "VMPFC"
    elif current_role == "VMPFC":
        return "OFC"
    elif current_role == "OFC":
        return "ACC"
    elif current_role == "ACC":
        return "MPFC"
    else:
        return None


def _get_backstory(role_name: RoleName) -> str:
    if role_name == "DLPFC":
        return "executive functions including working memory, planning, and cognitive control. You integrate information to guide complex decision-making and regulate behavior."
    elif role_name == "VMPFC":
        return "processing emotional value and risk assessment. You evaluate the emotional significance of choices and predict their emotional outcomes."
    elif role_name == "OFC":
        return "reward processing and value-based decision making. You integrate sensory and emotional information to evaluate rewards and guide behavior optimization."
    elif role_name == "ACC":
        return "error detection, conflict monitoring, and emotional regulation. You identify conflicts between competing responses and help regulate emotional reactions."
    else:
        return "self-referential thinking and social cognition. You process information about self and others, supporting social decision-making and perspective-taking."


def _get_goal(role_name: RoleName) -> str:
    if role_name == "DLPFC":
        return "Analyze the situation using executive control, maintain relevant information in working memory, and develop strategic plans for optimal outcomes."
    elif role_name == "VMPFC":
        return "Evaluate the emotional implications and risks, considering how different choices might affect emotional wellbeing and social relationships."
    elif role_name == "OFC":
        return "Assess the reward value of different options, integrate sensory and emotional information, and optimize decision-making for maximum benefit."
    elif role_name == "ACC":
        return "Monitor for conflicts between competing options, detect potential errors, and help regulate emotional responses to support optimal choices."
    else:
        return "Consider social and self-relevant implications, integrate personal and social knowledge, and support perspective-taking in decision-making."
