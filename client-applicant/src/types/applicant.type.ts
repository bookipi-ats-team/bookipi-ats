
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

export type { Applicant, Application, StageCode };