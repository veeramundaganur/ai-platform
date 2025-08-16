# app/models/user.py
# User model: supports email/password + optional google_id
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    id = sa.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = sa.Column(sa.Text, unique=True, nullable=False, index=True)
    password_hash = sa.Column(sa.Text, nullable=True)
    google_id = sa.Column(sa.Text, nullable=True, index=True)
    name = sa.Column(sa.Text, nullable=True)
    profile_picture = sa.Column(sa.Text, nullable=True)
    role = sa.Column(sa.Text, nullable=False, default="user")
    created_at = sa.Column(sa.TIMESTAMP(timezone=True), nullable=False, default=datetime.utcnow)
