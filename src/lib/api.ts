const API_BASE_URL =
  (import.meta.env.VITE_API_URL ?? 'https://buildtrust-backend.onrender.com/api').replace(/\/+$/, ''); // remove trailing slash(es)


export interface User {
  id: number;
  email: string;
  name: string | null;
  is_active?: number;
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

  async completePortfolioSetup(formData: Record<string, unknown>) {
    // Convert to FormData to support file uploads
    const fd = new FormData();
    
    // Add personal and preferences data as JSON
    fd.append('personal', JSON.stringify(formData.personal || {}));
    fd.append('preferences', JSON.stringify(formData.preferences || {}));
    
    // Handle identity documents (government_id, business_registration, selfie)
    const identity = formData.identity as any || {};
    const identityData: Record<string, unknown> = {};
    
    const identityFields = ['id', 'cac', 'selfie'];
    identityFields.forEach(field => {
      if (identity[field]) {
        const doc = identity[field];
        if (doc instanceof File) {
          fd.append(`identity_${field}`, doc);
        } else if (doc && doc.file instanceof File) {
          fd.append(`identity_${field}`, doc.file);
        } else if (doc) {
          identityData[field] = doc;
        }
      }
    });
    if (Object.keys(identityData).length > 0) {
      fd.append('identity_metadata', JSON.stringify(identityData));
    }
    
    // Handle credentials (licenses, certifications, testimonials)
    const credentials = formData.credentials as any || {};
    const credentialsData: Record<string, unknown> = {};
    
    ['licenses', 'certifications', 'testimonials'].forEach(credType => {
      if (credentials[credType]) {
        const items = Array.isArray(credentials[credType]) ? credentials[credType] : [];
        items.forEach((item: any, idx: number) => {
          if (item instanceof File) {
            fd.append(`credential_${credType}_${idx}`, item);
          } else if (item && item.file instanceof File) {
            fd.append(`credential_${credType}_${idx}`, item.file);
          } else if (item) {
            if (!credentialsData[credType]) credentialsData[credType] = [];
            (credentialsData[credType] as any[]).push(item);
          }
        });
      }
    });
    if (Object.keys(credentialsData).length > 0) {
      fd.append('credentials_metadata', JSON.stringify(credentialsData));
    }
    
    // Add actual files from projects
    const projects = formData.projects as any[] || [];
    if (projects.length > 0) {
      projects.forEach((project, idx) => {
        // Add project data
        fd.append(`project_${idx}_title`, project.title || '');
        fd.append(`project_${idx}_type`, project.type || '');
        fd.append(`project_${idx}_location`, project.location || '');
        fd.append(`project_${idx}_budget`, project.budget || '');
        fd.append(`project_${idx}_description`, project.description || '');
        
        // Add actual files from media array
        if (project.media && Array.isArray(project.media)) {
          project.media.forEach((file, fileIdx) => {
            if (file instanceof File) {
              fd.append(`project_${idx}_media_${fileIdx}`, file);
            }
          });
        }
      });
    }
    
    return this.request('/portfolio/setup', {
      method: 'POST',
      body: fd,
      // Don't set Content-Type header - FormData will set it automatically with boundary
    });
  }

  async getDevelopers() {
    return this.request('/developers', {
      method: 'GET',
    });
  }

  async getDeveloperById(id: string | number) {
    return this.request(`/developers/${id}`, {
      method: 'GET',
    });
  }

  async submitProjectRequest(data: Record<string, unknown>) {
    console.log('📋 SUBMITTING PROJECT REQUEST:', {
      timestamp: new Date().toISOString(),
      requestData: data
    });
    return this.request('/projects/request/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async getClientProjects() {
    return this.request('/projects', {
      method: 'GET',
    });
  }

  async getClientContracts() {
    return this.request('/contracts', {
      method: 'GET',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);


