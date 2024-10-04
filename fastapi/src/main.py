from fastapi import FastAPI

import uvicorn

from src.chats.router import chat_router
from src.config import settings

app = FastAPI()

app.include_router(chat_router)

if __name__ == "__main__":
    uvicorn.run("main:app", **settings.app.model_dump())
