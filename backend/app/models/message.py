# app/models/message.py
# Message timeline for sessions
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.db.base import Base

class Message(Base):
    __tablename__ = "messages"
    id = sa.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = sa.Column(UUID(as_uuid=True), sa.ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)
    role = sa.Column(sa.Text, nullable=False)  # 'user' | 'assistant' | 'system'
    content = sa.Column(sa.Text, nullable=False)
    created_at = sa.Column(sa.TIMESTAMP(timezone=True), default=datetime.utcnow)
