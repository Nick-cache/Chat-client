from pydantic_settings import BaseSettings
from pydantic import Field
from datetime import timezone
from pytz import timezone as tz


class AppSettings(BaseSettings):
    host: str = Field(alias="FASTAPI_HOST")
    port: int = Field(alias="FASTAPI_PORT")
    reload: bool = Field(alias="FASTAPI_RELOAD")
    workers: int = Field(alias="FASTAPI_WORKERS")


class RedisSettings(BaseSettings):
    host: str = Field(alias="REDIS_HOST")
    port: str = Field(alias="REDIS_PORT")
    broker_idx: int = Field(alias="REDIS_BROKER")
    cache_idx: int = Field(alias="REDIS_CACHE")


class PostgresSettings(BaseSettings):
    uri: str = Field(alias="POSTGRES_URI")

    @property
    def sync_url(self) -> str:
        return f"postgresql://{self.uri}"

    @property
    def async_url(self) -> str:
        return f"postgresql+asyncpg://{self.uri}"


class Settings(BaseSettings):
    app: AppSettings = AppSettings()
    postgres: PostgresSettings = PostgresSettings()
    redis: RedisSettings = RedisSettings()
    raw_timezone: str = Field(alias="TIMEZONE")

    @property
    def timezone(self) -> timezone:
        return tz(self.raw_timezone)


settings = Settings()
