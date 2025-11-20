# Code Standards & Best Practices

## File Organization

### File Naming
- **React components:** PascalCase (e.g., `TombstoneCard.jsx`, `GhostAvatar.jsx`)
- **Utilities:** camelCase (e.g., `dateFormatter.js`, `apiClient.js`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`, `COLORS.js`)
- **Hooks:** camelCase with 'use' prefix (e.g., `useSpectralData.js`, `useGitAnalysis.js`)
- **Services:** PascalCase (e.g., `GitAnalyzer.js`, `AIAnalyzer.js`)
- **Types:** PascalCase with `.types.js` suffix (e.g., `Repository.types.js`)

### File Structure Rules
- **Maximum 250 lines per file** - Split larger files into smaller modules
- **One component per file** - Easier to maintain and test
- **Colocate tests:** `Component.jsx` + `Component.test.jsx`
- **Colocate styles when needed:** `Component.jsx` + `Component.module.css`

### Import Order
```javascript
// 1. External dependencies
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

// 2. Internal absolute imports
import { GitAnalyzer } from '@/services/GitAnalyzer'
import { useSpectralData } from '@/hooks/useSpectralData'

// 3. Relative imports
import { TombstoneCard } from '../Tombstone/TombstoneCard'
import { formatDate } from './utils'

// 4. Styles
import styles from './Component.module.css'
import './Component.css'

// 5. Assets
import ghostIcon from '@/assets/images/ghost.svg'
```

---

## JavaScript/React Standards

### Variable Declarations
- Use `const` by default
- Use `let` only when reassignment is necessary
- **NEVER use `var`**
- Destructure when accessing multiple properties

```javascript
// ✅ Good
const { name, email } = user
const isActive = true
let count = 0

// ❌ Bad
var isActive = true
let name = user.name
```

### Function Definitions
- Use arrow functions for callbacks and short functions
- Use named function declarations for top-level functions
- Always use async/await, never raw Promises

```javascript
// ✅ Good
const fetchRepositoryData = async (repoUrl) => {
  try {
    const response = await axios.get(`/api/analyze?url=${repoUrl}`)
    return response.data
  } catch (error) {
    throw new SpectralError('Failed to fetch repository', error)
  }
}

// ❌ Bad
function fetchRepositoryData(repoUrl) {
  return axios.get(`/api/analyze?url=${repoUrl}`)
    .then(response => response.data)
    .catch(error => { throw error })
}
```

### Error Handling
- Always use try-catch with async/await
- Create custom error classes
- Log errors with Winston (backend) or console.error (frontend)
- Provide user-friendly error messages with Halloween theme

```javascript
// Custom Error Class
class SpectralError extends Error {
  constructor(message, originalError = null) {
    super(message)
    this.name = 'SpectralError'
    this.originalError = originalError
    this.timestamp = new Date()
  }
}

// Usage
try {
  const data = await riskyOperation()
} catch (error) {
  logger.error('[TOMB] Operation failed:', error)
  throw new SpectralError('The spirits are restless. Please try again.', error)
}
```

---

## React Component Standards

### Component Structure
```javascript
// 1. Imports
import { useState, useEffect, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'

// 2. Type definitions or PropTypes (at top for visibility)

// 3. Component definition
const ComponentName = ({ prop1, prop2 }) => {
  // 4. Hooks (in this order)
  const context = useContext(SomeContext)
  const [state, setState] = useState(initialValue)
  const ref = useRef(null)
  const customHook = useCustomHook()
  
  // 5. useEffect hooks
  useEffect(() => {
    // effect logic
    return () => {
      // cleanup
    }
  }, [dependencies])
  
  // 6. Event handlers
  const handleClick = (event) => {
    // handler logic
  }
  
  // 7. Derived/computed values
  const computedValue = useMemo(() => {
    return expensiveCalculation(state)
  }, [state])
  
  // 8. Early returns
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  
  // 9. Main render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}

// 10. PropTypes
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
}

// 11. Default props
ComponentName.defaultProps = {
  prop2: 0,
}

// 12. Export
export default ComponentName
```

### PropTypes
- Always define PropTypes for all components
- Mark required props explicitly
- Use shape for complex objects

```javascript
import PropTypes from 'prop-types'

TombstoneCard.propTypes = {
  file: PropTypes.shape({
    path: PropTypes.string.isRequired,
    linesOfCode: PropTypes.number.isRequired,
    lastModified: PropTypes.instanceOf(Date).isRequired,
    healthScore: PropTypes.number,
    isDead: PropTypes.bool,
  }).isRequired,
  onClick: PropTypes.func,
  onHover: PropTypes.func,
  className: PropTypes.string,
  showEpitaph: PropTypes.bool,
}

TombstoneCard.defaultProps = {
  onClick: () => {},
  onHover: () => {},
  className: '',
  showEpitaph: true,
}
```

### Hook Naming
- Custom hooks must start with 'use'
- Use spooky prefixes: `useSpectral*`, `useHaunted*`, `useGhost*`

```javascript
// ✅ Good
const useSpectralData = (repoUrl) => { /* ... */ }
const useHauntedAnimation = () => { /* ... */ }
const useGhostContributors = (contributors) => { /* ... */ }

// ❌ Bad
const getSpectralData = (repoUrl) => { /* ... */ }
const hauntedAnimation = () => { /* ... */ }
```

### Component Composition
- Prefer composition over inheritance
- Extract reusable logic into custom hooks
- Keep components small and focused (single responsibility)

```javascript
// ✅ Good - Composition
const TombstoneCard = ({ file, children }) => {
  const { isHovered, handleHover } = useHoverState()
  const { playSound } = useSpookySound()
  
  return (
    <Card onMouseEnter={handleHover}>
      <TombstoneHeader file={file} />
      <TombstoneBody>{children}</TombstoneBody>
      {isHovered && <GhostOverlay />}
    </Card>
  )
}

// ❌ Bad - Monolithic component
const TombstoneCard = ({ file }) => {
  // 500 lines of mixed logic and rendering
}
```

### Conditional Rendering
```javascript
// ✅ Good
{isLoading && <LoadingSpinner />}
{error && <ErrorMessage error={error} />}
{data?.files.map(file => <Tombstone key={file.path} file={file} />)}

// Use ternary for if-else
{isDead ? <SkullIcon /> : <HeartIcon />}

// ❌ Bad
{isLoading ? <LoadingSpinner /> : null}
{data && data.files && data.files.map(...)}
```

---

## Backend Standards

### Service Class Structure
```javascript
class GitAnalyzer {
  constructor(config = {}) {
    this.config = {
      maxCommits: 1000,
      timeout: 30000,
      ...config,
    }
    this.cache = new NodeCache({ stdTTL: 300 })
  }

  /**
   * Analyzes a Git repository
   * @param {string} repoPath - Path to repository
   * @returns {Promise<RepositoryData>} Analyzed repository data
   * @throws {RepositoryError} If repository is invalid
   */
  async analyzeRepository(repoPath) {
    // Implementation
  }

  // Private methods
  #parseCommits(commits) {
    // Implementation
  }
}

export default GitAnalyzer
```

### API Route Structure
```javascript
// routes/analyze.routes.js
import express from 'express'
import { analyzeController } from '../controllers/analyze.controller.js'
import { validateAnalyzeRequest } from '../middleware/validation.js'
import { rateLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

router.post('/analyze', 
  rateLimiter, 
  validateAnalyzeRequest, 
  analyzeController
)

export default router
```

### Controller Structure
```javascript
// controllers/analyze.controller.js
import { GitAnalyzer } from '../services/GitAnalyzer.js'
import { logger } from '../utils/logger.js'
import { SpectralError } from '../utils/errors.js'

export const analyzeController = async (req, res, next) => {
  try {
    const { repoUrl, repoPath } = req.body
    
    logger.info('[TOMB] Starting repository analysis', { repoUrl })
    
    const analyzer = new GitAnalyzer()
    const result = await analyzer.analyzeRepository(repoPath || repoUrl)
    
    logger.info('[TOMB] Analysis complete', { fileCount: result.totalFiles })
    
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error('[TOMB] Analysis failed', { error: error.message })
    next(error)
  }
}
```

### Validation with Joi
```javascript
import Joi from 'joi'

export const analyzeSchema = Joi.object({
  repositoryUrl: Joi.string()
    .uri()
    .when('repoPath', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
  repoPath: Joi.string()
    .when('repositoryUrl', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
  options: Joi.object({
    maxCommits: Joi.number().integer().min(1).max(10000).default(1000),
    includeAI: Joi.boolean().default(true),
  }),
}).xor('repositoryUrl', 'repoPath')
```

---

## Documentation Standards

### JSDoc Comments
- All functions must have JSDoc comments
- Include @param, @returns, @throws
- Provide examples for complex functions

```javascript
/**
 * Generates a spooky epitaph for a deceased code file
 * @param {FileMetadata} file - The file metadata
 * @param {Commit[]} commits - Array of commits affecting the file
 * @returns {Promise<string>} The generated epitaph
 * @throws {AIServiceError} If Gemini API fails
 * @example
 * const epitaph = await generateEpitaph(
 *   { path: 'Button.js', linesOfCode: 150 },
 *   [commit1, commit2]
 * )
 * // Returns: "Here lies Button.js, clicked its last time on Oct 31..."
 */
async function generateEpitaph(file, commits) {
  // Implementation
}
```

### Code Comments
- Explain WHY, not WHAT
- Comment complex algorithms
- Mark TODOs with `[TODO: username - description]`

```javascript
// ✅ Good
// Using force simulation to prevent tombstone overlaps
// This provides a natural graveyard feel while maintaining readability
const simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(-100))
  .force('collision', d3.forceCollide().radius(50))

// ❌ Bad
// This creates a simulation
const simulation = d3.forceSimulation(nodes)
```

---

## Testing Standards

### Test File Organization
```javascript
// Component.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TombstoneCard } from './TombstoneCard'

describe('TombstoneCard', () => {
  // Setup
  const mockFile = {
    path: 'test.js',
    linesOfCode: 100,
    lastModified: new Date('2024-10-31'),
    isDead: false,
  }

  // Test cases organized by feature
  describe('Rendering', () => {
    it('should render file information correctly', () => {
      // Arrange
      render(<TombstoneCard file={mockFile} />)
      
      // Act & Assert
      expect(screen.getByText('test.js')).toBeInTheDocument()
      expect(screen.getByText('100 lines')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should call onClick when tombstone is clicked', async () => {
      // Arrange
      const handleClick = jest.fn()
      render(<TombstoneCard file={mockFile} onClick={handleClick} />)
      
      // Act
      fireEvent.click(screen.getByRole('button'))
      
      // Assert
      await waitFor(() => {
        expect(handleClick).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing data gracefully', () => {
      const incompleteFile = { path: 'test.js' }
      render(<TombstoneCard file={incompleteFile} />)
      expect(screen.queryByText('0 lines')).toBeInTheDocument()
    })
  })
})
```

### Test Coverage Requirements
- Minimum **70% overall coverage**
- **100% coverage** for utility functions
- Critical paths must be fully tested
- Test happy path, error cases, and edge cases

### Mocking Standards
```javascript
// Mock external dependencies
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () => 'Mocked response',
        },
      }),
    }),
  })),
}))

