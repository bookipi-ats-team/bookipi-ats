import { useQuery } from '@tanstack/react-query';
import { fetchJobs, fetchJobById } from '@/api/jobs';
import { JobFilters } from '@/types/job';

export const useJobs = (page: number, filters: JobFilters) => {
  return useQuery({
    queryKey: ['jobs', page, filters],
    queryFn: () => fetchJobs(page, filters),
    placeholderData: (previousData) => previousData, // Keep previous data while loading new data
  });
};

export const useJob = (id: string) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => fetchJobById(id),
    enabled: !!id, // Only run query if id exists
  });
};
