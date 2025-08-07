export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
}

export interface Patient {
  name: string;
  age: number;
  primaryComplaint: string;
  notes?: string;
}

export interface PatientTask {
  id: string;
  title: string;
  description: string;
  patient: Patient;
  assignedStudentId: string;
  assignedStudentName: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: Date;
  completedAt?: Date;
  qualityScore?: number;
}

export interface StudentRanking {
  studentId: string;
  studentName: string;
  rank: number;
  tasksCompleted: number;
  averageScore: number;
  acceptanceRate: number;
}