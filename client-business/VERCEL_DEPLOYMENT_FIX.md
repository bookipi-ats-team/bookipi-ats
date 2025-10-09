# Vercel Deployment Fix - 404 Error on Direct Route Access

## Problem
When accessing routes directly (e.g., `https://bookipi-ats-business.vercel.app/onboarding`), you get a 404 error.

## Root Cause
Vercel (and most static hosting) tries to find a physical file at that path. Since this is a Single Page Application (SPA) with client-side routing (React Router), all routes should serve the same `index.html` file.

## Solution

### ✅ File Created: `vercel.json`

This file tells Vercel to rewrite all routes to `index.html`, allowing React Router to handle the routing:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## How to Deploy the Fix

### Option 1: Push to Git (Recommended)

If you're using GitHub, GitLab, or Bitbucket connected to Vercel:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Add vercel.json to fix SPA routing"

# Push to your remote
git push origin main  # or master, depending on your branch name
```

Vercel will automatically detect the push and redeploy.

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm install -g vercel

# Deploy from project root
vercel --prod
```

### Option 3: Manual Upload via Vercel Dashboard

1. Go to your Vercel project dashboard
2. Click "Settings" → "Git"
3. Reconnect or trigger a new deployment
4. The `vercel.json` file will be included in the next build

### Option 4: Drag & Drop (Quick Test)

1. Build your project: `npm run build`
2. Go to [vercel.com](https://vercel.com)
3. Drag the `dist` folder (including `vercel.json` in root) to deploy

## Verification

After deployment, test these URLs directly in your browser:

- ✅ `https://bookipi-ats-business.vercel.app/`
- ✅ `https://bookipi-ats-business.vercel.app/onboarding`
- ✅ `https://bookipi-ats-business.vercel.app/jobs`
- ✅ `https://bookipi-ats-business.vercel.app/jobs/new`
- ✅ `https://bookipi-ats-business.vercel.app/jobs/j-1`
- ✅ `https://bookipi-ats-business.vercel.app/jobs/j-1/edit`
- ✅ `https://bookipi-ats-business.vercel.app/jobs/j-1/pipeline`

All should work without 404 errors!

## What `vercel.json` Does

```json
{
  "rewrites": [
    {
      "source": "/(.*)",        // Match ALL routes
      "destination": "/index.html"  // Serve index.html for all routes
    }
  ]
}
```

- **`source: "/(.*)")`** - Matches any URL path
- **`destination: "/index.html"`** - Always serves the main HTML file
- React Router then takes over and handles the client-side routing

## Alternative: Using `redirects` (Not Recommended for SPA)

```json
{
  "redirects": [
    {
      "source": "/(.*)",
      "destination": "/index.html",
      "permanent": false
    }
  ]
}
```

❌ This causes the URL to change in the browser
✅ `rewrites` keeps the original URL (better for SPAs)

## Other Hosting Platforms

### Netlify
Create `_redirects` file in `/public`:
```
/*    /index.html   200
```

### Firebase Hosting
In `firebase.json`:
```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### AWS S3 + CloudFront
In CloudFront → Error Pages:
- Set 403 and 404 errors to return `/index.html` with 200 status

### GitHub Pages
More complex - requires using HashRouter instead of BrowserRouter

## Common Issues After Fix

### Issue 1: Assets not loading
**Solution**: Make sure `base` in `vite.config.ts` is set correctly:
```typescript
export default defineConfig({
  base: '/', // For root domain deployment
  // base: '/your-repo-name/', // For GitHub Pages
})
```

### Issue 2: API calls failing
**Solution**: Update `BASE_URL` in `src/api/config.ts`:
```typescript
export const API_CONFIG = {
  USE_MOCK: false, // Switch to true for demo
  BASE_URL: 'https://your-backend-api.com/api/v1',
  AUTH_TOKEN: process.env.VITE_AUTH_TOKEN,
};
```

### Issue 3: Environment variables not working
**Solution**: Add to Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add variables with `VITE_` prefix:
   - `VITE_API_URL`
   - `VITE_AUTH_TOKEN`
3. Redeploy

## Build Configuration

Your `vite.config.ts` should look like:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Important for Vercel
});
```

## Summary

✅ **Created**: `vercel.json` with SPA rewrites
🔄 **Next Step**: Push to Git or redeploy via Vercel CLI
✨ **Result**: All routes will work when accessed directly

The fix is already in place - you just need to deploy it! 🚀
