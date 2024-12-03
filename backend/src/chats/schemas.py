from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel as BaseSchema, UUID4


# ! CHATS
class ChatSchema(BaseSchema):
    uuid: UUID4
    name: str


class ChatCreateSchema(BaseSchema):
    name: str


class ChatChangeNameSchema(BaseSchema):
    name: str


# ! MESSAGES
class MessageSchema(BaseSchema):
    uuid: UUID4
    role: str
    content: str
    date: datetime
    chat_uuid: UUID4
    stopped: bool
    tokens: int


class MessageCreateSchema(BaseSchema):
    role: str
    content: str
    date: datetime
    chat_uuid: UUID4
    stopped: bool
    tokens: int


class MessageUpdateSchema(BaseSchema):
    uuid: UUID4
    content: str
    stopped: bool
    tokens: int


class MessagesDeleteSchema(BaseSchema):
    uuids: list[UUID4]
