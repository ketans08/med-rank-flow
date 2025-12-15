from beanie import Document
from typing import Optional, Literal, Dict, Any
from datetime import datetime
from pydantic import Field


class PatientTask(Document):
    title: str
    description: str
    patient: dict  # PatientInfo as dict
    assigned_student_id: str
    status: Literal["pending", "accepted", "rejected", "completed"] = "pending"
    quality_score: Optional[float] = Field(None, ge=0, le=5)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    
    class Settings:
        name = "patient_tasks"
        indexes = ["assigned_student_id", "status", "created_at"]

