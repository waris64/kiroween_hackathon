/**
 * Generate Tests Hook
 * 
 * Automatically generates test files for components or services
 * with basic test structure and examples
 */

export default {
  name: 'Generate Tests',
  description: 'Generate test file for a component or service',
  
  // Trigger on file creation or manually
  trigger: 'manual',
  
  // Action type
  action: 'template',
  
  // Prompt user for test details
  prompts: [
    {
      name: 'testType',
      type: 'select',
      message: 'What are you testing?',
      choices: [
        { title: 'React Component', value: 'component' },
        { title: 'Service/Utility', value: 'service' },
        { title: 'Hook', value: 'hook' },
        { title: 'API Endpoint', value: 'api' },
      ],
    },
    {
      name: 'fileName',
      type: 'input',
      message: 'File name (without extension):',
      validate: (input) => input ? true : 'File name is required',
    },
    {
      name: 'testFramework',
      type: 'select',
      message: 'Test framework:',
      choices: [
        { title: 'Jest (Backend)', value: 'jest' },
        { title: 'Vitest (Frontend)', value: 'vitest' },
      ],
    },
  ],
  
  // Template for component tests
  componentTemplate: `/**
 * Tests for {{fileName}}
 */

import { describe, test, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import {{fileName}} from '../{{fileName}}'

describe('{{fileName}}', () => {
  test('should render without crashing', () => {
    render(<{{fileName}} />)
    expect(screen.getByRole('...')).toBeInTheDocument()
  })

  test('should handle props correctly', () => {
    const props = {
      // Add test props
    }
    render(<{{fileName}} {...props} />)
    // Add assertions
  })

  test('should handle user interactions', () => {
    render(<{{fileName}} />)
    // Add interaction tests
  })
})
`,
  
  // Template for service tests
  serviceTemplate: `/**
 * Tests for {{fileName}}
 */

import { describe, test, expect, beforeEach } from '@jest/globals'
import {{fileName}} from '../{{fileName}}'

describe('{{fileName}}', () => {
  let service

  beforeEach(() => {
    // Setup before each test
    service = new {{fileName}}()
  })

  test('should initialize correctly', () => {
    expect(service).toBeDefined()
  })

  test('should handle basic operations', () => {
    // Add test cases
  })

  test('should handle error cases', () => {
    // Add error test cases
  })
})
`,
  
  // Output path based on test type
  outputPath: {
    component: 'frontend/src/components/__tests__/{{fileName}}.test.jsx',
    service: 'backend/tests/services/{{fileName}}.test.js',
    hook: 'frontend/src/hooks/__tests__/{{fileName}}.test.js',
    api: 'backend/tests/api/{{fileName}}.test.js',
  },
  
  // Post-generation actions
  postActions: [
    {
      action: 'message',
      message: '✅ Test file created! Remember to add actual test cases.',
    },
    {
      action: 'open',
      file: '{{outputPath}}',
    },
  ],
  
  // Enabled by default
  enabled: true,
}
