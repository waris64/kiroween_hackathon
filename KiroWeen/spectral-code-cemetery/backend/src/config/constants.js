/**
 * Application Constants
 * 
 * Central location for all configuration constants used throughout
 * the SPECTRAL application.
 * 
 * @module constants
 */

export const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'go',
  'rust',
  'ruby',
  'php',
  'csharp',
  'cpp',
  'c'
]

export const FILE_SIZE_LIMIT = 10 * 1024 * 1024 // 10MB

export const MAX_COMMITS = 1000

export const CACHE_TTL = 300 // 5 minutes in seconds

export const DEAD_CODE_THRESHOLD_DAYS = 180

export const HEALTH_SCORE_WEIGHTS = {
  recency: 0.5,
  frequency: 0.3,
  size: 0.2
}

export const ERROR_MESSAGES = {
  REPOSITORY_NOT_FOUND: 'The repository has been consumed by darkness',
  REPOSITORY_PRIVATE: 'This repository is protected by ancient wards',
  REPOSITORY_TOO_LARGE: 'This repository is too vast for mortal comprehension',
  INVALID_URL: 'The portal address is corrupted',
  INVALID_PATH: 'This path leads to forbidden realms',
  FILE_NOT_FOUND: 'The file has been erased from existence',
  GIT_CLONE_FAILED: 'Failed to summon the repository from the ether',
  GIT_ANALYSIS_FAILED: 'The Git spirits refuse to reveal their secrets',
  AI_UNAVAILABLE: 'The AI oracle slumbers',
  AI_RATE_LIMIT: 'The spirits grow weary - too many summonings',
  VALIDATION_FAILED: 'Your spell components are incomplete',
  CODE_TOO_LARGE: 'This code fragment is too powerful to resurrect',
  UNSUPPORTED_LANGUAGE: 'This ancient tongue is unknown to us',
  CACHE_ERROR: 'The memory crystals have shattered',
  INTERNAL_ERROR: 'A disturbance in the spectral plane has occurred'
}

export const SPOOKY_PREFIXES = [
  '[TOMB]',
  '[GHOST]',
  '[SPELL]',
  '[CEMETERY]',
  '[CACHE]',
  '[SPIRIT]',
  '[CRYPT]',
  '[HAUNT]'
]

export const RATE_LIMITS = {
  DEFAULT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
  },
  STRICT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10
  },
  ANALYSIS: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20
  }
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
}

export default {
  SUPPORTED_LANGUAGES,
  FILE_SIZE_LIMIT,
  MAX_COMMITS,
  CACHE_TTL,
  DEAD_CODE_THRESHOLD_DAYS,
  HEALTH_SCORE_WEIGHTS,
  ERROR_MESSAGES,
  SPOOKY_PREFIXES,
  RATE_LIMITS,
  HTTP_STATUS
}
