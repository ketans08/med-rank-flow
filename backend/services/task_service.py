from typing import List, Optional
from datetime import datetime
from models.patient_task import PatientTask
from models.task_response import TaskResponse
from models.analytics_log import AnalyticsLog
from models.user import User
from schemas.task import TaskCreateSchema, TaskScoreSchema


class TaskService:
    
    @staticmethod
    async def create_task(task_data: TaskCreateSchema, admin_id: str) -> PatientTask:
        """Create a new patient-linked task"""
        task = PatientTask(
            title=task_data.title,
            description=task_data.description,
            patient=task_data.patient.dict(),
            assigned_student_id=task_data.assigned_student_id,
            status="pending"
        )
        await task.insert()
        
        # Log analytics
        await AnalyticsLog(
            user_id=admin_id,
            task_id=str(task.id),
            role="admin",
            action="task_created",
            metadata={"title": task.title, "student_id": task.assigned_student_id}
        ).insert()
        
        return task
    
    @staticmethod
    async def get_admin_tasks() -> List[PatientTask]:
        """Get all tasks for admin view"""
        tasks = await PatientTask.find().sort(-PatientTask.created_at).to_list()
        
        # Enrich with student names
        student_ids = list(set(t.assigned_student_id for t in tasks))
        if student_ids:
            from beanie.odm.operators.find.comparison import In
            students = await User.find(In(User.id, student_ids)).to_list()
            student_map = {str(s.id): s.name for s in students}
            
            for task in tasks:
                task.assigned_student_name = student_map.get(task.assigned_student_id)
        
        return tasks
    
    @staticmethod
    async def get_student_tasks(student_id: str) -> List[PatientTask]:
        """Get all tasks assigned to a specific student"""
        return await PatientTask.find(
            PatientTask.assigned_student_id == student_id
        ).sort(-PatientTask.created_at).to_list()
    
    @staticmethod
    async def accept_task(task_id: str, student_id: str) -> PatientTask:
        """Accept a pending task"""
        task = await PatientTask.get(task_id)
        if not task:
            raise ValueError("Task not found")
        
        if task.assigned_student_id != student_id:
            raise ValueError("Task not assigned to this student")
        
        if task.status != "pending":
            raise ValueError("Task is not pending")
        
        task.status = "accepted"
        await task.save()
        
        # Create response
        await TaskResponse(
            task_id=task_id,
            student_id=student_id,
            action="accepted"
        ).insert()
        
        # Log analytics
        await AnalyticsLog(
            user_id=student_id,
            task_id=task_id,
            role="student",
            action="task_accepted"
        ).insert()
        
        return task
    
    @staticmethod
    async def reject_task(task_id: str, student_id: str, reject_reason: str) -> PatientTask:
        """Reject a pending task"""
        task = await PatientTask.get(task_id)
        if not task:
            raise ValueError("Task not found")
        
        if task.assigned_student_id != student_id:
            raise ValueError("Task not assigned to this student")
        
        if task.status != "pending":
            raise ValueError("Task is not pending")
        
        task.status = "rejected"
        await task.save()
        
        # Create response
        await TaskResponse(
            task_id=task_id,
            student_id=student_id,
            action="rejected",
            reject_reason=reject_reason
        ).insert()
        
        # Log analytics
        await AnalyticsLog(
            user_id=student_id,
            task_id=task_id,
            role="student",
            action="task_rejected",
            metadata={"reason": reject_reason}
        ).insert()
        
        return task
    
    @staticmethod
    async def complete_task(task_id: str, student_id: str) -> PatientTask:
        """Mark an accepted task as completed"""
        task = await PatientTask.get(task_id)
        if not task:
            raise ValueError("Task not found")
        
        if task.assigned_student_id != student_id:
            raise ValueError("Task not assigned to this student")
        
        if task.status != "accepted":
            raise ValueError("Task must be accepted before completion")
        
        task.status = "completed"
        task.completed_at = datetime.utcnow()
        await task.save()
        
        # Create response
        await TaskResponse(
            task_id=task_id,
            student_id=student_id,
            action="completed"
        ).insert()
        
        # Log analytics
        await AnalyticsLog(
            user_id=student_id,
            task_id=task_id,
            role="student",
            action="task_completed"
        ).insert()
        
        return task
    
    @staticmethod
    async def score_task(task_id: str, score_data: TaskScoreSchema, admin_id: str) -> PatientTask:
        """Assign a quality score to a completed task (admin only)"""
        task = await PatientTask.get(task_id)
        if not task:
            raise ValueError("Task not found")
        
        if task.status != "completed":
            raise ValueError("Task must be completed before scoring")
        
        task.quality_score = score_data.quality_score
        await task.save()
        
        # Log analytics
        await AnalyticsLog(
            user_id=admin_id,
            task_id=task_id,
            role="admin",
            action="task_scored",
            metadata={"score": score_data.quality_score}
        ).insert()
        
        return task

