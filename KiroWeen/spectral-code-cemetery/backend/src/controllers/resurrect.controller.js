/**
 * Resurrect Controller
 * 
 * Handles code modernization and resurrection requests.
 * 
 * @module controllers/resurrect
 */

import AIAnalyzer from '../services/AIAnalyzer.js'
import logger from '../utils/logger.js'
import { getCached, setCached } from '../utils/cache.js'
import { hashString } from '../utils/helpers.js'
import { validateCodeSize, validateLanguage } from '../utils/validators.js'

const aiAnalyzer = new AIAnalyzer()

/**
 * Resurrect code controller
 * 
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {Function} next - Next middleware
 */
export async function resurrectCodeController(req, res, next) {
  try {
    const { code, language, context = '' } = req.body

    logger.spell(`Resurrecting ${language} code (${code.length} chars)`)

    // Validate inputs
    validateCodeSize(code, 10000)
    validateLanguage(language)

    // Generate cache key
    const cacheKey = `resurrect:${hashString(code + language)}`
    
    // Check cache
    const cached = getCached(cacheKey)
    if (cached) {
      logger.spell('Returning cached resurrection')
      return res.json({
        success: true,
        data: {
          ...cached,
          cached: true
        }
      })
    }

    // Perform resurrection (modernization)
    const modernization = await aiAnalyzer.suggestModernization(code, language)

    // Cache the result
    setCached(cacheKey, modernization, 3600) // Cache for 1 hour

    logger.spell('Code resurrection completed successfully')

    res.json({
      success: true,
      data: {
        ...modernization,
        originalCode: code,
        language,
        cached: false
      }
    })

  } catch (error) {
    logger.haunt('Code resurrection failed:', error)
    next(error)
  }
}

export default {
  resurrectCodeController
}
