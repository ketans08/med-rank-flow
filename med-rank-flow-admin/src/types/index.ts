export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
}

export interface Patient {
  name: string;
  age: number;
  primary_complaint: string;
  notes?: string;
}

export interface PatientTask {
  id: string;
  title: string;
  description: string;
  patient: Patient;
  assigned_student_id: string;
  assigned_student_name?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  created_at: string;
  completed_at?: string;
  quality_score?: number;
}

export interface StudentRanking {
  student_id: string;
  student_name: string;
  rank: number;
  tasks_completed: number;
  average_score: number;
  acceptance_rate: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
}

export interface TaskCreateRequest {
  title: string;
  description: string;
  patient: Patient;
  assigned_student_id: string;
}

export interface TaskScoreRequest {
  quality_score: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

