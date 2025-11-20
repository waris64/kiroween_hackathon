/**
 * Generate Component Hook
 * 
 * Automatically generates a new React component with boilerplate code
 * following the project's naming conventions and structure
 */

export default {
  name: 'Generate Component',
  description: 'Generate a new React component with PropTypes and styling',
  
  // Trigger manually via command palette
  trigger: 'manual',
  
  // Action type
  action: 'template',
  
  // Prompt user for component details
  prompts: [
    {
      name: 'componentName',
      type: 'input',
      message: 'Component name (e.g., GhostCard):',
      validate: (input) => {
        if (!input) return 'Component name is required'
        if (!/^[A-Z][a-zA-Z0-9]*$/.test(input)) {
          return 'Component name must be PascalCase (e.g., GhostCard)'
        }
        return true
      },
    },
    {
      name: 'componentType',
      type: 'select',
      message: 'Component type:',
      choices: [
        { title: 'Button', value: 'Buttons' },
        { title: 'Layout', value: 'Layout' },
        { title: 'Effect', value: 'Effects' },
        { title: 'Error', value: 'Error' },
        { title: 'Loading', value: 'Loading' },
        { title: 'Modal', value: 'Modal' },
        { title: 'Other', value: 'Other' },
      ],
    },
    {
      name: 'hasProps',
      type: 'confirm',
      message: 'Add PropTypes?',
      initial: true,
    },
  ],
  
  // Template to generate
  template: `import React from 'react'
{{#if hasProps}}
import PropTypes from 'prop-types'
{{/if}}

/**
 * {{componentName}} Component
 * 
 * TODO: Add component description
 */
function {{componentName}}({ children, className = '', ...props }) {
  return (
    <div className={\`{{componentName.toLowerCase()}} \${className}\`} {...props}>
      {children}
    </div>
  )
}

{{#if hasProps}}
{{componentName}}.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}
{{/if}}

export default {{componentName}}
`,
  
  // Output path
  outputPath: 'frontend/src/components/{{componentType}}/{{componentName}}.jsx',
  
  // Post-generation actions
  postActions: [
    {
      action: 'message',
      message: '✅ Component {{componentName}} created successfully!',
    },
    {
      action: 'open',
      file: 'frontend/src/components/{{componentType}}/{{componentName}}.jsx',
    },
  ],
  
  // Enabled by default
  enabled: true,
}
