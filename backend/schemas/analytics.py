from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class StudentRankingSchema(BaseModel):
    student_id: str
    student_name: str
    rank: int
    tasks_completed: int
    average_score: float
    acceptance_rate: float


class PerformanceTimelineSchema(BaseModel):
    date: str
    task: str
    score: float


class WeeklyProgressSchema(BaseModel):
    week: str
    score: float
    tasks: int
    improvement: float


class TaskTypePerformanceSchema(BaseModel):
    type: str
    avg_score: float
    completed: int
    color: str


class StudentAnalyticsSchema(BaseModel):
    student_info: Dict[str, Any]
    performance_history: List[PerformanceTimelineSchema]
    weekly_progress: List[WeeklyProgressSchema]
    task_type_performance: List[TaskTypePerformanceSchema]
    upcoming_tasks: List[Dict[str, Any]]


class AdminAnalyticsSchema(BaseModel):
    total_students: int
    average_score: float
    tasks_this_month: int
    completion_rate: float
    student_performance: List[Dict[str, Any]]
    monthly_trends: List[Dict[str, Any]]
    task_distribution: List[Dict[str, Any]]
    top_performers: List[Dict[str, Any]]

