import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/api.service';

const uploadResume = async (file: File): Promise<{ fileId: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.upload<{ fileId: string }>('/files/upload', formData);
  return response;
}

export const useUploadResume = () => {
  return useMutation({
    mutationFn: uploadResume,
    onSuccess: (data) => {
      console.log('Application submitted successfully:', data);
    },
    onError: (error) => {
      console.error('Failed to submit application:', error);
    },
  });
};
