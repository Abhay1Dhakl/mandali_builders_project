from __future__ import annotations

from datetime import datetime

from sqlmodel import SQLModel


class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


class AdminLogin(SQLModel):
    username: str
    password: str


class CompanyProfileBase(SQLModel):
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


class CompanyProfileUpdate(SQLModel):
    company_name: str | None = None
    tagline: str | None = None
    hero_title: str | None = None
    hero_subtitle: str | None = None
    overview: str | None = None
    vision: str | None = None
    years_experience: int | None = None
    completed_projects: int | None = None
    annual_volume: str | None = None
    client_retention: str | None = None
    phone: str | None = None
    email: str | None = None
    address: str | None = None
    headquarters: str | None = None
    hero_primary_cta: str | None = None
    hero_secondary_cta: str | None = None


class CommitmentBase(SQLModel):
    title: str
    subtitle: str
    description: str
    accent: str
    display_order: int = 0


class CommitmentCreate(CommitmentBase):
    pass


class CommitmentUpdate(SQLModel):
    title: str | None = None
    subtitle: str | None = None
    description: str | None = None
    accent: str | None = None
    display_order: int | None = None


class ServiceBase(SQLModel):
    name: str
    slug: str
    short_description: str
    detailed_description: str
    icon: str
    display_order: int = 0


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(SQLModel):
    name: str | None = None
    slug: str | None = None
    short_description: str | None = None
    detailed_description: str | None = None
    icon: str | None = None
    display_order: int | None = None


class SectorBase(SQLModel):
    name: str
    slug: str
    short_description: str
    hero_stat: str
    image: str
    display_order: int = 0


class SectorCreate(SectorBase):
    pass


class SectorUpdate(SQLModel):
    name: str | None = None
    slug: str | None = None
    short_description: str | None = None
    hero_stat: str | None = None
    image: str | None = None
    display_order: int | None = None


class ProjectBase(SQLModel):
    title: str
    slug: str
    client_name: str
    location: str
    sector_id: int | None = None
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


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(SQLModel):
    title: str | None = None
    slug: str | None = None
    client_name: str | None = None
    location: str | None = None
    sector_id: int | None = None
    service_line: str | None = None
    size: str | None = None
    year_completed: int | None = None
    status: str | None = None
    headline: str | None = None
    description: str | None = None
    challenge: str | None = None
    solution: str | None = None
    impact: str | None = None
    image: str | None = None
    featured: bool | None = None


class InsightBase(SQLModel):
    title: str
    slug: str
    category: str
    excerpt: str
    content: str
    image: str
    published_at: datetime
    featured: bool = False


class InsightCreate(InsightBase):
    pass


class InsightUpdate(SQLModel):
    title: str | None = None
    slug: str | None = None
    category: str | None = None
    excerpt: str | None = None
    content: str | None = None
    image: str | None = None
    published_at: datetime | None = None
    featured: bool | None = None


class OfficeBase(SQLModel):
    name: str
    city: str
    country: str
    address: str
    phone: str
    email: str
    manager: str
    region: str
    featured: bool = False


class OfficeCreate(OfficeBase):
    pass


class OfficeUpdate(SQLModel):
    name: str | None = None
    city: str | None = None
    country: str | None = None
    address: str | None = None
    phone: str | None = None
    email: str | None = None
    manager: str | None = None
    region: str | None = None
    featured: bool | None = None


class InquiryCreate(SQLModel):
    full_name: str
    company_name: str
    email: str
    phone: str
    inquiry_type: str
    message: str


class InquiryUpdate(SQLModel):
    status: str | None = None


class DashboardStats(SQLModel):
    total_services: int
    total_sectors: int
    total_projects: int
    total_insights: int
    total_offices: int
    open_inquiries: int
