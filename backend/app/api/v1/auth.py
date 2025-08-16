# app/api/v1/auth.py
# Light scaffolding for auth endpoints (signup/login placeholders)
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.core.security import hash_password, create_access_token
from sqlalchemy.future import select

router = APIRouter()

class SignupPayload(BaseModel):
    email: EmailStr
    password: str
    name: str | None = None

@router.post("/signup")
async def signup(payload: SignupPayload):
    async with AsyncSessionLocal() as db:
        q = await db.execute(select(User).where(User.email == payload.email))
        existing = q.scalar_one_or_none()
        if existing:
            raise HTTPException(status_code=400, detail="Email exists")
        user = User(email=payload.email, password_hash=hash_password(payload.password), name=payload.name)
        db.add(user)
        await db.commit()
        return {"access_token": create_access_token(str(user.id)), "token_type": "bearer"}
