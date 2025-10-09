import { useMutation } from '@tanstack/react-query';
import env from '@/config/env';

export interface UploadResumeParams {
  file: File;
  jobId?: string;
  applicantId?: string;
}

export interface UploadResumeResponse {
  fileId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  _id: string;
}

const buildUploadUrl = ({ file, jobId, applicantId }: UploadResumeParams) => {
  const searchParams = new URLSearchParams({
    originalName: file.name ?? 'resume',
  });

  if (jobId) {
    searchParams.set('jobId', jobId);
  }

  if (applicantId) {
    searchParams.set('applicantId', applicantId);
  }

  const baseUrl = env.API_URL.replace(/\/$/, '');
  return `${baseUrl}/files/resume/uploads?${searchParams.toString()}`;
};

const normalizeErrorMessage = (status: number, statusText: string, bodyText: string) => {
  if (!bodyText) {
    return `HTTP ${status}: ${statusText}`;
  }

  try {
    const parsed = JSON.parse(bodyText) as { error?: string; message?: string };
    return parsed.error || parsed.message || `HTTP ${status}: ${statusText}`;
  } catch {
    return bodyText;
  }
};

const uploadResume = async (params: UploadResumeParams): Promise<UploadResumeResponse> => {
  const { file } = params;
  const uploadUrl = buildUploadUrl(params);

  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: file,
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
    },
    cache: 'no-store',
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      normalizeErrorMessage(response.status, response.statusText, responseText)
    );
  }

  try {
    return JSON.parse(responseText) as UploadResumeResponse;
  } catch {
    throw new Error('Unexpected server response while uploading resume');
  }
};

export const useUploadResume = () =>
  useMutation({
    mutationFn: uploadResume,
    onSuccess: (data) => {
      console.log('Resume uploaded successfully:', data);
    },
    onError: (error) => {
      console.error('Failed to upload resume:', error);
    },
  });
