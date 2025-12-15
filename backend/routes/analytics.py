from fastapi import APIRouter, HTTPException, status, Depends
from schemas.analytics import (
    StudentRankingSchema, StudentAnalyticsSchema, AdminAnalyticsSchema
)
from services.analytics_service import AnalyticsService
from core.dependencies import get_current_admin, get_current_student
from models.user import User

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/rankings", response_model=list[StudentRankingSchema])
async def get_rankings(admin: User = Depends(get_current_admin)):
    """Get student rankings (admin only)"""
    rankings = await AnalyticsService.get_student_rankings()
    return [
        StudentRankingSchema(**r) for r in rankings
    ]


@router.get("/student/{student_id}", response_model=StudentAnalyticsSchema)
async def get_student_analytics(
    student_id: str,
    admin: User = Depends(get_current_admin)
):
    """Get analytics for a specific student (admin only)"""
    try:
        analytics = await AnalyticsService.get_student_analytics(student_id)
        return StudentAnalyticsSchema(**analytics)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get("/student", response_model=StudentAnalyticsSchema)
async def get_my_analytics(student: User = Depends(get_current_student)):
    """Get analytics for current student"""
    try:
        analytics = await AnalyticsService.get_student_analytics(str(student.id))
        return StudentAnalyticsSchema(**analytics)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get("/admin", response_model=AdminAnalyticsSchema)
async def get_admin_analytics(admin: User = Depends(get_current_admin)):
    """Get comprehensive admin analytics"""
    analytics = await AnalyticsService.get_admin_analytics()
    return AdminAnalyticsSchema(**analytics)

