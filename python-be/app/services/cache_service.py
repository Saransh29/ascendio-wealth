import redis.asyncio as redis
import os
from dotenv import load_dotenv

load_dotenv()

class CacheService:
    def __init__(self):
        redis_host = os.getenv('REDIS_HOST')
        redis_port = os.getenv('REDIS_PORT', 6379)
        redis_password = os.getenv('REDIS_PASSWORD')

        if not all([redis_host, redis_password]):
            raise ValueError("REDIS_HOST and REDIS_PASSWORD environment variables must be set")

        self.redis_url = f"redis://{redis_host}:{redis_port}"
        self.redis_password = redis_password
        self.redis_port = redis_port
        self.redis_host = redis_host

    async def get_connection(self):
        return await redis.Redis(host=self.redis_host, port=self.redis_port, password=self.redis_password, ssl=True)

    async def get(self, key: str) -> str:
        redis_conn = await self.get_connection()
        try:
            return await redis_conn.get(key)
        finally:
            await redis_conn.close()

    async def set(self, key: str, value: str, expiration: int = 3600):
        redis_conn = await self.get_connection()
        try:
            await redis_conn.setex(key, expiration, value)
        finally:
            await redis_conn.close()