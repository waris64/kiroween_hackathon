/**
 * Jest Test Setup
 * 
 * Global test configuration and utilities for SPECTRAL backend tests
 * This file runs before each test suite
 */

import { jest } from '@jest/globals'
import dotenv from 'dotenv'

// Load test environment variables
dotenv.config({ path: '.env.test' })

// Set test environment
process.env.NODE_ENV = 'test'
process.env.LOG_LEVEL = 'error' // Reduce log noise during tests

// Mock console methods to reduce test output noise
global.console = {
  ...console,
  log: jest.fn(), // Mock console.log
  debug: jest.fn(), // Mock console.debug
  info: jest.fn(), // Mock console.info
  warn: jest.fn(), // Mock console.warn
  error: jest.fn(), // Keep error for debugging
}

// Global test utilities
global.testUtils = {
  /**
   * Create a mock repository data object
   */
  createMockRepositoryData: () => ({
    repository: {
      url: 'https://github.com/test/repo',
      name: 'test-repo',
      branch: 'main',
      analyzedAt: new Date().toISOString(),
    },
    commits: [
      {
        hash: 'abc123',
        author: 'Test User',
        email: 'test@example.com',
        date: '2024-01-01T00:00:00Z',
        message: 'Initial commit',
        filesChanged: 5,
        insertions: 100,
        deletions: 0,
      },
    ],
    files: [
      {
        path: 'src/index.js',
        type: 'js',
        size: 1024,
        totalCommits: 10,
        lastModified: '2024-01-01T00:00:00Z',
        churnRate: 2.5,
        contributors: ['Test User'],
      },
    ],
    contributors: [
      {
        name: 'Test User',
        email: 'test@example.com',
        commits: 10,
        linesAdded: 500,
        linesDeleted: 100,
        firstCommit: '2024-01-01T00:00:00Z',
        lastActive: '2024-01-10T00:00:00Z',
      },
    ],
    stats: {
      totalCommits: 10,
      totalFiles: 5,
      totalContributors: 1,
      oldestCommit: '2024-01-01T00:00:00Z',
      newestCommit: '2024-01-10T00:00:00Z',
    },
  }),

  /**
   * Create a mock Express request object
   */
  createMockRequest: (overrides = {}) => ({
    body: {},
    params: {},
    query: {},
    headers: {},
    ip: '127.0.0.1',
    ...overrides,
  }),

  /**
   * Create a mock Express response object
   */
  createMockResponse: () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      sendStatus: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    }
    return res
  },

  /**
   * Create a mock Express next function
   */
  createMockNext: () => jest.fn(),

  /**
   * Wait for a specified time (for async operations)
   */
  wait: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

  /**
   * Generate a random string
   */
  randomString: (length = 10) => {
    return Math.random().toString(36).substring(2, length + 2)
  },

  /**
   * Generate a mock GitHub URL
   */
  mockGitHubUrl: (user = 'testuser', repo = 'testrepo') => {
    return `https://github.com/${user}/${repo}`
  },
}

// Mock external services by default
jest.mock('../src/services/AIAnalyzer.js', () => ({
  default: class MockAIAnalyzer {
    constructor() {
      this.client = null
    }

    async analyzeRepository(repositoryData) {
      return {
        repositoryStory: 'A spooky test story',
        fileEpitaphs: [],
        hauntedCode: [],
        ghostContributors: [],
      }
    }

    async generateRepositoryStory() {
      return 'A spooky test story'
    }

    async generateFileEpitaphs() {
      return []
    }

    async identifyHauntedCode() {
      return []
    }

    async characterizeGhosts() {
      return []
    }

    getFallbackInsights(repositoryData) {
      return {
        repositoryStory: 'Fallback story',
        fileEpitaphs: [],
        hauntedCode: [],
        ghostContributors: [],
      }
    }
  },
}))

// Setup and teardown hooks
beforeAll(() => {
  // Global setup before all tests
  console.log('🎃 Starting SPECTRAL test suite...')
})

afterAll(() => {
  // Global cleanup after all tests
  console.log('👻 SPECTRAL test suite complete!')
})

beforeEach(() => {
  // Reset mocks before each test
  jest.clearAllMocks()
})

afterEach(() => {
  // Cleanup after each test
  jest.restoreAllMocks()
})

// Handle unhandled promise rejections in tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection in test:', reason)
  throw reason
})

export default {}
