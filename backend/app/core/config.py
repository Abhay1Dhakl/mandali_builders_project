from __future__ import annotations

import os
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[3]
BACKEND_DIR = ROOT_DIR / "backend"
SHARED_DATA_PATH = ROOT_DIR / "shared" / "demo-data.json"


class Settings:
    app_name = "Mandali Builders API"
    secret_key = os.getenv("SECRET_KEY", "mandali-builders-dev-secret")
    algorithm = "HS256"
    access_token_expire_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "720"))
    allowed_origins = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:3000,http://127.0.0.1:3000",
        ).split(",")
        if origin.strip()
    ]
    database_path = Path(os.getenv("DATABASE_PATH", str(BACKEND_DIR / "mandali.db")))
    shared_data_path = SHARED_DATA_PATH


settings = Settings()
