import api from './api'

/**
 * AI Service - Handles all AI-powered features
 */
const aiService = {
  /**
   * Generate epitaph for a file
   * @param {FileMetadata} file - File metadata
   * @param {Commit[]} commits - File commits
   * @returns {Promise<string>} Generated epitaph
   */
  async generateEpitaph(file, commits) {
    try {
      const response = await api.post('/generate-epitaph', { file, commits })
      return response.data.epitaph
    } catch (error) {
      console.error('[GHOST] Epitaph generation failed:', error)
      throw error
    }
  },

  /**
   * Resurrect (modernize) old code
   * @param {string} code - Old code
   * @param {string} level - Modernization level (conservative, moderate, aggressive)
   * @param {string} filePath - File path for context
   * @returns {Promise<ModernizationSuggestion>} Modernization suggestions
   */
  async resurrectCode(code, level = 'moderate', filePath = '') {
    try {
      const response = await api.post('/resurrect', { code, level, filePath })
      return response.data
    } catch (error) {
      console.error('[SPELL] Code resurrection failed:', error)
      throw error
    }
  },
}

export default aiService
