from pydantic import UUID4
from datetime import datetime

from sqlalchemy import select, update, delete

from src.database import DatabaseManager
from src.chats.models import Chat, Message


class ChatDal:
    @classmethod
    async def create(cls, name: str, tokens: int) -> Chat:
        async with DatabaseManager.session_factory() as session:
            chat = Chat(name=name, tokens=tokens)
            session.add(chat)
            await session.commit()
            await session.refresh(chat)
            return chat

    @classmethod
    async def change_name(cls, uuid: UUID4, name: str):
        async with DatabaseManager.session_factory() as session:
            await session.execute(update(Chat), [{"uuid": uuid, "name": name}])
            await session.commit()

    @classmethod
    async def get_by_uuid(cls, uuid: UUID4) -> Chat:
        async with DatabaseManager.session_factory() as session:
            return (
                await session.execute(select(Chat).filter(Chat.uuid == uuid))
            ).scalar_one_or_none()

    @classmethod
    async def get_all(cls) -> list[Chat]:
        async with DatabaseManager.session_factory() as session:
            return (await session.scalars(select(Chat))).unique().all()

    @classmethod
    async def delete_by_uuid(cls, uuid: UUID4):
        async with DatabaseManager.session_factory() as session:
            await session.execute(delete(Chat).filter(Chat.uuid == uuid))
            await session.commit()


class MessageDal:
    @classmethod
    async def create(
        cls, role: str, content: str, date: datetime, stopped: bool, chat_uuid: UUID4
    ) -> Message:
        async with DatabaseManager.session_factory() as session:
            message = Message(
                role=role,
                content=content,
                date=date,
                stopped=stopped,
                chat_uuid=chat_uuid,
            )
            session.add(message)
            await session.commit()
            await session.refresh(message)
            return message

    @classmethod
    async def update_message(cls, uuid: UUID4, content: str):
        async with DatabaseManager.session_factory() as session:
            await session.execute(update(Message), [{"uuid": uuid, "content": content}])
            await session.commit()

    @classmethod
    async def delete_messages_by_uuids(cls, uuids: list[UUID4]):
        async with DatabaseManager.session_factory() as session:
            await session.execute(delete(Message).filter(Message.uuid.in_(uuids)))
            await session.commit()

    @classmethod
    async def get_messages(cls, chat_uuid: UUID4) -> list[Message]:
        async with DatabaseManager.session_factory() as session:
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
