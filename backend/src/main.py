import uvicorn
from fastapi import FastAPI

from src.chats.router import router as chat_router
from src.config import settings

app = FastAPI()

app.include_router(chat_router)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.app.host,
        port=settings.app.port,
        reload=settings.app.reload,
        workers=settings.app.workers,
    )
