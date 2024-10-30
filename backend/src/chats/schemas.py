from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel as BaseSchema, UUID4


# ! CHATS
class ChatSchema(BaseSchema):
    uuid: UUID4
    name: str
    tokens: int
    project_uuid: UUID4 | None = None


class ChatCreateSchema(BaseSchema):
    name: str
    tokens: int
    project_uuid: UUID4 | None = None


class ChatUpdateSchema(BaseSchema):
    name: str


# ! MESSAGES
class MessageSchema(BaseSchema):
    uuid: UUID4
    role: str
    content: str
    date: datetime
    chat_uuid: UUID4
    stopped: bool


class MessageCreateSchema(BaseSchema):
    role: str
    content: str
    date: datetime
    chat_uuid: UUID4
    stopped: bool


class MessageUpdateSchema(BaseSchema):
    uuid: UUID4
    content: str


class MessagesDeleteSchema(BaseSchema):
    uuids: list[UUID4]
