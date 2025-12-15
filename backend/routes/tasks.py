from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from schemas.task import (
    TaskCreateSchema, TaskResponseSchema, TaskAcceptSchema,
    TaskRejectSchema, TaskScoreSchema
)
from services.task_service import TaskService
from core.dependencies import get_current_admin, get_current_student
from models.user import User
from models.patient_task import PatientTask

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("", response_model=TaskResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreateSchema,
    admin: User = Depends(get_current_admin)
):
    """Create a new patient-linked task (admin only)"""
    try:
        task = await TaskService.create_task(task_data, str(admin.id))
        return TaskResponseSchema(
            id=str(task.id),
            title=task.title,
            description=task.description,
            patient=task.patient,
            assigned_student_id=task.assigned_student_id,
            assigned_student_name=task.assigned_student_name,
            status=task.status,
            quality_score=task.quality_score,
            created_at=task.created_at,
            completed_at=task.completed_at
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/admin", response_model=List[TaskResponseSchema])
async def get_admin_tasks(admin: User = Depends(get_current_admin)):
    """Get all tasks (admin view)"""
    tasks = await TaskService.get_admin_tasks()
    return [
        TaskResponseSchema(
            id=str(task.id),
            title=task.title,
            description=task.description,
            patient=task.patient,
            assigned_student_id=task.assigned_student_id,
            assigned_student_name=getattr(task, "assigned_student_name", None),
            status=task.status,
            quality_score=task.quality_score,
            created_at=task.created_at,
            completed_at=task.completed_at
        )
        for task in tasks
    ]


@router.get("/student", response_model=List[TaskResponseSchema])
async def get_student_tasks(student: User = Depends(get_current_student)):
    """Get tasks assigned to current student"""
    tasks = await TaskService.get_student_tasks(str(student.id))
    return [
        TaskResponseSchema(
            id=str(task.id),
            title=task.title,
            description=task.description,
            patient=task.patient,
            assigned_student_id=task.assigned_student_id,
            status=task.status,
            quality_score=task.quality_score,
            created_at=task.created_at,
            completed_at=task.completed_at
        )
        for task in tasks
    ]


@router.post("/{task_id}/accept", response_model=TaskResponseSchema)
async def accept_task(
    task_id: str,
    student: User = Depends(get_current_student)
):
    """Accept a pending task"""
    try:
        task = await TaskService.accept_task(task_id, str(student.id))
        return TaskResponseSchema(
            id=str(task.id),
            title=task.title,
            description=task.description,
            patient=task.patient,
            assigned_student_id=task.assigned_student_id,
            status=task.status,
            quality_score=task.quality_score,
            created_at=task.created_at,
            completed_at=task.completed_at
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/{task_id}/reject", response_model=TaskResponseSchema)
async def reject_task(
    task_id: str,
    reject_data: TaskRejectSchema,
    student: User = Depends(get_current_student)
):
    """Reject a pending task"""
    try:
        task = await TaskService.reject_task(task_id, str(student.id), reject_data.reject_reason)
        return TaskResponseSchema(
            id=str(task.id),
            title=task.title,
            description=task.description,
            patient=task.patient,
            assigned_student_id=task.assigned_student_id,
            status=task.status,
            quality_score=task.quality_score,
            created_at=task.created_at,
            completed_at=task.completed_at
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/{task_id}/complete", response_model=TaskResponseSchema)
async def complete_task(
    task_id: str,
    student: User = Depends(get_current_student)
):
    """Mark an accepted task as completed"""
    try:
        task = await TaskService.complete_task(task_id, str(student.id))
        return TaskResponseSchema(
            id=str(task.id),
            title=task.title,
            description=task.description,
            patient=task.patient,
            assigned_student_id=task.assigned_student_id,
            status=task.status,
            quality_score=task.quality_score,
            created_at=task.created_at,
            completed_at=task.completed_at
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/{task_id}/score", response_model=TaskResponseSchema)
async def score_task(
    task_id: str,
    score_data: TaskScoreSchema,
    admin: User = Depends(get_current_admin)
):
    """Assign quality score to a completed task (admin only)"""
    try:
        task = await TaskService.score_task(task_id, score_data, str(admin.id))
        return TaskResponseSchema(
            id=str(task.id),
            title=task.title,
            description=task.description,
            patient=task.patient,
            assigned_student_id=task.assigned_student_id,
            assigned_student_name=getattr(task, "assigned_student_name", None),
            status=task.status,
            quality_score=task.quality_score,
            created_at=task.created_at,
            completed_at=task.completed_at
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

