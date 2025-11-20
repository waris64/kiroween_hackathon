# SPECTRAL - Architecture Specification

## System Overview

SPECTRAL is a full-stack web application that analyzes Git repositories and visualizes code evolution through an interactive, Halloween-themed cemetery interface. Files appear as tombstones, contributors as floating ghosts, and AI generates spooky narratives about code history.

## Architecture Pattern

- **Frontend:** Single Page Application (SPA) with React
- **Backend:** RESTful API with Express.js
- **Communication:** HTTP/REST with JSON
- **State Management:** React Query for server state, React hooks for UI state
- **Caching:** In-memory cache with node-cache (1 hour TTL)
- **AI Integration:** Google Gemini API (free tier) with fallback responses

## Core Modules

### 1. GitAnalyzer Service (Backend)

**Purpose:** Parse and analyze Git repositories

**Location:** `backend/src/services/GitAnalyzer.js`

**Public Methods:**
```javascript
- analyzeRepository(repositoryUrl, branch, options): Promise<RepositoryData>
- cloneRepository(repositoryUrl, repoPath, branch): Promise<void>
- extractCommitHistory(repoPath, maxCommits): Promise<Commit[]>
- analyzeFiles(repoPath): Promise<FileMetadata[]>
- identifyContributors(repoPath): Promise<Contributor[]>
- cleanup(repoPath): Promise<void>
```

**Data Structures:**
```typescript
interface RepositoryData {
  repository: {
    url: string;
    name: string;
    branch: string;
    analyzedAt: string;
  };
  commits: Commit[];
  files: FileMetadata[];
  contributors: Contributor[];
  stats: {
    totalCommits: number;
    totalFiles: number;
    totalContributors: number;
    oldestCommit: string;
    newestCommit: string;
  };
}

interface Commit {
  hash: string;
  author: string;
  email: string;
  date: string;
  message: string;
  filesChanged: number;
  insertions: number;
  deletions: number;
}

interface FileMetadata {
  path: string;
  type: string;
  size: number;
  totalCommits: number;
  lastModified: string;
  churnRate: number;
  contributors: string[];
}

interface Contributor {
  name: string;
  email: string;
  commits: number;
  linesAdded: number;
  linesDeleted: number;
  firstCommit: string;
  lastActive: string;
}
```

**Dependencies:**
- `simple-git` for Git operations
- Node.js `fs/promises` for file system
- Custom logger utility

**Error Handling:**
- Throws `RepositoryError` for invalid/inaccessible repos
- Throws `RepositoryError` for private repositories
- Throws `RepositoryError` for network failures
- Automatic cleanup of temporary files in finally block

**Implementation Details:**
- Clones repositories to `temp/repos` directory
- Uses `--depth 1000` for faster cloning
- Limits file analysis to 500 files for performance
- Calculates churn rate as commits per day of file age
- Extracts unique contributors by email

---

### 2. AIAnalyzer Service (Backend)

**Purpose:** Use Google Gemini AI to analyze code and generate spooky narratives

**Location:** `backend/src/services/AIAnalyzer.js`

**Public Methods:**
```javascript
- analyzeRepository(repositoryData): Promise<AIInsights>
- generateRepositoryStory(repositoryData): Promise<string>
- generateFileEpitaphs(files): Promise<Epitaph[]>
- identifyHauntedCode(files): Promise<HauntedCode[]>
- characterizeGhosts(contributors): Promise<GhostPersona[]>
- getFallbackInsights(repositoryData): AIInsights
```

**Data Structures:**
```typescript
interface AIInsights {
  repositoryStory: string;
  fileEpitaphs: Epitaph[];
  hauntedCode: HauntedCode[];
  ghostContributors: GhostPersona[];
}

interface Epitaph {
  filePath: string;
  epitaph: string;
  spookinessLevel: number; // 1-5
}

interface HauntedCode {
  filePath: string;
  reason: string;
  severity: 'high' | 'medium' | 'low';
  churnRate: number;
  contributors: number;
}

interface GhostPersona {
  name: string;
  persona: string;
  ghostType: 'phantom' | 'specter' | 'wraith' | 'poltergeist' | 'banshee';
  lastSeen: string;
  commits: number;
}
```

**Gemini API Integration:**
- Model: `gemini-pro`
- Free tier: 1500 requests/day, 60 RPM
- Prompts include Halloween theme instructions
- JSON parsing with regex fallback
- Graceful degradation to fallback responses

**Fallback Strategy:**
- If API key missing: Use fallback immediately
- If API fails: Catch error and use fallback
- Fallback generates basic but themed responses
- No user-facing errors for AI failures

**Rate Limiting:**
- Handled by Gemini API (60 RPM)
- Responses cached to reduce API calls
- Batch processing for multiple files

---

### 3. Cemetery Visualizer (Frontend)

**Purpose:** Interactive cemetery layout with tombstones and ghosts

**Location:** `frontend/src/components/Cemetery.jsx`

