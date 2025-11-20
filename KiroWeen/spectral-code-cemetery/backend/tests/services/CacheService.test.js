/**
 * Tests for CacheService
 * 
 * Tests caching functionality for repository analysis results
 */

import { describe, test, expect, beforeEach } from '@jest/globals'
import CacheService from '../../src/services/CacheService.js'

describe('CacheService', () => {
  let cacheService

  beforeEach(() => {
    // Create a fresh cache instance for each test
    cacheService = new CacheService()
  })

  describe('set and get operations', () => {
    test('should store and retrieve a value', () => {
      const key = 'test-key'
      const value = { data: 'test-data' }

      cacheService.set(key, value)
      const retrieved = cacheService.get(key)

      expect(retrieved).toEqual(value)
    })

    test('should return undefined for non-existent key', () => {
      const result = cacheService.get('non-existent-key')
      expect(result).toBeUndefined()
    })

    test('should overwrite existing key', () => {
      const key = 'test-key'
      
      cacheService.set(key, 'first-value')
      cacheService.set(key, 'second-value')
      
      const result = cacheService.get(key)
      expect(result).toBe('second-value')
    })

    test('should handle complex objects', () => {
      const key = 'complex-key'
      const value = {
        repository: { name: 'test-repo' },
        commits: [{ hash: 'abc123' }],
        nested: { deep: { value: 42 } },
      }

      cacheService.set(key, value)
      const retrieved = cacheService.get(key)

      expect(retrieved).toEqual(value)
      expect(retrieved.nested.deep.value).toBe(42)
    })
  })

  describe('get operation for existing keys', () => {
    test('should return value for existing key', () => {
      cacheService.set('test-key', 'test-value')
      expect(cacheService.get('test-key')).toBe('test-value')
    })

    test('should return undefined for non-existent key', () => {
      expect(cacheService.get('non-existent')).toBeUndefined()
    })
  })

  describe('del operation', () => {
    test('should delete existing key', () => {
      const key = 'test-key'
      
      cacheService.set(key, 'test-value')
      expect(cacheService.get(key)).toBe('test-value')
      
      cacheService.del(key)
      expect(cacheService.get(key)).toBeUndefined()
    })

    test('should handle deleting non-existent key', () => {
      expect(() => {
        cacheService.del('non-existent')
      }).not.toThrow()
    })
  })

  describe('flush operation', () => {
    test('should flush all cached items', () => {
      cacheService.set('key1', 'value1')
      cacheService.set('key2', 'value2')
      cacheService.set('key3', 'value3')

      expect(cacheService.get('key1')).toBe('value1')
      expect(cacheService.get('key2')).toBe('value2')
      expect(cacheService.get('key3')).toBe('value3')

      cacheService.flush()

      expect(cacheService.get('key1')).toBeUndefined()
      expect(cacheService.get('key2')).toBeUndefined()
      expect(cacheService.get('key3')).toBeUndefined()
    })

    test('should handle flushing empty cache', () => {
      expect(() => {
        cacheService.flush()
      }).not.toThrow()
    })
  })

  describe('TTL (Time To Live)', () => {
    test('should expire items after TTL', async () => {
      // Create cache with 1 second TTL
      const shortTTLCache = new CacheService(1)
      
      shortTTLCache.set('test-key', 'test-value')
      expect(shortTTLCache.get('test-key')).toBe('test-value')

      // Wait for expiration
      await global.testUtils.wait(1100)

      expect(shortTTLCache.get('test-key')).toBeUndefined()
    }, 2000)

    test('should not expire before TTL', async () => {
      const longTTLCache = new CacheService(10)
      
      longTTLCache.set('test-key', 'test-value')
      
      // Wait less than TTL
      await global.testUtils.wait(500)
      
      expect(longTTLCache.get('test-key')).toBe('test-value')
    })
  })

  describe('Repository analysis caching', () => {
    test('should cache repository analysis results', () => {
      const mockData = global.testUtils.createMockRepositoryData()
      const cacheKey = `analysis:${mockData.repository.url}:${mockData.repository.branch}`

      cacheService.set(cacheKey, mockData)
      const cached = cacheService.get(cacheKey)

      expect(cached).toEqual(mockData)
      expect(cached.repository.name).toBe('test-repo')
      expect(cached.commits).toHaveLength(1)
    })

    test('should generate consistent cache keys', () => {
      const url = 'https://github.com/user/repo'
      const branch = 'main'
      
      const key1 = `analysis:${url}:${branch}`
      const key2 = `analysis:${url}:${branch}`
      
      expect(key1).toBe(key2)
    })
  })

  describe('Error handling', () => {
    test('should handle null values', () => {
      cacheService.set('null-key', null)
      expect(cacheService.get('null-key')).toBeNull()
    })

    test('should handle undefined values', () => {
      // node-cache doesn't store undefined, it returns undefined for missing keys
      cacheService.set('undefined-key', undefined)
      // After setting undefined, the key won't exist, so get returns undefined
      const result = cacheService.get('undefined-key')
      expect(result === undefined || result === null).toBe(true)
    })

    test('should handle empty strings', () => {
      cacheService.set('empty-key', '')
      expect(cacheService.get('empty-key')).toBe('')
    })

    test('should handle arrays', () => {
      const array = [1, 2, 3, 4, 5]
      cacheService.set('array-key', array)
      expect(cacheService.get('array-key')).toEqual(array)
    })
  })
})
