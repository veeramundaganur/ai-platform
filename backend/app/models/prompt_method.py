# app/models/prompt_method.py
# Prompt generation methods (few-shot, CoT, JSON, YAML, DSL, etc.)
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.db.base import Base

class PromptMethod(Base):
    __tablename__ = "prompt_methods"
    id = sa.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    key = sa.Column(sa.Text, nullable=False, unique=True)   # machine key e.g., "cot", "few_shot"
    name = sa.Column(sa.Text, nullable=False)               # display name
    description = sa.Column(sa.Text, nullable=True)
    created_at = sa.Column(sa.TIMESTAMP(timezone=True), default=datetime.utcnow)
