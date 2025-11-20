/**
 * Global Error Handler Middleware
 * 
 * Catches all errors and formats them with spooky messages.
 * 
 * @module errorHandler
 */

import logger from '../utils/logger.js'
import {
  SpectralError,
  RepositoryError,
  FileNotFoundError,
  GitOperationError,
  AIServiceError,
  ValidationError,
  SecurityError
} from '../utils/errors.js'
import { HTTP_STATUS } from '../config/constants.js'

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {Function} next - Next middleware
 */
export function errorHandler(err, req, res, next) {
  // Log error with appropriate level
  if (err.statusCode >= 500) {
    logger.haunt(`${err.name}: ${err.message}`, {
      path: req.path,
      method: req.method,
      ip: req.ip,
      stack: err.stack
    })
  } else {
    logger.warn(`[TOMB] ${err.name}: ${err.message}`, {
      path: req.path,
      method: req.method
    })
  }

  // Handle specific error types
  if (err instanceof RepositoryError) {
    return res.status(err.statusCode || HTTP_STATUS.BAD_REQUEST).json({
      error: {
        code: err.code,
        message: err.message,
        timestamp: err.timestamp
      }
    })
  }

  if (err instanceof FileNotFoundError) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      error: {
        code: err.code,
        message: err.message,
        timestamp: err.timestamp
      }
    })
  }

  if (err instanceof GitOperationError) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: {
        code: err.code,
        message: err.message,
        timestamp: err.timestamp
      }
    })
  }

  if (err instanceof AIServiceError) {
    return res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
      error: {
        code: err.code,
        message: err.message,
        timestamp: err.timestamp
      }
    })
  }

  if (err instanceof ValidationError) {
    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      error: {
        code: err.code,
        message: err.message,
        timestamp: err.timestamp
      }
    })
  }

  if (err instanceof SecurityError) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      error: {
        code: err.code,
        message: err.message,
        timestamp: err.timestamp
      }
    })
  }

  if (err instanceof SpectralError) {
    return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(err.toJSON())
  }

  // Handle Joi validation errors
  if (err.name === 'ValidationError' && err.isJoi) {
    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Your incantation is malformed',
        details: err.details,
        timestamp: new Date().toISOString()
      }
    })
  }

  // Handle generic errors
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
  const message = process.env.NODE_ENV === 'production'
    ? 'A disturbance in the spectral plane has occurred'
    : err.message

  res.status(statusCode).json({
    error: {
      code: 'INTERNAL_ERROR',
      message,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack
      })
    }
  })
}

/**
 * 404 Not Found handler
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 */
export function notFoundHandler(req, res) {
  logger.warn(`[TOMB] 404 Not Found: ${req.method} ${req.path}`)
  
  res.status(HTTP_STATUS.NOT_FOUND).json({
    error: {
      code: 'NOT_FOUND',
      message: 'This path leads to the void - nothing exists here',
      path: req.path,
      timestamp: new Date().toISOString()
    }
  })
}

export default {
  errorHandler,
  notFoundHandler
}
