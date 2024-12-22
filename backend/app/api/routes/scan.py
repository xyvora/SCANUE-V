from fastapi import HTTPException
from loguru import logger
from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR

from app.agents.workflow import create_workflow
from app.api.deps import CurrentUser
from app.core.config import settings
from app.core.utils import APIRouter
from app.models.agents import AgentState, Topic

router = APIRouter(tags=["SCAN"], prefix=f"{settings.API_V1_PREFIX}/scan")


@router.post("/")
async def ask_question(*, topic: Topic, _: CurrentUser) -> AgentState:
    """Ask SCAN for help with a questions."""

    initial_state = AgentState(task=topic.topic, stage="task_delegation")
    workflow = create_workflow()

    try:
        state = await workflow.ainvoke(initial_state.model_dump())
    except Exception as e:
        logger.error(f"An error occurred while answering question: {e}")
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred when getting an answer",
        ) from e

    return AgentState(**state)
