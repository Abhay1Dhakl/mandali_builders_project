from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class AdminUser(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    hashed_password: str
    full_name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class CompanyProfile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    company_name: str
    tagline: str
    hero_title: str
    hero_subtitle: str
    overview: str
    vision: str
    years_experience: int
    completed_projects: int
    annual_volume: str
    client_retention: str
    phone: str
    email: str
    address: str
    headquarters: str
    hero_primary_cta: str
    hero_secondary_cta: str


class Commitment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    subtitle: str
    description: str
    accent: str
    display_order: int = 0


class Service(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    slug: str = Field(index=True)
    short_description: str
    detailed_description: str
    icon: str
    display_order: int = 0


class Sector(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    slug: str = Field(index=True)
    short_description: str
    hero_stat: str
    image: str
    display_order: int = 0


class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    slug: str = Field(index=True)
    client_name: str
    location: str
    sector_id: Optional[int] = Field(default=None, foreign_key="sector.id")
    service_line: str
    size: str
    year_completed: int
    status: str
    headline: str
    description: str
    challenge: str
    solution: str
    impact: str
    image: str
    featured: bool = False


class Insight(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    slug: str = Field(index=True)
    category: str
    excerpt: str
    content: str
    image: str
    published_at: datetime = Field(default_factory=datetime.utcnow)
    featured: bool = False


class Office(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    city: str
    country: str
    address: str
    phone: str
    email: str
    manager: str
    region: str
    featured: bool = False


class Inquiry(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    full_name: str
    company_name: str
    email: str
    phone: str
    inquiry_type: str
    message: str
    status: str = "New"
    created_at: datetime = Field(default_factory=datetime.utcnow)
