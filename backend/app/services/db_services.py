from asyncpg import Connection


async def ping(conn: Connection) -> None:
    await conn.execute("SELECT 1")
