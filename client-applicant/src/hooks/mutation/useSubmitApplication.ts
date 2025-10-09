import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/api.service';
import { JobApplicationFormData } from '@/schemas/job-application-schema';

interface SubmitApplicationParams {
  jobId: string;
  data: JobApplicationFormData;
}

interface SubmitApplicationResponse {
  success: boolean;
  applicationId: string;
  message?: string;
}

/**
 * Hook for submitting job applications using the new API service
 * 
 * This replaces the old mock implementation with a real API call
 */
export const useSubmitApplication = () => {
  return useMutation<
    SubmitApplicationResponse,
    Error,
    SubmitApplicationParams
  >({
    mutationFn: async ({ jobId, data }) => {
      // Using the new API service instead of mock implementation
      return api.post<SubmitApplicationResponse>(`/jobs/${jobId}/applications`, data);
    },

    onSuccess: (response) => {
      console.log('Application submitted successfully:', response.applicationId);
    },

    onError: (error) => {
      console.error('Failed to submit application:', error.message);
    },
  });
};
