from fastapi import APIRouter, HTTPException, status
from datetime import timedelta
from schemas.auth import LoginRequest, TokenResponse
from models.user import User
from core.security import verify_password, create_access_token
from core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest):
    """Authenticate user and return JWT token"""
    user = await User.find_one(User.email == credentials.email)
    
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token_expires = timedelta(minutes=settings.jwt_access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role},
        expires_delta=access_token_expires
    )
    
    return TokenResponse(
        access_token=access_token,
        user={
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    )

