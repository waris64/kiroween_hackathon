/**
 * Input Validators
 * 
 * Security-focused validation functions to prevent injection attacks
 * and ensure data integrity.
 * 
 * @module validators
 */

import path from 'path'
import fs from 'fs/promises'
import { SUPPORTED_LANGUAGES } from '../config/constants.js'
import { SecurityError, ValidationError } from './errors.js'

/**
 * Validate file path to prevent directory traversal
 * @param {string} filePath - File path to validate
 * @throws {SecurityError} If path contains dangerous patterns
 * @returns {boolean} True if valid
 */
export function validatePath(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    throw new ValidationError('File path must be a non-empty string')
  }

  // Check for directory traversal attempts
  const dangerous = ['..', '~', '$', '|', '&', ';', '`', '\n', '\r']
  
  for (const pattern of dangerous) {
    if (filePath.includes(pattern)) {
      throw new SecurityError(`Path contains forbidden pattern: ${pattern}`)
    }
  }

  // Check for absolute paths (should be relative)
  if (path.isAbsolute(filePath)) {
    throw new SecurityError('Absolute paths are not allowed')
  }

  return true
}

/**
 * Validate Git repository URL
 * @param {string} url - Repository URL
 * @throws {ValidationError} If URL is invalid
 * @returns {boolean} True if valid
 */
export function validateRepoUrl(url) {
  if (!url || typeof url !== 'string') {
    throw new ValidationError('Repository URL must be a non-empty string')
  }

  // Supported Git hosting platforms
  const validPatterns = [
    /^https:\/\/github\.com\/[\w-]+\/[\w.-]+$/,
    /^https:\/\/gitlab\.com\/[\w-]+\/[\w.-]+$/,
    /^https:\/\/bitbucket\.org\/[\w-]+\/[\w.-]+$/,
    /^git@github\.com:[\w-]+\/[\w.-]+\.git$/,
    /^git@gitlab\.com:[\w-]+\/[\w.-]+\.git$/
  ]

  const isValid = validPatterns.some(pattern => pattern.test(url))

  if (!isValid) {
    throw new ValidationError(
      'Invalid repository URL. Supported: GitHub, GitLab, Bitbucket (HTTPS or SSH)'
    )
  }

  return true
}

/**
 * Validate programming language
 * @param {string} lang - Language identifier
 * @throws {ValidationError} If language is unsupported
 * @returns {boolean} True if valid
 */
export function validateLanguage(lang) {
  if (!lang || typeof lang !== 'string') {
    throw new ValidationError('Language must be a non-empty string')
  }

  const normalized = lang.toLowerCase().trim()

  if (!SUPPORTED_LANGUAGES.includes(normalized)) {
    throw new ValidationError(
      `Unsupported language: ${lang}. Supported: ${SUPPORTED_LANGUAGES.join(', ')}`
    )
  }

  return true
}

/**
 * Sanitize user input to remove dangerous characters
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input) {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // Remove control characters and dangerous patterns
  return input
    .replace(/[\x00-\x1F\x7F]/g, '') // Control characters
    .replace(/[<>]/g, '') // HTML tags
    .replace(/[`$]/g, '') // Command injection
    .trim()
}

/**
 * Check if path is a valid Git repository
 * @param {string} repoPath - Path to check
 * @returns {Promise<boolean>} True if valid Git repo
 */
export async function isValidGitRepo(repoPath) {
  try {
    const gitDir = path.join(repoPath, '.git')
    const stats = await fs.stat(gitDir)
    return stats.isDirectory()
  } catch {
    return false
  }
}

/**
 * Validate code size
 * @param {string} code - Code to validate
 * @param {number} maxSize - Maximum size in characters
 * @throws {ValidationError} If code is too large
 * @returns {boolean} True if valid
 */
export function validateCodeSize(code, maxSize = 10000) {
  if (!code || typeof code !== 'string') {
    throw new ValidationError('Code must be a non-empty string')
  }

  if (code.length > maxSize) {
    throw new ValidationError(
      `Code is too large (${code.length} chars). Maximum: ${maxSize} chars`
    )
  }

  return true
}

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate branch name
 * @param {string} branch - Branch name
 * @throws {ValidationError} If branch name is invalid
 * @returns {boolean} True if valid
 */
export function validateBranch(branch) {
  if (!branch || typeof branch !== 'string') {
    throw new ValidationError('Branch name must be a non-empty string')
  }

  // Git branch name rules
  const invalidPatterns = [
    /\.\./,  // No consecutive dots
    /^[.-]/,  // Cannot start with dot or dash
    /[~^:?*\[\]\\]/,  // Invalid characters
    /\s/,  // No whitespace
    /@{/,  // No @{
    /\.lock$/  // Cannot end with .lock
  ]

  for (const pattern of invalidPatterns) {
    if (pattern.test(branch)) {
      throw new ValidationError(`Invalid branch name: ${branch}`)
    }
  }

  return true
}

export default {
  validatePath,
  validateRepoUrl,
  validateLanguage,
  sanitizeInput,
  isValidGitRepo,
  validateCodeSize,
  validateEmail,
  validateBranch
}
