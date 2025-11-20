# Testing Git Analysis

## Test the Backend API

### 1. Test Health Endpoint
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"alive","message":"SPECTRAL backend is running"}
```

### 2. Test Repository Analysis

Start an analysis:
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repositoryUrl": "https://github.com/octocat/Hello-World",
    "branch": "master",
    "options": {
      "maxCommits": 100
    }
  }'
```

Expected response:
```json
{
  "analysisId": "uuid-here",
  "status": "processing",
  "progress": 0,
  "estimatedTime": 30,
  "message": "Summoning the ghosts... This may take a moment."
}
```

### 3. Check Analysis Status

Replace `{analysisId}` with the ID from step 2:
```bash
curl http://localhost:3000/api/analysis/{analysisId}/status
```

Expected response (when completed):
```json
{
  "analysisId": "uuid-here",
  "status": "completed",
  "progress": 100,
  "result": {
    "repository": {...},
    "commits": [...],
    "files": [...],
    "contributors": [...]
  }
}
```

### 4. Get Repository Data

```bash
curl http://localhost:3000/api/repository/{analysisId}
```

## Test Repositories

Good test repositories:
- `https://github.com/octocat/Hello-World` (small, simple)
- `https://github.com/octocat/Spoon-Knife` (small, active)
- `https://github.com/torvalds/linux` (large, will take time)

## Expected Data Structure

### Repository Info
```json
{
  "url": "https://github.com/user/repo",
  "name": "repo",
  "branch": "main",
  "analyzedAt": "2025-11-14T..."
}
```

### Commits
```json
[{
  "hash": "abc123...",
  "author": "John Doe",
  "email": "john@example.com",
  "date": "2025-11-14T...",
  "message": "Initial commit",
  "filesChanged": 5,
  "insertions": 100,
  "deletions": 0
}]
```

### Files
```json
[{
  "path": "src/index.js",
  "type": "js",
  "size": 1024,
  "totalCommits": 15,
  "lastModified": "2025-11-14T...",
  "churnRate": 2.5,
  "contributors": ["John Doe", "Jane Smith"]
}]
```

### Contributors
```json
[{
  "name": "John Doe",
  "email": "john@example.com",
  "commits": 50,
  "linesAdded": 1000,
  "linesDeleted": 200,
  "lastActive": "2025-11-14T..."
}]
```

## Error Cases

### Invalid URL
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"repositoryUrl": "not-a-url"}'
```

Expected: 400 Bad Request with validation error

### Private Repository
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"repositoryUrl": "https://github.com/private/repo"}'
```

Expected: 422 Repository Error

### Non-existent Repository
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"repositoryUrl": "https://github.com/nonexistent/repo123456"}'
```

Expected: 422 Repository Error
