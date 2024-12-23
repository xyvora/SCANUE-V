from loguru import logger

from app.api.deps import CacheClient, DbConn
from app.core.config import settings
from app.core.utils import APIRouter
from app.services.db_services import ping

router = APIRouter(
    tags=["Health"], prefix=f"{settings.API_V1_PREFIX}/health", include_in_schema=False
)


@router.get("/")
async def health(*, cache_client: CacheClient, db_conn: DbConn) -> dict[str, str]:
    """Check the health of the server."""

    logger.debug("Checking health")
    health = {"server": "healthy"}

    logger.debug("Checking db health")
    try:
        await ping(db_conn)
        health["db"] = "healthy"
    except Exception as e:
        logger.error(f"Unable to ping the database: {e}")
        health["db"] = "unhealthy"

    logger.debug("Checking cache health")
    try:
        await cache_client.ping()
        health["cache"] = "healthy"
    except Exception as e:
        logger.error(f"Unable to ping the cache server: {e}")
        health["cache"] = "unhealthy"

    return health
