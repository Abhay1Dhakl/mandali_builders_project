from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from app.core.config import settings
from app.database import create_db_and_tables, engine
from app.routers import admin, public
from app.seed import seed_database


@asynccontextmanager
async def lifespan(_: FastAPI):
    create_db_and_tables()
    with Session(engine) as session:
        seed_database(session)
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def healthcheck() -> dict:
    return {"status": "ok"}


app.include_router(public.router)
app.include_router(admin.router)
