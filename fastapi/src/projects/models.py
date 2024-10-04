from __future__ import annotations

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey

from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4

from src.database import BaseModel
from src.chats.models import Chat


class File(BaseModel):
    uuid: Mapped[UUID] = mapped_column(
        UUID,
        primary_key=True,
        unique=True,
        default=uuid4,
    )
    name: Mapped[str] = mapped_column(String(100))
    content: Mapped[str] = mapped_column(String(6000))
    path: Mapped[str] = mapped_column(String(100))
    project_uuid: Mapped[UUID] = mapped_column(ForeignKey("project.uuid"))


class Project(BaseModel):
    uuid: Mapped[UUID] = mapped_column(
        UUID,
        primary_key=True,
        unique=True,
        default=uuid4,
    )
    name: Mapped[str] = mapped_column(String(100))
    chats: Mapped[list["Chat"]] = relationship()
    structure: Mapped[list["File"]] = relationship()
