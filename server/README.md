# Bookipi ATS Backend

Backend service for the Bookipi Applicant Tracking System (ATS) MVP. This README captures the product scope relevant to the backend, the API surface area to be delivered, and practical notes for running the service locally.

## Tech Stack
- Node.js + TypeScript
- Express with RESTful routes under `/api/v1`
- Helmet & CORS middleware

## Getting Started
- Install dependencies: `npm install`
- Run in watch mode: `npm run dev`
- Start in production mode: `npm start`
- Lint: `npm run lint`

Environment variables:
- `PORT` (default `3000`)
- `NODE_ENV` (default `development`)
- `MONGODB_URI` (optional) – MongoDB connection string; if omitted, the server boots without a database connection and logs a warning
- `OPENAI_API_KEY` (optional) – enables AI-backed suggestions; when missing, all AI endpoints return deterministic static fallbacks
- `GOOGLE_DRIVE_CREDENTIALS_PATH` (default `./credentials.json`) – path to the Google service account JSON used for Drive access
- `GOOGLE_DRIVE_FOLDER_ID` (required) – Drive folder where finalized resume files are stored

Create a `.env` file if you need to override defaults. The server logs the active port and environment on boot.

### Resume Storage (Google Drive)
- Place your Google Cloud service account JSON key outside of version control. Reference it via `GOOGLE_DRIVE_CREDENTIALS_PATH` (defaults to `./credentials.json`).
- Share the target Drive folder with the service account email and set `GOOGLE_DRIVE_FOLDER_ID` to that folder's ID (`1k8Os2R9oUauuGVreY-pV0aIuWiXqmqsz` in development).
- Resume uploads are staged locally under `uploads/resumes/tmp` and pushed to Drive during confirmation; successful confirmations store the Drive file ID in `storagePath` and return the public Drive URL.
- If a confirmation fails after upload, the API attempts to delete the Drive file and leaves the temp upload cleaned up.

## MVP Scope & Principles

**Core personas**
- Business Owner (internal admin)
- Applicant (external)

**Primary surfaces**
- Owner onboarding: capture business profile (name, description, industry) with optional query-string prefill.
- Jobs dashboard: list, filter, manage, and publish/pause/close jobs.
- AI-assisted job creation: title suggestions, must-have suggestions, auto-generated job description.
- Applicant pipeline: kanban board with drag/drop stage changes, notes, and applicant detail view.
- Applicant portal: browse jobs with filters, view details, apply with resume, view application status list.

**AI features included in MVP**
- Job title suggestions
- Must-have requirement suggestions
- Auto-generated job descriptions
- Resume-to-job match scoring
- Applicant CV quality score and improvement tips

**Out of scope (post-MVP)**
- External job board distribution (LinkedIn, Seek, Glassdoor, etc.)
- Interview scheduling or offer workflows
- Automated email sequences
- Calendar scheduling integration
- Multi-tenant organisations beyond a single business owner

## API Overview

- Base path: `/api/v1`
- Authentication: Bearer JWT required for authenticated routes; `/public/*` endpoints remain unauthenticated.
- Standard error envelope:
  ```json
  {
    "error": {
      "code": "STRING_CODE",
      "message": "Human-readable",
      "field": "optional"
    }
  }
  ```

### Auth
- `GET /auth/me` → `200 OK` `{ id, email, name, role, businessId? }`

### Business (Owner Onboarding)
- `GET /business/my` → `200 OK Business` or `404 Not Found`
- `POST /business` body `{ name, description?, industry? }` → `200 OK Business` (support query prefill via `?name=&description=&industry=`)
- `PATCH /business/:id` body `{ name?, description?, industry? }` → `200 OK Business`

### Jobs
- `GET /jobs?businessId=&status=&q=&location=&industry=&employmentType=&publishedAfter=&cursor=&limit=` → `200 OK { items: Job[], nextCursor? }`
- `POST /jobs` body `{ businessId, title, description, mustHaves[]?, location?, employmentType, industry? }` → `200 OK Job`
- `GET /jobs/:id` → `200 OK Job`
- `PATCH /jobs/:id` body `{ title?, description?, mustHaves[]?, location?, employmentType, industry?, status? }` → `200 OK Job`
- `POST /jobs/:id/publish` → `200 OK { status: "PUBLISHED" }`
- `POST /jobs/:id/pause` → `200 OK { status: "PAUSED" }`
- `POST /jobs/:id/close` → `200 OK { status: "CLOSED" }`

