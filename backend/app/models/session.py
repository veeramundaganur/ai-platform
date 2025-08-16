# app/models/session.py
# Chat session (for Chat UI mapping)
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.db.base import Base

class Session(Base):
    __tablename__ = "sessions"
    id = sa.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = sa.Column(UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True)
    title = sa.Column(sa.Text, nullable=True)
    system_prompt = sa.Column(sa.Text, nullable=True)
    model = sa.Column(sa.Text, nullable=True)
    created_at = sa.Column(sa.TIMESTAMP(timezone=True), default=datetime.utcnow)
    updated_at = sa.Column(sa.TIMESTAMP(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = sa.Column(sa.TIMESTAMP(timezone=True), nullable=True)
