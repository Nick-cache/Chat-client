from typing import Any
from sqlalchemy import select, update, delete, insert
from sqlalchemy.ext.asyncio import AsyncSession
from src.database import BaseModel


class Dal:
    model: BaseModel

    @classmethod
    async def create(
        cls,
        payload: dict[str, Any],
        session: AsyncSession,
    ) -> BaseModel:
        entity = cls.model(**payload)
        session.add(entity)
        await session.commit()
        return entity

    @classmethod
    async def get_all(
        cls,
        session: AsyncSession,
        payload: dict | None = None,
    ) -> list[BaseModel]:
        statement = select(cls.model)
        if payload is not None:
            statement = statement.filter_by(**payload)
        return (await session.scalars(statement)).unique().all()

    @classmethod
    async def get_one_by(
        cls,
        ident: dict[str, Any],
        session: AsyncSession,
        options: list | None = None,
    ) -> BaseModel:
        statement = select(cls.model).filter_by(**ident)
        if options is not None:
            statement = statement.options(*options)
        return (await session.execute(statement)).unique().scalar_one_or_none()

    @classmethod
    async def update_rows(
        cls,
        payload: list[dict[str, Any]],
        session: AsyncSession,
    ) -> BaseModel:
        """
        Bulk update
        Requires PK in payload
        """
        (await session.execute(update(cls.model), payload)).scalar()
        await session.commit()

    @classmethod
    async def insert_rows(
        cls,
        payload: list[dict[str, Any]],
        session: AsyncSession,
    ) -> BaseModel:
        """
        Bulk insert
        Requires PK in payload
        """
        (await session.execute(insert(cls.model), payload)).scalar()
        await session.commit()

    @classmethod
    async def delete_by(
        cls,
        ident: dict[str, Any],
        session: AsyncSession,
    ):
        await session.execute(delete(cls.model).filter_by(**ident))
        await session.commit()
