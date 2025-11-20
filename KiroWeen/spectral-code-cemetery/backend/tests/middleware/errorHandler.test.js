/**
 * Tests for Error Handler Middleware
 * 
 * Tests error handling and response formatting
 */

import { describe, test, expect, beforeEach } from '@jest/globals'
import { errorHandler, notFoundHandler } from '../../src/middleware/errorHandler.js'
import { SpectralError, ValidationError, RepositoryError } from '../../src/utils/errors.js'

describe('Error Handler Middleware', () => {
  let req, res, next

  beforeEach(() => {
    req = global.testUtils.createMockRequest()
    res = global.testUtils.createMockResponse()
    next = global.testUtils.createMockNext()
  })

  describe('errorHandler', () => {
    test('should handle SpectralError with custom status code', () => {
      const error = new SpectralError('Custom error message')
      error.statusCode = 400
      
      errorHandler(error, req, res, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalled()
    })

    test('should handle ValidationError', () => {
      const error = new ValidationError('Invalid input data')
      
      errorHandler(error, req, res, next)

      expect(res.status).toHaveBeenCalledWith(422)
      expect(res.json).toHaveBeenCalled()
      const call = res.json.mock.calls[0][0]
      expect(call.error.code).toBe('VALIDATION_ERROR')
      expect(call.error.message).toBe('Invalid input data')
    })

    test('should handle RepositoryError', () => {
      const error = new RepositoryError('Repository not found')
      
      errorHandler(error, req, res, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalled()
      const call = res.json.mock.calls[0][0]
      expect(call.error.code).toBe('REPOSITORY_ERROR')
      expect(call.error.message).toBe('Repository not found')
    })

    test('should handle generic Error with 500 status', () => {
      const error = new Error('Something went wrong')
      
      errorHandler(error, req, res, next)

      expect(res.status).toHaveBeenCalledWith(500)
      const call = res.json.mock.calls[0][0]
      expect(call.error.code).toBe('INTERNAL_ERROR')
      expect(call.error.message).toBe('Something went wrong')
      expect(call.error.timestamp).toBeDefined()
    })

    test('should handle errors without message', () => {
      const error = new Error()
      
      errorHandler(error, req, res, next)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalled()
    })

    test('should include error details in development mode', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      
      const error = new Error('Dev error')
      error.stack = 'Error stack trace'
      
      errorHandler(error, req, res, next)

      expect(res.status).toHaveBeenCalledWith(500)
      
      process.env.NODE_ENV = originalEnv
    })

    test('should handle errors with custom properties', () => {
      const error = new SpectralError('Custom error')
      error.statusCode = 403
      error.details = { field: 'username', reason: 'already exists' }
      
      errorHandler(error, req, res, next)

      expect(res.status).toHaveBeenCalledWith(403)
    })
  })

  describe('notFoundHandler', () => {
    test('should return 404 for undefined routes', () => {
      req.path = '/api/non-existent-route'
      
      notFoundHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      const call = res.json.mock.calls[0][0]
      expect(call.error.code).toBe('NOT_FOUND')
      expect(call.error.message).toBe('This path leads to the void - nothing exists here')
      expect(call.error.path).toBe('/api/non-existent-route')
      expect(call.error.timestamp).toBeDefined()
    })

    test('should include request path in response', () => {
      req.path = '/api/unknown/path'
      
      notFoundHandler(req, res)

      const call = res.json.mock.calls[0][0]
      expect(call.error.path).toBe('/api/unknown/path')
    })

    test('should handle root path', () => {
      req.path = '/'
      
      notFoundHandler(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
    })
  })

  describe('Error Response Format', () => {
    test('should always return JSON format', () => {
      const error = new SpectralError('Test error')
      error.statusCode = 400
      
      errorHandler(error, req, res, next)

      expect(res.json).toHaveBeenCalled()
      expect(res.send).not.toHaveBeenCalled()
    })

    test('should include error code in response', () => {
      const error = new ValidationError('Invalid data')
      
      errorHandler(error, req, res, next)

      expect(res.json).toHaveBeenCalled()
      const call = res.json.mock.calls[0][0]
      expect(call.error.code).toBeDefined()
    })

    test('should include error message in response', () => {
      const error = new SpectralError('Test message')
      error.statusCode = 400
      
      errorHandler(error, req, res, next)

      expect(res.json).toHaveBeenCalled()
      const call = res.json.mock.calls[0][0]
      expect(call.error.message).toBe('Test message')
    })
  })

  describe('Spooky Error Messages', () => {
    test('should use spooky language for 404 errors', () => {
      req.path = '/api/missing'
      
      notFoundHandler(req, res)

      const call = res.json.mock.calls[0][0]
      expect(call.error.message).toContain('void')
      expect(call.error.code).toBe('NOT_FOUND')
    })

    test('should maintain Halloween theme in error responses', () => {
      req.path = '/api/test'
      
      notFoundHandler(req, res)

      const call = res.json.mock.calls[0][0]
      expect(call.error.message).toMatch(/void|nothing|path/i)
    })
  })
})
