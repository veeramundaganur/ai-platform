# app/api/v1/prompts.py
# Basic prompt creation endpoint (store raw input and return id)
from fastapi import APIRouter
from pydantic import BaseModel
from app.db.session import AsyncSessionLocal
from app.models.prompt import Prompt

router = APIRouter()

class CreatePrompt(BaseModel):
    raw_input: str
    model_key: str | None = None
    method_key: str | None = None

@router.post("/")
async def create_prompt(payload: CreatePrompt):
    async with AsyncSessionLocal() as db:
        p = Prompt(raw_input=payload.raw_input)
        db.add(p)
        await db.commit()
        await db.refresh(p)
        return {"id": str(p.id), "raw_input": p.raw_input}
