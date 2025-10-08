export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  payRange: string;
  description: string;
  posted: string;
  datePosted: string;
  language: string;
  industry: string;
  bookmarked: boolean;
  // Additional fields for job details
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
}

export interface JobFilters {
  searchQuery: string;
  jobType: string;
  location: string;
  datePosted: string;
  language: string;
  industry: string;
  payRange: string;
}

export interface PaginatedJobsResponse {
  jobs: Job[];
  totalJobs: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
