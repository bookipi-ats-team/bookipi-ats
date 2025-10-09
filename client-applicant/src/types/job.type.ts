
type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN' | 'TEMPORARY';
type JobStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

interface Job {
  _id: string;
  businessId: string;
  title: string;
  description: string;
  mustHaves: string[];
  location?: string;
  employmentType: EmploymentType;
  industry?: string;
  status: JobStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

type JobResponse = Job & {
  business: {
    name: string,
    description: string,
    industry: string
  }
};

interface JobFilters {
  businessId?: string;
  status?: JobStatus;
  q?: string;
  location?: string;
  industry?: string;
  cursor?: string;
  limit?: number;
}

interface PaginatedJobsResponse {
  items: JobResponse[],
  //   currentCursor: string,
  //   currentPage: number;
  previousCursor?: string
  nextCursor?: string,
  //   totalJobs: number,
  //   totalPages: number,
  //   hasNextPage: boolean;
  //   hasPreviousPage: boolean;
}

export type { Job, JobFilters, PaginatedJobsResponse, JobResponse };