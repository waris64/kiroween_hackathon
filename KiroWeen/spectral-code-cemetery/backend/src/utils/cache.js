/**
 * Cache Service
 * 
 * In-memory caching with NodeCache for improved performance.
 * 
 * @module cache
 */

import NodeCache from 'node-cache'
import logger from './logger.js'
import { CACHE_TTL } from '../config/constants.js'

// Initialize cache with default TTL
const cache = new NodeCache({
  stdTTL: CACHE_TTL,
  checkperiod: 120, // Check for expired keys every 2 minutes
  useClones: false // Better performance, but be careful with mutations
})

/**
 * Get cached value
 * @param {string} key - Cache key
 * @returns {any|null} Cached value or null
 */
export function getCached(key) {
  try {
    const value = cache.get(key)
    
    if (value !== undefined) {
      logger.cache(`Cache HIT: ${key}`)
      return value
    }
    
    logger.cache(`Cache MISS: ${key}`)
    return null
  } catch (error) {
    logger.error(`[CACHE] Error getting key ${key}:`, error)
    return null
  }
}

/**
 * Set cached value
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttl - Time to live in seconds (optional)
 * @returns {boolean} Success status
 */
export function setCached(key, value, ttl = CACHE_TTL) {
  try {
    const success = cache.set(key, value, ttl)
    
    if (success) {
      logger.cache(`Cache SET: ${key} (TTL: ${ttl}s)`)
    } else {
      logger.warn(`[CACHE] Failed to set key: ${key}`)
    }
    
    return success
  } catch (error) {
    logger.error(`[CACHE] Error setting key ${key}:`, error)
    return false
  }
}

/**
 * Delete cached value
 * @param {string} key - Cache key
 * @returns {number} Number of deleted entries
 */
export function deleteCached(key) {
  try {
    const deleted = cache.del(key)
    logger.cache(`Cache DELETE: ${key} (${deleted} entries)`)
    return deleted
  } catch (error) {
    logger.error(`[CACHE] Error deleting key ${key}:`, error)
    return 0
  }
}

/**
 * Clear all cache
 * @returns {void}
 */
export function clearCache() {
  try {
    cache.flushAll()
    logger.cache('Cache CLEARED: All entries removed')
  } catch (error) {
    logger.error('[CACHE] Error clearing cache:', error)
  }
}

/**
 * Get cache statistics
 * @returns {Object} Cache stats
 */
export function getCacheStats() {
  return cache.getStats()
}

/**
 * Check if key exists
 * @param {string} key - Cache key
 * @returns {boolean} True if exists
 */
export function hasCached(key) {
  return cache.has(key)
}

// Event listeners
cache.on('expired', (key, value) => {
  logger.cache(`Cache EXPIRED: ${key}`)
})

cache.on('flush', () => {
  logger.cache('Cache FLUSHED')
})

export default cache
export { cache }
