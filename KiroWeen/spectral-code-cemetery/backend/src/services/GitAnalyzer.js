/**
 * GitAnalyzer Service
 * 
 * Analyzes Git repositories and extracts comprehensive metadata including:
 * - Commit history and statistics
 * - File metadata (lines, health scores, dead code detection)
 * - Contributor analysis
 * - Code churn metrics
 * - File history and diffs
 * 
 * Uses simple-git for Git operations and NodeCache for performance optimization.
 * 
 * @module GitAnalyzer
 */

import simpleGit from 'simple-git'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import NodeCache from 'node-cache'
import logger from '../utils/logger.js'
import { RepositoryError, FileNotFoundError, GitOperationError } from '../utils/errors.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * GitAnalyzer Class
 * 
 * Provides comprehensive Git repository analysis with caching
 */
class GitAnalyzer {
  constructor(config = {}) {
    this.config = {
      maxCommits: 1000,
      timeout: 30000,
      cloneTimeout: 600000, // 10 minutes for large repos
      cacheRepositoryTTL: 300, // 5 minutes
      cacheFileHistoryTTL: 600, // 10 minutes
      ...config,
    }
    
    // Initialize cache
    this.repositoryCache = new NodeCache({ stdTTL: this.config.cacheRepositoryTTL })
    this.fileHistoryCache = new NodeCache({ stdTTL: this.config.cacheFileHistoryTTL })
    
    // Configuration
    this.tempDir = process.env.TEMP_CLONE_DIR || path.join(__dirname, '../../../temp/repos')
    this.maxRepoSizeMB = parseInt(process.env.MAX_REPO_SIZE_MB || '500')
  }

  /**
   * Analyzes a Git repository comprehensively
   * 
   * @param {string} repositoryUrl - URL of the Git repository
   * @param {string} branch - Branch to analyze (default: 'main')
   * @param {Object} options - Analysis options
   * @param {number} options.maxCommits - Maximum commits to analyze
   * @returns {Promise<RepositoryData>} Complete repository analysis
   * @throws {RepositoryError} If repository is invalid or inaccessible
   */
  async analyzeRepository(repositoryUrl, branch = 'main', options = {}) {
    // Sanitize URL: remove query parameters and hash fragments
    const cleanUrl = repositoryUrl.split('?')[0].split('#')[0]
    
    const cacheKey = `repo:${cleanUrl}:${branch}`
    
    // Check cache first
    const cached = this.repositoryCache.get(cacheKey)
    if (cached) {
      logger.info('[TOMB] Returning cached repository analysis')
      return cached
    }

    const repoName = this.extractRepoName(cleanUrl)
    const repoPath = path.join(this.tempDir, `${repoName}-${Date.now()}`)

    try {
      logger.info(`[TOMB] Starting analysis of repository: ${cleanUrl}`)

      // Ensure temp directory exists
      await fs.mkdir(this.tempDir, { recursive: true })

      // Clone the repository (use cleaned URL)
      await this.cloneRepository(cleanUrl, repoPath, branch)

      // Validate repository has commits
      const git = simpleGit(repoPath)
      const log = await git.log({ maxCount: 1 })
      
      if (log.total === 0) {
        throw new RepositoryError('Repository is empty - no commits found')
      }

      // Extract all data in parallel
      const [commits, files, contributors] = await Promise.all([
        this.extractCommitHistory(repoPath, options.maxCommits || this.config.maxCommits),
        this.analyzeFiles(repoPath),
        this.identifyContributors(repoPath)
      ])

      const result = {
        repository: {
          url: cleanUrl,
          name: repoName,
          branch,
          analyzedAt: new Date().toISOString()
        },
        commits,
        files,
        contributors,
        stats: {
          totalCommits: commits.length,
          totalFiles: files.length,
          totalContributors: contributors.length,
          oldestCommit: commits[commits.length - 1]?.date,
          newestCommit: commits[0]?.date
        }
      }

      // Cache the result
      this.repositoryCache.set(cacheKey, result)

      logger.info(`[TOMB] Analysis complete for ${repoName}`, {
        commits: commits.length,
        files: files.length,
        contributors: contributors.length
      })

      return result
    } catch (error) {
      logger.error(`[TOMB] Failed to analyze repository: ${error.message}`)
      
      if (error instanceof RepositoryError) {
        throw error
      }
      
      throw new RepositoryError(`Failed to analyze repository: ${error.message}`)
    } finally {
      // Cleanup: remove cloned repository
      await this.cleanup(repoPath)
    }
  }