// Mock React hooks
const mockUseNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}))
```

---

## Performance Standards

### React Performance
- Use `React.memo` for expensive components
- Use `useMemo` for expensive calculations
- Use `useCallback` for functions passed as props
- Avoid inline object/array creation in render

```javascript
// ✅ Good
const MemoizedTombstone = React.memo(TombstoneCard, (prevProps, nextProps) => {
  return prevProps.file.path === nextProps.file.path &&
         prevProps.file.lastModified === nextProps.file.lastModified
})

const expensiveValue = useMemo(() => {
  return calculateComplexStats(data)
}, [data])

const handleClick = useCallback((id) => {
  performAction(id)
}, [])

// ❌ Bad
return (
  <Component 
    data={{ name: 'test' }}  // New object every render
    onClick={() => handler()} // New function every render
  />
)
```

### Bundle Size
- Code split routes with `React.lazy`
- Lazy load heavy libraries (D3, Monaco Editor)
- Tree-shake unused code
- Compress images and assets

```javascript
// Route-based code splitting
const Cemetery = lazy(() => import('./pages/Cemetery'))
const TimeTravel = lazy(() => import('./pages/TimeTravel'))

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/cemetery" element={<Cemetery />} />
        <Route path="/time-travel" element={<TimeTravel />} />
      </Routes>
    </Suspense>
  )
}
```

### API Performance
- Cache responses for 5 minutes
- Implement request debouncing
- Use pagination for large datasets
- Compress responses with gzip

```javascript
// Caching middleware
const cacheMiddleware = (duration = 300) => {
  const cache = new NodeCache({ stdTTL: duration })
  
  return (req, res, next) => {
    const key = req.originalUrl
    const cachedResponse = cache.get(key)
    
    if (cachedResponse) {
      logger.info('[CACHE] Hit:', key)
      return res.json(cachedResponse)
    }
    
    res.originalJson = res.json
    res.json = (data) => {
      cache.set(key, data)
      res.originalJson(data)
    }
    
    next()
  }
}
```

---

## Logging Standards

### Log Levels
- **ERROR:** Fatal errors that require immediate attention
- **WARN:** Non-fatal issues that should be investigated
- **INFO:** General informational messages
- **DEBUG:** Detailed debugging information

### Log Format
```javascript
// Use structured logging with Winston
logger.info('[TOMB] Repository analysis started', {
  repoUrl,
  userId: req.user?.id,
  timestamp: new Date().toISOString(),
})

