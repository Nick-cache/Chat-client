from fastapi.routing import APIRouter
from pydantic import UUID4

from src.database import session_dep
from src.utils import to_http_exception

from src.chats.service import ChatService
from src.chats.exceptions import CHAT_EXCEPTIONS
from src.chats.schemas import (
    ChatSaveSchema,
    ChatResponseSchema,
    ChatUpdateSchema,
    MessageResponseSchema,
    MessagesDeleteSchema,
)

router = APIRouter(prefix="/chats", tags=["chats"])


@router.post(
    "/create_chat",
    response_model=ChatResponseSchema,
)
@to_http_exception(CHAT_EXCEPTIONS)
async def create_chat(
    payload: ChatSaveSchema,
    session: session_dep,
):
    return await ChatService.create(payload.model_dump(), session)


@router.get(
    "/get_all",
    response_model=list[ChatResponseSchema],
)
async def get_all_chats(session: session_dep):
    return await ChatService.get_all(session)


@router.put("/add_messages")
@to_http_exception(CHAT_EXCEPTIONS)
async def add_messages_in_chat(
    payload: list[MessageResponseSchema],
    session: session_dep,
):
    await ChatService.add_messages(payload, session)


@router.put("/update_messages")
@to_http_exception(CHAT_EXCEPTIONS)
async def update_messages(
    payload: list[MessageResponseSchema],
    session: session_dep,
):
    await ChatService.update_messages(payload, session)


@router.put("/delete_messages")
@to_http_exception(CHAT_EXCEPTIONS)
async def delete_messages(
    payload: MessagesDeleteSchema,
    session: session_dep,
):
    await ChatService.delete_messages(payload.uuids, session)


@router.get("/{uuid}", response_model=ChatResponseSchema)
async def get_chat(uuid: UUID4, session: session_dep):
    ident = {"uuid": uuid}
    return await ChatService.get(ident, session)


@router.get("/{uuid}/messages", response_model=list[MessageResponseSchema])
async def get_chat_messages(uuid: UUID4, session: session_dep):
    return await ChatService.get_messages(uuid, session)


@router.put("/{uuid}")
async def update_chat(uuid: UUID4, payload: ChatUpdateSchema, session: session_dep):
    data = [{"uuid": uuid, "name": payload.name}]
    await ChatService.update(data, session)


@router.delete("/{uuid}")
async def delete_chat(uuid: UUID4, session: session_dep):
    ident = {"uuid": uuid}
    await ChatService.delete(ident, session)
