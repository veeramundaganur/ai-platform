# app/main.py
# FastAPI entrypoint + startup hook (creates tables in dev)
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.base import Base
from app.db.session import async_engine
from app.api.v1 import health, auth, prompts

app = FastAPI(title="Prompt Platform API", version="0.1.0")

# CORS for local dev (frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/v1/health", tags=["health"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(prompts.router, prefix="/api/v1/prompts", tags=["prompts"])

@app.on_event("startup")
async def on_startup():
    # In dev we auto-create tables if ALEMBIC not used yet.
    if os.getenv("SKIP_CREATE_TABLES", "0") != "1":
        async with async_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
