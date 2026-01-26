const API_BASE_URL =
  (import.meta.env.VITE_API_URL ?? 'https://buildtrust-backend.onrender.com/api').replace(/\/+$/, ''); // remove trailing slash(es)


export interface User {
  id: number;
  email: string;
  name: string | null;
  role: 'client' | 'developer' | 'admin';
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
    // Normalize baseUrl: no trailing slash
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('auth_token');

    // Avoid forcing Content-Type when sending FormData (browser will set boundary)
    const isFormData = options.body instanceof FormData;

    const headers: HeadersInit = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Ensure endpoint is joined to baseUrl with exactly one slash
    const url = endpoint.startsWith('/') ? `${this.baseUrl}${endpoint}` : `${this.baseUrl}/${endpoint}`;

    console.log(`🌐 API REQUEST:`, {
      method: options.method || 'GET',
      url,
      headers,
      body: options.body,
      timestamp: new Date().toISOString()
    });

    try {
      const response = await fetch(url, {
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

      console.log(`🌐 API RESPONSE:`, {
        status: response.status,
        statusText: response.statusText,
        body,
        timestamp: new Date().toISOString()
      });

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
    form.append('type', type); // append type first (helps some servers parse fields before files)
    form.append('file', file as any);

    const headers: HeadersInit = {};
    // Add a header so the server can verify the document type before streaming the file
    headers['X-Document-Type'] = type;
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

  async changePassword(data: { currentPassword: string; newPassword: string; confirmPassword: string }): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me', { method: 'GET' });
  }

  async createProject(data: Record<string, unknown>) {
    console.log('📦 CREATING PROJECT:', {
      timestamp: new Date().toISOString(),
      projectData: data
    });
    return this.request('/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async uploadProjectMedia(projectId: number, file: File | Blob) {
    const token = localStorage.getItem('auth_token');
    const form = new FormData();
    form.append('file', file as any);

    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    console.log('🎬 UPLOADING PROJECT MEDIA:', {
      timestamp: new Date().toISOString(),
      projectId,
      fileName: (file as any).name
    });

    const response = await fetch(`${this.baseUrl}/projects/${projectId}/media`, {
      method: 'POST',
      headers,
      body: form,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Media upload failed (${response.status})`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);


