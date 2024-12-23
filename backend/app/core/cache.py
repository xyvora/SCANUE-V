import valkey.asyncio as valkey

from app.core.config import settings


class Cache:
    def __init__(self) -> None:
        self._pool: valkey.ConnectionPool | None = None
        self.client: valkey.Valkey | None = None

    async def create_client(self) -> None:
        self._pool = await self._create_pool()
        self.client = valkey.Valkey.from_pool(self._pool)

    async def close_client(self) -> None:
        if self.client:
            await self.client.aclose()

        if self._pool:
            await self._pool.aclose()

    async def _create_pool(self) -> valkey.ConnectionPool:
        return valkey.ConnectionPool(
            host=settings.VALKEY_HOST,
            port=settings.VALKEY_PORT,
            password=settings.VALKEY_PASSWORD.get_secret_value(),
            db=0,
        )

    async def _close_pool(self) -> None:
        if self._pool:
            await self._pool.aclose()


cache = Cache()
