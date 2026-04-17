from __future__ import annotations

from datetime import datetime
from typing import Optional

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
    company_name: Optional[str] = None
    tagline: Optional[str] = None
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    overview: Optional[str] = None
    vision: Optional[str] = None
    years_experience: Optional[int] = None
    completed_projects: Optional[int] = None
    annual_volume: Optional[str] = None
    client_retention: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    headquarters: Optional[str] = None
    hero_primary_cta: Optional[str] = None
    hero_secondary_cta: Optional[str] = None


class CommitmentBase(SQLModel):
    title: str
    subtitle: str
    description: str
    accent: str
    display_order: int = 0


class CommitmentCreate(CommitmentBase):
    pass


class CommitmentUpdate(SQLModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    accent: Optional[str] = None
    display_order: Optional[int] = None


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
    name: Optional[str] = None
    slug: Optional[str] = None
    short_description: Optional[str] = None
    detailed_description: Optional[str] = None
    icon: Optional[str] = None
    display_order: Optional[int] = None


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
    name: Optional[str] = None
    slug: Optional[str] = None
    short_description: Optional[str] = None
    hero_stat: Optional[str] = None
    image: Optional[str] = None
    display_order: Optional[int] = None


class ProjectBase(SQLModel):
    title: str
    slug: str
    client_name: str
    location: str
    sector_id: Optional[int] = None
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
    title: Optional[str] = None
    slug: Optional[str] = None
    client_name: Optional[str] = None
    location: Optional[str] = None
    sector_id: Optional[int] = None
    service_line: Optional[str] = None
    size: Optional[str] = None
    year_completed: Optional[int] = None
    status: Optional[str] = None
    headline: Optional[str] = None
    description: Optional[str] = None
    challenge: Optional[str] = None
    solution: Optional[str] = None
    impact: Optional[str] = None
    image: Optional[str] = None
    featured: Optional[bool] = None


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
    title: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    image: Optional[str] = None
    published_at: Optional[datetime] = None
    featured: Optional[bool] = None


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
    name: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    manager: Optional[str] = None
    region: Optional[str] = None
    featured: Optional[bool] = None


class InquiryCreate(SQLModel):
    full_name: str
    company_name: str
    email: str
    phone: str
    inquiry_type: str
    message: str


class InquiryUpdate(SQLModel):
    status: Optional[str] = None


class DashboardStats(SQLModel):
    total_services: int
    total_sectors: int
    total_projects: int
    total_insights: int
    total_offices: int
    open_inquiries: int