logger.error('[GHOST] AI service error', {
  error: error.message,
  stack: error.stack,
  context: { fileId, operation: 'generateEpitaph' },
})
```

### Spooky Log Prefixes
- `[TOMB]` - Repository analysis operations
- `[GHOST]` - AI/Gemini API operations
- `[SPELL]` - Resurrection/modernization features
- `[CEMETERY]` - UI/visualization operations
- `[CACHE]` - Caching operations
- `[SPIRIT]` - Background jobs/workers

---

## Git Commit Standards

### Commit Message Format
```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting)
- `refactor` - Code refactoring
- `test` - Adding/updating tests
- `chore` - Maintenance tasks

**Examples:**
```
feat(cemetery): add tombstone hover animations
fix(api): handle private repository errors
docs(readme): update installation instructions
refactor(git-analyzer): extract commit parsing logic
```

### Branch Naming
- `feature/cemetery-visualization`
- `fix/ghost-animation-bug`
- `refactor/git-analyzer`
- `docs/api-documentation`

---

## Security Standards

### Input Validation
- Validate all user inputs
- Sanitize data before processing
- Use Joi schemas for API requests
- Prevent SQL injection (use parameterized queries)
- Prevent XSS attacks (sanitize HTML)

### Environment Variables
- Never commit `.env` files
- Use `.env.example` for documentation
- Validate required env vars on startup
- Use different values for dev/prod

