import { api } from '@/services/api.service';
import { Job, JobFilters, PaginatedJobsResponse } from '@/types/job.type';

/**
 * Job API Functions using the reusable API service
 */

// Fetch jobs with pagination and filters
export const fetchJobs = async (
  page: number = 1,
  filters: JobFilters
) => {
  const params = {
    page,
    limit: 10,
    ...filters,
  };

  return api.get<PaginatedJobsResponse>('/jobs', params);
};

// Fetch single job by ID
export const fetchJobById = async (id: string): Promise<Job> => {
  return api.get<Job>(`/jobs/${id}`);
};

// Bookmark/unbookmark job
export const toggleJobBookmark = async (
  jobId: string,
  bookmarked: boolean
): Promise<{ success: boolean }> => {
  return api.patch<{ success: boolean }>(`/jobs/${jobId}/bookmark`, {
    bookmarked,
  });
};

// Search jobs
export const searchJobs = async (
  query: string,
  filters?: Partial<JobFilters>
): Promise<PaginatedJobsResponse> => {
  const params = {
    search: query,
    ...filters,
  };

  return api.get<PaginatedJobsResponse>('/jobs/search', params);
};

// Get job recommendations
export const getJobRecommendations = async (
  userId?: string
): Promise<Job[]> => {
  const params = userId ? { userId } : {};
  return api.get<Job[]>('/jobs/recommendations', params);
};

// Get jobs by category/industry
export const getJobsByCategory = async (
  category: string,
  page: number = 1
): Promise<PaginatedJobsResponse> => {
  return api.get<PaginatedJobsResponse>('/jobs/category', {
    category,
    page,
    limit: 10,
  });
};
