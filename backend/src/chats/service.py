from typing import Any
from pydantic import UUID4

from sqlalchemy.ext.asyncio import AsyncSession

from src.chats.dal import ChatDal, MessageDal


class ChatService:
    @classmethod
    async def create(cls, payload: dict[str, Any], session: AsyncSession):
        chat = await ChatDal.create(
            payload,
            session=session,
        )
        await session.refresh(chat)
        return chat

    @classmethod
    async def update(cls, payload: list[dict[str, Any]], session: AsyncSession):
        await ChatDal.update_rows(payload=payload, session=session)

    @classmethod
    async def get(cls, ident: dict[str, UUID4], session: AsyncSession):
        return await ChatDal.get_one_by(
            ident=ident,
            session=session,
        )

    @classmethod
    async def get_all(cls, session: AsyncSession):
        return await ChatDal.get_all(session=session)

    @classmethod
    async def delete(cls, ident: dict[str, UUID4], session: AsyncSession):
        await ChatDal.delete_by(ident=ident, session=session)

    @classmethod
    async def add_messages(
        cls,
        payload: list[dict[str, Any]],
        session: AsyncSession,
    ):
        await MessageDal.insert_rows(
            payload=payload,
            session=session,
        )

    async def get_messages(uuid: UUID4, session: AsyncSession):
        return await MessageDal.get_messages(chat_uuid=uuid, session=session)

    @classmethod
    async def update_messages(
        cls,
        payload: list[dict[str, Any]],
        session: AsyncSession,
    ):
        await MessageDal.update_rows(payload=payload, session=session)

    @classmethod
    async def delete_messages(
        cls,
        uuids: list[UUID4],
        session: AsyncSession,
    ):
        await MessageDal.delete_messages_by_uuids(
            uuids=uuids,
            session=session,
        )