### API Security
- Implement rate limiting
- Use CORS properly
- Add security headers with Helmet
- Validate file paths (prevent directory traversal)
- Never execute code from repositories

---

## Code Review Checklist

Before submitting a PR, ensure:

- [ ] Code follows naming conventions
- [ ] PropTypes defined for all components
- [ ] Error handling implemented
- [ ] Tests written and passing
- [ ] No console.logs in production code
- [ ] Comments explain WHY, not WHAT
- [ ] No hardcoded values (use constants)
- [ ] Accessibility requirements met
- [ ] Performance optimizations applied
- [ ] Security best practices followed
- [ ] Documentation updated
- [ ] Halloween theme maintained

---

## IMPORTANT RULES

1. **Follow these standards strictly** - Consistency is key
2. **Review before committing** - Use the checklist
3. **Test your code** - Don't skip tests
4. **Document complex logic** - Help future developers
5. **Keep it spooky** - Maintain the Halloween theme
6. **Performance matters** - Optimize where needed
7. **Security first** - Never compromise security
8. **Accessibility always** - Make it usable for everyone

---

This document ensures SPECTRAL maintains high code quality, consistency, and maintainability throughout development. 🎃👻


---

## Advanced Security Standards

### Input Validation
- Validate all user inputs
- Sanitize file paths to prevent directory traversal
- Validate URLs before fetching
- Escape output to prevent XSS

