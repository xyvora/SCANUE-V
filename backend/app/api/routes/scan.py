from copy import deepcopy

import orjson
from fastapi import HTTPException
from loguru import logger
from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR

from app.agents.workflow import create_workflow
from app.api.deps import CacheClient, CurrentUser
from app.core.config import settings
from app.core.utils import APIRouter
from app.models.agents import AgentState, Topic

router = APIRouter(tags=["SCAN"], prefix=f"{settings.API_V1_PREFIX}/scan")


@router.post("/")
async def ask_question(*, topic: Topic, cache_client: CacheClient, user: CurrentUser) -> AgentState:
    """Ask SCAN for help with a questions."""

    cache = await cache_client.get(name=f"{user.id}-agent-state")  # type: ignore[misc]
    initial_state = (
        AgentState(**orjson.loads(cache))
        if cache
        else AgentState(task=topic.topic, stage="task_delegation")
    )
    initial_state.stage = "task_delegation"

    workflow = create_workflow()

    try:
        state = await workflow.ainvoke(initial_state.model_dump())
    except Exception as e:
        logger.error(f"An error occurred while answering question: {e}")
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred when getting an answer",
        ) from e

    current_state = AgentState(**state)

    try:
        cache_state = deepcopy(current_state)
        cache_state.previous_response = current_state.response
        # 5 minute TTL cache
        await cache_client.set(  # type: ignore[misc]
            name=f"{user.id}-agent-state", value=cache_state.model_dump_json(), ex=300
        )
    except Exception as e:
        logger.error(f"An error occurred while caching the agent state for user {user.id}: {e}")

    return current_state
