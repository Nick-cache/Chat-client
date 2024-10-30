from pydantic import UUID4
from datetime import datetime

from src.chats.dal import ChatDal, MessageDal


class ChatService:
    @classmethod
    async def create(cls, name: str, tokens: int):
        chat = await ChatDal.create(name, tokens)
        return chat

    @classmethod
    async def change_name(cls, uuid: UUID4, name: str):
        await ChatDal.change_name(uuid, name)

    @classmethod
    async def get_by_uuid(cls, uuid: UUID4):
        return await ChatDal.get_by_uuid(uuid)

    @classmethod
    async def get_all(cls):
        return await ChatDal.get_all()

    @classmethod
    async def delete_by_uuid(cls, uuid: UUID4):
        await ChatDal.delete_by_uuid(uuid)

    @classmethod
    async def add_message(
        cls, role: str, content: str, date: datetime, chat_uuid: UUID4, stopped: bool
    ):
        await MessageDal.create(role, content, date, chat_uuid, stopped)

    @classmethod
    async def get_messages(chat_uuid: UUID4):
        return await MessageDal.get_messages(chat_uuid)

    @classmethod
    async def update_message(cls, uuid: UUID4, content: str):
        await MessageDal.update_message(uuid, content)

    @classmethod
    async def delete_messages(cls, uuids: list[UUID4]):
        await MessageDal.delete_messages_by_uuids(uuids)
