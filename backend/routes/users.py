from fastapi import APIRouter, Depends
from typing import List
from schemas.user import UserResponseSchema
from models.user import User
from core.dependencies import get_current_admin

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/students", response_model=List[UserResponseSchema])
async def get_students(admin: User = Depends(get_current_admin)):
    """Get all students (admin only)"""
    students = await User.find(User.role == "student").to_list()
    return [
        UserResponseSchema(
            id=str(s.id),
            name=s.name,
            email=s.email,
            role=s.role
        )
        for s in students
    ]

