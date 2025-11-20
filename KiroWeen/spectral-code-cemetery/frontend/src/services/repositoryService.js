import api from './api'

/**
 * Repository Service - Handles all repository-related API calls
 */
const repositoryService = {
  /**
   * Analyze a Git repository
   * @param {string} repoUrl - Repository URL or local path
   * @returns {Promise<RepositoryData>} Analyzed repository data
   */
  async analyzeRepository(repoUrl) {
    try {
      const response = await api.post('/analyze', { repoUrl })
      return response.data
    } catch (error) {
      console.error('[CEMETERY] Repository analysis failed:', error)
      throw error
    }
  },

  /**
   * Get file history for a specific file
   * @param {string} repoId - Repository ID
   * @param {string} filePath - File path
   * @returns {Promise<FileHistory[]>} File commit history
   */
  async getFileHistory(repoId, filePath) {
    try {
      const encodedPath = encodeURIComponent(filePath)
      const response = await api.get(`/file-history/${repoId}/${encodedPath}`)
      return response.data
    } catch (error) {
      console.error('[TOMB] Failed to fetch file history:', error)
      throw error
    }
  },

  /**
   * Get dead code report
   * @param {string} repoId - Repository ID
   * @returns {Promise<DeadCodeReport>} Dead code analysis
   */
  async getDeadCode(repoId) {
    try {
      const response = await api.get(`/dead-code/${repoId}`)
      return response.data
    } catch (error) {
      console.error('[GHOST] Failed to detect dead code:', error)
      throw error
    }
  },
}

export default repositoryService
