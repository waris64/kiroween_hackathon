# 🔧 API Troubleshooting Guide

## Quick Fixes

### 1. Is Backend Running?

**Check:**
```bash
cd spectral-code-cemetery/backend
npm run dev
```

**Should see:**
```
🚀 Server running on port 3001
```

### 2. Is Frontend Connected?

**Check:** `frontend/src/services/api.js`

Should have:
```javascript
baseURL: 'http://localhost:3001/api'
```

### 3. CORS Issue?

**Check:** Backend logs for CORS errors

**Fix:** Update `backend/.env`:
```
CORS_ORIGIN=http://localhost:5173
```

### 4. Timeout on Large Repos?

**Fixed!** Server timeout increased to 15 minutes.

**Restart backend** to apply changes:
```bash
# Stop backend (Ctrl+C)
cd backend
npm run dev
```

---

## Common Errors

### Error: "Failed to analyze repository"

**Cause:** Backend not running or wrong URL

**Fix:**
1. Start backend: `cd backend && npm run dev`
2. Check URL in browser: `http://localhost:3001/api/health`
3. Should return: `{"status":"ok"}`

### Error: "Request timeout"

**Cause:** Repository too large (like React)

**Fix:** Already fixed! Restart backend.

### Error: "Repository not found"

**Cause:** Invalid GitHub URL

**Fix:** Use format: `https://github.com/username/repo`

### Error: "Network Error"

**Cause:** Frontend can't reach backend

**Fix:**
1. Check backend is running on port 3001
2. Check frontend is on port 5173
3. Check CORS_ORIGIN in backend/.env

---

## Test API Manually

### 1. Health Check
```bash
curl http://localhost:3001/api/health
```

**Expected:** `{"status":"ok"}`

### 2. Analyze Repository
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"repoUrl":"https://github.com/devweekends/Fellowship-2025-DSA-Series"}'
```

**Expected:** JSON with repository data

---

## Current Configuration

### Backend
- **Port:** 3001
- **Timeout:** 15 minutes (900000ms)
- **Clone Timeout:** 10 minutes (600000ms)
- **Max Commits:** 1000
- **Clone Depth:** 50

### Frontend
- **Port:** 5173
- **API URL:** http://localhost:3001/api

---

## For Video Recording

### Recommended Repository
Use: `https://github.com/devweekends/Fellowship-2025-DSA-Series`

**Why:**
- ✅ Smaller size (faster)
- ✅ Good mix of files
- ✅ Clear dead code examples
- ✅ Won't timeout

### Avoid for Demo
- ❌ `https://github.com/facebook/react` (too large, may timeout)
- ❌ Very large repos (10,000+ commits)

---

## Quick Start Checklist

- [ ] Backend running on port 3001
- [ ] Frontend running on port 5173
- [ ] Health check returns OK
- [ ] Test with small repo first
- [ ] Check browser console for errors
- [ ] Check backend logs for errors

---

**If still having issues, check backend logs in `backend/logs/` for detailed error messages.**
