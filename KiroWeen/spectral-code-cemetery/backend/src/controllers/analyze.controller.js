/**
 * Analyze Controller
 * 
 * Handles repository analysis requests with Git and AI integration.
 * 
 * @module controllers/analyze
 */

import GitAnalyzer from '../services/GitAnalyzer.js'
import AIAnalyzer from '../services/AIAnalyzer.js'
import logger from '../utils/logger.js'
import { chunkArray } from '../utils/helpers.js'
import { getCached, setCached } from '../utils/cache.js'
import { hashString } from '../utils/helpers.js'

const gitAnalyzer = new GitAnalyzer()
const aiAnalyzer = new AIAnalyzer()

/**
 * Analyze repository controller
 * 
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {Function} next - Next middleware
 */
export async function analyzeRepositoryController(req, res, next) {
  try {
    const { repoUrl, repoPath, branch = 'main', options = {} } = req.body

    logger.tomb(`Starting repository analysis: ${repoUrl || repoPath}`)

    // Generate cache key
    const cacheKey = `analysis:${hashString(repoUrl || repoPath)}:${branch}`
    
    // Check cache
    const cached = getCached(cacheKey)
    if (cached) {
      logger.tomb('Returning cached analysis result')
      return res.json({
        success: true,
        data: cached,
        cached: true
      })
    }

    // Step 1: Analyze repository with Git
    logger.tomb('Analyzing Git repository...')
    const repositoryData = await gitAnalyzer.analyzeRepository(
      repoUrl || repoPath,
      branch,
      options
    )

    logger.tomb(`Found ${repositoryData.files.length} files and ${repositoryData.commits.length} commits`)

    // Step 2: Generate AI insights if enabled
    let aiInsights = null
    if (options.includeAI !== false) {
      logger.tomb('Generating AI insights...')
      
      try {
        // Generate epitaphs for files in parallel (limit to 10 at a time)
        const filesToAnalyze = repositoryData.files.slice(0, 50) // Limit to top 50 files
        const fileChunks = chunkArray(filesToAnalyze, 10)
        
        const allEpitaphs = []
        for (const chunk of fileChunks) {
          const epitaphPromises = chunk.map(file => 
            aiAnalyzer.generateEpitaph(file, repositoryData.commits)
              .catch(err => {
                logger.warn(`[GHOST] Failed to generate epitaph for ${file.path}:`, err.message)
                return `Here lies ${file.path}, forever changed ${file.totalCommits} times`
              })
          )
          
          const epitaphs = await Promise.all(epitaphPromises)
          allEpitaphs.push(...epitaphs)
        }

        // Generate complete AI insights
        aiInsights = await aiAnalyzer.analyzeRepository(repositoryData)
        
        logger.tomb('AI insights generated successfully')
      } catch (error) {
        logger.warn('[GHOST] AI analysis failed, using fallback:', error.message)
        aiInsights = aiAnalyzer.getFallbackInsights(repositoryData)
      }
    }

    // Step 3: Combine results
    const result = {
      repository: repositoryData.repository,
      stats: repositoryData.stats,
      files: repositoryData.files,
      commits: repositoryData.commits,
      contributors: repositoryData.contributors,
      aiInsights,
      analyzedAt: new Date().toISOString()
    }

    // Cache the result
    setCached(cacheKey, result, 3600) // Cache for 1 hour

    logger.tomb('Repository analysis completed successfully')

    res.json({
      success: true,
      data: result
    })

  } catch (error) {
    logger.haunt('Repository analysis failed:', error)
    next(error)
  }
}

export default {
  analyzeRepositoryController
}
