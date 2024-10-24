from __future__ import annotations

from uuid import uuid4
from typing import Optional

from sqlalchemy import String, ForeignKey, Integer, DateTime, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from src.database import BaseModel


class Message(BaseModel):
    uuid: Mapped[UUID] = mapped_column(
        UUID,
        primary_key=True,
        unique=True,
        default=uuid4,
    )
    role: Mapped[str] = mapped_column(String(100))
    content: Mapped[str] = mapped_column(Text)
    date: Mapped[DateTime] = mapped_column(DateTime)
    chat_uuid: Mapped[UUID] = mapped_column(
        ForeignKey(
            "chat.uuid",
            ondelete="CASCADE",
        )
    )
    stopped: Mapped[bool] = mapped_column(Boolean, default=False)


class Chat(BaseModel):
    uuid: Mapped[UUID] = mapped_column(
        UUID,
        primary_key=True,
        unique=True,
        default=uuid4,
    )
    name: Mapped[str] = mapped_column(String(100))
    tokens: Mapped[int] = mapped_column(Integer)
    messages: Mapped[list["Message"]] = relationship()
    project_uuid: Mapped[Optional[UUID]] = mapped_column(ForeignKey("project.uuid"))
