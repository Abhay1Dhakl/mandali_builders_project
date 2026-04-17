from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, func, select

from app.core.security import create_access_token, verify_password
from app.database import get_session
from app.dependencies import get_current_user
from app.models import (
    AdminUser,
    Commitment,
    CompanyProfile,
    Inquiry,
    Insight,
    Office,
    Project,
    Sector,
    Service,
)
from app.routers.public import (
    serialize_commitment,
    serialize_insight,
    serialize_office,
    serialize_profile,
    serialize_project,
    serialize_sector,
    serialize_service,
)
from app.schemas import (
    AdminLogin,
    CommitmentCreate,
    CommitmentUpdate,
    CompanyProfileBase,
    CompanyProfileUpdate,
    DashboardStats,
    InquiryUpdate,
    InsightCreate,
    InsightUpdate,
    OfficeCreate,
    OfficeUpdate,
    ProjectCreate,
    ProjectUpdate,
    SectorCreate,
    SectorUpdate,
    ServiceCreate,
    ServiceUpdate,
    Token,
)


router = APIRouter(prefix="/api/admin", tags=["admin"])


def update_instance(instance, payload) -> None:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(instance, field, value)


def get_or_404(session: Session, model, item_id: int, detail: str):
    item = session.get(model, item_id)
    if not item:
        raise HTTPException(status_code=404, detail=detail)
    return item


def ensure_sector_exists(session: Session, sector_id: int | None) -> None:
    if sector_id is None:
        return
    if not session.get(Sector, sector_id):
        raise HTTPException(status_code=400, detail="Selected sector does not exist")


def get_sector_lookup(session: Session) -> dict[int, Sector]:
    sectors = session.exec(select(Sector)).all()
    return {int(sector.id): sector for sector in sectors if sector.id is not None}


@router.post("/auth/login", response_model=Token)
def login(payload: AdminLogin, session: Session = Depends(get_session)) -> Token:
    user = session.exec(select(AdminUser).where(AdminUser.username == payload.username)).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    return Token(access_token=create_access_token(user.username))


