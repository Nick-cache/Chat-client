from pydantic_settings import BaseSettings
from pydantic import Field
from datetime import timezone
from pytz import timezone as tz


class Settings:
    def __init__(self, *configs) -> None:
        for config in configs:
            setattr(self, config.key, config)


class SettingsWithKey(BaseSettings):
    _key: str

    @property
    def key(self) -> str:
        return self._key


class App(SettingsWithKey):
    _key = "app"

    host: str = Field(alias="FASTAPI_HOST")
    port: int = Field(alias="FASTAPI_PORT")
    reload: bool = Field(alias="FASTAPI_RELOAD")
    workers: int = Field(alias="FASTAPI_WORKERS")


class Redis(SettingsWithKey):
    _key = "redis"

    host: str = Field(alias="REDIS_HOST")
    port: str = Field(alias="REDIS_PORT")
    broker_idx: int = Field(alias="REDIS_BROKER")
    cache_idx: int = Field(alias="REDIS_CACHE")


class Postgres(SettingsWithKey):
    _key = "postgres"

    uri: str = Field(alias="POSTGRES_URI")

    @property
    def sync_url(self) -> str:
        return f"postgresql://{self.uri}"

    @property
    def async_url(self) -> str:
        return f"postgresql+asyncpg://{self.uri}"


class Timezone(SettingsWithKey):
    _key = "timezone"

    raw_timezone: str = Field(alias="TIMEZONE")

    @property
    def timezone(self) -> timezone:
        return tz(self.raw_timezone)


settings = Settings(
    App(),
    Redis(),
    Postgres(),
    Timezone(),
)
