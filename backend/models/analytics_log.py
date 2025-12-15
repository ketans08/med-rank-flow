from beanie import Document
from typing import Literal, Optional
from datetime import datetime
from pydantic import Field


class AnalyticsLog(Document):
    user_id: str
    task_id: Optional[str] = None
    role: Literal["admin", "student"]
    action: str  # e.g., "task_created", "task_accepted", "task_scored"
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: dict = Field(default_factory=dict)
    
    class Settings:
        name = "analytics_logs"
        indexes = ["user_id", "task_id", "role", "timestamp", "action"]

