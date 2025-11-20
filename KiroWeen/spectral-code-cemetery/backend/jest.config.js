/**
 * Jest Configuration for SPECTRAL Backend
 * 
 * Configures Jest testing framework with:
 * - ES modules support
 * - Coverage reporting
 * - Test environment setup
 * - Mock configurations
 */

export default {
  // Use Node environment for backend tests
  testEnvironment: 'node',

  // Support ES modules (no need for extensionsToTreatAsEsm when type: module in package.json)
  transform: {},

  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js',
    '**/__tests__/**/*.js',
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js', // Exclude server entry point
    '!**/node_modules/**',
    '!**/tests/**',
  ],

  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  // Coverage thresholds (optional - can be adjusted)
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Test timeout (30 seconds for Git operations)
  testTimeout: 30000,

  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // Verbose output
  verbose: true,

  // Detect open handles (useful for debugging)
  detectOpenHandles: true,
  forceExit: true,

  // Module directories
  moduleDirectories: ['node_modules', 'src'],

  // Global setup/teardown
  globalSetup: undefined,
  globalTeardown: undefined,
}
