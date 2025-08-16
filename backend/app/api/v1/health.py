# app/api/v1/health.py
# small health router so we can verify the server is up quickly
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def health():
    return {"status": "ok"}
