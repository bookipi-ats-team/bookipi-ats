# API Configuration Guide

## 🔄 Switching Between Mock and Live API

### Current Configuration
Location: `src/api/config.ts`

```typescript
export const API_CONFIG = {
  USE_MOCK: true,  // 👈 Change this to switch modes
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  AUTH_TOKEN: import.meta.env.VITE_AUTH_TOKEN || '',
};
```

## 🎭 Mock Mode (Default)

**Pros:**
- ✅ No backend required
- ✅ Works immediately
- ✅ Fast responses (500-1500ms simulated delay)
- ✅ Consistent test data
- ✅ Perfect for frontend development

**How it works:**
- All API calls are intercepted
- Data comes from `src/api/mockData.ts`
- Simulates realistic API delays
- State persists only in memory (resets on refresh)

**When to use:**
- Initial frontend development
- UI/UX testing
- Demos and presentations
- When backend is not ready

## 🔗 Live API Mode

**Pros:**
- ✅ Real data persistence
- ✅ Actual AI integrations
- ✅ Full authentication
- ✅ Multi-user support

**Setup:**

1. **Update config file:**
   ```typescript
   // src/api/config.ts
   export const API_CONFIG = {
     USE_MOCK: false,  // 👈 Set to false
     BASE_URL: 'http://localhost:3000/api/v1',  // Your backend URL
     AUTH_TOKEN: 'your-jwt-token-here',  // From your auth flow
   };
   ```

2. **Or use environment variables:**
   Create `.env` file:
   ```bash
   VITE_API_BASE_URL=http://localhost:3000/api/v1
   VITE_AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

## 🔌 Backend Requirements

Your backend should implement these endpoints:

### Authentication
```
GET /auth/me
Response: { id, email, name, role, businessId }
```

### Business
```
GET /business/my
POST /business
PATCH /business/:id
```

### Jobs
```
GET /jobs?businessId=&status=&q=
POST /jobs
GET /jobs/:id
PATCH /jobs/:id
POST /jobs/:id/publish
POST /jobs/:id/pause
POST /jobs/:id/close
```

### Applications
```
GET /jobs/:jobId/applications?stage=
GET /applications/:id
PATCH /applications/:id
```

### Notes
```
GET /applications/:id/notes
POST /applications/:id/notes
```

### AI Endpoints
```
POST /ai/suggest-job-titles
POST /ai/suggest-must-haves
POST /ai/generate-jd
```

## 🔒 Authentication

### Current Implementation
The app sends a Bearer token in all requests:

```typescript
headers: {
  'Authorization': `Bearer ${API_CONFIG.AUTH_TOKEN}`,
}
```

### For Production
Replace with proper auth flow:

1. **Login page** → Get JWT token
2. **Store token** → localStorage or secure cookie
3. **Refresh token** → Before expiration
4. **Logout** → Clear token

Example update to `src/api/client.ts`:
```typescript
const getAuthToken = () => {
  return localStorage.getItem('auth_token') || '';
};

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 🧪 Testing Both Modes

### Test Mock Mode
```typescript
// src/api/config.ts
USE_MOCK: true
```
- Visit http://localhost:5173
- All features work with dummy data
- Check sidebar shows "Mock Mode Active"

### Test Live Mode
```typescript
// src/api/config.ts
USE_MOCK: false
BASE_URL: 'http://localhost:3000/api/v1'
AUTH_TOKEN: 'your-token'
```
- Ensure backend is running
- Visit http://localhost:5173
- Data should persist across refreshes
- Check sidebar (green dot disappears)

## 🐛 Debugging API Issues

### Enable Request Logging
Add to `src/api/client.ts`:

```typescript
axiosInstance.interceptors.request.use((config) => {
  console.log('📤 API Request:', {
    method: config.method,
    url: config.url,
    data: config.data,
  });
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);
```

### Common Issues

**401 Unauthorized**
- Check AUTH_TOKEN is valid
- Verify token hasn't expired
- Ensure backend accepts Bearer tokens

**404 Not Found**
- Verify BASE_URL is correct
- Check endpoint paths match backend
- Ensure backend routes are registered

**CORS Errors**
- Backend must allow your frontend origin
- Add CORS headers to backend:
  ```
  Access-Control-Allow-Origin: http://localhost:5173
  Access-Control-Allow-Methods: GET,POST,PATCH,DELETE
  Access-Control-Allow-Headers: Content-Type,Authorization
  ```

**Network Errors**
- Check backend is running
- Verify correct port number
- Test backend directly with curl/Postman

## 📊 API Response Format

All endpoints should follow this structure:

### Success Response
```json
{
  "id": "j-1",
  "title": "Senior Engineer",
  "status": "PUBLISHED",
  ...
}
```

### Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required",
    "field": "title"
  }
}
```

### Paginated Response
```json
{
  "items": [...],
  "nextCursor": "eyJpZCI6MTIzfQ=="
}
```

## 🔄 Gradual Migration

You can mix both modes during development:

```typescript
// src/api/index.ts
export const jobsApi = {
  async getAll(params) {
    // Use mock for development
    if (API_CONFIG.USE_MOCK || !API_CONFIG.AUTH_TOKEN) {
      return mockJobs;
    }
    // Use real API when ready
    const response = await axiosInstance.get('/jobs', { params });
    return response.data;
  },
};
```

## 📝 Checklist for Going Live

- [ ] Backend is deployed and accessible
- [ ] All endpoints are implemented
- [ ] CORS is configured correctly
- [ ] Authentication flow is working
- [ ] Error responses match expected format
- [ ] API_CONFIG.USE_MOCK is set to false
- [ ] BASE_URL points to production
- [ ] AUTH_TOKEN is obtained from login
- [ ] Test all features end-to-end
- [ ] Monitor API errors in production

## 🚀 Production Deployment

For production, use environment variables:

```bash
# .env.production
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

And keep token management secure:
- Never commit tokens to git
- Use secure storage (httpOnly cookies)
- Implement token refresh
- Add rate limiting on backend

---

**Questions?** Check the main README.md or review `src/api/` files for implementation details.
