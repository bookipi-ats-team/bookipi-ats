import { useMutation } from '@tanstack/react-query';
import env from '@/config/env';

interface UploadResumeParams {
  file: File;
  jobId?: string;
  applicantId?: string;
}

interface UploadResumeResponse {
  fileId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  _id: string;
}

const uploadResume = async ({ file, jobId, applicantId }: UploadResumeParams): Promise<UploadResumeResponse> => {
  // Build query parameters
  const queryParams: Record<string, string> = {
    originalName: file.name,
  };

  if (jobId) {
    queryParams.jobId = jobId;
  }

  if (applicantId) {
    queryParams.applicantId = applicantId;
  }

  // Create the request URL with query parameters
  const url = `/files/resume/uploads?${new URLSearchParams(queryParams).toString()}`;

  // Upload the file as binary data using fetch directly since we need custom headers
  const fullUrl = `${env.API_URL}${url}`;

  const response = await fetch(fullUrl, {
    method: 'POST',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const useUploadResume = () => {
  return useMutation({
    mutationFn: uploadResume,
    onSuccess: (data) => {
      console.log('Resume uploaded successfully:', data);
    },
    onError: (error) => {
      console.error('Failed to upload resume:', error);
    },
  });
};