@router.get("/dashboard", response_model=DashboardStats)
def dashboard(
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> DashboardStats:
    return DashboardStats(
        total_services=session.exec(select(func.count(Service.id))).one(),
        total_sectors=session.exec(select(func.count(Sector.id))).one(),
        total_projects=session.exec(select(func.count(Project.id))).one(),
        total_insights=session.exec(select(func.count(Insight.id))).one(),
        total_offices=session.exec(select(func.count(Office.id))).one(),
        open_inquiries=session.exec(
            select(func.count(Inquiry.id)).where(Inquiry.status != "Closed")
        ).one(),
    )


@router.get("/profile")
def get_profile(
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    profile = session.exec(select(CompanyProfile)).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return serialize_profile(profile)


@router.put("/profile")
def update_profile(
    payload: CompanyProfileUpdate,
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    profile = session.exec(select(CompanyProfile)).first()
    if not profile:
        base = CompanyProfileBase(**payload.model_dump(exclude_none=True))
        profile = CompanyProfile(**base.model_dump())
        session.add(profile)
    else:
        update_instance(profile, payload)
    session.commit()
    session.refresh(profile)
    return serialize_profile(profile)


@router.get("/commitments")
def list_commitments(
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> list[dict]:
    items = session.exec(select(Commitment).order_by(Commitment.display_order)).all()
    return [serialize_commitment(item) for item in items]


@router.post("/commitments", status_code=status.HTTP_201_CREATED)
def create_commitment(
    payload: CommitmentCreate,
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    item = Commitment(**payload.model_dump())
    session.add(item)
    session.commit()
    session.refresh(item)
    return serialize_commitment(item)


@router.put("/commitments/{item_id}")
def update_commitment(
    item_id: int,
    payload: CommitmentUpdate,
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    item = get_or_404(session, Commitment, item_id, "Commitment not found")
    update_instance(item, payload)
    session.commit()
    session.refresh(item)
    return serialize_commitment(item)


@router.delete("/commitments/{item_id}")
def delete_commitment(
    item_id: int,
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    item = get_or_404(session, Commitment, item_id, "Commitment not found")
    session.delete(item)
    session.commit()
    return {"message": "Commitment deleted"}


@router.get("/services")
def list_services(
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> list[dict]:
    items = session.exec(select(Service).order_by(Service.display_order)).all()
    return [serialize_service(item) for item in items]


@router.post("/services", status_code=status.HTTP_201_CREATED)
def create_service(
    payload: ServiceCreate,
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    item = Service(**payload.model_dump())
    session.add(item)
    session.commit()
    session.refresh(item)
    return serialize_service(item)


@router.put("/services/{item_id}")
def update_service(
    item_id: int,
    payload: ServiceUpdate,
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    item = get_or_404(session, Service, item_id, "Service not found")
    update_instance(item, payload)
    session.commit()
    session.refresh(item)
    return serialize_service(item)


@router.delete("/services/{item_id}")
def delete_service(
    item_id: int,
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    item = get_or_404(session, Service, item_id, "Service not found")
    session.delete(item)
    session.commit()
    return {"message": "Service deleted"}


@router.get("/sectors")
def list_sectors(
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> list[dict]:
    items = session.exec(select(Sector).order_by(Sector.display_order)).all()
    return [serialize_sector(item) for item in items]


@router.post("/sectors", status_code=status.HTTP_201_CREATED)
def create_sector(
    payload: SectorCreate,
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    item = Sector(**payload.model_dump())
    session.add(item)
    session.commit()
    session.refresh(item)
    return serialize_sector(item)


@router.put("/sectors/{item_id}")
def update_sector(
    item_id: int,
    payload: SectorUpdate,
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    item = get_or_404(session, Sector, item_id, "Sector not found")
    update_instance(item, payload)
    session.commit()
    session.refresh(item)
    return serialize_sector(item)


@router.delete("/sectors/{item_id}")
def delete_sector(
    item_id: int,
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    item = get_or_404(session, Sector, item_id, "Sector not found")
    session.delete(item)
    session.commit()
    return {"message": "Sector deleted"}


@router.get("/projects")
def list_projects(
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> list[dict]:
    items = session.exec(select(Project).order_by(Project.year_completed.desc(), Project.title)).all()
    lookup = get_sector_lookup(session)
    return [serialize_project(item, lookup) for item in items]


@router.post("/projects", status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    ensure_sector_exists(session, payload.sector_id)
    item = Project(**payload.model_dump())
    session.add(item)
    session.commit()
    session.refresh(item)
    return serialize_project(item, get_sector_lookup(session))


@router.put("/projects/{item_id}")
def update_project(
    item_id: int,
    payload: ProjectUpdate,
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    item = get_or_404(session, Project, item_id, "Project not found")
    if payload.sector_id is not None:
        ensure_sector_exists(session, payload.sector_id)
    update_instance(item, payload)
    session.commit()
    session.refresh(item)
    return serialize_project(item, get_sector_lookup(session))


@router.delete("/projects/{item_id}")
def delete_project(
    item_id: int,
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    item = get_or_404(session, Project, item_id, "Project not found")
    session.delete(item)
    session.commit()
    return {"message": "Project deleted"}


@router.get("/insights")
def list_insights(
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> list[dict]:
    items = session.exec(select(Insight).order_by(Insight.published_at.desc())).all()
    return [serialize_insight(item) for item in items]


@router.post("/insights", status_code=status.HTTP_201_CREATED)
def create_insight(
    payload: InsightCreate,
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    item = Insight(**payload.model_dump())
    session.add(item)
    session.commit()
    session.refresh(item)
    return serialize_insight(item)


@router.put("/insights/{item_id}")
def update_insight(
    item_id: int,
    payload: InsightUpdate,
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    item = get_or_404(session, Insight, item_id, "Insight not found")
    update_instance(item, payload)
    session.commit()
    session.refresh(item)
    return serialize_insight(item)


@router.delete("/insights/{item_id}")
def delete_insight(
    item_id: int,
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    item = get_or_404(session, Insight, item_id, "Insight not found")
    session.delete(item)
    session.commit()
    return {"message": "Insight deleted"}


@router.get("/offices")
def list_offices(
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> list[dict]:
    items = session.exec(select(Office).order_by(Office.city)).all()
    return [serialize_office(item) for item in items]


@router.post("/offices", status_code=status.HTTP_201_CREATED)
def create_office(
    payload: OfficeCreate,
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    item = Office(**payload.model_dump())
    session.add(item)
    session.commit()
    session.refresh(item)
    return serialize_office(item)


@router.put("/offices/{item_id}")
def update_office(
    item_id: int,
    payload: OfficeUpdate,
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    item = get_or_404(session, Office, item_id, "Office not found")
    update_instance(item, payload)
    session.commit()
    session.refresh(item)
    return serialize_office(item)


@router.delete("/offices/{item_id}")
def delete_office(
    item_id: int,
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    item = get_or_404(session, Office, item_id, "Office not found")
    session.delete(item)
    session.commit()
    return {"message": "Office deleted"}


@router.get("/inquiries")
def list_inquiries(
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> list[dict]:
    items = session.exec(select(Inquiry).order_by(Inquiry.created_at.desc())).all()
    return [item.model_dump() for item in items]


@router.put("/inquiries/{item_id}")
def update_inquiry(
    item_id: int,
    payload: InquiryUpdate,
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    item = get_or_404(session, Inquiry, item_id, "Inquiry not found")
    update_instance(item, payload)
    session.commit()
    session.refresh(item)
    return item.model_dump()


@router.delete("/inquiries/{item_id}")
def delete_inquiry(
    item_id: int,
    _: AdminUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    item = get_or_404(session, Inquiry, item_id, "Inquiry not found")
    session.delete(item)
    session.commit()
    return {"message": "Inquiry deleted"}
