import secrets
import bcrypt
from datetime import datetime, timedelta


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    try:
        # Handle both string and bytes
        if isinstance(hashed_password, str):
            hashed_password = hashed_password.encode('utf-8')
        if isinstance(plain_password, str):
            plain_password = plain_password.encode('utf-8')
        return bcrypt.checkpw(plain_password, hashed_password)
    except Exception as e:
        print(f"Password verification error: {e}")
        return False


def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt directly"""
    # Bcrypt has 72 byte limit, but our passwords are short
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def generate_session_token() -> str:
    """Generate a simple random session token"""
    return secrets.token_urlsafe(32)


def get_session_expiry() -> datetime:
    """Get session expiry time (24 hours)"""
    return datetime.utcnow() + timedelta(hours=24)

