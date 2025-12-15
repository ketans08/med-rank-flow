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
    getMine: async () => {
      return request<any[]>('/tasks/student');
    },
    
    accept: async (taskId: string) => {
      return request<any>(`/tasks/${taskId}/accept`, {
        method: 'POST',
      });
    },
    
    reject: async (taskId: string, reason: string) => {
      return request<any>(`/tasks/${taskId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reject_reason: reason }),
      });
    },
    
    complete: async (taskId: string) => {
      return request<any>(`/tasks/${taskId}/complete`, {
        method: 'POST',
      });
    },
  },
  
  analytics: {
    getMyAnalytics: async () => {
      return request<any>('/analytics/student');
    },
  },
};

export { ApiError };

