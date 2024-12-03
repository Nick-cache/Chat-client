from pydantic import UUID4
from datetime import datetime

from src.chats.dal import ChatDal, MessageDal


class ChatService:
    @classmethod
    async def create(cls, name: str):
        return await ChatDal.create(name)

    @classmethod
    async def change_name(cls, uuid: UUID4, name: str):
        payload = {"name": name}
        await ChatDal.update(uuid, payload)

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
        cls,
        role: str,
        content: str,
        date: datetime,
        chat_uuid: UUID4,
        stopped: bool,
        tokens: int,
    ):
        await MessageDal.create(role, content, date, stopped, chat_uuid, tokens)

    @classmethod
    async def get_messages(cls, chat_uuid: UUID4):
        return await MessageDal.get_messages(chat_uuid)

    @classmethod
    async def update_message(
        cls, uuid: UUID4, content: str, stopped: bool, tokens: int
    ):
        await MessageDal.update_message(uuid, content, stopped, tokens)

    @classmethod
    async def delete_messages(cls, uuids: list[UUID4]):
        await MessageDal.delete_messages_by_uuids(uuids)
