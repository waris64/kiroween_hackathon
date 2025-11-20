/**
 * Winston Logger Configuration
 * 
 * Provides spooky-themed logging with custom prefixes and formats.
 * 
 * @module logger
 */

import winston from 'winston'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const { combine, timestamp, printf, colorize, errors } = winston.format

// Custom format with spooky prefixes
const spookyFormat = printf(({ level, message, timestamp, stack, prefix }) => {
  const prefixStr = prefix || '[TOMB]'
  const msg = stack || message
  return `${timestamp} ${level}: ${prefixStr} ${msg}`
})

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs')

// Logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    spookyFormat
  ),
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: combine(
        colorize(),
        spookyFormat
      )
    }),
    
    // File transport for errors
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // File transport for all logs
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log')
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log')
    })
  ]
})

// Helper methods with spooky prefixes
logger.tomb = (message, meta = {}) => {
  logger.info(message, { prefix: '[TOMB]', ...meta })
}

logger.ghost = (message, meta = {}) => {
  logger.info(message, { prefix: '[GHOST]', ...meta })
}

logger.spell = (message, meta = {}) => {
  logger.info(message, { prefix: '[SPELL]', ...meta })
}

logger.cemetery = (message, meta = {}) => {
  logger.info(message, { prefix: '[CEMETERY]', ...meta })
}

logger.cache = (message, meta = {}) => {
  logger.debug(message, { prefix: '[CACHE]', ...meta })
}

logger.spirit = (message, meta = {}) => {
  logger.info(message, { prefix: '[SPIRIT]', ...meta })
}

logger.crypt = (message, meta = {}) => {
  logger.warn(message, { prefix: '[CRYPT]', ...meta })
}

logger.haunt = (message, meta = {}) => {
  logger.error(message, { prefix: '[HAUNT]', ...meta })
}

export default logger
