from fastapi import HTTPException
from loguru import logger
from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR

from app.api.deps import CurrentUser
from app.core.config import settings
from app.core.utils import APIRouter
from app.models.scan import AnalysisReport, Topic
from app.scan.graph import CustomGraph

router = APIRouter(tags=["SCAN"], prefix=f"{settings.API_V1_PREFIX}/scan")


@router.post("/")
async def ask_question(*, topic: Topic, _: CurrentUser) -> AnalysisReport:
    """Ask SCAN for help with a questions."""

    graph = CustomGraph(topic.topic)
    try:
        logger.debug("Preparing analysis")
        analysis = await graph.execute()
    except Exception as e:
        logger.error(f"An error occurred while answering question: {e}")
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred when getting an answer",
        ) from e

    return analysis
