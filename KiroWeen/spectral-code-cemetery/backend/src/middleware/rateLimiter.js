/**
 * Rate Limiting Middleware
 * 
 * Protects API endpoints from abuse with spooky-themed messages.
 * 
 * @module rateLimiter
 */

import rateLimit from 'express-rate-limit'
import { RATE_LIMITS } from '../config/constants.js'
import logger from '../utils/logger.js'

/**
 * Default rate limiter (100 requests per 15 minutes)
 */
export const defaultLimiter = rateLimit({
  windowMs: RATE_LIMITS.DEFAULT.windowMs,
  max: RATE_LIMITS.DEFAULT.max,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'The spirits grow weary. Please rest before summoning again.',
      retryAfter: '15 minutes'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`[TOMB] Rate limit exceeded for IP: ${req.ip}`)
    res.status(429).json({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'The spirits grow weary. Please rest before summoning again.',
        retryAfter: '15 minutes'
      }
    })
  }
})

/**
 * Strict rate limiter for resource-intensive operations (10 requests per 15 minutes)
 */
export const strictLimiter = rateLimit({
  windowMs: RATE_LIMITS.STRICT.windowMs,
  max: RATE_LIMITS.STRICT.max,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'The resurrection spell requires more time to recharge. Please wait before casting again.',
      retryAfter: '15 minutes'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`[SPELL] Strict rate limit exceeded for IP: ${req.ip}`)
    res.status(429).json({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'The resurrection spell requires more time to recharge. Please wait before casting again.',
        retryAfter: '15 minutes'
      }
    })
  }
})

/**
 * Analysis rate limiter (20 requests per hour)
 */
export const analysisLimiter = rateLimit({
  windowMs: RATE_LIMITS.ANALYSIS.windowMs,
  max: RATE_LIMITS.ANALYSIS.max,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many repository summonings. The cemetery gates must rest.',
      retryAfter: '1 hour'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`[CEMETERY] Analysis rate limit exceeded for IP: ${req.ip}`)
    res.status(429).json({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many repository summonings. The cemetery gates must rest.',
        retryAfter: '1 hour'
      }
    })
  }
})

export default {
  defaultLimiter,
  strictLimiter,
  analysisLimiter
}
