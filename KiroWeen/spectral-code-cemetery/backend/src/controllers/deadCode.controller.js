/**
 * Dead Code Controller
 * 
 * Handles dead code detection requests.
 * 
 * @module controllers/deadCode
 */

import GitAnalyzer from '../services/GitAnalyzer.js'
import logger from '../utils/logger.js'
import { getCached, setCached } from '../utils/cache.js'

const gitAnalyzer = new GitAnalyzer()

/**
 * Get dead code controller
 * 
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {Function} next - Next middleware
 */
export async function getDeadCodeController(req, res, next) {
  try {
    const { repoId } = req.params

    logger.cemetery(`Detecting dead code in repo: ${repoId}`)

    // Validate input
    if (!repoId) {
      return res.status(400).json({
        error: {
          code: 'INVALID_INPUT',
          message: 'Repository ID is required'
        }
      })
    }

    // Generate cache key
    const cacheKey = `deadcode:${repoId}`
    
    // Check cache
    const cached = getCached(cacheKey)
    if (cached) {
      logger.cemetery('Returning cached dead code report')
      return res.json({
        success: true,
        data: cached,
        cached: true
      })
    }

    // Detect dead code
    const deadCodeReport = await gitAnalyzer.detectDeadCode(repoId)

    // Cache the result
    setCached(cacheKey, deadCodeReport, 1800) // Cache for 30 minutes

    logger.cemetery(`Found ${deadCodeReport.deadFiles?.length || 0} dead files`)

    res.json({
      success: true,
      data: deadCodeReport,
      cached: false
    })

  } catch (error) {
    logger.haunt('Dead code detection failed:', error)
    next(error)
  }
}

export default {
  getDeadCodeController
}
