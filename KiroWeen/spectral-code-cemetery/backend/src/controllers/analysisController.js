import GitAnalyzer from '../services/GitAnalyzer.js'
import AIAnalyzer from '../services/AIAnalyzer.js'
import CacheService from '../services/CacheService.js'
import logger from '../utils/logger.js'
import { v4 as uuidv4 } from 'uuid'

const gitAnalyzer = new GitAnalyzer()
const aiAnalyzer = new AIAnalyzer()
const cache = new CacheService()

// Store for ongoing analyses
const analysisStore = new Map()

/**
 * Start repository analysis
 */
export const analyzeRepository = async (req, res, next) => {
  try {
    const { repositoryUrl, branch, options } = req.validatedData
    
    // Generate analysis ID
    const analysisId = uuidv4()
    
    // Check cache first
    const cacheKey = `analysis:${repositoryUrl}:${branch}`
    const cachedResult = cache.get(cacheKey)
    
    if (cachedResult) {
      logger.info('Returning cached analysis result')
      return res.json({
        analysisId,
        status: 'completed',
        progress: 100,
        result: cachedResult
      })
    }

    // Store initial status
    analysisStore.set(analysisId, {
      status: 'processing',
      progress: 0,
      repositoryUrl,
      startedAt: new Date().toISOString()
    })

    // Start analysis in background
    gitAnalyzer.analyzeRepository(repositoryUrl, branch, options)
      .then(async (gitResult) => {
        // Add AI insights if requested
        let aiInsights = null
        if (options.includeAI !== false) {
          try {
            aiInsights = await aiAnalyzer.analyzeRepository(gitResult)
          } catch (error) {
            logger.warn('AI analysis failed, continuing without insights:', error.message)
          }
        }

        const result = {
          ...gitResult,
          aiInsights
        }

        analysisStore.set(analysisId, {
          status: 'completed',
          progress: 100,
          result,
          completedAt: new Date().toISOString()
        })
        
        // Cache the result
        cache.set(cacheKey, result)
        
        logger.info(`Analysis ${analysisId} completed successfully`)
      })
      .catch(error => {
        analysisStore.set(analysisId, {
          status: 'failed',
          progress: 0,
          error: error.message,
          failedAt: new Date().toISOString()
        })
        
        logger.error(`Analysis ${analysisId} failed:`, error)
      })

    // Return immediate response
    res.status(202).json({
      analysisId,
      status: 'processing',
      progress: 0,
      estimatedTime: 30,
      message: 'Summoning the ghosts... This may take a moment.'
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get analysis status
 */
export const getAnalysisStatus = async (req, res, next) => {
  try {
    const { analysisId } = req.params
    
    const analysis = analysisStore.get(analysisId)
    
    if (!analysis) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Analysis not found. The spirits have vanished!'
        }
      })
    }

    res.json({
      analysisId,
      ...analysis
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get repository data
 */
export const getRepositoryData = async (req, res, next) => {
  try {
    const { analysisId } = req.params
    
    const analysis = analysisStore.get(analysisId)
    
    if (!analysis) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Analysis not found'
        }
      })
    }

    if (analysis.status !== 'completed') {
      return res.status(400).json({
        error: {
          code: 'ANALYSIS_NOT_READY',
          message: 'Analysis is still in progress'
        }
      })
    }

    res.json(analysis.result)
  } catch (error) {
    next(error)
  }
}

/**
 * Get file history
 */
export const getFileHistory = async (req, res, next) => {
  try {
    const { analysisId, filePath } = req.params
    
    const analysis = analysisStore.get(analysisId)
    
    if (!analysis || analysis.status !== 'completed') {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Analysis not found or not completed'
        }
      })
    }

    const file = analysis.result.files.find(f => f.path === filePath)
    
    if (!file) {
      return res.status(404).json({
        error: {
          code: 'FILE_NOT_FOUND',
          message: 'File not found in analysis'
        }
      })
    }

    // Get commits related to this file
    const fileCommits = analysis.result.commits.filter(commit => 
      commit.message.includes(filePath) || commit.filesChanged > 0
    )

    res.json({
      file,
      commits: fileCommits.slice(0, 50)
    })
  } catch (error) {
    next(error)
  }
}
