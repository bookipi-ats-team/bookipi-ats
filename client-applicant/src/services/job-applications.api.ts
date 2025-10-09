import { api } from '@/services/api.service';
import { JobApplicationFormData } from '@/schemas/job-application-schema';

/**
 * Job Application API Functions
 */

export interface JobApplication {
  id: string;
  jobId: string;
  applicantId: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  submittedAt: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  professionalInfo: {
    experience: string;
    currentPosition: string;
    expectedSalary: string;
    availableFrom: string;
  };
  documents: {
    resumeUrl?: string;
    coverLetterUrl?: string;
  };
  additionalQuestions?: Record<string, string>;
}

export interface SubmitApplicationResponse {
  success: boolean;
  applicationId: string;
  message?: string;
}

export interface ApplicationsResponse {
  applications: JobApplication[];
  total: number;
  page: number;
  limit: number;
}

// Submit job application
export const submitJobApplication = async (
  jobId: string,
  data: JobApplicationFormData
): Promise<SubmitApplicationResponse> => {
  return api.post<SubmitApplicationResponse>(`/jobs/${jobId}/applications`, data);
};

// Upload resume
export const uploadResume = async (
  file: File
): Promise<{ url: string; filename: string }> => {
  const formData = new FormData();
  formData.append('resume', file);

  return api.upload<{ url: string; filename: string }>('/documents/resume', formData);
};

// Upload cover letter
export const uploadCoverLetter = async (
  file: File
): Promise<{ url: string; filename: string }> => {
  const formData = new FormData();
  formData.append('coverLetter', file);

  return api.upload<{ url: string; filename: string }>('/documents/cover-letter', formData);
};

// Get user's applications
export const getMyApplications = async (
  page: number = 1,
  status?: JobApplication['status']
): Promise<ApplicationsResponse> => {
  const params: Record<string, string | number | boolean> = {
    page,
    limit: 10,
  };

  if (status) {
    params.status = status;
  }

  return api.get<ApplicationsResponse>('/applications/my', params);
};

// Get application by ID
export const getApplicationById = async (
  applicationId: string
): Promise<JobApplication> => {
  return api.get<JobApplication>(`/applications/${applicationId}`);
};

// Withdraw application
export const withdrawApplication = async (
  applicationId: string
): Promise<{ success: boolean; message?: string }> => {
  return api.delete<{ success: boolean; message?: string }>(`/applications/${applicationId}`);
};

// Update application status (for admin/HR use)
export const updateApplicationStatus = async (
  applicationId: string,
  status: JobApplication['status'],
  notes?: string
): Promise<{ success: boolean }> => {
  return api.patch<{ success: boolean }>(`/applications/${applicationId}/status`, {
    status,
    notes,
  });
};
