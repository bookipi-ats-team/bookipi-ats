import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/api.service';
import { ApplicantData } from '@/schemas/job-application-schema';

interface SubmitApplicationParams {
  jobId: string;
  data: ApplicantData;
  resumeFileId?: string;
}

interface SubmitApplicationResponse {
  _id: string;
  jobId: string;
  applicantId: string;
  stage: string;
  resumeFileId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hook for submitting job applications using the /public/apply endpoint
 * 
 * This submits the application with applicant data and optional resumeFileId
 */
export const useSubmitApplication = () => {
  return useMutation<
    SubmitApplicationResponse,
    Error,
    SubmitApplicationParams
  >({
    mutationFn: async ({ jobId, data, resumeFileId }) => {
      const payload = {
        jobId,
        applicant: data,
        ...(resumeFileId && { resumeFileId }),
      };

      // Using the /public/apply endpoint
      return api.post<SubmitApplicationResponse>('/public/apply', payload);
    },

    onSuccess: (response) => {
      console.log('Application submitted successfully:', response._id);
    },

    onError: (error) => {
      console.error('Failed to submit application:', error.message);
    },
  });
};
