// AIAnalyzer.js - Uses Google Gemini AI to generate spooky narratives

import { GoogleGenerativeAI } from '@google/generative-ai'
import logger from '../utils/logger.js'

class AIAnalyzer {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      logger.warn('No GEMINI_API_KEY found, will use fallback responses')
      this.client = null
    } else {
      this.client = new GoogleGenerativeAI(apiKey)
      this.model = this.client.getGenerativeModel({ model: 'gemini-pro' })
    }
  }

  /**
   * Generate complete AI insights for repository
   */
  async analyzeRepository(repositoryData) {
    try {
      logger.info('Starting AI analysis for repository')

      const [repositoryStory, fileEpitaphs, hauntedCode, ghostContributors] = await Promise.all([
        this.generateRepositoryStory(repositoryData),
        this.generateFileEpitaphs(repositoryData.files.slice(0, 10)),
        this.identifyHauntedCode(repositoryData.files),
        this.characterizeGhosts(repositoryData.contributors.slice(0, 5))
      ])

      return {
        repositoryStory,
        fileEpitaphs,
        hauntedCode,
        ghostContributors
      }
    } catch (error) {
      logger.error('AI analysis failed:', error)
      // Return fallback data if AI fails
      return this.getFallbackInsights(repositoryData)
    }
  }

  /**
   * Generate a spooky narrative about the repository
   */
  async generateRepositoryStory(repositoryData) {
    if (!this.client) {
      return this.getFallbackInsights(repositoryData).repositoryStory
    }

    const { repository, stats, commits, contributors } = repositoryData

    const topFiles = repositoryData.files
      .sort((a, b) => b.totalCommits - a.totalCommits)
      .slice(0, 5)
      .map(f => f.path)

    const prompt = `You are a spooky storyteller for a Halloween-themed code analysis tool called SPECTRAL.

Analyze this repository's haunted history:
- Repository: ${repository.name}
- Total commits: ${stats.totalCommits}
- Active period: ${stats.oldestCommit} to ${stats.newestCommit}
- Contributors: ${stats.totalContributors}
- Most changed files: ${topFiles.join(', ')}
- Top contributor: ${contributors[0]?.name || 'Unknown'}

Create a spooky, dramatic narrative (3-4 paragraphs) about the haunted history of this codebase. Include:
- Mysterious patterns in the commit history
- Ghostly contributors and their impact
- The most haunted files
- Dramatic moments in the repository's evolution

Make it fun, engaging, and Halloween-themed! Use phrases like "haunted", "spirits", "cursed", "possessed", etc.`

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      logger.error('Gemini API error:', error)
      return this.getFallbackInsights(repositoryData).repositoryStory
    }
  }

  /**
   * Create epitaphs for tombstones
   */
  async generateFileEpitaphs(files) {
    if (files.length === 0) return []
    if (!this.client) {
      return files.map(f => ({
        filePath: f.path,
        epitaph: `Here lies ${f.path}, touched by ${f.contributors.length} ghostly hands, forever changed ${f.totalCommits} times.`,
        spookinessLevel: Math.min(5, Math.ceil(f.churnRate))
      }))
    }

    const fileDescriptions = files.map(f => 
      `- ${f.path}: ${f.totalCommits} commits, churn rate ${f.churnRate}, contributors: ${f.contributors.join(', ')}`
    ).join('\n')

    const prompt = `You are writing epitaphs for a spooky code cemetery visualization.

For each of these files, create a short, dramatic epitaph (1-2 sentences) that tells the story of the file's life and death in the codebase. Make them Halloween-themed and fun!

Files:
${fileDescriptions}

Return ONLY a JSON array with this format:
[
  {
    "filePath": "path/to/file",
    "epitaph": "Here lies...",
    "spookinessLevel": 3
  }
]

Spookiness level 1-5 based on churn rate and activity.`

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      logger.warn('Failed to generate epitaphs, using fallback')
    }

    return files.map(f => ({
      filePath: f.path,
      epitaph: `Here lies ${f.path}, touched by ${f.contributors.length} ghostly hands, forever changed ${f.totalCommits} times.`,
      spookinessLevel: Math.min(5, Math.ceil(f.churnRate))
    }))
  }

  /**
   * Find problematic or frequently changed code
   */
  async identifyHauntedCode(files) {
    // Identify files with high churn rate or many contributors
    const hauntedFiles = files
      .filter(f => f.churnRate > 1 || f.contributors.length > 3)
      .sort((a, b) => b.churnRate - a.churnRate)
      .slice(0, 5)

    return hauntedFiles.map(f => ({
      filePath: f.path,
      reason: f.churnRate > 2 
        ? `Cursed with constant changes (${f.totalCommits} commits)` 
        : `Haunted by ${f.contributors.length} restless spirits`,
      severity: f.churnRate > 3 ? 'high' : 'medium',
      churnRate: f.churnRate,
      contributors: f.contributors.length
    }))
  }

  /**
   * Create spooky personas for contributors
   */
  async characterizeGhosts(contributors) {
    if (contributors.length === 0) return []
    if (!this.client) {
      return contributors.map(c => ({
        name: c.name,
        persona: `A ${c.commits > 50 ? 'prolific' : 'mysterious'} spirit who left ${c.commits} marks upon this codebase`,
        ghostType: c.commits > 50 ? 'phantom' : 'specter',
        lastSeen: c.lastActive,
        commits: c.commits
      }))
    }

    const contributorList = contributors.map(c =>
      `- ${c.name}: ${c.commits} commits, ${c.linesAdded} lines added, last seen ${c.lastActive}`
    ).join('\n')

    const prompt = `You are characterizing contributors as ghosts in a spooky code cemetery.

For each contributor, create a short, fun ghost persona (1 sentence) based on their activity:

Contributors:
${contributorList}

Return ONLY a JSON array:
[
  {
    "name": "Contributor Name",
    "persona": "The Phantom Refactorer, forever optimizing code in the shadows...",
    "ghostType": "phantom"
  }
]

Ghost types: phantom, specter, wraith, poltergeist, banshee`

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const personas = JSON.parse(jsonMatch[0])
        return personas.map((p, i) => ({
          ...p,
          lastSeen: contributors[i]?.lastActive,
          commits: contributors[i]?.commits
        }))
      }
    } catch (error) {
      logger.warn('Failed to generate ghost personas, using fallback')
    }

    return contributors.map(c => ({
      name: c.name,
      persona: `A ${c.commits > 50 ? 'prolific' : 'mysterious'} spirit who left ${c.commits} marks upon this codebase`,
      ghostType: c.commits > 50 ? 'phantom' : 'specter',
      lastSeen: c.lastActive,
      commits: c.commits
    }))
  }

  /**
   * Fallback insights when AI is unavailable
   */
  getFallbackInsights(repositoryData) {
    return {
      repositoryStory: `In the depths of ${repositoryData.repository.name}, ${repositoryData.stats.totalCommits} commits echo through time. ${repositoryData.stats.totalContributors} spirits have left their mark, weaving a tapestry of code that spans from ${new Date(repositoryData.stats.oldestCommit).getFullYear()} to ${new Date(repositoryData.stats.newestCommit).getFullYear()}. The most haunted files bear the scars of countless changes, while ghostly contributors drift through the codebase, their presence felt in every line.`,
      fileEpitaphs: repositoryData.files.slice(0, 10).map(f => ({
        filePath: f.path,
        epitaph: `Here lies ${f.path}, touched by ${f.contributors.length} spirits, changed ${f.totalCommits} times.`,
        spookinessLevel: Math.min(5, Math.ceil(f.churnRate))
      })),
      hauntedCode: this.identifyHauntedCode(repositoryData.files),
      ghostContributors: repositoryData.contributors.slice(0, 5).map(c => ({
        name: c.name,
        persona: `A mysterious spirit with ${c.commits} commits`,
        ghostType: 'specter',
        lastSeen: c.lastActive,
        commits: c.commits
      }))
    }
  }
}

export default AIAnalyzer
