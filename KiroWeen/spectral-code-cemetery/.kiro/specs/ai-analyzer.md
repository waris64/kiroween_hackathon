# AI Analyzer Specification

## Purpose

The AI Analyzer uses Google's Gemini AI to generate spooky, Halloween-themed narratives and insights about code evolution, creating engaging stories for the cemetery visualization.

## Core Functionality

### Code Story Generation
- Analyze commit patterns to create narratives
- Generate "epitaphs" for files (tombstones)
- Create spooky descriptions of code evolution
- Identify "haunted" code (frequently changed)
- Detect "zombie" code (dead but still present)

### Pattern Recognition
- Identify refactoring patterns
- Detect code smells
- Find architectural changes
- Recognize feature additions
- Spot bug fix patterns

### Contributor Characterization
- Generate spooky personas for contributors
- Identify coding styles
- Detect activity patterns
- Create "ghost" profiles for inactive contributors

## AI Prompts

### File Epitaph Prompt
```
Given this file's history:
- Path: {filePath}
- Total commits: {commitCount}
- Contributors: {contributors}
- Churn rate: {churnRate}
- Last modified: {lastModified}

Generate a spooky, Halloween-themed epitaph (2-3 sentences) that tells the story of this file's life and death in the codebase. Make it dramatic and fun!
```

### Repository Story Prompt
```
Analyze this repository's evolution:
- Total commits: {totalCommits}
- Active period: {startDate} to {endDate}
- Contributors: {contributorCount}
- Most changed files: {topFiles}

Create a spooky narrative (3-4 paragraphs) about the haunted history of this codebase. Include dramatic moments, mysterious patterns, and ghostly contributors.
```

## Response Format

```javascript
{
  repositoryStory: string,
  fileEpitaphs: [{
    filePath: string,
    epitaph: string,
    spookinessLevel: number // 1-5
  }],
  hauntedCode: [{
    filePath: string,
    reason: string,
    severity: string
  }],
  ghostContributors: [{
    name: string,
    persona: string,
    lastSeen: timestamp
  }]
}
```

## Rate Limiting

- Cache AI responses
- Batch similar requests
- Implement exponential backoff
- Handle API errors gracefully
