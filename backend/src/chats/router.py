from fastapi.routing import APIRouter
from pydantic import UUID4

from src.database import session_dep
from src.utils import to_http_exception

from src.chats.exceptions import CHAT_EXCEPTIONS
from src.chats.dal import ChatDal, MessageDal
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
    chat = await ChatDal.create(
        payload.model_dump(),
        session=session,
    )
    await session.refresh(chat)
    return chat


@router.get(
    "/get_all",
    response_model=list[ChatResponseSchema],
)
async def get_all_chats(session: session_dep):
    return await ChatDal.get_all(session=session)


@router.put("/add_messages")
@to_http_exception(CHAT_EXCEPTIONS)
async def add_messages_in_chat(
    payload: list[MessageResponseSchema],
    session: session_dep,
):
    await MessageDal.insert_rows(
        payload=payload,
        session=session,
    )


@router.put("/update_messages")
@to_http_exception(CHAT_EXCEPTIONS)
async def update_messages(
    payload: list[MessageResponseSchema],
    session: session_dep,
):
    await MessageDal.update_rows(payload=payload, session=session)


@router.put("/delete_messages")
@to_http_exception(CHAT_EXCEPTIONS)
async def delete_messages(
    payload: MessagesDeleteSchema,
    session: session_dep,
):
    await MessageDal.delete_messages_by_uuids(
        uuids=payload.uuids,
        session=session,
    )


@router.get("/{uuid}")
async def get_chat(uuid: UUID4, session: session_dep):
    ident = {"uuid": uuid}
    return await ChatDal.get_one_by(
        ident=ident,
        session=session,
    )


@router.get("/{uuid}/messages", response_model=list[MessageResponseSchema])
async def get_chat_messages(uuid: UUID4, session: session_dep):
    return await MessageDal.get_messages(chat_uuid=uuid, session=session)


@router.put("/{uuid}")
async def update_chat(uuid: UUID4, payload: ChatUpdateSchema, session: session_dep):
    data = {"uuid": uuid, "name": payload.name}
    await ChatDal.update_rows(payload=[data], session=session)


@router.delete("/{uuid}")
async def delete_chat(uuid: UUID4, session: session_dep):
    ident = {"uuid": uuid}
    await ChatDal.delete_by(ident=ident, session=session)
