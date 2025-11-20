# 🎃 SPECTRAL Backend Tests

## Overview

This directory contains the test suite for the SPECTRAL backend API. Tests are written using Jest and follow best practices for Node.js testing.

## Test Structure

```
tests/
├── setup.js                    # Global test configuration
├── README.md                   # This file
├── utils/
│   └── helpers.test.js        # Utility function tests
├── services/
│   └── CacheService.test.js   # Service layer tests
└── middleware/
    └── errorHandler.test.js   # Middleware tests
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm test -- --coverage
```

### Run specific test file
```bash
npm test -- tests/services/CacheService.test.js
```

### Run tests matching pattern
```bash
npm test -- --testNamePattern="CacheService"
```

## Test Configuration

### Jest Configuration
- **File:** `jest.config.js`
- **Test Environment:** Node.js
- **Module System:** ES Modules
- **Timeout:** 30 seconds (for Git operations)
- **Coverage Threshold:** 50% (adjustable)

### Environment Variables
- **File:** `.env.test`
- **Purpose:** Test-specific configuration
- **Note:** Automatically loaded by setup.js

## Global Test Utilities

The `setup.js` file provides global utilities accessible in all tests:

### Mock Data Creators

```javascript
// Create mock repository data
const mockData = global.testUtils.createMockRepositoryData()

// Create mock Express request
const req = global.testUtils.createMockRequest({
  body: { test: 'data' },
  params: { id: '123' }
})

// Create mock Express response
const res = global.testUtils.createMockResponse()

// Create mock next function
const next = global.testUtils.createMockNext()
```

### Helper Functions

```javascript
// Wait for async operations
await global.testUtils.wait(1000) // Wait 1 second

// Generate random string
const str = global.testUtils.randomString(10)

// Generate mock GitHub URL
const url = global.testUtils.mockGitHubUrl('user', 'repo')
```

## Writing Tests

### Basic Test Structure

```javascript
import { describe, test, expect, beforeEach } from '@jest/globals'

describe('Feature Name', () => {
  let service

  beforeEach(() => {
    // Setup before each test
    service = new MyService()
  })

  describe('method name', () => {
    test('should do something', () => {
      const result = service.method()
      expect(result).toBe(expected)
    })

    test('should handle errors', () => {
      expect(() => {
        service.methodThatThrows()
      }).toThrow()
    })
  })
})
```

### Testing Async Code

```javascript
test('should handle async operations', async () => {
  const result = await service.asyncMethod()
  expect(result).toBeDefined()
})

test('should handle async errors', async () => {
  await expect(service.failingAsync()).rejects.toThrow()
})
```

### Testing Express Middleware

```javascript
test('should handle request', () => {
  const req = global.testUtils.createMockRequest()
  const res = global.testUtils.createMockResponse()
  const next = global.testUtils.createMockNext()

  middleware(req, res, next)

  expect(res.status).toHaveBeenCalledWith(200)
  expect(res.json).toHaveBeenCalled()
})
```

### Testing with Mocks

```javascript
import { jest } from '@jest/globals'

test('should use mocked function', () => {
  const mockFn = jest.fn().mockReturnValue('mocked')
  
  const result = mockFn()
  
  expect(mockFn).toHaveBeenCalled()
  expect(result).toBe('mocked')
})
```

## Test Coverage

### Current Coverage Targets
- **Branches:** 50%
- **Functions:** 50%
- **Lines:** 50%
- **Statements:** 50%

### View Coverage Report
After running tests with coverage:
```bash
npm test -- --coverage
```

Open the HTML report:
```bash
open coverage/lcov-report/index.html
```

## Mocked Services

The following services are mocked by default in `setup.js`:

### AIAnalyzer
- Returns mock AI insights
- No actual API calls made
- Consistent test data

To use real AIAnalyzer in a test:
```javascript
jest.unmock('../src/services/AIAnalyzer.js')
```

## Best Practices

### 1. Test Isolation
- Each test should be independent
- Use `beforeEach` for setup
- Clean up in `afterEach` if needed

### 2. Descriptive Names
```javascript
// Good
test('should return 404 when repository not found', () => {})

// Bad
test('test1', () => {})
```

### 3. Arrange-Act-Assert Pattern
```javascript
test('should calculate total', () => {
  // Arrange
  const service = new CalculatorService()
  
  // Act
  const result = service.add(2, 3)
  
  // Assert
  expect(result).toBe(5)
})
```

### 4. Test Edge Cases
- Empty inputs
- Null/undefined values
- Large datasets
- Error conditions

### 5. Keep Tests Fast
- Mock external services
- Use small test data
- Avoid unnecessary waits

## Debugging Tests

### Run single test with verbose output
```bash
npm test -- --verbose tests/services/CacheService.test.js
```

### Debug with Node inspector
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Add debug logs
```javascript
test('debug example', () => {
  console.error('This will show in test output')
  // console.log is mocked, use console.error for debugging
})
```

## Common Issues

### Issue: ES Module errors
**Solution:** Ensure `"type": "module"` in package.json

### Issue: Timeout errors
**Solution:** Increase timeout in jest.config.js or specific test:
```javascript
test('long operation', async () => {
  // test code
}, 60000) // 60 second timeout
```

### Issue: Mock not working
**Solution:** Check mock path is correct and use jest.mock() before imports

### Issue: Tests pass locally but fail in CI
**Solution:** Check environment variables and file paths

## Adding New Tests

1. Create test file in appropriate directory
2. Follow naming convention: `*.test.js`
3. Import test utilities from `@jest/globals`
4. Use global test utilities from `setup.js`
5. Write descriptive test names
6. Run tests to verify they pass
7. Check coverage impact

## Test Categories

### Unit Tests
- Test individual functions/methods
- Mock all dependencies
- Fast execution
- High coverage

### Integration Tests
- Test multiple components together
- Minimal mocking
- Test real interactions
- Slower execution

### Example Test Files
- `utils/helpers.test.js` - Unit tests for utilities
- `services/CacheService.test.js` - Service unit tests
- `middleware/errorHandler.test.js` - Middleware tests

## Future Improvements

- [ ] Add integration tests for API endpoints
- [ ] Add tests for GitAnalyzer service
- [ ] Add tests for controllers
- [ ] Increase coverage to 70%+
- [ ] Add E2E tests with Supertest
- [ ] Add performance tests
- [ ] Add security tests

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Node.js Testing Guide](https://nodejs.org/en/docs/guides/testing/)

---

**Happy Testing! 🎃👻**
