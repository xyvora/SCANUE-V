import sys
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.responses import ORJSONResponse
from loguru import logger

from app.api.router import api_router
from app.core.cache import cache
from app.core.config import settings
from app.core.db import db

logger.remove()  # Remove the default logger so log level can be set
if settings.LOG_TO_SCREEN_AND_FILE or settings.LOG_PATH is None:
    logger.add(sys.stderr, level=settings.LOG_LEVEL)
if settings.LOG_PATH:
    logger.add(settings.LOG_PATH, level=settings.LOG_LEVEL)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncGenerator:
    logger.info("Initalizing database connection pool")
    try:
        await db.create_pool()
    except Exception as e:
        logger.error(f"Error creating db connection pool: {e}")
        raise

    logger.info("Running database migrations")
    try:
        await db.apply_migrations()
    except Exception as e:
        logger.error(f"Error applying migrations: {e}")
        raise

    logger.info("Saving first superuser")
    try:
        await db.create_first_superuser()
    except Exception as e:
        logger.error(f"Error creating first superuser: {e}")
        raise e

    logger.info("Initializing cache client")
    try:
        await cache.create_client()
    except Exception as e:
        logger.error(f"Error creating cache client: {e}")
        raise

    yield
    logger.info("Closing database connection pool")
    try:
        await db.close_pool()
    except Exception as e:
        logger.error(f"Error closing db connection pool: {e}")
        raise


app = FastAPI(
    title=settings.TITLE,
    lifespan=lifespan,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    default_response_class=ORJSONResponse,
)

app.include_router(api_router)
