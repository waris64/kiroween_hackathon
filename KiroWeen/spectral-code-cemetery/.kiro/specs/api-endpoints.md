# API Endpoints Specification

## Base URL
`http://localhost:3000/api`

## Endpoints

### 1. Analyze Repository

**POST** `/analyze`

Initiates analysis of a Git repository.

**Request Body:**
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

**Response:**
```json
{
  "analysisId": "uuid",
  "status": "processing",
  "estimatedTime": 30
}
```

### 2. Get Analysis Status

**GET** `/analysis/:analysisId/status`

Check the status of an ongoing analysis.

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

### 3. Get Repository Data

**GET** `/repository/:analysisId`

Retrieve complete analysis data.

**Response:**
```json
{
  "repository": {
    "url": "string",
    "name": "string",
    "analyzedAt": "timestamp"
  },
  "commits": [...],
  "files": [...],
  "contributors": [...]
}
```

### 4. Get AI Insights

**GET** `/insights/:analysisId`

Retrieve AI-generated insights and narratives.

**Response:**
```json
{
  "repositoryStory": "string",
  "fileEpitaphs": [...],
  "hauntedCode": [...],
  "ghostContributors": [...]
}
```

### 5. Get File History

**GET** `/file/:analysisId/:filePath/history`

Get detailed history for a specific file.

**Response:**
```json
{
  "filePath": "string",
  "commits": [...],
  "contributors": [...],
  "churnRate": "number",
  "epitaph": "string"
}
```

### 6. Health Check

**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "alive",
  "message": "SPECTRAL backend is running"
}
```

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

## Rate Limiting

- 100 requests per 15 minutes per IP
- Analysis endpoint: 10 requests per hour
- Headers include rate limit info

## Authentication

Currently no authentication required (hackathon project).
Future: API key authentication.
