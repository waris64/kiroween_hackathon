/**
 * SPECTRAL Backend Server
 * 
 * Main server file that sets up Express application with:
 * - Security middleware (Helmet, CORS)
 * - Request logging (Morgan, Winston)
 * - Rate limiting
 * - API routes
 * - Error handling
 * - Graceful shutdown
 * 
 * @module server
 */

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import apiRoutes from './routes/index.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import logger from './utils/logger.js'

// Load environment variables
dotenv.config()

// Validate required environment variables
const requiredEnvVars = ['NODE_ENV']
const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

if (missingVars.length > 0) {
  logger.warn(`[SPIRIT] Missing optional environment variables: ${missingVars.join(', ')}`)
}

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 3001
const NODE_ENV = process.env.NODE_ENV || 'development'
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'

/**
 * Security Middleware
 * Helmet adds various HTTP headers for security
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
}))

/**
 * CORS Configuration
 * Allow requests from frontend origin
 */
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

/**
 * HTTP Request Logging
 * Morgan logs all HTTP requests in development
 */
if (NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }))
}

/**
 * Body Parser Middleware
 * Parse JSON request bodies
 */
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/**
 * Rate Limiting Middleware
 * Prevents abuse by limiting requests per IP
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window per IP
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'The spirits grow tired. Please wait before trying again. 👻',
    },
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('[SPIRIT] Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
    })
    res.status(429).json({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'The spirits grow tired. Please wait before trying again. 👻',
      },
    })
  },
})

// Apply rate limiting to all API routes
app.use('/api', limiter)

/**
 * Health Check Endpoint
 * Returns server status and uptime
 * 
 * @route GET /api/health-check
 * @returns {Object} 200 - Server status
 */
app.get('/api/health-check', (req, res) => {
  const uptime = process.uptime()
  const memoryUsage = process.memoryUsage()
  
  res.json({
    status: 'alive',
    message: 'SPECTRAL backend is running 🎃',
    uptime: Math.floor(uptime),
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    memory: {
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
    },
  })
})

/**
 * Root Endpoint
 * Welcome message
 */
app.get('/', (req, res) => {
  res.json({
    message: '🎃 Welcome to SPECTRAL API 🎃',
    version: '1.0.0',
    documentation: '/api/health-check',
  })
})

/**
 * API Routes
 * Mount all API routes under /api prefix
 */
app.use('/api', apiRoutes)

/**
 * 404 Not Found Handler
 * Catches all undefined routes
 */
app.use(notFoundHandler)

/**
 * Global Error Handler
 * Catches all errors and returns formatted response
 */
app.use(errorHandler)

/**
 * Start Server
 * Listen on specified port
 */
const server = app.listen(PORT, () => {
  logger.info(`[TOMB] 🎃 SPECTRAL backend running on port ${PORT}`)
  logger.info(`[TOMB] Environment: ${NODE_ENV}`)
  logger.info(`[TOMB] CORS Origin: ${CORS_ORIGIN}`)
  console.log(`\n🎃 SPECTRAL Backend Server 🎃`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`🌐 Server: http://localhost:${PORT}`)
  console.log(`🏥 Health: http://localhost:${PORT}/api/health-check`)
  console.log(`📊 Environment: ${NODE_ENV}`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)
})

/**
 * Graceful Shutdown Handler
 * Handles SIGTERM and SIGINT signals
 */
const gracefulShutdown = (signal) => {
  logger.info(`[SPIRIT] ${signal} received. Starting graceful shutdown...`)
  
  server.close(() => {
    logger.info('[SPIRIT] Server closed. All connections terminated.')
    logger.info('[SPIRIT] 👻 The spirits have departed. Goodbye!')
    process.exit(0)
  })
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('[SPIRIT] Forced shutdown after timeout')
    process.exit(1)
  }, 10000)
}

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

/**
 * Unhandled Rejection Handler
 * Catches unhandled promise rejections
 */
process.on('unhandledRejection', (reason, promise) => {
  logger.error('[SPIRIT] Unhandled Rejection', {
    reason,
    promise,
  })
})

/**
 * Uncaught Exception Handler
 * Catches uncaught exceptions
 */
process.on('uncaughtException', (error) => {
  logger.error('[SPIRIT] Uncaught Exception', {
    error: error.message,
    stack: error.stack,
  })
  
  // Exit process after logging
  process.exit(1)
})

export default app
