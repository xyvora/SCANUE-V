from camel_converter.pydantic_base import CamelBase


class SubTask(CamelBase):
    task: str
    category: str = "general"
    agent: str | None = None


class AgentState(CamelBase):
    task: str
    stage: str
    response: str | None = None
    subtasks: list[str] | None = None
    feedback: str | None = None
    previous_response: str | None = None
    feedback_history: list[str] | None = None
    scanaq_results: str | None = None


class Topic(CamelBase):
    topic: str
