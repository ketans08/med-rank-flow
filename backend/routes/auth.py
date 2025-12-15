from fastapi import APIRouter, HTTPException, status, Depends
from schemas.auth import LoginRequest, TokenResponse
from models.user import User
from models.session import Session
from core.security import verify_password, generate_session_token, get_session_expiry
from core.dependencies import get_current_user
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest):
    """Simple email/password authentication"""
    try:
        user = await User.find_one(User.email == credentials.email)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Verify password
        if not verify_password(credentials.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Generate simple session token
        token = generate_session_token()
        expires_at = get_session_expiry()
        
        # Create session
        session = Session(
            user_id=str(user.id),
            token=token,
            expires_at=expires_at
        )
        await session.insert()
        
        return TokenResponse(
            access_token=token,
            user={
                "id": str(user.id),
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"Login error: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """Logout and delete session"""
    # Delete all sessions for this user
    sessions = await Session.find(Session.user_id == str(current_user.id)).to_list()
    for session in sessions:
        await session.delete()
    
    return {"message": "Logged out successfully"}

