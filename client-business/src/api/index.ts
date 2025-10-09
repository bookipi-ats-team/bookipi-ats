import axiosInstance from './client';
import { API_CONFIG } from './config';
import {
  mockUser,
  mockBusiness,
  mockJobs,
  mockApplications,
  mockNotes,
  mockJobTitleSuggestions,
  mockMustHaveSuggestions,
  mockGeneratedJD,
} from './mockData';
import type {
  User,
  Business,
  CreateBusinessInput,
  Job,
  CreateJobInput,
  UpdateJobInput,
  ApplicationWithDetails,
  UpdateApplicationInput,
  Note,
  CreateNoteInput,
  AISuggestTitlesInput,
  AISuggestMustHavesInput,
  AIGenerateJDInput,
  AISuggestionResponse,
  AIGenerateJDResponse,
  PaginatedResponse,
} from '../types';

// Helper to simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API
export const authApi = {
  async getMe(): Promise<User> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return mockUser;
    }
    const response = await axiosInstance.get<User>('/auth/me');
    return response.data;
  },
};

// Business API
export const businessApi = {
  async getMy(): Promise<Business> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return mockBusiness;
    }
    const response = await axiosInstance.get<Business>('/business/my');
    return response.data;
  },

  async create(data: CreateBusinessInput, params?: { name?: string; description?: string; industry?: string }): Promise<Business> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return {
        ...mockBusiness,
        ...data,
        id: 'b-' + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    const response = await axiosInstance.post<Business>('/business', data, { params });
    return response.data;
  },

  async update(id: string, data: Partial<CreateBusinessInput>): Promise<Business> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return {
        ...mockBusiness,
        ...data,
        updatedAt: new Date().toISOString(),
      };
    }
    const response = await axiosInstance.patch<Business>(`/business/${id}`, data);
    return response.data;
  },
};

// Jobs API
export const jobsApi = {
  async getAll(params?: {
    businessId?: string;
    status?: string;
    q?: string;
    location?: string;
    industry?: string;
    cursor?: string;
    limit?: number;
  }): Promise<PaginatedResponse<Job>> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      let filtered = [...mockJobs];
      
      if (params?.status) {
        filtered = filtered.filter(j => j.status === params.status);
      }
      if (params?.q) {
        const query = params.q.toLowerCase();
        filtered = filtered.filter(j => 
          j.title.toLowerCase().includes(query) ||
          j.description.toLowerCase().includes(query)
        );
      }
      
      return { items: filtered };
    }
    const response = await axiosInstance.get<PaginatedResponse<Job>>('/jobs', { params });
    return response.data;
  },

  async getById(id: string): Promise<Job> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      const job = mockJobs.find(j => j.id === id);
      if (!job) throw new Error('Job not found');
      return job;
    }
    const response = await axiosInstance.get<Job>(`/jobs/${id}`);
    return response.data;
  },

  async create(data: CreateJobInput): Promise<Job> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return {
        ...data,
        id: 'j-' + Date.now(),
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    const response = await axiosInstance.post<Job>('/jobs', data);
    return response.data;
  },

  async update(id: string, data: UpdateJobInput): Promise<Job> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      const job = mockJobs.find(j => j.id === id);
      if (!job) throw new Error('Job not found');
      return {
        ...job,
        ...data,
        updatedAt: new Date().toISOString(),
      };
    }
    const response = await axiosInstance.patch<Job>(`/jobs/${id}`, data);
    return response.data;
  },

  async publish(id: string): Promise<{ status: string }> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return { status: 'PUBLISHED' };
    }
    const response = await axiosInstance.post<{ status: string }>(`/jobs/${id}/publish`);
    return response.data;
  },

  async pause(id: string): Promise<{ status: string }> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return { status: 'PAUSED' };
    }
    const response = await axiosInstance.post<{ status: string }>(`/jobs/${id}/pause`);
    return response.data;
  },

  async close(id: string): Promise<{ status: string }> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return { status: 'CLOSED' };
    }
    const response = await axiosInstance.post<{ status: string }>(`/jobs/${id}/close`);
    return response.data;
  },
};

// Applications API
export const applicationsApi = {
  async getByJob(
    jobId: string,
    params?: { stage?: string; cursor?: string; limit?: number }
  ): Promise<PaginatedResponse<ApplicationWithDetails>> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      let filtered = mockApplications.filter(app => app.jobId === jobId);
      
      if (params?.stage) {
        filtered = filtered.filter(app => app.stage === params.stage);
      }
      
      return { items: filtered };
    }
    const response = await axiosInstance.get<PaginatedResponse<ApplicationWithDetails>>(
      `/jobs/${jobId}/applications`,
      { params }
    );
    return response.data;
  },

  async getById(id: string): Promise<ApplicationWithDetails> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      const app = mockApplications.find(a => a.id === id);
      if (!app) throw new Error('Application not found');
      return app;
    }
    const response = await axiosInstance.get<ApplicationWithDetails>(`/applications/${id}`);
    return response.data;
  },

  async update(id: string, data: UpdateApplicationInput): Promise<ApplicationWithDetails> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      const app = mockApplications.find(a => a.id === id);
      if (!app) throw new Error('Application not found');
      return {
        ...app,
        ...data,
        updatedAt: new Date().toISOString(),
      };
    }
    const response = await axiosInstance.patch<ApplicationWithDetails>(`/applications/${id}`, data);
    return response.data;
  },
};

// Notes API
export const notesApi = {
  async getByApplication(applicationId: string): Promise<Note[]> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return mockNotes[applicationId] || [];
    }
    const response = await axiosInstance.get<Note[]>(`/applications/${applicationId}/notes`);
    return response.data;
  },

  async create(applicationId: string, data: CreateNoteInput): Promise<Note> {
    if (API_CONFIG.USE_MOCK) {
      await delay();
      return {
        id: 'n-' + Date.now(),
        applicationId,
        authorId: mockUser.id,
        body: data.body,
        createdAt: new Date().toISOString(),
      };
    }
    const response = await axiosInstance.post<Note>(`/applications/${applicationId}/notes`, data);
    return response.data;
  },
};

// AI API
export const aiApi = {
  async suggestJobTitles(data: AISuggestTitlesInput): Promise<AISuggestionResponse> {
    if (API_CONFIG.USE_MOCK) {
      await delay(800);
      return mockJobTitleSuggestions;
    }
    const response = await axiosInstance.post<AISuggestionResponse>('/ai/suggest-job-titles', data);
    return response.data;
  },

  async suggestMustHaves(data: AISuggestMustHavesInput): Promise<AISuggestionResponse> {
    if (API_CONFIG.USE_MOCK) {
      await delay(800);
      return mockMustHaveSuggestions;
    }
    const response = await axiosInstance.post<AISuggestionResponse>('/ai/suggest-must-haves', data);
    return response.data;
  },

  async generateJD(data: AIGenerateJDInput): Promise<AIGenerateJDResponse> {
    if (API_CONFIG.USE_MOCK) {
      await delay(1500);
      return mockGeneratedJD;
    }
    const response = await axiosInstance.post<AIGenerateJDResponse>('/ai/generate-jd', data);
    return response.data;
  },
};
