# 🚀 SPECTRAL Quick Start Guide

Get the SPECTRAL Code Cemetery up and running in minutes!

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- Google Gemini API key (get one at https://makersuite.google.com/app/apikey)

## Installation Steps

### 1. Install Dependencies

Open two terminal windows in the project root:

**Terminal 1 - Backend:**
```bash
cd spectral-code-cemetery/backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd spectral-code-cemetery/frontend
npm install
```

### 2. Configure Environment Variables

**Backend Environment (.env):**

Create or edit `backend/.env`:
```env
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_actual_api_key_here
```

**Frontend Environment (.env):**

Create or edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000
```

### 3. Start the Servers

**Terminal 1 - Start Backend:**
```bash
cd spectral-code-cemetery/backend
npm run dev
```

Wait for: `🚀 Server running on port 3000`

**Terminal 2 - Start Frontend:**
```bash
cd spectral-code-cemetery/frontend
npm run dev
```

Wait for: `Local: http://localhost:5173/`

### 4. Open the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Testing the Application

### Quick Test Flow:

1. **Landing Page** (http://localhost:5173)
   - You should see the spooky Halloween-themed landing page
   - Enter a GitHub repository URL (e.g., `https://github.com/facebook/react`)
   - Click "Analyze Repository"

2. **Cemetery View** (http://localhost:5173/cemetery)
   - View the interactive cemetery with file tombstones
   - Try searching for files
   - Filter by type (haunted, active, dormant)
   - Click on tombstones to see file details

3. **Time Travel** (http://localhost:5173/time-travel)
   - Navigate through commit history
   - Use playback controls
   - View commit details and changes

4. **Code Resurrection** (http://localhost:5173/resurrection)
   - Select a file to modernize
   - Choose modernization level
   - Click "Resurrect Code" to see AI-powered improvements

5. **404 Page** (http://localhost:5173/nonexistent)
   - Visit any invalid URL to see the custom 404 page

## Troubleshooting

### Backend won't start
- Check if port 3000 is already in use
- Verify your GEMINI_API_KEY is set in backend/.env
- Run `npm install` again in the backend directory

### Frontend won't start
- Check if port 5173 is already in use
- Verify VITE_API_URL is set in frontend/.env
- Run `npm install` again in the frontend directory

### API calls failing
- Ensure backend is running on port 3000
- Check browser console for CORS errors
- Verify the backend health endpoint: http://localhost:3000/health

### No data showing
- Make sure you've analyzed a repository first
- Check that the repository URL is valid and accessible
- Look at backend logs for any errors

## Verification Checklist

- [ ] Backend server running on port 3000
- [ ] Frontend server running on port 5173
- [ ] Landing page loads with Halloween theme
- [ ] Can enter repository URL
- [ ] Cemetery page shows file visualization
- [ ] Time Travel page displays commit history
- [ ] Resurrection page allows code modernization
- [ ] 404 page shows custom error design

## API Endpoints

Test these endpoints to verify backend is working:

- **Health Check**: http://localhost:3000/health
- **Analyze Repository**: POST http://localhost:3000/api/analyze
- **Generate Epitaph**: POST http://localhost:3000/api/generate-epitaph
- **Resurrect Code**: POST http://localhost:3000/api/resurrect

## Development Commands

### Backend
```bash
npm run dev      # Start development server with nodemon
npm test         # Run tests
npm start        # Start production server
```

### Frontend
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Next Steps

Once everything is running:

1. Explore the different pages and features
2. Try analyzing different repositories
3. Experiment with the AI-powered code resurrection
4. Check out the interactive cemetery visualization
5. Travel through time with the commit history viewer

## Need Help?

- Check `FINAL_COMPLETION.md` for detailed feature documentation
- Review `TROUBLESHOOTING.md` for common issues
- Look at `STATUS.md` for current project status

---

**Happy Haunting! 👻**

*Built for the Kiroween Hackathon 2025*
