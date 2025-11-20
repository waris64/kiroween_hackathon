/**
 * API Routes
 * 
 * Central routing configuration for all API endpoints.
 * 
 * @module routes
 */

import express from 'express'
import { analyzeRepositoryController } from '../controllers/analyze.controller.js'
import { getFileHistoryController } from '../controllers/fileHistory.controller.js'
import { generateEpitaphController } from '../controllers/epitaph.controller.js'
import { resurrectCodeController } from '../controllers/resurrect.controller.js'
import { getDeadCodeController } from '../controllers/deadCode.controller.js'
import {
  validateAnalyzeRequest,
  validateEpitaphRequest,
  validateResurrectRequest
} from '../middleware/validation.js'
import {
  defaultLimiter,
  strictLimiter,
  analysisLimiter
} from '../middleware/rateLimiter.js'

const router = express.Router()

/**
 * POST /api/analyze
 * Analyze a Git repository
 * 
 * Rate limit: 20 requests per hour
 * Validation: analyzeSchema
 */
router.post(
  '/analyze',
  analysisLimiter,
  validateAnalyzeRequest,
  analyzeRepositoryController
)

/**
 * GET /api/file-history/:repoId/:filePath
 * Get commit history for a specific file
 * 
 * Rate limit: 100 requests per 15 minutes
 */
router.get(
  '/file-history/:repoId/:filePath(*)',
  defaultLimiter,
  getFileHistoryController
)

/**
 * POST /api/generate-epitaph
 * Generate AI epitaph for a file
 * 
 * Rate limit: 100 requests per 15 minutes
 * Validation: epitaphSchema
 */
router.post(
  '/generate-epitaph',
  defaultLimiter,
  validateEpitaphRequest,
  generateEpitaphController
)

/**
 * POST /api/resurrect
 * Modernize and resurrect old code
 * 
 * Rate limit: 10 requests per 15 minutes (strict)
 * Validation: resurrectSchema
 */
router.post(
  '/resurrect',
  strictLimiter,
  validateResurrectRequest,
  resurrectCodeController
)

/**
 * GET /api/dead-code/:repoId
 * Detect dead code in repository
 * 
 * Rate limit: 100 requests per 15 minutes
 */
router.get(
  '/dead-code/:repoId',
  defaultLimiter,
  getDeadCodeController
)

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'alive',
    message: 'SPECTRAL backend is haunting successfully',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

export default router
