from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, desc, select

from app.database import get_session
from app.models import Commitment, CompanyProfile, Inquiry, Insight, Office, Project, Sector, Service
from app.schemas import InquiryCreate


router = APIRouter(prefix="/api/public", tags=["public"])


def serialize_profile(profile: CompanyProfile) -> dict:
    return profile.model_dump()


def serialize_commitment(commitment: Commitment) -> dict:
    return commitment.model_dump()


def serialize_service(service: Service) -> dict:
    return service.model_dump()


def serialize_sector(sector: Sector) -> dict:
    return sector.model_dump()


def serialize_project(project: Project, sector_lookup: dict[int, Sector]) -> dict:
    payload = project.model_dump()
    sector = sector_lookup.get(project.sector_id or -1)
    payload["sector"] = sector.model_dump() if sector else None
    return payload


def serialize_insight(insight: Insight) -> dict:
    return insight.model_dump()


def serialize_office(office: Office) -> dict:
    return office.model_dump()


def get_profile(session: Session) -> CompanyProfile:
    profile = session.exec(select(CompanyProfile)).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")
    return profile


def get_sector_lookup(session: Session) -> dict[int, Sector]:
    sectors = session.exec(select(Sector)).all()
    return {int(sector.id): sector for sector in sectors if sector.id is not None}


@router.get("/site")
def site_data(session: Session = Depends(get_session)) -> dict:
    profile = get_profile(session)
    commitments = session.exec(select(Commitment).order_by(Commitment.display_order)).all()
    services = session.exec(select(Service).order_by(Service.display_order)).all()
    sectors = session.exec(select(Sector).order_by(Sector.display_order)).all()
    projects = session.exec(select(Project).order_by(desc(Project.year_completed), Project.title)).all()
    insights = session.exec(select(Insight).order_by(desc(Insight.published_at))).all()
    offices = session.exec(select(Office).order_by(Office.city)).all()
    sector_lookup = get_sector_lookup(session)

    serialized_projects = [serialize_project(project, sector_lookup) for project in projects]

    return {
        "profile": serialize_profile(profile),
        "commitments": [serialize_commitment(item) for item in commitments],
        "services": [serialize_service(item) for item in services],
        "sectors": [serialize_sector(item) for item in sectors],
        "projects": serialized_projects,
        "featured_projects": [item for item in serialized_projects if item["featured"]][:4],
        "insights": [serialize_insight(item) for item in insights],
        "featured_insights": [serialize_insight(item) for item in insights if item.featured][:3],
        "offices": [serialize_office(item) for item in offices],
    }


@router.get("/profile")
def company_profile(session: Session = Depends(get_session)) -> dict:
    return serialize_profile(get_profile(session))


@router.get("/services")
def list_services(session: Session = Depends(get_session)) -> list[dict]:
    services = session.exec(select(Service).order_by(Service.display_order)).all()
    return [serialize_service(item) for item in services]


@router.get("/sectors")
def list_sectors(session: Session = Depends(get_session)) -> list[dict]:
    sectors = session.exec(select(Sector).order_by(Sector.display_order)).all()
    return [serialize_sector(item) for item in sectors]


@router.get("/projects")
def list_projects(
    sector: Optional[str] = Query(default=None),
    featured: Optional[bool] = Query(default=None),
    session: Session = Depends(get_session),
) -> list[dict]:
    projects = session.exec(select(Project).order_by(desc(Project.year_completed), Project.title)).all()
    sector_lookup = get_sector_lookup(session)

    serialized = [serialize_project(item, sector_lookup) for item in projects]
    if sector:
        serialized = [item for item in serialized if item["sector"] and item["sector"]["slug"] == sector]
    if featured is not None:
        serialized = [item for item in serialized if item["featured"] is featured]
    return serialized


@router.get("/projects/{slug}")
def project_detail(slug: str, session: Session = Depends(get_session)) -> dict:
    project = session.exec(select(Project).where(Project.slug == slug)).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return serialize_project(project, get_sector_lookup(session))


@router.get("/insights")
def list_insights(session: Session = Depends(get_session)) -> list[dict]:
    insights = session.exec(select(Insight).order_by(desc(Insight.published_at))).all()
    return [serialize_insight(item) for item in insights]


@router.get("/insights/{slug}")
def insight_detail(slug: str, session: Session = Depends(get_session)) -> dict:
    insight = session.exec(select(Insight).where(Insight.slug == slug)).first()
    if not insight:
        raise HTTPException(status_code=404, detail="Insight not found")
    return serialize_insight(insight)


@router.get("/offices")
def list_offices(session: Session = Depends(get_session)) -> list[dict]:
    offices = session.exec(select(Office).order_by(Office.city)).all()
    return [serialize_office(item) for item in offices]


@router.post("/contact", status_code=status.HTTP_201_CREATED)
def create_inquiry(payload: InquiryCreate, session: Session = Depends(get_session)) -> dict:
    inquiry = Inquiry(**payload.model_dump())
    session.add(inquiry)
    session.commit()
    session.refresh(inquiry)
    return {
        "message": "Inquiry submitted successfully",
        "inquiry_id": inquiry.id,
    }