  /**
   * Gets complete history for a specific file
   * 
   * @param {string} repoPath - Path to the Git repository
   * @param {string} filePath - Path to the file within the repository
   * @returns {Promise<Array<FileHistory>>} Array of commits affecting this file
   * @throws {FileNotFoundError} If file doesn't exist
   * @throws {GitOperationError} If Git operation fails
   */
  async getFileHistory(repoPath, filePath) {
    const cacheKey = `file:${repoPath}:${filePath}`
    
    // Check cache
    const cached = this.fileHistoryCache.get(cacheKey)
    if (cached) {
      logger.info('[TOMB] Returning cached file history')
      return cached
    }

    try {
      // Validate repository path
      await this.#validateRepositoryPath(repoPath)
      
      const git = simpleGit(repoPath)
      
      // Check if file exists
      const fullPath = path.join(repoPath, filePath)
      try {
        await fs.access(fullPath)
      } catch (error) {
        throw new FileNotFoundError(`File not found: ${filePath}`)
      }

      // Get file history
      const log = await git.log({ file: filePath })
      
      const history = await Promise.all(
        log.all.map(async (commit) => {
          try {
            // Get diff for this commit
            const diff = await git.show([commit.hash, '--', filePath])
            
            return {
              hash: commit.hash,
              author: commit.author_name,
              email: commit.author_email,
              date: commit.date,
              message: commit.message,
              diff: diff,
            }
          } catch (error) {
            logger.warn(`[TOMB] Failed to get diff for commit ${commit.hash}`)
            return {
              hash: commit.hash,
              author: commit.author_name,
              email: commit.author_email,
              date: commit.date,
              message: commit.message,
              diff: null,
            }
          }
        })
      )

      // Cache the result
      this.fileHistoryCache.set(cacheKey, history)

      return history
    } catch (error) {
      if (error instanceof FileNotFoundError) {
        throw error
      }
      
      logger.error(`[TOMB] Failed to get file history: ${error.message}`)
      throw new GitOperationError(`Failed to get file history: ${error.message}`)
    }
  }

  /**
   * Detects dead code in the repository
   * 
   * @param {string} repoPath - Path to the Git repository
   * @returns {Promise<DeadCodeReport>} Report of dead/stale code
   * @throws {GitOperationError} If analysis fails
   */
  async detectDeadCode(repoPath) {
    try {
      await this.#validateRepositoryPath(repoPath)
      
      const git = simpleGit(repoPath)
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

      // Get all files
      const allFiles = await git.raw(['ls-files'])
      const fileList = allFiles.trim().split('\n').filter(f => f)

      const deadFiles = []
      const staleFiles = []
      let totalFiles = 0

      for (const filePath of fileList) {
        try {
          const log = await git.log({ file: filePath, maxCount: 10 })
          
          if (log.total === 0) continue
          
          totalFiles++
          const lastCommitDate = new Date(log.latest.date)
          const daysSinceLastCommit = (new Date() - lastCommitDate) / (1000 * 60 * 60 * 24)

          // Dead: No commits in 6 months
          if (lastCommitDate < sixMonthsAgo) {
            deadFiles.push({
              path: filePath,
              lastModified: log.latest.date,
              daysSinceLastCommit: Math.floor(daysSinceLastCommit),
              totalCommits: log.total,
            })
          }
          // Stale: Very low commit frequency (< 0.1 commits per month)
          else if (log.total < 3 && daysSinceLastCommit > 90) {
            staleFiles.push({
              path: filePath,
              lastModified: log.latest.date,
              daysSinceLastCommit: Math.floor(daysSinceLastCommit),
              totalCommits: log.total,
            })
          }
        } catch (error) {
          logger.warn(`[TOMB] Failed to analyze file ${filePath} for dead code`)
        }
      }

      const deadCodePercentage = totalFiles > 0 
        ? ((deadFiles.length / totalFiles) * 100).toFixed(2)
        : 0

      return {
        totalFiles,
        deadFiles,
        staleFiles,
        deadCodePercentage: parseFloat(deadCodePercentage),
        analyzedAt: new Date().toISOString(),
      }
    } catch (error) {
      logger.error(`[TOMB] Failed to detect dead code: ${error.message}`)
      throw new GitOperationError(`Failed to detect dead code: ${error.message}`)
    }
  }

