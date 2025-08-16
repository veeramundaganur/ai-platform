# app/core/security.py
# password + jwt helpers (bcrypt via passlib)
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(subject: str, expires_delta: timedelta | None = None) -> str:
    to_encode = {"sub": subject, "iat": datetime.utcnow().timestamp()}
    if expires_delta:
        to_encode.update({"exp": (datetime.utcnow() + expires_delta).timestamp()})
    else:
        to_encode.update({"exp": (datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)).timestamp()})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
