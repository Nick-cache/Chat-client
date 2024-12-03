from pydantic_settings import BaseSettings
from pydantic import Field
from datetime import timezone
from pytz import timezone as tz


class App(BaseSettings):
    host: str = Field(alias="BACKEND_HOST")
    port: int = Field(alias="BACKEND_PORT")
    reload: bool = Field(alias="BACKEND_RELOAD")
    workers: int = Field(alias="BACKEND_WORKERS")
    cors: list[str] = Field(alias="BACKEND_CORS")


class Postgres(BaseSettings):
    uri: str = Field(alias="POSTGRES_SERVICE")

    @property
    def sync_url(self) -> str:
        return f"postgresql://{self.uri}"

    @property
    def async_url(self) -> str:
        return f"postgresql+asyncpg://{self.uri}"


class Timezone(BaseSettings):
    raw_timezone: str = Field(alias="TIMEZONE")

    @property
    def timezone(self) -> timezone:
        return tz(self.raw_timezone)


class Settings:
    def __init__(
        self,
        app: BaseSettings,
        postgres: BaseSettings,
        timezone: BaseSettings,
    ) -> None:
        self.app = app
        self.postgres = postgres
        self.timezone = timezone


settings = Settings(
    App(),
    Postgres(),
    Timezone(),
)
