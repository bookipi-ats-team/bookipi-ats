// User & Auth
export interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  businessId?: string;
}

// Business
export interface Business {
  _id: string;
  name: string;
  description?: string;
  industry?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBusinessInput {
  name: string;
  description?: string;
  industry?: string;
}

// Job
export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERN"
  | "TEMPORARY";
export type JobStatus = "DRAFT" | "PUBLISHED" | "PAUSED" | "CLOSED";

export interface Job {
  _id: string;
  businessId: string;
  title: string;
  description: string;
  mustHaves: string[];
  location?: string;
  employmentType: EmploymentType;
  industry?: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobInput {
  businessId: string;
  title: string;
  description: string;
  mustHaves: string[];
  location?: string;
  employmentType: EmploymentType;
  industry?: string;
}

export interface UpdateJobInput {
  title?: string;
  description?: string;
  mustHaves?: string[];
  location?: string;
  employmentType?: EmploymentType;
  industry?: string;
  status?: JobStatus;
}

// Applicant
export interface Applicant {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  location?: string;
  createdAt: string;
}

// Application
export type ApplicationStage =
  | "NEW"
  | "SCREEN"
  | "INTERVIEW"
  | "OFFER"
  | "HIRED"
  | "REJECTED";

export interface Application {
  _id: string;
  applicantId: string;
  jobId: string;
  businessId: string;
  stage: ApplicationStage;
  score?: number;
  cvScore?: number;
  cvTips?: string[];
  notesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationWithDetails extends Application {
  applicant: Applicant;
  job?: Job;
  resumeFile?: ResumeFile;
}

export interface CreateApplicationInput {
  jobId: string;
  applicant: {
    id?: string;
    email: string;
    name: string;
    phone?: string;
    location?: string;
  };
  resumeFileId?: string;
}

export interface UpdateApplicationInput {
  stage?: ApplicationStage;
}

// Note
export interface Note {
  _id: string;
  applicationId: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface CreateNoteInput {
  body: string;
}

// Resume File
export interface ResumeFile {
  _id: string;
  applicantId: string;
  jobId?: string;
  url: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

export interface SignResumeInput {
  mimeType: string;
  sizeBytes: number;
}

export interface SignResumeResponse {
  uploadUrl: string;
  fileId: string;
}

export interface ConfirmResumeInput {
  fileId: string;
  applicantId?: string;
  jobId?: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
}

// AI
export interface AISuggestTitlesInput {
  businessId?: string;
  industry?: string;
  description?: string;
}

export interface AISuggestMustHavesInput {
  jobTitle: string;
  industry?: string;
  seniority?: string;
}

export interface AIGenerateJDInput {
  jobTitle: string;
  mustHaves: string[];
  business: {
    name: string;
    description?: string;
    industry?: string;
  };
  extras?: Record<string, unknown>;
}

export interface AISuggestionResponse {
  items: string[];
  source: "AI" | "STATIC";
}

export interface AIGenerateJDResponse {
  text: string;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  nextCursor?: string;
}

// Error
export interface APIError {
  error: {
    code: string;
    message: string;
    field?: string;
  };
}
