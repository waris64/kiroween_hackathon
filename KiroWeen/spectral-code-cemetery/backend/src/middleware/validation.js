/**
 * Validation Middleware
 * 
 * Joi schema validation for request bodies and parameters.
 * 
 * @module validation
 */

import Joi from 'joi'
import { ValidationError } from '../utils/errors.js'
import logger from '../utils/logger.js'

/**
 * Analyze request validation schema
 */
export const analyzeSchema = Joi.object({
  repoUrl: Joi.string().uri().optional(),
  repoPath: Joi.string().optional(),
  branch: Joi.string().default('main'),
  options: Joi.object({
    includeAI: Joi.boolean().default(true),
    maxCommits: Joi.number().integer().min(1).max(5000).default(1000),
    fileTypes: Joi.array().items(Joi.string()).optional()
  }).optional()
}).or('repoUrl', 'repoPath')

/**
 * Epitaph generation validation schema
 */
export const epitaphSchema = Joi.object({
  file: Joi.object({
    path: Joi.string().required(),
    linesOfCode: Joi.number().integer().optional(),
    firstCommit: Joi.string().optional(),
    lastModified: Joi.string().optional(),
    commitCount: Joi.number().integer().optional(),
    contributors: Joi.array().items(Joi.string()).optional()
  }).required(),
  commits: Joi.array().items(Joi.object({
    hash: Joi.string().required(),
    author: Joi.string().required(),
    date: Joi.string().required(),
    message: Joi.string().required()
  })).optional()
})

/**
 * Resurrect code validation schema
 */
export const resurrectSchema = Joi.object({
  code: Joi.string().required().max(10000),
  language: Joi.string().required(),
  context: Joi.string().optional().max(500)
})

/**
 * Generic validation middleware
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
export function validateRequest(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    })

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))

      logger.warn('[TOMB] Validation failed:', errors)

      return res.status(422).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Your incantation is malformed',
          details: errors
        }
      })
    }

    // Replace request body with validated and sanitized value
    req.body = value
    next()
  }
}

/**
 * Validate analyze request
 */
export const validateAnalyzeRequest = validateRequest(analyzeSchema)

/**
 * Validate epitaph request
 */
export const validateEpitaphRequest = validateRequest(epitaphSchema)

/**
 * Validate resurrect request
 */
export const validateResurrectRequest = validateRequest(resurrectSchema)

/**
 * Validation middleware that catches Joi errors
 */
export function validationMiddleware(err, req, res, next) {
  if (err instanceof ValidationError || err.name === 'ValidationError') {
    logger.warn('[TOMB] Validation error:', err.message)
    
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message || 'Your incantation is malformed',
        timestamp: new Date().toISOString()
      }
    })
  }

  next(err)
}

export default {
  validateAnalyzeRequest,
  validateEpitaphRequest,
  validateResurrectRequest,
  validationMiddleware
}
