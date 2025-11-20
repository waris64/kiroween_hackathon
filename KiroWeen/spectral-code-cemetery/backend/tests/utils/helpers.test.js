/**
 * Tests for utility helper functions
 * 
 * Example test file demonstrating Jest setup
 */

import { describe, test, expect } from '@jest/globals'

describe('Helper Utilities', () => {
  describe('Test Setup Verification', () => {
    test('should have access to global test utilities', () => {
      expect(global.testUtils).toBeDefined()
      expect(global.testUtils.createMockRepositoryData).toBeDefined()
      expect(global.testUtils.createMockRequest).toBeDefined()
      expect(global.testUtils.createMockResponse).toBeDefined()
    })

    test('should create mock repository data', () => {
      const mockData = global.testUtils.createMockRepositoryData()
      
      expect(mockData).toHaveProperty('repository')
      expect(mockData).toHaveProperty('commits')
      expect(mockData).toHaveProperty('files')
      expect(mockData).toHaveProperty('contributors')
      expect(mockData).toHaveProperty('stats')
      
      expect(mockData.repository.name).toBe('test-repo')
      expect(mockData.commits).toHaveLength(1)
      expect(mockData.files).toHaveLength(1)
      expect(mockData.contributors).toHaveLength(1)
    })

    test('should create mock Express request', () => {
      const req = global.testUtils.createMockRequest({
        body: { test: 'data' },
        params: { id: '123' },
      })
      
      expect(req.body).toEqual({ test: 'data' })
      expect(req.params).toEqual({ id: '123' })
      expect(req.ip).toBe('127.0.0.1')
    })

    test('should create mock Express response', () => {
      const res = global.testUtils.createMockResponse()
      
      expect(res.status).toBeDefined()
      expect(res.json).toBeDefined()
      expect(res.send).toBeDefined()
      
      // Test chaining
      res.status(200).json({ success: true })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ success: true })
    })

    test('should generate random strings', () => {
      const str1 = global.testUtils.randomString(10)
      const str2 = global.testUtils.randomString(10)
      
      expect(str1).toHaveLength(10)
      expect(str2).toHaveLength(10)
      expect(str1).not.toBe(str2) // Should be different
    })

    test('should generate mock GitHub URLs', () => {
      const url = global.testUtils.mockGitHubUrl('user', 'repo')
      expect(url).toBe('https://github.com/user/repo')
    })

    test('should wait for specified time', async () => {
      const start = Date.now()
      await global.testUtils.wait(100)
      const elapsed = Date.now() - start
      
      expect(elapsed).toBeGreaterThanOrEqual(100)
      expect(elapsed).toBeLessThan(200)
    })
  })

  describe('Environment Configuration', () => {
    test('should be in test environment', () => {
      expect(process.env.NODE_ENV).toBe('test')
    })

    test('should have log level set to error', () => {
      expect(process.env.LOG_LEVEL).toBe('error')
    })
  })

  describe('Mock Verification', () => {
    test('console methods should be mocked', () => {
      console.log('This should be mocked')
      console.info('This should be mocked')
      console.debug('This should be mocked')
      
      expect(console.log).toHaveBeenCalled()
      expect(console.info).toHaveBeenCalled()
      expect(console.debug).toHaveBeenCalled()
    })
  })
})
