import type { PatientTask, StudentRanking, Student } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('access_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new ApiError(response.status, error.detail || 'Request failed');
  }
  
  return response.json();
}

export const api = {
  auth: {
    login: async (credentials: { email: string; password: string }) => {
      return request<{ access_token: string; token_type: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    },
  },
  
  tasks: {
    create: async (task: any) => {
      return request<PatientTask>('/tasks', {
        method: 'POST',
        body: JSON.stringify(task),
      });
    },
    
    getAll: async () => {
      return request<PatientTask[]>('/tasks/admin');
    },
    
    score: async (taskId: string, score: number) => {
      return request<PatientTask>(`/tasks/${taskId}/score`, {
        method: 'POST',
        body: JSON.stringify({ quality_score: score }),
      });
    },
  },
  
  analytics: {
    getRankings: async () => {
      return request<StudentRanking[]>('/analytics/rankings');
    },
    
    getAdminAnalytics: async () => {
      return request<any>('/analytics/admin');
    },
    
    getStudentAnalytics: async (studentId: string) => {
      return request<any>(`/analytics/student/${studentId}`);
    },
  },
  
  students: {
    getAll: async () => {
      return request<Student[]>('/users/students');
    },
  },
};

export { ApiError };

