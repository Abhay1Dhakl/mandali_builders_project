from __future__ import annotations

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select

from app.core.security import decode_token
from app.database import get_session
from app.models import AdminUser


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/admin/auth/login")


def get_current_user(
    session: Session = Depends(get_session),
    token: str = Depends(oauth2_scheme),
) -> AdminUser:
    username = decode_token(token)
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )

    user = session.exec(select(AdminUser).where(AdminUser.username == username)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin user not found",
        )
    return user
