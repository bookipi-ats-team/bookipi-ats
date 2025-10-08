Tech & Project Baseline

React (Vite or Next.js), TypeScript, Tailwind, React Query.

API base: import.meta.env.VITE_API_BASE_URL (default http://localhost:4000/api/v1).

Auth for business routes: Authorization: Bearer ${import.meta.env.VITE_API_TOKEN}.

File structure (suggested):

src/
  app or pages/
  components/{ui,features}
  hooks/
  api/
  lib/
  styles/
  types/

Design Guidelines (must follow)

Canvas: white; Sidebar: #F7F8FB.

Primary: #2563EB (hover #1D4ED8), focus ring: #93C5FD.

Text: title #111827, secondary #4B5563.

Borders: #E5E7EB; radius: 12px; shadow: very subtle.

Typography (Inter): H1 24/32 semi-bold; body 14–15 regular; meta 12 medium (table headers uppercase).

Spacing: row height ≈ 64px; compact controls with generous white space.

Buttons: primary solid blue (12px radius); secondary ghost, subtle hover.

Animations: 150–200ms ease-out, minimal.

Status stages (pills, compact): NEW | SCREEN | INTERVIEW | OFFER | HIRED | REJECTED (soft bg, small dot/icon optional, readable text).

Keep everything legible, calm, and consistent. Prefer utilities over custom CSS.

Routes to Implement

/onboarding — collect business name, description, industry; support query prefill; POST /business; success → /jobs.

/jobs — dashboard list with status filter; actions: New Job, Manage, Pipeline.

/jobs/new — AI job creator (title suggestions, must-have suggestions, generate JD); create & publish flow.

/jobs/:jobId — summary with publish/pause/close and basic metrics (#apps by stage).

/jobs/:jobId/pipeline — kanban: drag & drop between NEW/SCREEN/INTERVIEW/OFFER/HIRED/REJECTED; side panel for details & notes.

API Calls to Wire (business app)

GET /auth/me

GET /business/my, POST /business

GET /jobs?businessId=&status=&q=&cursor=&limit=

POST /jobs, GET /jobs/:id, PATCH /jobs/:id

POST /jobs/:id/publish|pause|close

GET /jobs/:jobId/applications?stage=

GET /applications/:id, PATCH /applications/:id { stage }

POST /applications/:id/notes { body }

AI: POST /ai/suggest-job-titles, POST /ai/suggest-must-haves, POST /ai/generate-jd

Components to Scaffold

Layout: Shell (left sidebar, sticky header).

Forms/Inputs: BusinessForm, JobTitleInputWithSuggestions, MustHaveChips, RichTextEditor (simple is fine).

Lists & Tables: JobsTable (64px rows, 12px uppercase headers).

Actions: PublishControls (publish/pause/close).

Pipeline: PipelineBoard (DnD), ApplicationCard, ApplicationPanel (details, notes, scores).

Shared UI: Button(primary|ghost), Input, Textarea, Select, Badge/Pill (use stage labels), DataTable, EmptyState, Toast, Spinner, ConfirmDialog, Pagination.

Hooks (React Query)

Create typed hooks with proper keys and error toasts:

useMe()

useBusiness() / useCreateBusiness()

useJobs(params) / useJob(id) / useCreateJob() / usePatchJob()

useApplications(jobId, stage?) / useApplication(id) / useMoveApplication()

useNotes(appId) / useAddNote(appId)

useAISuggestTitles() / useAISuggestMustHaves() / useAIGenerateJD()

Fetch helper should:

Prepend base URL, inject bearer token, parse JSON, surface server { error: { code, message } }.

Interaction Rules

Onboarding: validate required fields; success toast; route to /jobs.

Jobs: empty state CTA “Create Job”; quick status filter; row actions.

AI creator: debounce suggestions; chips selectable; “Generate JD” fills editor; create, then optional publish.

Pipeline: accessible DnD (mouse & keyboard). Optimistic stage updates; rollback on failure. Side panel shows resume link, match score, cv score, notes (add note inline).

Status pills: render exact stage labels; compact rounded; soft bg; readable text. (No elaborate theming—keep generic but consistent.)

Accessibility & Quality

Every input has a <label>; show inline errors.

Focus rings visible and consistent (ring-2 with brand focus color).

Keyboard nav for menus and DnD (tab/arrow support); aria labels on interactive icons.

No console warnings; types strict; handle loading/empty/error states.

Minimal Inline Prompts (paste as comments where needed)

Table: “Build a 64px-row DataTable with 12px uppercase headers, subtle row hover, right-aligned actions.”

Suggest chips: “Below the title input, render clickable suggestion chips from /ai/suggest-job-titles (debounced).”

DnD: “Kanban with columns NEW, SCREEN, INTERVIEW, OFFER, HIRED, REJECTED; on drag end call PATCH /applications/:id with { stage } (optimistic).”

Notes: “In the application panel, list notes (newest first) and an add-note field that optimistically appends.”

Small Style Tokens (Tailwind-friendly)

Card: rounded-[12px] border border-[#E5E7EB] bg-white shadow-sm

Input: h-9 rounded-[12px] border border-[#E5E7EB] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#93C5FD]

Primary button: h-9 rounded-[12px] bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition ease-out duration-200

Ghost button: h-9 rounded-[12px] hover:bg-gray-50 transition

Header H1: text-[24px] leading-8 font-semibold text-[#111827]

Meta text: text-[12px] font-medium uppercase text-[#4B5563] tracking-wide