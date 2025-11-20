# 🧪 SPECTRAL Backend Testing Guide

## Quick Start

```bash
# Install dependencies (if not already done)
npm install

# Run all tests
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run tests with coverage report
npm test -- --coverage
```

## Test Results

After running tests, you should see output like:

```
🎃 Starting SPECTRAL test suite...

 PASS  tests/utils/helpers.test.js
 PASS  tests/services/CacheService.test.js
 PASS  tests/middleware/errorHandler.test.js

Test Suites: 3 passed, 3 total
Tests:       25 passed, 25 total
Snapshots:   0 total
Time:        2.5s

👻 SPECTRAL test suite complete!
```

## What's Tested

### ✅ Test Setup & Configuration
- Global test utilities
- Mock data generators
- Environment configuration
- Console mocking

### ✅ CacheService
- Set and get operations
- Has and delete operations
- Clear all cache
- TTL (Time To Live) expiration
- Repository analysis caching
- Error handling

### ✅ Error Handler Middleware
- AppError handling
- ValidationError handling
- RepositoryError handling
- Generic error handling
- 404 Not Found handler
- Spooky error messages
- Response format validation

## Test Coverage

Current test files provide coverage for:
- ✅ Utility functions
- ✅ Cache service
- ✅ Error handling middleware
- ⏳ Git analyzer (future)
- ⏳ AI analyzer (future)
- ⏳ Controllers (future)
- ⏳ API endpoints (future)

## Running Specific Tests

```bash
# Run only CacheService tests
npm test -- CacheService

# Run only error handler tests
npm test -- errorHandler

# Run tests matching pattern
npm test -- --testNamePattern="should cache"

# Run specific test file
npm test -- tests/services/CacheService.test.js
```

## Debugging Tests

```bash
# Run with verbose output
npm test -- --verbose

# Run in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Show console output (console.error only, log is mocked)
npm test -- --silent=false
```

## Test Structure

```
backend/
├── jest.config.js           # Jest configuration
├── .env.test               # Test environment variables
└── tests/
    ├── setup.js            # Global test setup
    ├── README.md           # Detailed testing docs
    ├── utils/
    │   └── helpers.test.js
    ├── services/
    │   └── CacheService.test.js
    └── middleware/
        └── errorHandler.test.js
```

## Key Features

### 1. Global Test Utilities
Access helpful utilities in any test:

```javascript
// Create mock data
const mockData = global.testUtils.createMockRepositoryData()

// Create mock Express objects
const req = global.testUtils.createMockRequest()
const res = global.testUtils.createMockResponse()
const next = global.testUtils.createMockNext()

// Helper functions
await global.testUtils.wait(1000)
const str = global.testUtils.randomString(10)
const url = global.testUtils.mockGitHubUrl('user', 'repo')
```

### 2. Automatic Mocking
- Console methods mocked (reduces noise)
- AIAnalyzer mocked (no API calls)
- Environment set to 'test'
- Log level set to 'error'

### 3. ES Module Support
- Full ES6+ syntax support
- Import/export statements
- Async/await
- Modern JavaScript features

### 4. Coverage Reporting
```bash
npm test -- --coverage
```

Generates:
- Terminal summary
- HTML report in `coverage/`
- LCOV report for CI/CD

## Writing New Tests

1. Create file: `tests/[category]/[name].test.js`
2. Import test functions:
```javascript
import { describe, test, expect, beforeEach } from '@jest/globals'
```

3. Write tests:
```javascript
describe('Feature', () => {
  test('should do something', () => {
    expect(true).toBe(true)
  })
})
```

4. Run tests:
```bash
npm test
```

## CI/CD Integration

Tests are ready for CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm test

- name: Generate coverage
  run: npm test -- --coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Troubleshooting

### Tests not running?
- Check Node.js version (18+)
- Run `npm install`
- Check jest.config.js exists

### Import errors?
- Verify `"type": "module"` in package.json
- Check file extensions (.js)
- Verify import paths

### Timeout errors?
- Increase timeout in jest.config.js
- Or per-test: `test('name', async () => {}, 60000)`

### Mock not working?
- Check mock path is correct
- Use jest.mock() before imports
- Clear mocks in beforeEach

## Best Practices

✅ **DO:**
- Write descriptive test names
- Test edge cases
- Use beforeEach for setup
- Keep tests independent
- Mock external services
- Test error conditions

❌ **DON'T:**
- Make tests depend on each other
- Use real API keys in tests
- Commit .env.test with secrets
- Skip error case testing
- Write tests without assertions

## Next Steps

To expand test coverage:

1. **Add Controller Tests**
   - Test API endpoints
   - Verify request/response
   - Check error handling

2. **Add Service Tests**
   - GitAnalyzer tests
   - AIAnalyzer tests (with mocks)
   - Integration tests

3. **Add E2E Tests**
   - Use Supertest
   - Test full request flow
   - Verify database operations

4. **Increase Coverage**
   - Target 70%+ coverage
   - Focus on critical paths
   - Test error scenarios

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Supertest for API Testing](https://github.com/visionmedia/supertest)

---

**Tests are ready! Run `npm test` to see them in action.** 🎃✨
