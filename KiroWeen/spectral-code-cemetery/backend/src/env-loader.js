/**
 * Environment Variable Loader
 * 
 * This file MUST be imported first before any other modules
 * to ensure environment variables are loaded before AIAnalyzer is instantiated
 */

import dotenv from 'dotenv'

// Load environment variables immediately
dotenv.config()

// Log API key status
if (process.env.GEMINI_API_KEY) {
  console.log(`✓ GEMINI_API_KEY loaded (${process.env.GEMINI_API_KEY.substring(0, 10)}...)`)
} else {
  console.warn('✗ GEMINI_API_KEY not found - using fallback responses')
}

export default process.env
