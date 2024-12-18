"""Init

Revision ID: 904cfa9e1b3e
Revises: 
Create Date: 2024-11-26 11:06:46.089507

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '904cfa9e1b3e'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('chat',
    sa.Column('uuid', sa.UUID(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.PrimaryKeyConstraint('uuid'),
    sa.UniqueConstraint('uuid')
    )
    op.create_table('message',
    sa.Column('uuid', sa.UUID(), nullable=False),
    sa.Column('role', sa.String(length=100), nullable=False),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('date', sa.DateTime(), nullable=False),
    sa.Column('chat_uuid', sa.UUID(), nullable=False),
    sa.Column('stopped', sa.Boolean(), nullable=False),
    sa.Column('tokens', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['chat_uuid'], ['chat.uuid'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('uuid'),
    sa.UniqueConstraint('uuid')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('message')
    op.drop_table('chat')
    # ### end Alembic commands ###