**Features:**
- Animated moon and floating clouds
- Repository story display at top
- Floating ghost contributors with hover cards
- Grid layout of tombstone files
- Smooth animations with Framer Motion
- Responsive design (desktop/tablet/mobile)

**Layout Algorithm:**
- CSS Grid: 2-6 columns based on screen size
- Tombstones sized by commit count (36-48px height)
- Color-coded by churn rate:
  - Red (>3): High activity/problematic
  - Green (>1): Active development
  - Gray (≤1): Stable/inactive
- Staggered entry animations (0.1s delay per item)

**Interactions:**
- **Click tombstone:** Opens FileDetailModal
- **Hover tombstone:** Shows epitaph overlay, scales up
- **Hover ghost:** Shows contributor stats card
- **Scroll:** Natural page scroll
- **Responsive:** Touch-friendly on mobile

**Visual Effects:**
- Moon pulses (3s cycle)
- Clouds drift across (30-50s)
- Ghosts float randomly (4-5s cycles)
- Tombstones rise from ground on load
- Glow effect for high-activity files

---

### 4. Tombstone Component (Frontend)

**Purpose:** Individual file representation as interactive tombstone

**Location:** `frontend/src/components/Tombstone.jsx`

**Features:**
- Rounded top (tombstone shape)
- Skull icon at top
- File name display (truncated)
- Commit and contributor counts
- Hover epitaph overlay
- Activity-based styling

**Styling Logic:**
```javascript
// Size based on commits
commits > 50: h-48 w-40
commits > 20: h-40 w-36
default: h-36 w-32

// Color based on churn rate
churnRate > 3: red border + shadow
churnRate > 1: green border + shadow
default: gray border + shadow
```

**Animations:**
- Entry: Rise from ground (y: 100 → 0)
- Hover: Scale 1.05, lift -5px
- Epitaph: Fade in overlay
- Glow: Pulse for high activity

---

### 5. Ghost Avatar Component (Frontend)

**Purpose:** Floating contributor visualization

**Location:** `frontend/src/components/GhostAvatar.jsx`

**Features:**
- Translucent circular avatar
- Ghost icon
- Floating animation
- Hover info card
- Opacity based on activity

**Styling Logic:**
```javascript
// Opacity based on commits
commits > 100: 1.0
commits > 50: 0.8
commits > 20: 0.6
default: 0.4

// Size based on commits
commits > 100: w-16 h-16
commits > 50: w-14 h-14
default: w-12 h-12
```

**Animations:**
- Float: y: [0, -20, 0], x: [0, 10, -10, 0]
- Duration: 4-5s (varies by index)
- Hover: Scale 1.2, opacity 1.0
- Info card: Slide up on hover

---

### 6. File Detail Modal (Frontend)

**Purpose:** Detailed file information display

**Location:** `frontend/src/components/FileDetailModal.jsx`

**Features:**
- Full-screen overlay
- Statistics grid (commits, churn, contributors, date)
- Contributor list with avatars
- File type badge
- Close button

**Layout:**
- Sticky header with file path
- 2x2 stats grid
- Scrollable contributor list
- Responsive padding

---

### 7. Loading Component (Frontend)

**Purpose:** Animated loading state during analysis

**Location:** `frontend/src/components/LoadingSpectral.jsx`

**Features:**
- Animated floating ghost
- Progress bar
- Status messages
- Spinning loader icon

**Progress Messages:**
```javascript
progress < 30: "Cloning the haunted repository..."
progress 30-60: "Extracting ghostly commits..."
progress 60-90: "Analyzing tombstone files..."
progress ≥ 90: "Summoning AI spirits..."
```

---

## API Endpoints

### POST /api/analyze
**Request:**
```json
{
  "repositoryUrl": "https://github.com/user/repo",
  "branch": "main",
  "options": {
    "includeAI": true,
    "maxCommits": 1000,
    "fileTypes": ["js", "jsx", "ts", "tsx"]
  }
}
```

**Response:** (202 Accepted)
```json
{
  "analysisId": "uuid",
  "status": "processing",
  "progress": 0,
  "estimatedTime": 30,
  "message": "Summoning the ghosts..."
}
```

**Description:** Start background analysis of repository

**Rate Limit:** 10 requests/hour per IP

---

### GET /api/analysis/:analysisId/status
**Response:**
```json
{
  "analysisId": "uuid",
  "status": "completed",
  "progress": 100,
  "result": {
    "repository": {...},
    "commits": [...],
    "files": [...],
    "contributors": [...],
    "aiInsights": {...}
  }
}
```

**Description:** Poll analysis status and get results

**Polling:** Frontend polls every 2 seconds until complete

---

### GET /api/repository/:analysisId
**Response:** Full RepositoryData with AI insights

**Description:** Get complete analysis data

---

### GET /api/file/:analysisId/:filePath/history
**Response:**
```json
{
  "file": FileMetadata,
  "commits": Commit[]
}
```

**Description:** Get detailed file history

---

### GET /health
**Response:**
```json
{
  "status": "alive",
  "message": "SPECTRAL backend is running"
}
```

**Description:** Health check endpoint

