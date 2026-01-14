const API_BASE_URL =
  import.meta.env.VITE_API_URL
  ?? 'https://buildtrust-backend.onrender.com/api';


export interface User {
  id: number;
  email: string;
  name: string | null;
  role: 'client' | 'developer';
  bio?: string | null;
  phone?: string | null;
  location?: string | null;
  website?: string | null;
  linkedin?: string | null;
  github?: string | null;
  hourly_rate?: number | null;
  availability_status?: string | null;
  years_experience?: number | null;
  completed_projects?: number | null;
  rating?: number | null;
  total_reviews?: number | null;
  setup_completed?: boolean;
  created_at?: string;
  email_verified?: boolean;
}

export interface AuthResponse {
  message?: string;
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
  details?: any;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('auth_token');

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const text = await response.text();
      let body: any = null;
      try {
        body = text ? JSON.parse(text) : null;
      } catch {
        body = text;
      }

      if (!response.ok) {
        const serverMsg = body?.error || body?.message || text || `HTTP ${response.status}`;
        const err = new Error(serverMsg);
        // Attach extra info for debugging
        (err as any).status = response.status;
        (err as any).body = body;
        (err as any).url = `${this.baseUrl}${endpoint}`;
        throw err;
      }

      return body;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Network request failed');
    }
  }

  async signup(data: {
    email: string;
    password: string;
    name?: string;
    role?: 'client' | 'developer';
  }): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // 🔑 Store token in localStorage
    if (res.token) {
      localStorage.setItem('auth_token', res.token);
    }

    return res;
  }

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Store token in localStorage on successful login
    if (res.token) {
      localStorage.setItem('auth_token', res.token);
    }

    return res;
  }

  async updateProfile(data: Record<string, unknown>) {
    // Adjust endpoint/method to match your backend (e.g., PUT /auth/me)
    return this.request('/auth/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async uploadDocument(userId: number, type: string, file: File | Blob) {
    const token = localStorage.getItem('auth_token');
    const form = new FormData();
    form.append('file', file as any);
    form.append('type', type);

    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${this.baseUrl}/users/${userId}/documents`, {
      method: 'POST',
      headers,
      body: form,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Upload failed (${response.status})`);
    }

    return response.json();
  }

  async logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  }

  async verifyEmail(data: { token: string }): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resendVerification(data: { email: string }): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async forgotPassword(data: { email: string }): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: { token: string; password: string }): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me', { method: 'GET' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);


