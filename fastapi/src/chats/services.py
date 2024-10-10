from src.services import Dal
from src.chats.models import Chat, Message
from pydantic import UUID4
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete, select


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
        await session.execute(delete(Message).filter(Message.uuid.in_(uuids)))
        await session.commit()

    @classmethod
    async def get_messages(
        cls,
        chat_uuid: UUID4,
        session: AsyncSession,
    ):
        return (
            (
                await session.scalars(
                    select(Message)
                    .filter(Message.chat_uuid == chat_uuid)
                    .order_by(Message.date)
                )
            )
            .unique()
            .all()
        )