  /**
   * Gets chronological commit timeline
   * 
   * @param {string} repoPath - Path to the Git repository
   * @returns {Promise<Array<Commit>>} Chronological list of commits
   * @throws {GitOperationError} If operation fails
   */
  async getCommitTimeline(repoPath) {
    try {
      await this.#validateRepositoryPath(repoPath)
      
      const git = simpleGit(repoPath)
      const log = await git.log({ maxCount: this.config.maxCommits })

      const timeline = log.all.map(commit => this.#parseCommit(commit))

      return timeline
    } catch (error) {
      logger.error(`[TOMB] Failed to get commit timeline: ${error.message}`)
      throw new GitOperationError(`Failed to get commit timeline: ${error.message}`)
    }
  }

  /**
   * Calculates code churn metrics for a time period
   * 
   * @param {string} repoPath - Path to the Git repository
   * @param {number} days - Number of days to analyze (default: 30)
   * @returns {Promise<ChurnMetrics>} Code churn statistics
   * @throws {GitOperationError} If calculation fails
   */
  async calculateCodeChurn(repoPath, days = 30) {
    try {
      await this.#validateRepositoryPath(repoPath)
      
      const git = simpleGit(repoPath)
      const sinceDate = new Date()
      sinceDate.setDate(sinceDate.getDate() - days)

      // Get commits in time period
      const log = await git.log({
        '--since': sinceDate.toISOString(),
        '--numstat': null,
      })

      let totalAdditions = 0
      let totalDeletions = 0
      const fileChurnMap = new Map()

      for (const commit of log.all) {
        totalAdditions += commit.diff?.insertions || 0
        totalDeletions += commit.diff?.deletions || 0

        // Track per-file churn
        if (commit.diff?.files) {
          commit.diff.files.forEach(file => {
            const current = fileChurnMap.get(file.file) || { additions: 0, deletions: 0, commits: 0 }
            fileChurnMap.set(file.file, {
              additions: current.additions + (file.insertions || 0),
              deletions: current.deletions + (file.deletions || 0),
              commits: current.commits + 1,
            })
          })
        }
      }

      // Calculate churn rate (changes per day)
      const churnRate = days > 0 ? (totalAdditions + totalDeletions) / days : 0

      // Get most frequently changed files
      const mostChangedFiles = Array.from(fileChurnMap.entries())
        .map(([path, stats]) => ({
          path,
          ...stats,
          totalChanges: stats.additions + stats.deletions,
        }))
        .sort((a, b) => b.totalChanges - a.totalChanges)
        .slice(0, 10)

      return {
        period: {
          days,
          startDate: sinceDate.toISOString(),
          endDate: new Date().toISOString(),
        },
        totalCommits: log.total,
        totalAdditions,
        totalDeletions,
        churnRate: parseFloat(churnRate.toFixed(2)),
        mostChangedFiles,
      }
    } catch (error) {
      logger.error(`[TOMB] Failed to calculate code churn: ${error.message}`)
      throw new GitOperationError(`Failed to calculate code churn: ${error.message}`)
    }
  }

  /**
   * Clone repository to temporary directory
   * 
   * @private
   * @param {string} repositoryUrl - Repository URL
   * @param {string} repoPath - Local path to clone to
   * @param {string} branch - Branch to clone
   * @throws {RepositoryError} If cloning fails
   */
  async cloneRepository(repositoryUrl, repoPath, branch) {
    try {
      logger.info(`[TOMB] Cloning repository to ${repoPath}`)
      
      // Configure git with better timeout and buffer settings
      const git = simpleGit({
        timeout: {
          block: this.config.cloneTimeout, // 10 minutes for large repos
        },
        config: [
          'http.postBuffer=524288000',
          'http.lowSpeedLimit=0',
          'http.lowSpeedTime=999999',
          'core.preloadindex=true',
          'core.fscache=true',
          'gc.auto=0',
          'core.longpaths=true', // Enable long paths on Windows
          'core.autocrlf=false'  // Prevent line ending issues
        ]
      })
      
      // Try with specified branch first
      try {
        await git.clone(repositoryUrl, repoPath, [
          '--depth', '50', // Reduced from 100 for faster cloning
          '--branch', branch,
          '--single-branch',
          '--no-tags',
          '--filter=blob:none' // Blobless clone for speed
        ])
        logger.info('[TOMB] Repository cloned successfully')
        return
      } catch (branchError) {
        // If branch not found, try without branch specification (uses default)
        if (branchError.message.includes('not found') || branchError.message.includes('Remote branch')) {
          logger.info(`[TOMB] Branch '${branch}' not found, trying default branch`)
          await git.clone(repositoryUrl, repoPath, [
            '--depth', '50', // Reduced from 100 for faster cloning
            '--single-branch',
            '--no-tags',
            '--filter=blob:none'
          ])
          logger.info('[TOMB] Repository cloned successfully with default branch')
          return
        }
        throw branchError
      }
    } catch (error) {
      logger.error(`[TOMB] Clone error details: ${JSON.stringify({
        message: error.message,
        code: error.code,
        signal: error.signal
      })}`)
      
      if (error.message.includes('not found') && !error.message.includes('Remote branch')) {
        throw new RepositoryError('Repository not found or inaccessible')
      }
      if (error.message.includes('Authentication') || error.message.includes('authentication')) {
        throw new RepositoryError('Private repositories are not supported')
      }
      if (error.message.includes('Empty reply') || error.message.includes('Connection reset')) {
        throw new RepositoryError('Network connection issue - please try again')
      }
      throw new RepositoryError(`Failed to clone repository: ${error.message}`)
    }
  }

  /**
   * Extract commit history from repository
   * 
   * @private
   * @param {string} repoPath - Path to repository
   * @param {number} maxCommits - Maximum commits to extract
   * @returns {Promise<Array<Commit>>} Array of commits
   */
  async extractCommitHistory(repoPath, maxCommits = 1000) {
    try {
      const git = simpleGit(repoPath)
      
      const log = await git.log({
        maxCount: maxCommits,
        '--stat': null
      })

      const commits = log.all.map(commit => this.#parseCommit(commit))

      return commits
    } catch (error) {
      logger.error(`[TOMB] Failed to extract commit history: ${error.message}`)
      throw new RepositoryError('Failed to extract commit history')
    }
  }

  /**
   * Analyze files in the repository
   * 
   * @private
   * @param {string} repoPath - Path to repository
   * @returns {Promise<Array<FileMetadata>>} Array of file metadata
   */
  async analyzeFiles(repoPath) {
    try {
      const git = simpleGit(repoPath)
      
      // Get all files in the repository
      const allFiles = await git.raw(['ls-files'])
      const fileList = allFiles.trim().split('\n').filter(f => f)

      const filesData = await Promise.all(
        fileList.slice(0, 100).map(async (filePath) => {
          try {
            // Get commit count for this file
            const log = await git.log({ file: filePath })
            
            if (log.total === 0) return null

            // Get file stats
            const fullPath = path.join(repoPath, filePath)
            let size = 0
            let linesOfCode = 0
            
            try {
              const stats = await fs.stat(fullPath)
              size = stats.size
              linesOfCode = await this.#countLines(fullPath)
            } catch (e) {
              // File might not exist anymore
            }

            // Extract unique contributors
            const contributors = [...new Set(log.all.map(c => c.author_name))]

            // Calculate metrics
            const firstCommit = new Date(log.all[log.all.length - 1].date)
            const lastCommit = new Date(log.latest.date)
            const churnRate = log.total / Math.max(1, this.#getFileAge(log.all))
            const healthScore = this.#calculateHealthScore(firstCommit, lastCommit, log.total)
            const isDead = this.#isFileDead(lastCommit)

            return {
              path: filePath,
              extension: path.extname(filePath).slice(1) || 'unknown',
              linesOfCode,
              size,
              firstCommit: firstCommit.toISOString(),
              lastModified: lastCommit.toISOString(),
              commitCount: log.total,
              healthScore,
              isDead,
              churnRate: parseFloat(churnRate.toFixed(2)),
              contributors
            }
          } catch (error) {
            logger.warn(`[TOMB] Failed to analyze file ${filePath}: ${error.message}`)
            return null
          }
        })
      )

      return filesData.filter(f => f !== null)
    } catch (error) {
      logger.error(`[TOMB] Failed to analyze files: ${error.message}`)
      throw new RepositoryError('Failed to analyze files')
    }
  }

  /**
   * Identify contributors and their statistics
   * 
   * @private
   * @param {string} repoPath - Path to repository
   * @returns {Promise<Array<Contributor>>} Array of contributors
   */
  async identifyContributors(repoPath) {
    try {
      const git = simpleGit(repoPath)
      
      // Get all commits with author info
      const log = await git.log()
      
      // Group by contributor
      const contributorMap = new Map()

      for (const commit of log.all) {
        const key = commit.author_email
        
        if (!contributorMap.has(key)) {
          contributorMap.set(key, {
            name: commit.author_name,
            email: commit.author_email,
            commits: 0,
            linesAdded: 0,
            linesDeleted: 0,
            firstCommit: commit.date,
            lastActive: commit.date
          })
        }

        const contributor = contributorMap.get(key)
        contributor.commits++
        contributor.linesAdded += commit.diff?.insertions || 0
        contributor.linesDeleted += commit.diff?.deletions || 0
        
        // Update last active (commits are in reverse chronological order)
        if (new Date(commit.date) > new Date(contributor.lastActive)) {
          contributor.lastActive = commit.date
        }
        if (new Date(commit.date) < new Date(contributor.firstCommit)) {
          contributor.firstCommit = commit.date
        }
      }

      // Convert to array and sort by commits
      const contributors = Array.from(contributorMap.values())
        .sort((a, b) => b.commits - a.commits)

      return contributors
    } catch (error) {
      logger.error(`[TOMB] Failed to identify contributors: ${error.message}`)
      throw new RepositoryError('Failed to identify contributors')
    }
  }

  /**
   * Count lines in a file
   * 
   * @private
   * @param {string} filePath - Path to file
   * @returns {Promise<number>} Number of lines
   */
  async #countLines(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      return content.split('\n').length
    } catch (error) {
      return 0
    }
  }

  /**
   * Calculate health score for a file (0-100)
   * 
   * @private
   * @param {Date} firstCommit - Date of first commit
   * @param {Date} lastCommit - Date of last commit
   * @param {number} commitCount - Total commits
   * @returns {number} Health score (0-100)
   */
  #calculateHealthScore(firstCommit, lastCommit, commitCount) {
    const now = new Date()
    const daysSinceLastCommit = (now - lastCommit) / (1000 * 60 * 60 * 24)
    
    // Recency score (0-50): More recent = higher score
    const recencyScore = Math.max(0, 50 - (daysSinceLastCommit / 3.65)) // 50 points for < 6 months
    
    // Activity score (0-50): More commits = higher score
    const activityScore = Math.min(50, commitCount * 2) // 50 points for 25+ commits
    
    return Math.round(Math.max(0, Math.min(100, recencyScore + activityScore)))
  }

