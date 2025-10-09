# Manual Applicant Addition Feature

## Overview
Added the ability for business owners to manually add applicants to jobs through a user-friendly interface with CV upload and form fields.

## Implementation Summary

### 1. Backend API Integration
**File:** `src/api/index.ts`
- Added `applicationsApi.create()` method
- Supports both mock and live API modes
- Mock mode generates realistic test data:
  - Applicant IDs: `a-{timestamp}`
  - Application IDs: `app-{timestamp}`
  - Random scores: 70-100 for score and cvScore
  - Mock CV tips provided
- Live mode: POST to `/applications` endpoint

**File:** `src/hooks/index.ts`
- Added `useCreateApplication` hook using React Query
- Returns mutation result with proper typing
- Automatically invalidates relevant queries on success:
  - Applications query for the job
  - Job query for updated applicant count
- Fixed TypeScript import: Added `CreateApplicationInput` type

### 2. User Interface
**File:** `src/pages/AddApplicantPage.tsx`
- New page component for adding applicants
- Features:
  - CV upload with drag-and-drop UI
  - File type validation (PDF, DOC, DOCX)
  - Auto-fill simulation on CV upload (mock data for now)
  - Form fields: name*, email*, phone, location
  - Required field validation
  - Loading and error states
  - Clean, responsive design
- **Redirects to pipeline with applicant selected:**
  - Captures the created application ID from mutation response
  - Navigates to `/jobs/${jobId}/pipeline?applicant=${applicationId}`
  - Pipeline page automatically opens the side panel for the new applicant

**File:** `src/pages/JobSummaryPage.tsx`
- Added "Add Applicant" button in header
- Located between "Edit Job" and action buttons
- Navigates to `/jobs/${jobId}/add-applicant`

### 3. Routing
**File:** `src/App.tsx`
- Added route: `/jobs/:jobId/add-applicant`
- Imported `AddApplicantPage` component
- Route positioned before pipeline route for proper matching

**File:** `src/pages/PipelinePage.tsx`
- Added URL search params support with `useSearchParams()`
- Auto-selects applicant when `?applicant={id}` is in URL
- Uses `useMemo` for optimized applications array
- `useEffect` hook watches for applicant parameter and auto-selects
- Only selects if no applicant is currently selected (prevents overriding user selection)

## User Flow

1. **Navigation**
   - From Job Summary page
   - Click "Add Applicant" button
   - Redirects to applicant form

2. **Form Filling**
   - Option 1: Upload CV (auto-fills fields - currently mocked)
   - Option 2: Manually enter information
   - Required: name and email
   - Optional: phone and location

3. **Submission**
   - Click "Add Applicant" button
   - API creates applicant and application
   - **Redirects to Pipeline with new applicant selected** ✨
   - Application appears in NEW stage
   - Side panel automatically opens showing applicant details

## Data Structure

### CreateApplicationInput Type
```typescript
{
  jobId: string;
  applicant: {
    id?: string;           // Optional: use existing applicant
    email: string;         // Required
    name: string;          // Required
    phone?: string;        // Optional
    location?: string;     // Optional
  };
  resumeFileId?: string;   // Optional: CV file reference
}
```

## Future Enhancements

1. **CV Processing**
   - Integrate real CV parsing service
   - Extract information automatically
   - Parse skills, experience, education

2. **File Upload**
   - Implement actual file upload to backend
   - Generate `resumeFileId` for CV reference
   - Store files in cloud storage (S3, etc.)

3. **Duplicate Detection**
   - Check for existing applicants by email
   - Show warning if applicant already exists
   - Option to use existing applicant record

4. **Form Validation**
   - Enhanced email validation
   - Phone number format validation
   - Location autocomplete

5. **Rich Editor**
   - Add notes field
   - Initial stage selection
   - Custom tags/labels

## Testing

### Manual Testing Steps
1. Navigate to any job summary page
2. Click "Add Applicant" button
3. Test CV upload:
   - Upload a PDF file
   - Verify fields auto-fill (mock data)
4. Test manual entry:
   - Fill out form without CV
   - Submit with only required fields
5. Verify:
   - **Redirects to pipeline page** ✅
   - **New applicant is automatically selected** ✅
   - **Side panel opens showing applicant details** ✅
   - Application has NEW stage
   - Applicant scores are displayed (consistent generated scores)
   - Can add notes immediately
   - Can drag applicant to different stages

### Mock Data
When `USE_MOCK = true` in config:
- Creates applicant with timestamp-based ID
- Generates random scores (70-100)
- Returns mock CV tips
- Simulates API delay

## Files Modified/Created

### Created
- `src/pages/AddApplicantPage.tsx` - New applicant form page

### Modified
- `src/api/index.ts` - Added create method to applicationsApi
- `src/hooks/index.ts` - Added useCreateApplication hook and import
- `src/pages/JobSummaryPage.tsx` - Added "Add Applicant" button
- `src/pages/PipelinePage.tsx` - Added URL search params support for auto-selecting applicants
- `src/App.tsx` - Added route and import

## Technical Notes

- Uses React 19 with TypeScript
- React Router for navigation
- React Query for data mutations
- Form uses controlled components
- File input handled with useRef hook
- Responsive design with Tailwind CSS
- Error handling with try-catch
- Loading states for better UX

## Backend Endpoint

**POST /applications**
```json
{
  "jobId": "string",
  "applicant": {
    "id": "string (optional)",
    "email": "string",
    "name": "string",
    "phone": "string (optional)",
    "location": "string (optional)"
  },
  "resumeFileId": "string (optional)"
}
```

**Response:**
```json
{
  "_id": "string",
  "applicantId": "string",
  "jobId": "string",
  "businessId": "string",
  "stage": "NEW",
  "score": number,
  "cvScore": number,
  "cvTips": ["string"],
  "notesCount": 0,
  "applicant": { ... }
}
```

## Date Completed
January 2025
