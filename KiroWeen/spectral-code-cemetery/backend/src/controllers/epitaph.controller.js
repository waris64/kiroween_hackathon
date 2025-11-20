/**
 * Epitaph Controller
 * 
 * Handles AI epitaph generation for individual files.
 * 
 * @module controllers/epitaph
 */

import AIAnalyzer from '../services/AIAnalyzer.js'
import logger from '../utils/logger.js'
import { getCached, setCached } from '../utils/cache.js'
import { hashString } from '../utils/helpers.js'

const aiAnalyzer = new AIAnalyzer()

/**
 * Generate epitaph controller
 * 
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {Function} next - Next middleware
 */
export async function generateEpitaphController(req, res, next) {
  try {
    const { file, commits = [] } = req.body

    logger.ghost(`Generating epitaph for file: ${file.path}`)

    // Validate inputs
    if (!file || !file.path) {
      return res.status(400).json({
        error: {
          code: 'INVALID_INPUT',
          message: 'File object with path is required'
        }
      })
    }

    // Generate cache key
    const cacheKey = `epitaph:${hashString(file.path + JSON.stringify(file))}`
    
    // Check cache
    const cached = getCached(cacheKey)
    if (cached) {
      logger.ghost('Returning cached epitaph')
      return res.json({
        success: true,
        data: {
          filePath: file.path,
          epitaph: cached,
          cached: true
        }
      })
    }

    // Generate epitaph
    const epitaph = await aiAnalyzer.generateEpitaph(file, commits)

    // Cache the result
    setCached(cacheKey, epitaph, 3600) // Cache for 1 hour

    logger.ghost('Epitaph generated successfully')

    res.json({
      success: true,
      data: {
        filePath: file.path,
        epitaph,
        cached: false
      }
    })

  } catch (error) {
    logger.haunt('Epitaph generation failed:', error)
    next(error)
  }
}

export default {
  generateEpitaphController
}
