/**
 * Mock data for demo purposes - No API required!
 */

export const MOCK_REPOSITORY_DATA = {
  repository: {
    url: 'https://github.com/demo/spectral-cemetery',
    name: 'spectral-cemetery',
    branch: 'main',
    analyzedAt: new Date().toISOString()
  },
  commits: [
    {
      hash: 'a1b2c3d',
      author: 'Alice Developer',
      email: 'alice@example.com',
      date: '2024-11-01T10:00:00Z',
      message: 'Add new authentication system',
      additions: 45,
      deletions: 12,
      filesChanged: 3
    },
    {
      hash: 'e4f5g6h',
      author: 'Bob Coder',
      email: 'bob@example.com',
      date: '2024-10-28T14:30:00Z',
      message: 'Fix memory leak in data processing',
      additions: 23,
      deletions: 8,
      filesChanged: 2
    }
  ],
  files: [
    {
      path: 'src/legacy/oldComponent.js',
      extension: 'js',
      linesOfCode: 156,
      size: 4567,
      firstCommit: '2024-08-15T10:00:00Z',
      lastModified: '2024-08-20T14:30:00Z',
      commitCount: 3,
      healthScore: 25,
      isDead: true,
      churnRate: 0.5,
      contributors: ['Alice Developer', 'Bob Coder']
    },
    {
      path: 'src/utils/helpers.js',
      extension: 'js',
      linesOfCode: 89,
      size: 2341,
      firstCommit: '2024-09-01T12:00:00Z',
      lastModified: '2024-09-05T16:20:00Z',
      commitCount: 5,
      healthScore: 45,
      isDead: false,
      churnRate: 1.2,
      contributors: ['Charlie Engineer']
    }
  ],
  contributors: [
    {
      name: 'Alice Developer',
      email: 'alice@example.com',
      commits: 15,
      linesAdded: 567,
      linesDeleted: 123
    }
  ],
  stats: {
    totalCommits: 41,
    totalFiles: 5,
    totalContributors: 4
  }
};

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));