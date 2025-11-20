# Git Analyzer Specification

## Purpose

The Git Analyzer service is responsible for cloning repositories, extracting commit history, analyzing file changes, and identifying code patterns over time.

## Core Functionality

### Repository Cloning
- Clone public Git repositories via HTTPS
- Support for GitHub, GitLab, Bitbucket
- Temporary storage in configurable directory
- Automatic cleanup after analysis
- Size validation before cloning

### Commit Analysis
- Extract full commit history
- Parse commit messages
- Identify commit authors
- Calculate commit frequency
- Detect commit patterns (time of day, day of week)

### File Analysis
- Track file additions, modifications, deletions
- Calculate lines of code changes
- Identify file types and languages
- Detect file rename/move operations
- Calculate file churn rate

### Contributor Analysis
- Identify all contributors
- Calculate contribution metrics
- Track activity patterns
- Identify "ghost" contributors (inactive)

## Data Structure

```javascript
{
  repository: {
    url: string,
    name: string,
    analyzedAt: timestamp
  },
  commits: [{
    hash: string,
    author: string,
    date: timestamp,
    message: string,
    filesChanged: number,
    insertions: number,
    deletions: number
  }],
  files: [{
    path: string,
    type: string,
    totalCommits: number,
    lastModified: timestamp,
    churnRate: number,
    contributors: string[]
  }],
  contributors: [{
    name: string,
    email: string,
    commits: number,
    linesAdded: number,
    linesDeleted: number,
    lastActive: timestamp
  }]
}
```

## Error Handling

- Invalid repository URLs
- Private repositories (not supported)
- Network failures
- Repository too large
- Corrupted Git history
- Permission issues