### Applicants (Internal)
- `GET /applicants?businessId=&q=&cursor=&limit=` → `200 OK { items: Applicant[], nextCursor? }`
- `GET /applicants/:id` → `200 OK Applicant`

### Applications & Pipeline
- `GET /jobs/:jobId/applications?stage=&cursor=&limit=` → `200 OK { items: (Application & { applicant: Applicant })[], nextCursor? }`
- `GET /applications/:id` → `200 OK Application & { applicant, job, resumeFile? }`
- `POST /applications` body `{ jobId, applicant: { id? | email, name, phone?, location? }, resumeFileId? }` → `200 OK Application`
- `PATCH /applications/:id` body `{ stage? }` → `200 OK Application` (supports drag-and-drop stage updates)
- `POST /applications/:id/notes` body `{ body }` → `200 OK Note`
- `GET /applications/:id/notes` → `200 OK Note[]`

### Files (Resumes)
- `POST /files/resume/uploads?applicantId=&jobId=&originalName=` raw body=`<binary>` → `200 OK ResumeFile`
  - Requires `Content-Type` header set to a supported resume MIME type (`pdf`, `doc`, `docx`, `odt`, `txt`).
  - `applicantId` and `jobId` query params are optional and validate that linked records exist and share the same business.
  - `originalName` query param lets clients override the stored filename; defaults to `<generated>.extension` when omitted.
  - Payload size must be > 0 bytes and ≤ `env.maxResumeFileSize`; successful uploads enqueue resume parsing/scoring.

### AI Services
- `POST /ai/suggest-job-titles` body `{ businessId?, industry?, description? }` → `200 OK { items: string[], source: "AI" | "STATIC" }`
- `POST /ai/suggest-must-haves` body `{ jobTitle, industry?, seniority? }` → `200 OK { items: string[], source: "AI" | "STATIC" }`
- `POST /ai/generate-jd` body `{ jobTitle, mustHaves[], business: { name, description?, industry? }, extras? }` → `200 OK { text, source: "AI" | "STATIC" }`
- `POST /ai/score-resume` body `{ applicationId | { resumeFileId, job: { title, mustHaves[], description } } }` → `200 OK { score, cvScore, cvTips: string[] }`

When `OPENAI_API_KEY` is present the service invokes OpenAI's `gpt-4o-mini` for contextual responses; otherwise deterministic fallbacks are returned with `source: "STATIC"`. Append `?mode=static` to any AI endpoint to explicitly bypass the OpenAI call.

#### AI Testing Notes
- Without an API key the responses are deterministic and tagged `"STATIC"`.
- Provide `OPENAI_API_KEY` to exercise live completions.
- Include `?mode=static` when you want to skip the OpenAI call during smoke tests.

### Public (Applicant-Facing)
- `GET /public/jobs?q=&location=&industry=&employmentType=&cursor=&limit=` → `200 OK { items: Job[], nextCursor? }` (only `PUBLISHED` jobs)
- `GET /public/jobs/:jobId` → `200 OK Job`
- `POST /public/apply` body `{ jobId, applicant: { email, name, phone?, location? }, resumeFileId }` → `200 OK Application` (`stage=NEW`)
- `GET /public/applications/:email` → `200 OK { items: (Application & { job: Job })[] }`

## Core Data Shapes

```ts
type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN' | 'TEMPORARY';
type StageCode = 'NEW' | 'SCREEN' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED';

type Job = {
  id: string;
  businessId: string;
  title: string;
  description: string;
  mustHaves: string[];
  location?: string;
  employmentType: EmploymentType;
  industry?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'CLOSED';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};

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

type Note = {
  id: string;
  applicationId: string;
  authorId: string;
  body: string;
  createdAt: string;
};

type ResumeFile = {
  id: string;
  applicantId: string;
  jobId?: string;
  url: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
};
```

## Acceptance Checklist (Backend ↔ Frontend)
- `POST /business` respects query prefill and completes onboarding flow.
- `POST /jobs` followed by `/jobs/:id/publish` makes the job visible via `/public/jobs`.
- Applicant apply flow (`sign → upload → confirm → /public/apply`) creates an `Application` in `NEW` stage.
- `/jobs/:jobId/applications` supports grouped listings; `PATCH /applications/:id` updates stages persistently.
- `POST /applications/:id/notes` increments `notesCount`.
- AI endpoints return usable data for chips, must-haves, and job description text.
