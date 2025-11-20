/**
 * Custom Error Classes for SPECTRAL
 * 
 * Provides spooky-themed error handling with proper error codes,
 * timestamps, and JSON serialization for API responses.
 * 
 * @module errors
 */

/**
 * Base SpectralError class
 * All custom errors extend from this
 */
class SpectralError extends Error {
  constructor(message, originalError = null) {
    super(message)
    this.name = this.constructor.name
    this.timestamp = new Date().toISOString()
    this.originalError = originalError
    this.code = 'SPECTRAL_ERROR'
    Error.captureStackTrace(this, this.constructor)
  }

  toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        code: this.code,
        timestamp: this.timestamp,
        ...(process.env.NODE_ENV === 'development' && this.originalError && {
          originalError: this.originalError.message
        })
      }
    }
  }
}

/**
 * Repository-related errors
 */
class RepositoryError extends SpectralError {
  constructor(message, originalError = null) {
    super(message || 'The repository spirits refuse to be summoned', originalError)
    this.code = 'REPOSITORY_ERROR'
    this.statusCode = 400
  }
}

/**
 * File not found errors
 */
class FileNotFoundError extends SpectralError {
  constructor(message, originalError = null) {
    super(message || 'This file has vanished into the void', originalError)
    this.code = 'FILE_NOT_FOUND'
    this.statusCode = 404
  }
}

/**
 * Git operation errors
 */
class GitOperationError extends SpectralError {
  constructor(message, originalError = null) {
    super(message || 'The Git spirits are restless and refuse to cooperate', originalError)
    this.code = 'GIT_OPERATION_ERROR'
    this.statusCode = 500
  }
}

/**
 * AI service errors
 */
class AIServiceError extends SpectralError {
  constructor(message, originalError = null) {
    super(message || 'The AI oracle has fallen silent', originalError)
    this.code = 'AI_SERVICE_ERROR'
    this.statusCode = 503
  }
}

/**
 * Validation errors
 */
class ValidationError extends SpectralError {
  constructor(message, originalError = null) {
    super(message || 'Your incantation is malformed', originalError)
    this.code = 'VALIDATION_ERROR'
    this.statusCode = 422
  }
}

/**
 * Security errors
 */
class SecurityError extends SpectralError {
  constructor(message, originalError = null) {
    super(message || 'Dark forces detected - access denied', originalError)
    this.code = 'SECURITY_ERROR'
    this.statusCode = 403
  }
}

export {
  SpectralError,
  RepositoryError,
  FileNotFoundError,
  GitOperationError,
  AIServiceError,
  ValidationError,
  SecurityError
}
