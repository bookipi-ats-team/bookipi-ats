# Bookipi ATS — MVP (Hackathon)

Single-repo setup for a 2-day build. FE/BE can sprint in parallel and plug in cleanly.

---

## Contents

* [Scope & Principles](#scope--principles)
* [Repo Layout](#repo-layout)
* [Tech Stack](#tech-stack)
* [Quickstart](#quickstart)
* [Environment Variables](#environment-variables)
* [Dev Scripts](#dev-scripts)
* [API (REST) — MVP](#api-rest--mvp)
* [Core Shapes](#core-shapes)
* [Frontend — Screens & Components](#frontend--screens--components)
* [Data Hooks](#data-hooks)
* [Minimal Flows](#minimal-flows)
* [Sample Payloads](#sample-payloads)
* [Acceptance Checklist](#acceptance-checklist)

---

## Scope & Principles

**Personas:** Business Owner (admin), Applicant (external).

**Surfaces (MVP):**

* Owner onboarding (email/business name/description/industry; querystring prefill)
* Jobs dashboard (list/manage, create new, view applicants)
* AI-assisted job creation (title suggestions, must-have suggestions, AI-generated JD)
* Applicant pipeline (drag-drop stages, notes, view match score)
* Applicant portal (job list + filters; job detail + apply with resume; application list + status)

**AI in MVP:** title suggestions, must-have suggestions, JD autogeneration, resume→job match score, applicant CV quality score + tips.

**Out of scope:** external job board posting (LinkedIn/Seek/Glassdoor), interviews, offers, email automations, scheduling, multi-tenant orgs.

---

## Repo Layout

```
.
├─ client-business/     # Owner/Recruiter app (React + TS)
├─ client-applicant/    # Public careers/applicant app (React + TS)
├─ server/              # REST API (NestJS/Express + TS)
├─ docker-compose.yml   # Postgres + MinIO (S3) for local
└─ README.md
```

---

## Tech Stack

* **Frontend:** React + TypeScript, Vite/Next, Tailwind, React Query.
* **Backend:** TypeScript, NestJS (or Express), Postgres (Prisma), MinIO (S3), JWT auth.
* **Async:** simple in-process or BullMQ/Redis (optional) for AI parse/score jobs.
* **Observability:** console + (optional) Sentry.

---

## Quickstart

### 1) Boot infra

```bash
docker compose up -d  # starts postgres:16 and minio
```

MinIO console: [http://localhost:9001](http://localhost:9001) (default creds in `.env.example` below). Create bucket `ats-resumes`.

### 2) Server

```bash
cd server
cp .env.example .env
pnpm i
pnpm prisma:migrate
pnpm dev
```

API at `http://localhost:4000/api/v1`

### 3) Client apps

```bash
# Business (owner/recruiter)
cd client-business
cp .env.example .env
pnpm i
pnpm dev  # http://localhost:5173 (or Next: 3000)

# Applicant (public)
cd ../client-applicant
cp .env.example .env
pnpm i
pnpm dev  # http://localhost:5174 (or Next: 3001)
```

> **Tip:** Day 1 can point FE to mock endpoints; Day 2 switch `VITE_API_BASE_URL` to real server.

---

## Environment Variables

### `server/.env.example`

```
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ats
JWT_SECRET=dev-secret

S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_ACCESS_KEY=minio
S3_SECRET_KEY=minio123
S3_BUCKET=ats-resumes
S3_USE_SSL=false
```

### `client-business/.env.example` and `client-applicant/.env.example`

```
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_API_TOKEN=DEV_TOKEN_OWNER   # used by business app for /auth/me during hackathon
```

---

## Dev Scripts

**Root (optional via npm-workspaces/pnpm):**

* `pnpm dev:all` — run server + both clients
* `pnpm typecheck` — typecheck all packages
* `pnpm lint` — lint all packages

**Server:**

* `pnpm dev` — start API (watch)
* `pnpm prisma:migrate` — run migrations
* `pnpm seed` — (optional) seed demo data

**Clients:**

* `pnpm dev` — start Vite/Next dev server
* `pnpm build && pnpm preview` — production preview

---

## API (REST) — MVP

**Base:** `/api/v1`
**Auth:** Bearer JWT (skip for `/public/*`).
**Error model (all endpoints):**

```json
{ "error": { "code": "STRING_CODE", "message": "Human-readable", "field": "optional" } }
```

### Auth

* `GET /auth/me` → `200 { id, email, name, role, businessId? }`

### Business (owner onboarding)

* `GET /business/my` → `200 Business | 404`
* `POST /business` (prefill via query `?name=&description=&industry=`)
  Body: `{ name, description?, industry? }` → `200 Business`
* `PATCH /business/:id` → `{ name?, description?, industry? }` → `200 Business`

### Jobs

* `GET /jobs?businessId=&status=&q=&location=&industry=&cursor=&limit=`
  → `200 { items: Job[], nextCursor? }`
* `POST /jobs`
  Body: `{ businessId, title, description, mustHaves[], location?, employmentType?, industry? }` → `200 Job`
* `GET /jobs/:id` → `200 Job`
* `PATCH /jobs/:id`
  Body: `{ title?, description?, mustHaves?, location?, employmentType?, industry?, status? }` → `200 Job`
* `POST /jobs/:id/publish` → `200 { status: "PUBLISHED" }`
* `POST /jobs/:id/pause` → `200 { status: "PAUSED" }`
* `POST /jobs/:id/close` → `200 { status: "CLOSED" }`

### Applicants (internal)

* `GET /applicants?businessId=&q=&cursor=&limit=` → `200 { items: Applicant[], nextCursor? }`
* `GET /applicants/:id` → `200 Applicant`

### Applications & Pipeline

* `GET /jobs/:jobId/applications?stage=&cursor=&limit=`
  → `200 { items: (Application & { applicant: Applicant })[], nextCursor? }`
* `GET /applications/:id`
  → `200 Application & { applicant, job, resumeFile? }`
* `POST /applications`
  Body: `{ jobId, applicant: { id? | email name phone? location? }, resumeFileId? }` → `200 Application`
* `PATCH /applications/:id`
  Body: `{ stage? }` → `200 Application`
* `POST /applications/:id/notes`
  Body: `{ body }` → `200 Note`
* `GET /applications/:id/notes` → `200 Note[]`

### Files (resumes)

* `POST /files/resume/sign`
  Body: `{ mimeType, sizeBytes }` → `200 { uploadUrl, fileId }`
* `POST /files/resume/confirm`
  Body: `{ fileId, applicantId?, jobId?, originalName, mimeType, sizeBytes }`
  → `200 ResumeFile` *(triggers async parse/score)*

### AI (stubs OK)

* `POST /ai/suggest-job-titles`
  Body: `{ businessId?, industry?, description? }` → `200 { items: string[], source: "AI"|"STATIC" }`
* `POST /ai/suggest-must-haves`
  Body: `{ jobTitle, industry?, seniority? }` → `200 { items: string[], source }`
* `POST /ai/generate-jd`
  Body: `{ jobTitle, mustHaves[], business: { name, description?, industry? }, extras? }` → `200 { text }`
* `POST /ai/score-resume` *(optional direct call; usually worker-triggered)*
  Body: `{ applicationId | { resumeFileId, job: { title, mustHaves[], description } } }`
  → `200 { score, cvScore, cvTips: string[] }`

### Public (Applicant)

* `GET /public/jobs?q=&location=&industry=&employmentType=&cursor=&limit=`
  → `200 { items: Job[], nextCursor? }` *(only `PUBLISHED`)*
* `GET /public/jobs/:jobId` → `200 Job`
* `POST /public/apply`
  Body: `{ jobId, applicant: { email, name, phone?, location? }, resumeFileId }`
  → `200 Application` *(stage=`NEW`)*
* `GET /public/applications/:email` *(MVP: session/OTP not required)*
  → `200 { items: (Application & { job: Job })[] }`

---

## Core Shapes

```ts
// Job
{
  id, businessId, title, description, mustHaves: string[], location?,
  employmentType: 'FULL_TIME'|'PART_TIME'|'CONTRACT'|'INTERN'|'TEMPORARY',
  industry?, status: 'DRAFT'|'PUBLISHED'|'PAUSED'|'CLOSED',
  createdAt, updatedAt
}

// Applicant
{ id, email, name, phone?, location?, createdAt }

// Application
{
  id, applicantId, jobId, businessId,
  stage: 'NEW'|'SCREEN'|'INTERVIEW'|'OFFER'|'HIRED'|'REJECTED',
  score?, cvScore?, cvTips?: string[], notesCount, createdAt, updatedAt
}

// Note
{ id, applicationId, authorId, body, createdAt }

// ResumeFile
{ id, applicantId, jobId?, url, originalName, mimeType, sizeBytes, createdAt }
```

---

## Frontend — Screens & Components

### Routes / Screens

**`/onboarding` — Business onboarding**
Fields: Business Name, Description, Industry (prefill from query).
Action: Save → redirect `/jobs`.
Calls: `POST /business`.

**`/jobs` — Jobs dashboard**
Table + status filters.
Actions: “New Job”, “Manage”, “Pipeline”.
Calls: `GET /jobs?businessId=...`, `POST /jobs/:id/publish|pause|close`.

**`/jobs/new` — AI Job Creator**
Title input + Suggest chips; Must-have pills (+ suggestions); “Generate JD” → rich text; Create → Publish.
Calls: `/ai/suggest-job-titles`, `/ai/suggest-must-haves`, `/ai/generate-jd`, `POST /jobs`.

**`/jobs/:jobId` — Job summary**
Overview; publish/pause/close; metrics (# apps per stage).
Calls: `GET /jobs/:id`, `GET /jobs/:id/applications?stage=`.

**`/jobs/:jobId/pipeline` — Kanban board**
Columns: NEW • SCREEN • INTERVIEW • OFFER • HIRED • REJECTED.
Cards: name, email, score, cvScore, updatedAt.
Drag → `PATCH /applications/:id { stage }`.
Side panel: details + notes.

**`/careers` — Public job list**
Search & filters (location, industry, type).
Calls: `GET /public/jobs`.

**`/careers/:jobId` — Public job detail + Apply**
Upload resume (sign → upload → confirm); minimal applicant info; submit → success (CV tips may follow).
Calls: `/files/resume/sign`, `/files/resume/confirm`, `/public/apply`.

**`/my-applications`** *(stretch)*
Applicant’s status list.
Calls: `GET /public/applications/:email`.

### Component Inventory (key props)

* **Forms / Inputs**

  * `BusinessForm` — `{ initial?, onSubmit(values) }`
  * `JobTitleInputWithSuggestions` — `{ value, onChange, suggestions, onPick, loading }`
  * `MustHaveChips` — `{ items, suggestions?, onAdd, onRemove }`
  * `RichTextEditor` — `{ value, onChange }`
  * `PublishControls` — `{ status, onPublish, onPause, onClose }`

* **Lists / Cards**

  * `JobsTable` — `{ items, onManage(jobId), onPipeline(jobId) }`
  * `JobPublicCard` — `{ job, onView(jobId) }`
  * `ApplicationCard` — `{ application: Application & { applicant: Applicant } }`

* **DnD Board**

  * `PipelineBoard` — `{ stages, columns, onMove(appId, toStage) }`

* **Detail / Panel**

  * `ApplicationPanel` — `{ application: Application & { applicant; job }, notes, onAddNote }`
  * `ResumePreviewLink` — `{ resumeFile? }`

* **Public Apply**

  * `ResumeUpload` — `{ onSignedUpload(file) => Promise<{fileId}>, onConfirm(fileId) }`
  * `ApplyForm` — `{ job, onSubmit({ applicant, resumeFileId }) }`

* **Shared**

  * `SearchInput`, `FilterPills`, `StatusBadge`, `ScorePill`, `Pagination`, `EmptyState`, `Toast`, `Spinner`, `ConfirmDialog`

---

## Data Hooks

* `useMe()`
* `useBusiness()` / `useCreateBusiness()`
* `useJobs(params)` / `useJob(jobId)` / `useCreateJob()` / `usePatchJob()`
* `useApplications(jobId, stage?)` / `useApplication(appId)` / `useMoveApplication()`
* `useNotes(appId)` / `useAddNote(appId)`
* `usePublicJobs(params)` / `usePublicJob(jobId)` / `usePublicApply()`
* `useSignResume()` / `useConfirmResume()`
* `useAISuggestTitles()` / `useAISuggestMustHaves()` / `useAIGenerateJD()`

---

## Minimal Flows

* **Owner onboarding:** `/onboarding` → submit → store `businessId` → `/jobs`
* **Create & publish:** `/jobs/new` → title suggest → must-haves → generate JD → create → publish → `/jobs`
* **Manage pipeline:** `/jobs/:jobId/pipeline` → drag card → optimistic update → toast
* **Applicant apply:** `/careers/:jobId` → sign+upload+confirm → submit → success (CV tips async)

---

## Sample Payloads

**Create Job**

```json
{
  "businessId": "b-1",
  "title": "Sales Associate",
  "description": "We are looking for...",
  "mustHaves": ["CRM", "Retail sales", "Cold calling"],
  "location": "Makati, PH",
  "employmentType": "FULL_TIME",
  "industry": "Retail"
}
```

**Move Stage**

```json
{ "stage": "SCREEN" }
```

**Public Apply**

```json
{
  "jobId": "j-1",
  "applicant": { "email": "ana@example.com", "name": "Ana D", "phone": "+63..." },
  "resumeFileId": "f-1"
}
```

---

## Acceptance Checklist

* [ ] `POST /business` works with query prefill → redirects to `/jobs`.
* [ ] `POST /jobs` then `/jobs/:id/publish` → appears in `/public/jobs`.
* [ ] Apply flow (sign → upload → confirm → `/public/apply`) creates `Application(NEW)`.
* [ ] `/jobs/:jobId/applications` returns grouped items; drag-drop → `PATCH /applications/:id` persists.
* [ ] `POST /applications/:id/notes` increments `notesCount`.
* [ ] AI stubs return usable chips & JD text.

---

### Notes

* For the hackathon, keep AI endpoints deterministic (stubbed arrays/templates).
* Resume upload: client calls **sign → S3 PUT → confirm**; server enqueues parse/score job.
* Public routes require no auth; business routes use a dev token for `/auth/me`.
