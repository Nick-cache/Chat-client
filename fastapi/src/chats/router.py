from fastapi.routing import APIRouter
from src.database import session_dep
from src.services import to_http_exception
from src.chats.exceptions import CHAT_EXCEPTIONS
from src.chats.services import ChatDal, MessageDal
from src.chats.schemas import (
    ChatSaveSchema,
    ChatResponseSchema,
    MessageResponseSchema,
    MessagesDeleteSchema,
)
from pydantic import UUID4

chat_router = APIRouter(prefix="/chats", tags=["chats"])


@chat_router.post(
    "/create_chat",
    response_model=ChatResponseSchema,
)
@to_http_exception(CHAT_EXCEPTIONS)
async def create_chat(
    payload: ChatSaveSchema,
    session: session_dep,
):
    chat = await ChatDal.create(
        payload.model_dump(),
        session=session,
    )
    await session.refresh(chat)
    return chat


@chat_router.get(
    "/get_all",
    response_model=list[ChatResponseSchema],
)
async def get_all_chats(session: session_dep):
    return await ChatDal.get_all(session=session)


@chat_router.put("/add_messages")
@to_http_exception(CHAT_EXCEPTIONS)
async def add_messages_in_chat(
    payload: list[MessageResponseSchema],
    session: session_dep,
):
    await MessageDal.insert_rows(
        payload=payload,
        session=session,
    )


@chat_router.put("/update_messages")
@to_http_exception(CHAT_EXCEPTIONS)
async def update_messages(
    payload: list[MessageResponseSchema],
    session: session_dep,
):
    await MessageDal.update_rows(payload=payload, session=session)


@chat_router.put("/delete_messages")
@to_http_exception(CHAT_EXCEPTIONS)
async def delete_messages(
    payload: MessagesDeleteSchema,
    session: session_dep,
):
    await MessageDal.delete_messages_by_uuids(
        uuids=payload.uuids,
        session=session,
    )


@chat_router.get("/{uuid}")
async def get_chat(uuid: UUID4, session: session_dep):
    ident = {"uuid": uuid}
    return await ChatDal.get_one_by(
        ident=ident,
        session=session,
    )


@chat_router.get("/{uuid}/messages", response_model=list[MessageResponseSchema],)
async def get_chat_messages(uuid: UUID4, session: session_dep):
    payload = {"chat_uuid": uuid}
    return await MessageDal.get_all(session=session, payload=payload)    


@chat_router.delete("/{uuid}")
async def delete_chat(uuid: UUID4, session: session_dep):
    ident = {"uuid": uuid}
    await ChatDal.delete_by(ident=ident, session=session)
