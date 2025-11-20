import express from 'express'
import { 
  analyzeRepository, 
  getAnalysisStatus, 
  getRepositoryData,
  getFileHistory 
} from '../controllers/analysisController.js'
import { validateAnalyzeRequest } from '../middleware/validation.js'
import rateLimit from 'express-rate-limit'

const router = express.Router()

// Rate limiter for analysis endpoint
const analysisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many analysis requests. The spirits need rest!'
    }
  }
})

// Routes
router.post('/analyze', analysisLimiter, validateAnalyzeRequest, analyzeRepository)
router.get('/analysis/:analysisId/status', getAnalysisStatus)
router.get('/repository/:analysisId', getRepositoryData)
router.get('/file/:analysisId/:filePath/history', getFileHistory)

export default router
