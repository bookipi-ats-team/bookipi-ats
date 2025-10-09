import { useQuery } from '@tanstack/react-query';
import { Job, JobFilters, PaginatedJobsResponse, JobResponse } from '@/types/job.type';
import { api } from '@/services/api.service';


export const fetchJobs = async (filters: JobFilters): Promise<PaginatedJobsResponse> => {
  const params = {
    limit: 10,
    ...filters,
  };
  return api.get<PaginatedJobsResponse>('/public/jobs', params);
};

export const fetchJobById = async (id: string): Promise<JobResponse> => {
  return api.get<JobResponse>(`/public/jobs/${id}`);
};

export const useJobs = (filters: JobFilters) => {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => fetchJobs(filters),
    placeholderData: (previousData) => previousData, // Keep previous data while loading new data
  });
};

export const useJob = (id: string) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => fetchJobById(id),
    enabled: !!id,
  });
};
