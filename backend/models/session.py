from beanie import Document
from datetime import datetime, timedelta
from typing import Optional
from pydantic import Field


class Session(Document):
    user_id: str
    token: str = Field(unique=True)
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "sessions"
        indexes = ["user_id", "token", "expires_at"]

