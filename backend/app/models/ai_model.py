# app/models/ai_model.py
# Supported AI models (pluggable list)
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.db.base import Base

class AIModel(Base):
    __tablename__ = "ai_models"
    id = sa.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = sa.Column(sa.Text, nullable=False)          # human readable, e.g., "gpt-4o"
    provider = sa.Column(sa.Text, nullable=False)      # e.g., "openai"
    description = sa.Column(sa.Text, nullable=True)
    is_active = sa.Column(sa.Boolean, default=True)
    created_at = sa.Column(sa.TIMESTAMP(timezone=True), default=datetime.utcnow)
