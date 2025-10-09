# Quick Start Guide

## 🎯 Getting Started in 3 Steps

1. **Install dependencies** (if not already done)
   ```bash
   npm install
   ```

2. **Start the dev server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   - Visit: http://localhost:5173
   - You'll see the Jobs dashboard with mock data already loaded!

## 🧭 Navigation Flow

### First Time Setup
1. Start at `/onboarding` to create your business profile
   - Try with prefill: `/onboarding?name=My Company&industry=Technology`
2. Navigate to `/jobs` to see the jobs dashboard

### Creating a Job
1. Click **"New Job"** button
2. Use **"Suggest Titles"** to get AI recommendations
3. Add must-have skills manually or click **"Suggest Skills"**
4. Click **"Generate with AI"** for job description
5. Choose "Save as Draft" or "Create & Publish"

### Managing Applications
1. From Jobs dashboard, click **"Pipeline"** on any job
2. Drag applicant cards between stages:
   - NEW → SCREEN → INTERVIEW → OFFER → HIRED
   - Or drag to REJECTED
3. Click any card to see details in side panel
4. Add notes to track progress

## 🎨 Testing UI Components

All pages are accessible with mock data:

- **Onboarding**: http://localhost:5173/onboarding
- **Jobs Dashboard**: http://localhost:5173/jobs
- **Create Job**: http://localhost:5173/jobs/new
- **Job Summary**: http://localhost:5173/jobs/j-1
- **Pipeline**: http://localhost:5173/jobs/j-1/pipeline

## 🔄 Mock vs Live API

### Current Mode: MOCK (Default)
Look at the bottom-left of the sidebar - you'll see a green dot with "Mock Mode Active"

### To Switch to Live API:
1. Open `src/api/config.ts`
2. Change:
   ```typescript
   USE_MOCK: false  // was: true
   ```
3. Set your backend URL and token:
   ```typescript
   BASE_URL: 'http://localhost:3000/api/v1'
   AUTH_TOKEN: 'your-jwt-token'
   ```

## 🎭 Mock Data Overview

**Pre-loaded data includes:**

### Jobs (3)
- Senior Software Engineer (Published)
- Product Manager (Published)
- UX Designer (Draft)

### Applicants (4)
- Maria Santos - NEW stage, Score: 85, CV: 78
- Juan Dela Cruz - SCREEN stage, Score: 92, CV: 88
- Anna Reyes - INTERVIEW stage, Score: 88, CV: 82
- Miguel Garcia - NEW stage, Score: 75, CV: 70

### Features to Test
✅ Search jobs by title
✅ Filter by status (Draft, Published, Paused, Closed)
✅ Publish/Pause/Close jobs
✅ AI suggestions for titles and skills
✅ AI-generated job descriptions
✅ Drag-and-drop applicants
✅ Add notes to applications
✅ View match scores and CV scores
✅ CV improvement tips

## 🛠️ Customizing Mock Data

Edit `src/api/mockData.ts` to:
- Add more jobs
- Create additional applicants
- Modify scores and stages
- Add more notes

Example:
```typescript
export const mockJobs: Job[] = [
  // Add your custom job here
  {
    id: 'j-custom',
    businessId: 'b-1',
    title: 'Your Custom Job Title',
    // ... other fields
  },
];
```

## 🎨 Design Customization

Want to change colors or styling? Edit:
- `tailwind.config.js` - Colors, fonts, spacing
- `src/index.css` - Global styles
- Component files - Individual component styles

## 📝 Common Tasks

### Test Onboarding with Prefill
```
http://localhost:5173/onboarding?name=Tech Startup&description=We build cool stuff&industry=Technology
```

### Add a New Application Stage
1. Edit `src/types/index.ts` - Add to `ApplicationStage` type
2. Edit `src/pages/PipelinePage.tsx` - Add to `STAGES` and `STAGE_CONFIG`
3. Update `src/components/shared/StatusBadge.tsx` - Add color config

### Modify AI Responses
Edit `src/api/mockData.ts`:
```typescript
export const mockJobTitleSuggestions: AISuggestionResponse = {
  items: [
    'Your Custom Title 1',
    'Your Custom Title 2',
    // ...
  ],
  source: 'STATIC',
};
```

## 🐛 Troubleshooting

**White screen on load?**
- Check browser console (F12)
- Verify all dependencies installed: `npm install`

**Styles look broken?**
- Restart dev server: Stop (Ctrl+C) and run `npm run dev` again
- Clear browser cache (Ctrl+Shift+Delete)

**Can't drag cards?**
- Check if @dnd-kit is installed: `npm list @dnd-kit/core`
- Try in different browser (Chrome recommended)

**Mock data not showing?**
- Verify `USE_MOCK: true` in `src/api/config.ts`
- Check console for errors

## 🚀 Production Build

When ready to deploy:

```bash
npm run build
```

This creates optimized files in `/dist` folder.

To preview production build:
```bash
npm run preview
```

## 🤝 Working with Your Team

### For Backend Developers
Share this with your backend team:
- Full API spec is in the project requirements
- All endpoints are documented in README.md
- Mock responses show expected data structure

### For Applicant Portal Developers
This business portal can work alongside:
- Applicant-facing job board
- Application submission forms
- Status tracking for applicants

## 📊 Performance Tips

The app uses React Query for:
- ✅ Automatic caching
- ✅ Background refetching
- ✅ Optimistic updates (drag-and-drop)

Mock API includes realistic delays (500-1500ms) to simulate real conditions.

---

## 🎉 You're All Set!

Open http://localhost:5173 and start exploring!

Need help? Check the main README.md for detailed documentation.
