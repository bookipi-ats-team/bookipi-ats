# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

# Bookipi ATS - Business Owner Portal

A modern Applicant Tracking System (ATS) frontend for business owners, built for a 2-day hackathon.

## 🚀 Features

- **Business Onboarding** - Quick setup with query parameter prefill support
- **Jobs Dashboard** - Manage job postings with filtering and status controls
- **AI-Powered Job Creation** - Get AI suggestions for job titles, requirements, and auto-generated descriptions
- **Job Summary** - Overview of applications with metrics and pipeline stats
- **Kanban Pipeline** - Drag-and-drop applicant management across stages (NEW → SCREEN → INTERVIEW → OFFER → HIRED → REJECTED)
- **Notes & Scoring** - Add notes and view AI-generated match scores for applicants

## 🛠️ Tech Stack

- **React 19** + **TypeScript**
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **React Query** - Data fetching and state management
- **Tailwind CSS** - Utility-first styling
- **@dnd-kit** - Drag and drop functionality
- **Axios** - HTTP client

## 📦 Installation

```bash
npm install
```

## 🎯 Quick Start

### Development Mode (Mock Data)

By default, the app uses **mock data** so you can test everything without a backend:

```bash
npm run dev
```

Visit http://localhost:5173

### Connect to Real Backend

1. Open `src/api/config.ts`
2. Change `USE_MOCK` to `false`:

```typescript
export const API_CONFIG = {
  USE_MOCK: false, // Set to false for real API
  BASE_URL: 'http://localhost:3000/api/v1',
  AUTH_TOKEN: 'your-jwt-token-here',
};
```

3. Ensure your backend is running on the specified BASE_URL

## 🎨 Design System

- **Primary Color**: `#2563EB` (hover: `#1D4ED8`)
- **Sidebar Background**: `#F7F8FB`
- **Border Radius**: `12px`
- **Font**: Inter (loaded via Google Fonts)
- **Typography**:
  - H1: 24px/32px semi-bold
  - Body: 14-15px regular
  - Meta: 12px medium

## 🗂️ Project Structure

```
src/
├── api/
│   ├── config.ts          # API configuration (mock/live toggle)
│   ├── client.ts          # Axios instance
│   ├── mockData.ts        # Mock data for development
│   └── index.ts           # API service layer
├── components/
│   ├── shared/            # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── SearchInput.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── ScorePill.tsx
│   │   └── Spinner.tsx
│   └── Layout.tsx         # Main layout with sidebar
├── hooks/
│   └── index.ts           # React Query hooks
├── pages/
│   ├── OnboardingPage.tsx
│   ├── JobsPage.tsx
│   ├── NewJobPage.tsx
│   ├── JobSummaryPage.tsx
│   └── PipelinePage.tsx
├── types/
│   └── index.ts           # TypeScript interfaces
└── App.tsx                # Main app with routing
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔗 Routes

| Route | Description |
|-------|-------------|
| `/onboarding` | Business setup (supports query params: `?name=&description=&industry=`) |
| `/jobs` | Jobs dashboard with filters |
| `/jobs/new` | Create new job with AI assistance |
| `/jobs/:jobId` | Job summary and metrics |
| `/jobs/:jobId/pipeline` | Kanban board for applicant management |

## 🤖 AI Features

The app includes AI-powered features that work with mock data by default:

1. **Job Title Suggestions** - Get relevant job title ideas
2. **Must-Have Suggestions** - AI-recommended skills and requirements
3. **JD Generation** - Auto-generate complete job descriptions
4. **Resume Scoring** - Match score and CV quality score (visible in pipeline)

## 📝 Mock Data

The app comes with pre-populated mock data:

- 1 Business (Bookipi Tech Solutions)
- 3 Jobs (Senior Software Engineer, Product Manager, UX Designer)
- 4 Applicants with varying scores
- 4 Applications across different pipeline stages
- Sample notes and CV tips

## 🔄 Switching Between Mock and Live API

The indicator at the bottom of the sidebar shows whether you're in **Mock Mode** or connected to a **Live API**.

**Mock Mode Benefits:**
- No backend required
- Instant responses
- Perfect for frontend development
- Test all features immediately

**Live API Mode:**
- Connect to real backend
- Persistent data
- Real AI integrations
- Full authentication

## 🎯 MVP Scope

**Included:**
- Business onboarding
- Job CRUD operations
- AI-assisted job creation
- Application pipeline management
- Drag-and-drop stage updates
- Notes and scoring

**Post-MVP (Not Included):**
- External job board posting (LinkedIn, Seek, Glassdoor)
- Interview scheduling
- Offer management
- Email automations
- Multi-tenant organizations

## 🤝 Team Integration

This frontend is designed to work with:
- **Backend API** (REST endpoints at `/api/v1`)
- **Applicant Portal** (separate frontend for job seekers)

### Backend Endpoints Expected

Key endpoints the frontend expects:
- `GET /auth/me`
- `POST /business`
- `GET /jobs`, `POST /jobs`, `PATCH /jobs/:id`
- `POST /jobs/:id/publish|pause|close`
- `GET /jobs/:jobId/applications`
- `PATCH /applications/:id`
- `POST /applications/:id/notes`
- `POST /ai/suggest-job-titles`
- `POST /ai/suggest-must-haves`
- `POST /ai/generate-jd`

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🐛 Troubleshooting

**Styles not loading?**
- Restart dev server (`npm run dev`)
- Check that Tailwind config files exist

**API not connecting?**
- Verify `USE_MOCK` setting in `src/api/config.ts`
- Check backend URL and port
- Ensure CORS is configured on backend

**Drag and drop not working?**
- Clear browser cache
- Check console for errors

---

**Happy Hacking! 🚀**

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