---

## Data Flow

1. **User Input:**
   - User enters repository URL and branch
   - Frontend validates input
   - Calls POST /api/analyze

2. **Backend Processing:**
   - Generate unique analysisId
   - Check cache for existing results
   - Start background analysis:
     - Clone repository
     - Extract Git data
     - Generate AI insights
     - Store in analysisStore Map

3. **Frontend Polling:**
   - Poll GET /api/analysis/:id/status every 2s
   - Show loading animation with progress
   - Stop polling when status = 'completed'

4. **Visualization:**
   - Receive complete data
   - Render Cemetery component
   - Animate tombstones and ghosts
   - Enable interactions

5. **User Interactions:**
   - Click tombstone → Open modal
   - Hover elements → Show tooltips
   - Click "New Analysis" → Reset state

---

## State Management

### Backend State
- **analysisStore:** Map<analysisId, AnalysisState>
  - Stores ongoing and completed analyses
  - In-memory (lost on restart)
  - No persistence layer

- **Cache:** node-cache instance
  - TTL: 3600 seconds (1 hour)
  - Key format: `analysis:${repoUrl}:${branch}`
  - Automatic expiration

### Frontend State
- **React Query:** Server state management
  - Automatic caching
  - Background refetching
  - Optimistic updates

- **Component State:** React useState
  - repoUrl, branch (form inputs)
  - selectedFile (modal state)
  - showCemetery (view state)

---

## Performance Targets

- **Repository Analysis:** < 30 seconds for repos with < 1000 commits
- **Cemetery Render:** < 2 seconds for < 500 files
- **AI Generation:** < 10 seconds total (parallel requests)
- **Animation Frame Rate:** 60 FPS
- **Initial Page Load:** < 1 second
- **API Response Time:** < 100ms (cached), < 5s (uncached)

---

## Security Considerations

### Input Validation
- Joi schema validation for all requests
- URL pattern matching (GitHub/GitLab/Bitbucket only)
- Branch name sanitization
- File path validation (no directory traversal)

### Rate Limiting
- Analysis endpoint: 10 requests/hour
- Other endpoints: 100 requests/15 minutes
- Per-IP tracking
- 429 status code when exceeded

### Security Headers
- Helmet.js middleware
- CORS restricted to frontend origin
- Content Security Policy
- XSS protection

### Data Protection
- No code execution from repositories
- Temporary files cleaned up
- No sensitive data logged
- Environment variables for secrets

---

## Error Handling Strategy

### Backend Errors
- Custom error classes (AppError, RepositoryError, ValidationError)
- Centralized error handler middleware
- Winston logging with timestamps
- User-friendly error messages with spooky theme

### Frontend Errors
- React Query error boundaries
- Graceful degradation for failed features
- Error state UI with retry option
- Console logging for debugging

### AI Failures
- Automatic fallback to pre-written responses
- No user-facing errors
- Logged for monitoring
- Maintains full functionality

---

## Testing Strategy

### Unit Tests
- Jest for backend services
- React Testing Library for components
- Target: 70% code coverage
- Mock external dependencies

### Integration Tests
- Supertest for API endpoints
- Test full request/response cycle
- Verify error handling
- Check rate limiting

### E2E Tests
- Manual testing for hackathon
- Future: Playwright for critical flows
- Test with real repositories
- Verify animations and interactions

---

## Deployment Architecture

### Development
- Frontend: Vite dev server (port 5173)
- Backend: Nodemon (port 3000)
- Hot module replacement
- Source maps enabled

### Production (Future)
- Frontend: Static build deployed to Vercel/Netlify
- Backend: Node.js on Railway/Render
- Environment-based configuration
- CDN for static assets
- Database for persistence (optional)

---

## Technology Stack Summary

### Frontend
- React 18.3.1 - UI framework
- Vite 5.4.6 - Build tool
- TailwindCSS 3.4.11 - Styling
- Framer Motion 11.5.4 - Animations
- React Query 5.56.2 - Data fetching
- Axios 1.7.7 - HTTP client
- Lucide React 0.441.0 - Icons

### Backend
- Express 4.21.0 - Web framework
- Google Generative AI - AI integration
- simple-git 3.26.0 - Git operations
- Winston 3.14.2 - Logging
- node-cache 5.1.2 - Caching
- Helmet 7.1.0 - Security
- Joi 17.13.3 - Validation
- express-rate-limit 7.4.0 - Rate limiting

---

## Future Enhancements

### Phase 2 Features
- User authentication (GitHub OAuth)
- Repository favorites/history
- Export cemetery as image
- Share cemetery via URL
- Real-time collaboration

### Phase 3 Features
- Database persistence (PostgreSQL)
- WebSocket for live updates
- Advanced analytics dashboard
- Code quality metrics
- Team insights

### Performance Improvements
- Redis for distributed caching
- Background job queue (Bull)
- CDN for static assets
- Database query optimization
- Lazy loading for large repos

---

This architecture supports the Halloween theme while providing real value for developers exploring code history and understanding repository evolution.