  /**
   * Check if file is considered dead (no commits in 6 months)
   * 
   * @private
   * @param {Date} lastCommit - Date of last commit
   * @returns {boolean} True if file is dead
   */
  #isFileDead(lastCommit) {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    return lastCommit < sixMonthsAgo
  }

  /**
   * Parse Git commit to standard format
   * 
   * @private
   * @param {Object} commit - Raw Git commit object
   * @returns {Commit} Parsed commit
   */
  #parseCommit(commit) {
    return {
      hash: commit.hash,
      author: commit.author_name,
      email: commit.author_email,
      date: commit.date,
      message: commit.message,
      filesChanged: commit.diff?.files?.length || 0,
      additions: commit.diff?.insertions || 0,
      deletions: commit.diff?.deletions || 0,
    }
  }

  /**
   * Calculate file age in days
   * 
   * @private
   * @param {Array} commits - Array of commits
   * @returns {number} Age in days
   */
  #getFileAge(commits) {
    if (commits.length === 0) return 1

    const oldest = new Date(commits[commits.length - 1].date)
    const newest = new Date(commits[0].date)
    const ageInDays = Math.max(1, (newest - oldest) / (1000 * 60 * 60 * 24))
    
    return ageInDays
  }

  /**
   * Validate repository path exists and is a Git repository
   * 
   * @private
   * @param {string} repoPath - Path to validate
   * @throws {RepositoryError} If path is invalid
   */
  async #validateRepositoryPath(repoPath) {
    try {
      await fs.access(repoPath)
      await fs.access(path.join(repoPath, '.git'))
    } catch (error) {
      throw new RepositoryError('Invalid repository path or not a Git repository')
    }
  }

  /**
   * Extract repository name from URL
   * 
   * @param {string} url - Repository URL
   * @returns {string} Repository name (sanitized for filesystem)
   */
  extractRepoName(url) {
    // Remove query parameters and hash fragments
    const cleanUrl = url.split('?')[0].split('#')[0]
    
    // Extract repo name
    const match = cleanUrl.match(/\/([^\/]+)\.git$/) || cleanUrl.match(/\/([^\/]+)\/?$/)
    let repoName = match ? match[1] : 'unknown-repo'
    
    // Sanitize for filesystem (remove invalid characters for Windows/Unix)
    repoName = repoName.replace(/[<>:"|?*]/g, '-')
    
    return repoName
  }

  /**
   * Cleanup temporary files
   * 
   * @param {string} repoPath - Path to cleanup
   */
  async cleanup(repoPath) {
    try {
      await fs.rm(repoPath, { recursive: true, force: true })
      logger.info(`[TOMB] Cleaned up temporary directory: ${repoPath}`)
    } catch (error) {
      logger.warn(`[TOMB] Failed to cleanup ${repoPath}: ${error.message}`)
    }
  }
}

export default GitAnalyzer
