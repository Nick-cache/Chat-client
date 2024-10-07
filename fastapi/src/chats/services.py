from src.services import Dal
from src.chats.models import Chat, Message
from pydantic import UUID4
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete


class ChatDal(Dal):
    model = Chat


class MessageDal(Dal):
    model = Message

    @classmethod
    async def delete_messages_by_uuids(
        cls,
        uuids: list[UUID4],
        session: AsyncSession,
    ):
        await session.execute(delete(Message).filter(Message.uuid.in_(ids)))
        await session.commit()
