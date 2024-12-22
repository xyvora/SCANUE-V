from pathlib import Path

import asyncpg
from loguru import logger

from app.core.config import settings
from app.core.security import get_password_hash
from app.core.utils import create_db_primary_key
from app.exceptions import NoDbPoolError
from app.services.user_services import get_user_by_email


class Database:
    def __init__(self) -> None:
        self.pool: asyncpg.Pool | None = None

    async def create_pool(self) -> None:
        self.pool = await asyncpg.create_pool(
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD.get_secret_value(),
            database=settings.POSTGRES_DB,
            host=settings.POSTGRES_HOST,
            port=settings.POSTGRES_PORT,
            max_size=10,
        )

    async def close_pool(self) -> None:
        if self.pool:
            await self.pool.close()

    async def _create_migration_table(self) -> None:
        if self.pool is None:
            logger.error("No db pool created")
            raise NoDbPoolError("No db pool created")

        query = """
            CREATE TABLE IF NOT EXISTS schema_migrations (
                version INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                migrated_at TIMESTAMP NOT NULL DEFAULT NOW()
            );
        """

        logger.debug("Creating migration table")
        async with self.pool.acquire() as connection:
            await connection.execute(query)

    async def _get_pending_migrations(self) -> list[dict[str, str | int]]:
        if self.pool is None:
            logger.error("No db pool created")
            raise NoDbPoolError("No db pool created")

        logger.debug("Checking for migrations")
        migrations = []
        try:
            migrations_path = Path().absolute() / "app" / "migrations"
            for path in migrations_path.iterdir():
                if not path.is_file():
                    continue
                migration: dict[str, str | int] = {}
                migration["name"] = path.name
                migration["content"] = path.read_text()
                migration["version"] = int(path.name.split("_")[0])
                migrations.append(migration)
        except FileNotFoundError as e:
            logger.error(f"Error reading migration files: {e}")

        # Get all applied versions
        query = "SELECT version from schema_migrations ORDER BY version ASC"
        async with self.pool.acquire() as connection:
            records = await connection.fetch(query)
            applied_versions = [r["version"] for r in records]

        # Filter out applied migrations
        migrations = [m for m in migrations if m["version"] not in applied_versions]

        if not migrations:
            logger.debug("No new migrations found")
            return migrations

        # Sort migrations by version
        migrations = sorted(migrations, key=lambda m: m["version"])
        logger.debug(f"{len(migrations)} new migrations found")
        return migrations

    async def apply_migrations(self) -> None:
        if self.pool is None:
            raise NoDbPoolError("No db pool available")

        await self._create_migration_table()
        migrations = await self._get_pending_migrations()

        if not migrations:
            return None

        async with self.pool.acquire() as connection:
            async with connection.transaction():
                for migration in migrations:
                    logger.debug(f"Running migration {migration['name']}")
                    await connection.execute(migration["content"])
                    await connection.execute(
                        "INSERT INTO schema_migrations (version, name) VALUES ($1, $2)",
                        migration["version"],
                        migration["name"],
                    )

    async def create_first_superuser(self) -> None:
        if self.pool is None:
            logger.error("No db pool created")
            raise NoDbPoolError("No db pool created")

        async with self.pool.acquire() as connection:
            db_user = await get_user_by_email(connection, email=settings.FIRST_SUPERUSER_EMAIL)

            if db_user:
                if db_user.is_active and db_user.is_superuser:
                    logger.debug("First super user already exists, skipping.")
                    return None
                else:
                    logger.info(
                        f"User with email {settings.FIRST_SUPERUSER_EMAIL} found, but is not active or is not a superuser, updating."
                    )
                    update_query = """
                    UPDATE users
                    SET is_active = true, is_superuser = true
                    WHERE email = $1
                    """

                    await connection.execute(update_query, settings.FIRST_SUPERUSER_EMAIL)

                    return None

            logger.debug(f"User with email {settings.FIRST_SUPERUSER_EMAIL} not found, adding")
            query = """
                INSERT INTO users (
                  id, email, full_name, hashed_password, is_active, is_superuser
                )
                VALUES ($1, $2, $3, $4, $5, $6)
            """

            hashed_password = get_password_hash(
                settings.FIRST_SUPERUSER_PASSWORD.get_secret_value()
            )
            await connection.execute(
                query,
                create_db_primary_key(),
                settings.FIRST_SUPERUSER_EMAIL,
                "Super User",
                hashed_password,
                True,
                True,
            )


db = Database()
