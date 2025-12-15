from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime


class PatientInfoSchema(BaseModel):
    name: str
    age: int
    primary_complaint: str
    notes: Optional[str] = None


class TaskCreateSchema(BaseModel):
    title: str
    description: str
    patient: PatientInfoSchema
    assigned_student_id: str


class TaskUpdateSchema(BaseModel):
    status: Optional[Literal["pending", "accepted", "rejected", "completed"]] = None
    quality_score: Optional[float] = Field(None, ge=0, le=5)


class TaskResponseSchema(BaseModel):
    id: str
    title: str
    description: str
    patient: dict  # Allow dict for flexibility
    assigned_student_id: str
    assigned_student_name: Optional[str] = None
    status: Literal["pending", "accepted", "rejected", "completed"]
    quality_score: Optional[float] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TaskAcceptSchema(BaseModel):
    pass


class TaskRejectSchema(BaseModel):
    reject_reason: str


class TaskScoreSchema(BaseModel):
    quality_score: float = Field(ge=0, le=5)

