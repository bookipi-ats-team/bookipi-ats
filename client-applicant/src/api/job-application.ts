import { useMutation } from '@tanstack/react-query';
import { JobApplicationFormData } from '@/schemas/job-application-schema';
import env from '@/config/env';

interface SubmitApplicationParams {
  jobId: string;
  data: JobApplicationFormData;
}

// Mock API function - replace with actual API call later
const submitJobApplication = async ({ jobId, data }: SubmitApplicationParams): Promise<{ success: boolean; applicationId: string }> => {
  // TODO: Replace with actual API call when backend is ready
  // const response = await fetch(`${env.API_URL}/jobs/${jobId}/applications`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // });
  // return response.json();

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulate successful submission with mock data
  console.log('Submitting application for job:', jobId, data);

  return {
    success: true,
    applicationId: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
};

export const useSubmitJobApplication = () => {
  return useMutation({
    mutationFn: submitJobApplication,
    onSuccess: (data) => {
      console.log('Application submitted successfully:', data);
    },
    onError: (error) => {
      console.error('Failed to submit application:', error);
    },
  });
};
