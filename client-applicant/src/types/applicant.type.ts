
type StageCode = 'NEW' | 'SCREEN' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED';

type Applicant = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  location?: string;
  createdAt: string;
};

type Application = {
  id: string;
  applicantId: string;
  jobId: string;
  businessId: string;
  stage: StageCode;
  score?: number;
  cvScore?: number;
  cvTips?: string[];
  notesCount: number;
  createdAt: string;
  updatedAt: string;
};

// Extended Application type with populated job data
type ApplicationWithJob = Application & {
  job: {
    _id: string;
    businessId: string;
    title: string;
    description: string;
    mustHaves: string[];
    location?: string;
    employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN' | 'TEMPORARY';
    industry?: string;
    status: 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'CLOSED';
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
  };
};

// Response from the public applications endpoint
type PublicApplicationsResponse = {
  items: ApplicationWithJob[];
};

export type { Applicant, Application, ApplicationWithJob, PublicApplicationsResponse, StageCode };