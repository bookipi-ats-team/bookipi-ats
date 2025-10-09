# API Configuration Guide

## Overview
The ATS frontend can work in two modes:
1. **Mock Mode** - Uses local mock data (for development/demo)
2. **Live API Mode** - Connects to the backend API

---

## Current Configuration

### API URL
```
https://art-bookipi-ats-api.bkpi.co/api/v1
```

### Current Mode
**Mock Mode** is currently enabled (`USE_MOCK: true`)

---

## How to Switch Modes

### Option 1: Edit Config File (Quick)

Open `/src/api/config.ts` and change:

```typescript
export const API_CONFIG = {
  USE_MOCK: true,  // Change to false to use live API
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://art-bookipi-ats-api.bkpi.co/api/v1',
  AUTH_TOKEN: import.meta.env.VITE_AUTH_TOKEN || '',
};
```

**To enable live API:**
```typescript
USE_MOCK: false,  // ✅ Now using live backend
```

### Option 2: Environment Variables (Recommended for Production)

Create a `.env` file in the project root:

```bash
# .env
VITE_API_BASE_URL=https://art-bookipi-ats-api.bkpi.co/api/v1
VITE_AUTH_TOKEN=your-jwt-token-here
```

Then set `USE_MOCK: false` in `src/api/config.ts`.

**Note**: Environment variables must start with `VITE_` to be exposed to the frontend.

---

## Environment Setup

### Development (.env)
```bash
VITE_API_BASE_URL=https://art-bookipi-ats-api.bkpi.co/api/v1
VITE_AUTH_TOKEN=
```

### Production (Vercel)
1. Go to Vercel Dashboard
2. Select your project: `bookipi-ats-business`
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://art-bookipi-ats-api.bkpi.co/api/v1`
5. (Optional) Add `VITE_AUTH_TOKEN` if needed
6. Redeploy

---

## API Endpoints Expected

The frontend expects these endpoints on the backend:

### Business
- `GET /business/my`
- `POST /business`
- `PATCH /business/:id`

### Jobs
- `GET /jobs`
- `POST /jobs`
- `GET /jobs/:id`
- `PATCH /jobs/:id`
- `POST /jobs/:id/publish`
- `POST /jobs/:id/pause`
- `POST /jobs/:id/close`

### Applications
- `GET /jobs/:jobId/applications`
- `GET /applications/:id`
- `PATCH /applications/:id`

### Notes
- `GET /applications/:id/notes`
- `POST /applications/:id/notes`

### AI (Optional)
- `POST /ai/suggest-job-titles`
- `POST /ai/suggest-must-haves`
- `POST /ai/generate-jd`

See `API_GUIDE.md` for complete API specifications.

---

## Testing the Connection

### 1. Switch to Live Mode
```typescript
// src/api/config.ts
USE_MOCK: false,
```

### 2. Check Browser Console
Open browser DevTools → Console, you should see API requests to:
```
https://art-bookipi-ats-api.bkpi.co/api/v1/...
```

### 3. Verify Network Tab
Open DevTools → Network tab:
- Look for requests to `art-bookipi-ats-api.bkpi.co`
- Check response status codes
- Verify request/response payloads

---

## Authentication

### Current Setup
The config supports JWT token authentication:

```typescript
// Automatically adds Authorization header if token is set
Authorization: Bearer <AUTH_TOKEN>
```

### Setting Token

#### Option 1: Environment Variable
```bash
VITE_AUTH_TOKEN=your-jwt-token
```

#### Option 2: Config File (Not Recommended)
```typescript
AUTH_TOKEN: 'your-jwt-token',  // Don't commit this!
```

#### Option 3: Runtime (Best for Production)
Implement proper auth flow that sets token after login.

---

## CORS Configuration

Make sure your backend allows requests from:
- `http://localhost:5173` (local dev)
- `https://bookipi-ats-business.vercel.app` (production)

Backend CORS headers should include:
```
Access-Control-Allow-Origin: https://bookipi-ats-business.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## Troubleshooting

### Issue: CORS Errors
**Error**: `Access to fetch at 'https://art-bookipi-ats-api.bkpi.co' from origin 'https://bookipi-ats-business.vercel.app' has been blocked by CORS policy`

**Solution**: Update backend CORS settings to allow your frontend domain.

### Issue: 404 Not Found
**Error**: `GET https://art-bookipi-ats-api.bkpi.co/api/v1/business/my 404`

**Solution**: Verify the endpoint exists on the backend. Check API_GUIDE.md for expected endpoints.

### Issue: 401 Unauthorized
**Error**: `GET https://art-bookipi-ats-api.bkpi.co/api/v1/business/my 401`

**Solution**: 
1. Check if AUTH_TOKEN is set correctly
2. Verify token is valid and not expired
3. Confirm backend expects token in `Authorization: Bearer <token>` format

### Issue: Network Error
**Error**: `Network request failed`

**Solution**:
1. Check if backend is running
2. Verify URL is correct: `https://art-bookipi-ats-api.bkpi.co/api/v1`
3. Check SSL certificate is valid
4. Test API directly with curl or Postman

---

## Quick Switch Commands

### Enable Mock Mode (Development)
```typescript
// src/api/config.ts
export const API_CONFIG = {
  USE_MOCK: true,  // ✅ Using mock data
  // ...
};
```

### Enable Live API (Production)
```typescript
// src/api/config.ts
export const API_CONFIG = {
  USE_MOCK: false,  // ✅ Using live backend
  // ...
};
```

---

## Complete Config File Reference

```typescript
// src/api/config.ts
export const API_CONFIG = {
  // Toggle: true = mock data, false = live API
  USE_MOCK: true,
  
  // Your backend API URL
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://art-bookipi-ats-api.bkpi.co/api/v1',
  
  // JWT token for authentication
  AUTH_TOKEN: import.meta.env.VITE_AUTH_TOKEN || '',
};
```

---

## Deployment Checklist

Before deploying to production:

- [ ] Update `USE_MOCK` to `false` if connecting to live API
- [ ] Add `VITE_API_BASE_URL` to Vercel environment variables
- [ ] Add `VITE_AUTH_TOKEN` if backend requires authentication
- [ ] Test all endpoints work (business, jobs, applications, notes)
- [ ] Verify CORS is configured on backend
- [ ] Check SSL certificate is valid
- [ ] Test error handling (network failures, 404s, etc.)

---

## Current Status

✅ **API URL Set**: `https://art-bookipi-ats-api.bkpi.co/api/v1`  
⚠️ **Mode**: Mock (change `USE_MOCK` to `false` to connect)  
📝 **Next Steps**: 
1. Verify backend endpoints are ready
2. Set `USE_MOCK: false` in `src/api/config.ts`
3. Test the connection
4. Deploy to Vercel

---

**Last Updated**: October 9, 2025
