/**
 * Auto-Commit Hook
 * 
 * Automatically commits changes when specific files are saved
 * Useful for keeping track of incremental changes during development
 */

export default {
  name: 'Auto Commit',
  description: 'Automatically commit changes to important files',
  
  // Trigger on file save
  trigger: 'onSave',
  
  // Only trigger for these file patterns
  filePattern: [
    '**/*.md',           // Documentation files
    '**/package.json',   // Dependency changes
    '**/.env.example',   // Environment templates
  ],
  
  // Exclude these patterns
  excludePattern: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.git/**',
    '**/.env/**'
  ],
  
  // Action to perform
  action: 'command',
  
  // Command to execute
  command: 'git add ${file} && git commit -m "chore: auto-commit ${fileName}"',
  
  // Confirmation before running
  confirmBeforeRun: true,
  
  // Show notification on completion
  showNotification: true,
  
  // Enabled by default
  enabled: false, // Set to true to enable
  
  // Configuration
  config: {
    commitMessagePrefix: 'chore: auto-commit',
    addToStaging: true,
    pushAfterCommit: false,
  },
}
