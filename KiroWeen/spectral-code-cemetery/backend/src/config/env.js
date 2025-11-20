/**
 * Environment Configuration
 * 
 * Validates and exports environment variables with defaults.
 * Throws errors for missing required variables.
 * 
 * @module env
 */

import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env') })

/**
 * Validate required environment variable
 * @param {string} name - Variable name
 * @param {string} defaultValue - Default value if not required
 * @returns {string} Variable value
 */
function getEnvVar(name, defaultValue = null) {
  const value = process.env[name]
  
  if (!value && defaultValue === null) {
    throw new Error(`[TOMB] Missing required environment variable: ${name}`)
  }
  
  return value || defaultValue
}

/**
 * Environment configuration object
 */
const config = {
  // Server
  port: parseInt(getEnvVar('PORT', '3000'), 10),
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  
  // AI Services
  geminiApiKey: getEnvVar('GEMINI_API_KEY', ''),
  
  // Git
  githubToken: getEnvVar('GITHUB_TOKEN', ''),
  
  // CORS
  corsOrigin: getEnvVar('CORS_ORIGIN', 'http://localhost:5173'),
  
  // Paths
  tempDir: getEnvVar('TEMP_DIR', './temp'),
  logsDir: getEnvVar('LOGS_DIR', './logs'),
  
  // Features
  enableAI: getEnvVar('ENABLE_AI', 'true') === 'true',
  enableCaching: getEnvVar('ENABLE_CACHING', 'true') === 'true',
  
  // Limits
  maxRepoSize: parseInt(getEnvVar('MAX_REPO_SIZE', '500'), 10), // MB
  maxCommits: parseInt(getEnvVar('MAX_COMMITS', '1000'), 10),
  maxFiles: parseInt(getEnvVar('MAX_FILES', '500'), 10),
  
  // Cache
  cacheTTL: parseInt(getEnvVar('CACHE_TTL', '300'), 10), // seconds
  
  // Rate Limiting
  rateLimitWindow: parseInt(getEnvVar('RATE_LIMIT_WINDOW', '900000'), 10), // 15 min
  rateLimitMax: parseInt(getEnvVar('RATE_LIMIT_MAX', '100'), 10),
  
  // Logging
  logLevel: getEnvVar('LOG_LEVEL', 'info'),
  
  // Development
  isDevelopment: getEnvVar('NODE_ENV', 'development') === 'development',
  isProduction: getEnvVar('NODE_ENV', 'development') === 'production',
  isTest: getEnvVar('NODE_ENV', 'development') === 'test'
}

// Validate critical configuration
if (config.isProduction && !config.geminiApiKey) {
  console.warn('[TOMB] Warning: No GEMINI_API_KEY configured. AI features will use fallbacks.')
}

export default config