```javascript
// Path validation
const validatePath = (filePath) => {
  const normalized = path.normalize(filePath)
  if (normalized.includes('..')) {
    throw new SecurityError('Invalid file path')
  }
  return normalized
}

// URL validation
const validateRepoUrl = (url) => {
  const parsed = new URL(url)
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new SecurityError('Invalid protocol')
  }
  return url
}
```

### Environment Variables Management
- Never commit `.env` files
- Use `.env.example` for documentation
- Validate required env vars on startup

```javascript
// config/env.js
const requiredEnvVars = [
  'GEMINI_API_KEY',
  'PORT',
  'NODE_ENV',
]

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`)
  }
})
```

### Rate Limiting Implementation
```javascript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  message: 'The spirits grow tired. Please wait before trying again.',
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api/', limiter)
```

---

## Advanced Accessibility Standards

### ARIA Labels
- All interactive elements need labels
- Use semantic HTML first
- Add ARIA only when necessary

```javascript
<button 
  aria-label="View file history for Button.js"
  onClick={handleClick}
>
  <ClockIcon aria-hidden="true" />
</button>
```

### Keyboard Navigation
- All features accessible via keyboard
- Proper tab order
- Visible focus indicators
- Escape key closes modals

```javascript
const handleKeyDown = (event) => {
  if (event.key === 'Escape') {
    closeModal()
  }
  if (event.key === 'Enter' || event.key === ' ') {
    handleActivate()
  }
}
```

### Reduced Motion Support
```javascript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

const animation = prefersReducedMotion 
  ? { duration: 0 }
  : { duration: 0.5, ease: 'easeInOut' }
```

---

## Git Commit Examples

### Feature Commit
```
🎃 feat: Add cemetery visualization with D3.js

- Implement force-directed graph layout
- Add tombstone collision detection
- Create fog parallax effect

Closes #23
```

### Bug Fix Commit
```
👻 fix: Prevent crash when analyzing empty repositories

Added validation to check if repository has commits before analysis.
Displays friendly error message to user.

Fixes #45
```

### Refactor Commit
```
♻️ refactor: Extract Git parsing logic into separate module

- Split GitAnalyzer into smaller, focused functions
- Improve testability
- Add JSDoc comments

Related to #67
```

### Documentation Commit
```
📚 docs: Update API documentation with new endpoints

- Add examples for /api/analyze endpoint
- Document error responses
- Add rate limiting information
```

---

## Final Notes

These standards are living documents. As the project evolves:

1. **Propose changes** via pull requests
2. **Discuss improvements** in team meetings
3. **Update examples** when patterns change
4. **Keep it practical** - standards should help, not hinder

Remember: **Consistency > Perfection**

The goal is maintainable, secure, accessible code that brings joy to developers and users alike. 🎃👻

---

*Last updated: November 2025*
*SPECTRAL - Where code goes to rest in peace* 🪦
