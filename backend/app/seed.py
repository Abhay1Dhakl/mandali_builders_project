from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from sqlmodel import Session, select

from app.core.config import settings
from app.core.security import get_password_hash
from app.models import (
    AdminUser,
    Commitment,
    CompanyProfile,
    Insight,
    Office,
    Project,
    Sector,
    Service,
)


def load_demo_data(path: Path | None = None) -> dict[str, Any]:
    source = path or settings.shared_data_path
    with source.open("r", encoding="utf-8") as file:
        return json.load(file)


def seed_database(session: Session) -> None:
    if session.exec(select(CompanyProfile)).first():
        return

    data = load_demo_data()

    session.add(CompanyProfile(**data["profile"]))

    for item in data["commitments"]:
        session.add(Commitment(**item))

    for item in data["services"]:
        session.add(Service(**item))

    sector_lookup: dict[str, int] = {}
    for item in data["sectors"]:
        sector = Sector(**item)
        session.add(sector)
        session.flush()
        sector_lookup[sector.slug] = int(sector.id)

    for item in data["projects"]:
        payload = {**item, "sector_id": sector_lookup.get(item["sector_slug"])}
        payload.pop("sector_slug", None)
        session.add(Project(**payload))

    for item in data["insights"]:
        session.add(Insight(**item))

    for item in data["offices"]:
        session.add(Office(**item))

    session.add(
        AdminUser(
            username="admin",
            hashed_password=get_password_hash("mandali123"),
            full_name="Mandali Builders Admin",
        )
    )
    session.commit()
