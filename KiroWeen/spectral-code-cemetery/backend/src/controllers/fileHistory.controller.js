/**
 * File History Controller
 * 
 * Handles file history retrieval requests.
 * 
 * @module controllers/fileHistory
 */

import GitAnalyzer from '../services/GitAnalyzer.js'
import logger from '../utils/logger.js'
import { validatePath } from '../utils/validators.js'
import { FileNotFoundError } from '../utils/errors.js'

const gitAnalyzer = new GitAnalyzer()

/**
 * Get file history controller
 * 
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {Function} next - Next middleware
 */
export async function getFileHistoryController(req, res, next) {
  try {
    const { repoId, filePath } = req.params

    logger.tomb(`Fetching file history: ${filePath} in repo ${repoId}`)

    // Validate inputs
    if (!repoId) {
      return res.status(400).json({
        error: {
          code: 'INVALID_INPUT',
          message: 'Repository ID is required'
        }
      })
    }

    if (!filePath) {
      return res.status(400).json({
        error: {
          code: 'INVALID_INPUT',
          message: 'File path is required'
        }
      })
    }

    // Validate file path for security
    validatePath(filePath)

    // Get file history
    const history = await gitAnalyzer.getFileHistory(repoId, filePath)

    if (!history || history.length === 0) {
      throw new FileNotFoundError(`No history found for file: ${filePath}`)
    }

    logger.tomb(`Found ${history.length} commits for file`)

    res.json({
      success: true,
      data: {
        repoId,
        filePath,
        commits: history,
        totalCommits: history.length
      }
    })

  } catch (error) {
    logger.haunt('File history retrieval failed:', error)
    next(error)
  }
}

export default {
  getFileHistoryController
}
