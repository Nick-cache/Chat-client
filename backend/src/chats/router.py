from fastapi.routing import APIRouter
from pydantic import UUID4

from src.utils import to_http_exception

from src.chats.service import ChatService
from src.chats.exceptions import CHAT_EXCEPTIONS
from src.chats.schemas import (
    ChatCreateSchema,
    ChatSchema,
    ChatUpdateSchema,
    MessageCreateSchema,
    MessageUpdateSchema,
    MessageSchema,
    MessagesDeleteSchema,
)

router = APIRouter(prefix="/chats", tags=["chats"])


@router.post("/create_chat", response_model=ChatSchema)
@to_http_exception(CHAT_EXCEPTIONS)
async def create_chat(payload: ChatCreateSchema):
    return await ChatService.create(payload.name, payload.tokens)


@router.get("/get_all", response_model=list[ChatSchema])
async def get_all_chats():
    return await ChatService.get_all()


@router.put("/add_message")
@to_http_exception(CHAT_EXCEPTIONS)
async def add_message(payload: MessageCreateSchema):
    await ChatService.add_message(
        payload.role, payload.content, payload.date, payload.chat_uuid, payload.stopped
    )


@router.put("/update_message")
@to_http_exception(CHAT_EXCEPTIONS)
async def update_message(payload: MessageUpdateSchema):
    await ChatService.update_message(payload.uuid, payload.content)


@router.put("/delete_messages")
@to_http_exception(CHAT_EXCEPTIONS)
async def delete_messages(payload: MessagesDeleteSchema):
    await ChatService.delete_messages(payload.uuids)


@router.get("/{uuid}", response_model=ChatSchema)
@to_http_exception(CHAT_EXCEPTIONS)
async def get_chat(uuid: UUID4):
    return await ChatService.get_by_uuid(uuid)


@router.get("/{uuid}/messages", response_model=list[MessageSchema])
@to_http_exception(CHAT_EXCEPTIONS)
async def get_chat_messages(uuid: UUID4):
    return await ChatService.get_messages(uuid)


@router.put("/{uuid}")
@to_http_exception(CHAT_EXCEPTIONS)
async def change_chat_name(uuid: UUID4, payload: ChatUpdateSchema):
    await ChatService.change_name(uuid, payload.name)


@router.delete("/{uuid}")
@to_http_exception(CHAT_EXCEPTIONS)
async def delete_chat(uuid: UUID4):
    await ChatService.delete_by_uuid(uuid)
