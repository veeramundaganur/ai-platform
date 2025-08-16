# app/models/prompt.py
# Stores raw messy input + refined output metadata
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.db.base import Base

class Prompt(Base):
    __tablename__ = "prompts"
    id = sa.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = sa.Column(UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True)
    model_id = sa.Column(UUID(as_uuid=True), sa.ForeignKey("ai_models.id"), nullable=True)
    method_id = sa.Column(UUID(as_uuid=True), sa.ForeignKey("prompt_methods.id"), nullable=True)
    raw_input = sa.Column(sa.Text, nullable=False)
    refined_output = sa.Column(sa.Text, nullable=True)
    metadata = sa.Column(sa.JSON, nullable=True)
    created_at = sa.Column(sa.TIMESTAMP(timezone=True), default=datetime.utcnow)
