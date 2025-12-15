from typing import Dict, List, Any
from datetime import datetime, timedelta
from models.patient_task import PatientTask
from models.task_response import TaskResponse
from models.user import User
from beanie.odm.operators.find.comparison import In


class AnalyticsService:
    
    @staticmethod
    async def get_student_rankings() -> List[Dict[str, Any]]:
        """Get student rankings based on tasks completed, avg score, and acceptance rate"""
        pipeline = [
            {
                "$match": {
                    "status": "completed",
                    "quality_score": {"$ne": None}
                }
            },
            {
                "$group": {
                    "_id": "$assigned_student_id",
                    "tasks_completed": {"$sum": 1},
                    "average_score": {"$avg": "$quality_score"},
                    "total_score": {"$sum": "$quality_score"}
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "_id",
                    "foreignField": "_id",
                    "as": "student"
                }
            },
            {
                "$unwind": "$student"
            },
            {
                "$project": {
                    "student_id": "$_id",
                    "student_name": "$student.name",
                    "tasks_completed": 1,
                    "average_score": {"$round": ["$average_score", 2]}
                }
            }
        ]
        
        completed_tasks = await PatientTask.aggregate(pipeline).to_list()
        
        # Get acceptance rates
        acceptance_pipeline = [
            {
                "$group": {
                    "_id": "$student_id",
                    "total_responses": {"$sum": 1},
                    "accepted": {
                        "$sum": {"$cond": [{"$eq": ["$action", "accepted"]}, 1, 0]}
                    }
                }
            }
        ]
        
        acceptance_data = await TaskResponse.aggregate(acceptance_pipeline).to_list()
        acceptance_map = {
            item["_id"]: (item["accepted"] / item["total_responses"] * 100) 
            if item["total_responses"] > 0 else 0
            for item in acceptance_data
        }
        
        # Combine data
        rankings = []
        for task_data in completed_tasks:
            student_id = task_data["student_id"]
            rankings.append({
                "student_id": student_id,
                "student_name": task_data["student_name"],
                "tasks_completed": task_data["tasks_completed"],
                "average_score": task_data["average_score"],
                "acceptance_rate": round(acceptance_map.get(student_id, 0), 2)
            })
        
        # Sort by average score descending, then by tasks completed
        rankings.sort(key=lambda x: (x["average_score"], x["tasks_completed"]), reverse=True)
        
        # Add rank
        for idx, ranking in enumerate(rankings, 1):
            ranking["rank"] = idx
        
        return rankings
    
    @staticmethod
    async def get_student_analytics(student_id: str) -> Dict[str, Any]:
        """Get comprehensive analytics for a specific student"""
        # Get student info
        student = await User.get(student_id)
        if not student:
            raise ValueError("Student not found")
        
        # Get all completed tasks for this student
        completed_tasks = await PatientTask.find(
            PatientTask.assigned_student_id == student_id,
            PatientTask.status == "completed",
            PatientTask.quality_score != None
        ).to_list()
        
        # Performance history (last 7 tasks)
        recent_tasks = sorted(completed_tasks, key=lambda x: x.completed_at or x.created_at, reverse=True)[:7]
        performance_history = [
            {
                "date": (task.completed_at or task.created_at).strftime("%Y-%m-%d"),
                "task": task.title,
                "score": task.quality_score or 0
            }
            for task in reversed(recent_tasks)
        ]
        
        # Weekly progress (last 6 weeks)
        weekly_progress = []
        for i in range(6, 0, -1):
            week_start = datetime.utcnow() - timedelta(weeks=i)
            week_end = week_start + timedelta(weeks=1)
            
            week_tasks = [
                t for t in completed_tasks
                if t.completed_at and week_start <= t.completed_at < week_end
            ]
            
            if week_tasks:
                avg_score = sum(t.quality_score or 0 for t in week_tasks) / len(week_tasks)
                weekly_progress.append({
                    "week": f"Week {7-i}",
                    "score": round(avg_score, 1),
                    "tasks": len(week_tasks),
                    "improvement": 0.2  # Simplified for now
                })
        
        # Task type performance
        task_types = {}
        for task in completed_tasks:
            task_type = task.title.split()[0] if task.title else "Other"
            if task_type not in task_types:
                task_types[task_type] = {"scores": [], "count": 0}
            task_types[task_type]["scores"].append(task.quality_score or 0)
            task_types[task_type]["count"] += 1
        
        task_type_performance = []
        colors = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"]
        for idx, (task_type, data) in enumerate(task_types.items()):
            avg_score = sum(data["scores"]) / len(data["scores"])
            task_type_performance.append({
                "type": task_type,
                "avg_score": round(avg_score, 1),
                "completed": data["count"],
                "color": colors[idx % len(colors)]
            })
        
        # Upcoming tasks (pending or accepted)
        upcoming_tasks = await PatientTask.find(
            PatientTask.assigned_student_id == student_id,
            In(PatientTask.status, ["pending", "accepted"])
        ).sort(-PatientTask.created_at).limit(3).to_list()
        
        upcoming = [
            {
                "id": str(task.id),
                "title": task.title,
                "due": (task.created_at + timedelta(days=7)).strftime("%Y-%m-%d"),
                "priority": "high" if task.patient.get("age", 0) > 70 else "medium",
                "est": "2 h"
            }
            for task in upcoming_tasks
        ]
        
        # Calculate average score and rank
        avg_score = sum(t.quality_score or 0 for t in completed_tasks) / len(completed_tasks) if completed_tasks else 0
        
        # Get rank
        rankings = await AnalyticsService.get_student_rankings()
        rank = next((r["rank"] for r in rankings if r["student_id"] == student_id), len(rankings) + 1)
        
        return {
            "student_info": {
                "name": student.name,
                "id": str(student.id),
                "specialization": "Emergency Medicine",  # Could be added to User model
                "semester": "3rd Semester",  # Could be added to User model
                "avgScore": round(avg_score, 1),
                "rank": rank,
                "totalStudents": len(rankings) + 1,
                "percentile": round((1 - (rank - 1) / (len(rankings) + 1)) * 100, 0) if rankings else 0
            },
            "performance_history": performance_history,
            "weekly_progress": weekly_progress,
            "task_type_performance": task_type_performance,
            "upcoming_tasks": upcoming
        }
    
    @staticmethod
    async def get_admin_analytics() -> Dict[str, Any]:
        """Get comprehensive analytics for admin dashboard"""
        # Total students
        total_students = await User.find(User.role == "student").count()
        
        # Average score across all completed tasks
        avg_score_pipeline = [
            {
                "$match": {
                    "status": "completed",
                    "quality_score": {"$ne": None}
                }
            },
            {
                "$group": {
                    "_id": None,
                    "avg_score": {"$avg": "$quality_score"}
                }
            }
        ]
        avg_result = await PatientTask.aggregate(avg_score_pipeline).to_list()
        average_score = round(avg_result[0]["avg_score"], 1) if avg_result else 0.0
        
        # Tasks this month
        month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        tasks_this_month = await PatientTask.find(
            PatientTask.created_at >= month_start
        ).count()
        
        # Completion rate
        total_tasks = await PatientTask.find().count()
        completed_tasks = await PatientTask.find(PatientTask.status == "completed").count()
        completion_rate = round((completed_tasks / total_tasks * 100), 0) if total_tasks > 0 else 0
        
        # Student performance data
        rankings = await AnalyticsService.get_student_rankings()
        student_performance = [
            {
                "name": r["student_name"],
                "avgScore": r["average_score"],
                "tasksCompleted": r["tasks_completed"],
                "acceptanceRate": r["acceptance_rate"],
                "trend": "up"  # Simplified
            }
            for r in rankings[:8]
        ]
        
        # Monthly trends (last 8 months)
        monthly_trends = []
        for i in range(8, 0, -1):
            month_start = (datetime.utcnow() - timedelta(days=30*i)).replace(day=1)
            month_end = (month_start + timedelta(days=32)).replace(day=1)
            
            month_tasks = await PatientTask.find(
                PatientTask.created_at >= month_start,
                PatientTask.created_at < month_end
            ).to_list()
            
            completed_month = [t for t in month_tasks if t.status == "completed"]
            avg_score_month = sum(t.quality_score or 0 for t in completed_month) / len(completed_month) if completed_month else 0
            
            monthly_trends.append({
                "month": month_start.strftime("%b"),
                "averageScore": round(avg_score_month, 1),
                "completionRate": round((len(completed_month) / len(month_tasks) * 100) if month_tasks else 0, 0),
                "totalTasks": len(month_tasks)
            })
        
        # Task distribution by type
        task_distribution_pipeline = [
            {
                "$group": {
                    "_id": "$title",
                    "count": {"$sum": 1}
                }
            },
            {
                "$project": {
                    "type": {"$arrayElemAt": [{"$split": ["$_id", " "]}, 0]},
                    "count": 1
                }
            },
            {
                "$group": {
                    "_id": "$type",
                    "count": {"$sum": "$count"}
                }
            }
        ]
        
        distribution_data = await PatientTask.aggregate(task_distribution_pipeline).to_list()
        total_dist = sum(d["count"] for d in distribution_data)
        
        colors = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"]
        task_distribution = [
            {
                "name": d["_id"],
                "value": round((d["count"] / total_dist * 100) if total_dist > 0 else 0, 0),
                "color": colors[idx % len(colors)]
            }
            for idx, d in enumerate(distribution_data[:5])
        ]
        
        # Top performers
        top_performers = [
            {
                "name": r["student_name"],
                "avgScore": r["average_score"],
                "tasksCompleted": r["tasks_completed"],
                "trend": "up"
            }
            for r in rankings[:5]
        ]
        
        return {
            "total_students": total_students,
            "average_score": average_score,
            "tasks_this_month": tasks_this_month,
            "completion_rate": completion_rate,
            "student_performance": student_performance,
            "monthly_trends": monthly_trends,
            "task_distribution": task_distribution,
            "top_performers": top_performers
        }

