/**
 * Helper Utilities
 * 
 * Common utility functions used throughout the application.
 * 
 * @module helpers
 */

import crypto from 'crypto'

/**
 * Format date consistently
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

/**
 * Calculate days since a date
 * @param {Date|string} date - Past date
 * @returns {number} Days since date
 */
export function calculateDaysSince(date) {
  const past = new Date(date)
  const now = new Date()
  const diffTime = Math.abs(now - past)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * Truncate string with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
export function truncateString(str, maxLength = 50) {
  if (!str) return ''
  if (str.length <= maxLength) return str
  return str.substring(0, maxLength - 3) + '...'
}

/**
 * Create hash for cache keys
 * @param {string} str - String to hash
 * @returns {string} MD5 hash
 */
export function hashString(str) {
  return crypto.createHash('md5').update(str).digest('hex')
}

/**
 * Async sleep utility
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Split array into chunks
 * @param {Array} array - Array to chunk
 * @param {number} size - Chunk size
 * @returns {Array<Array>} Chunked array
 */
export function chunkArray(array, size) {
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Retry async function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} delay - Initial delay in ms
 * @returns {Promise<any>} Function result
 */
export async function retryAsync(fn, maxRetries = 3, delay = 1000) {
  let lastError
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (attempt < maxRetries) {
        const waitTime = delay * Math.pow(2, attempt - 1)
        await sleep(waitTime)
      }
    }
  }
  
  throw lastError
}

/**
 * Safe JSON parse with fallback
 * @param {string} str - JSON string
 * @param {any} fallback - Fallback value
 * @returns {any} Parsed object or fallback
 */
export function safeJSONParse(str, fallback = null) {
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export function generateId() {
  return crypto.randomBytes(16).toString('hex')
}

/**
 * Sanitize filename
 * @param {string} filename - Filename to sanitize
 * @returns {string} Sanitized filename
 */
export function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9.-]/gi, '_').toLowerCase()
}

/**
 * Calculate percentage
 * @param {number} value - Value
 * @param {number} total - Total
 * @returns {number} Percentage (0-100)
 */
export function calculatePercentage(value, total) {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

/**
 * Deep clone object
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

export default {
  formatDate,
  calculateDaysSince,
  truncateString,
  hashString,
  sleep,
  chunkArray,
  retryAsync,
  safeJSONParse,
  generateId,
  sanitizeFilename,
  calculatePercentage,
  deepClone
}
