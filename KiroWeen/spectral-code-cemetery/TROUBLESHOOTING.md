# 🎃 SPECTRAL Troubleshooting Guide

## ✅ Current Status

Both servers are running successfully:
- **Frontend**: http://localhost:5173 ✅
- **Backend**: http://localhost:3000 ✅

## Common Issues & Solutions

### Issue: "Cannot access localhost:5173"

**Solution:**
1. Check if the dev server is running:
   ```bash
   # In spectral-code-cemetery/frontend
   npm run dev
   ```

2. Verify the server started successfully (should see):
   ```
   VITE v5.4.21  ready in XXX ms
   ➜  Local:   http://localhost:5173/
   ```

3. Try accessing in your browser:
   - Chrome: http://localhost:5173
   - Edge: http://localhost:5173
   - Firefox: http://localhost:5173

### Issue: "Port 5173 already in use"

**Solution:**
```bash
# Kill the process on port 5173
npx kill-port 5173

# Then restart
npm run dev
```

### Issue: "Backend not responding"

**Solution:**
1. Check if backend is running:
   ```bash
   # In spectral-code-cemetery/backend
   npm run dev
   ```

2. Test the health endpoint:
   ```bash
   curl http://localhost:3000/health
   ```

3. Should return:
   ```json
   {"status":"alive","message":"SPECTRAL backend is running"}
   ```

### Issue: "Styles not loading"

**Solution:**
1. Verify TailwindCSS is installed:
   ```bash
   cd frontend
   npm list tailwindcss
   ```

2. Check if `index.css` imports Tailwind:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

3. Restart the dev server

### Issue: "Module not found"

**Solution:**
```bash
# Clear and reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install

# Or for backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Issue: "React icons not showing"

**Solution:**
1. Verify lucide-react is installed:
   ```bash
   npm list lucide-react
   ```

2. If missing, install:
   ```bash
   npm install lucide-react
   ```

## Browser Cache Issues

If you see old content:
1. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Clear browser cache
3. Open in incognito/private mode

## Checking Server Status

### Frontend Status
```bash
# Should show Vite running
curl http://localhost:5173
```

### Backend Status
```bash
# Should return JSON health status
curl http://localhost:3000/health
```

## Development Tips

### Hot Reload Not Working?
- Save the file again
- Check console for errors
- Restart the dev server

### Environment Variables Not Loading?
- Restart the dev server after changing .env
- Verify .env file exists in correct location
- Check variable names start with VITE_ for frontend

### Performance Issues?
- Close unused browser tabs
- Restart dev servers
- Clear node_modules and reinstall

## Getting Help

If issues persist:
1. Check the browser console (F12)
2. Check the terminal output for errors
3. Review the STATUS.md file
4. Check the Kiro specs in .kiro/specs/

## Quick Reset

To start fresh:
```bash
# Stop all servers (Ctrl+C in terminals)

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Success Indicators

You should see:
- ✅ Purple/black gradient background
- ✅ "SPECTRAL" header in spooky font
- ✅ Repository input form
- ✅ Three feature cards
- ✅ Animated moon icon
- ✅ Ghost and skull icons
- ✅ No console errors

## Current Working Features

- Landing page with Halloween theme
- Repository URL input field
- Feature showcase cards
- Responsive design
- Animated icons
- Backend health endpoint
