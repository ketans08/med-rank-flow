from beanie import Document
from typing import Optional, Literal
from datetime import datetime
from pydantic import Field


class TaskResponse(Document):
    task_id: str
    student_id: str
    action: Literal["accepted", "rejected", "completed"]
    reject_reason: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "task_responses"
        indexes = ["task_id", "student_id", "timestamp"]

