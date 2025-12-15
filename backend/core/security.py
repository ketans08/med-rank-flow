from passlib.context import CryptContext
import secrets
from datetime import datetime, timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def generate_session_token() -> str:
    """Generate a simple random session token"""
    return secrets.token_urlsafe(32)


def get_session_expiry() -> datetime:
    """Get session expiry time (24 hours)"""
    return datetime.utcnow() + timedelta(hours=24)

