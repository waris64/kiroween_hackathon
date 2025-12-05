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
   * Generate epitaph for a single file
   */
  async generateEpitaph(file, commits = []) {
    if (!this.client) {
      return `Here lies ${file.path}, touched by ${file.contributors?.length || 0} ghostly hands, forever changed ${file.totalCommits || 0} times.`
    }

    const prompt = `You are writing an epitaph for a code file in a spooky cemetery visualization.

File: ${file.path}
Commits: ${file.totalCommits || 0}
Contributors: ${file.contributors?.join(', ') || 'Unknown'}
Churn Rate: ${file.churnRate || 0}

Create a short, dramatic epitaph (1-2 sentences) that tells the story of this file's life in the codebase. Make it Halloween-themed and fun!

Return ONLY the epitaph text, nothing else.`

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text().trim()
    } catch (error) {
      logger.warn('Failed to generate epitaph, using fallback')
      return `Here lies ${file.path}, touched by ${file.contributors?.length || 0} ghostly hands, forever changed ${file.totalCommits || 0} times.`
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
   * Suggest code modernization using AI
   */
  async suggestModernization(code, language) {
    if (!this.client) {
      return this.getFallbackModernization(code, language)
    }

    const prompt = `You are a code modernization expert for a Halloween-themed tool called SPECTRAL.

Analyze this ${language} code and modernize it using current best practices:

\`\`\`${language}
${code}
\`\`\`

Provide:
1. Modernized version of the code
2. List of specific changes made
3. Brief explanation of improvements

Return ONLY a JSON object in this exact format:
{
  "modernizedCode": "the modernized code here",
  "changes": ["change 1", "change 2", "change 3"],
  "explanation": "Brief explanation of the modernization"
}

Focus on:
- Modern syntax (ES6+, latest language features)
- Best practices and patterns
- Performance improvements
- Code readability
- Type safety where applicable`

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          modernizedCode: parsed.modernizedCode || code,
          changes: parsed.changes || [],
          explanation: parsed.explanation || 'Code has been modernized with AI assistance.',
          code: parsed.modernizedCode || code,
          summary: parsed.explanation || 'Code has been modernized with AI assistance.'
        }
      }
    } catch (error) {
      logger.error('AI modernization failed:', error)
    }

    return this.getFallbackModernization(code, language)
  }

  /**
   * Fallback modernization when AI is unavailable
   */
  getFallbackModernization(code, language) {
    const changes = []
    let modernized = code

    // Normalize language identifier
    const lang = language.toLowerCase()

    // JavaScript/TypeScript modernization
    if (lang === 'javascript' || lang === 'js' || lang === 'jsx' || lang === 'typescript' || lang === 'ts' || lang === 'tsx') {
      const original = modernized
      
      // var -> const/let
      modernized = modernized.replace(/var\s+/g, 'const ')
      if (modernized !== original) changes.push('Replaced var with const for immutability')
      
      // Function declarations -> arrow functions
      const funcPattern = /function\s+(\w+)\s*\((.*?)\)\s*{/g
      if (funcPattern.test(modernized)) {
        modernized = modernized.replace(funcPattern, 'const $1 = ($2) => {')
        changes.push('Converted function declarations to arrow functions')
      }
      
      // == -> ===
      if (modernized.includes('==') && !modernized.includes('===')) {
        modernized = modernized.replace(/([^=!])={2}([^=])/g, '$1===$2')
        changes.push('Replaced loose equality (==) with strict equality (===)')
      }
      
      // Add 'use strict' if not present
      if (!modernized.includes('use strict')) {
        modernized = `'use strict';\n\n${modernized}`
        changes.push('Added strict mode')
      }
    }
    
    // Python modernization
    else if (lang === 'python' || lang === 'py') {
      const original = modernized
      
      // print statement -> print function
      modernized = modernized.replace(/print\s+([^(])/g, 'print($1)')
      if (modernized !== original) changes.push('Updated print statements to print() function')
      
      // xrange -> range
      if (modernized.includes('xrange')) {
        modernized = modernized.replace(/xrange/g, 'range')
        changes.push('Replaced xrange with range (Python 3)')
      }
      
      // Add type hints suggestion
      if (!modernized.includes(':') || !modernized.includes('->')) {
        changes.push('Consider adding type hints for better code clarity')
      }
    }
    
    // C++ modernization
    else if (lang === 'cpp' || lang === 'c++' || lang === 'cc' || lang === 'cxx' || lang === 'c') {
      const original = modernized
      
      // NULL -> nullptr
      if (modernized.includes('NULL')) {
        modernized = modernized.replace(/\bNULL\b/g, 'nullptr')
        changes.push('Replaced NULL with nullptr (C++11)')
      }
      
      // malloc -> new or smart pointers
      if (modernized.includes('malloc(')) {
        changes.push('Replace malloc() with new or std::make_unique for type safety')
      }
      
      // C-style cast -> C++ cast
      if (modernized.match(/\([A-Za-z_][A-Za-z0-9_]*\s*\*\s*\)/)) {
        changes.push('Replace C-style casts with static_cast or reinterpret_cast')
      }
      
      // Add const for string parameters
      if (modernized.includes('char*') && !modernized.includes('const char*')) {
        modernized = modernized.replace(/char\*\s+(\w+)/g, 'const char* $1')
        changes.push('Added const to char* parameters for safety')
      }
      
      // Suggest std::string over char*
      if (modernized.includes('char*')) {
        changes.push('Consider using std::string instead of char* for better memory management')
      }
      
      // Suggest smart pointers for raw pointers
      if (modernized.includes('*') && (modernized.includes('malloc') || modernized.includes('new '))) {
        changes.push('Consider using std::unique_ptr or std::shared_ptr instead of raw pointers')
      }
      
      // Add auto keyword suggestion
      if (modernized.match(/\b(int|double|float|string|vector|map)\s+\w+\s*=/)) {
        changes.push('Consider using auto for type inference')
      }
      
      // Range-based for loops
      if (modernized.match(/for\s*\(\s*\w+\s+\w+\s*=\s*\d+/)) {
        changes.push('Consider using range-based for loops (for (auto& item : container))')
      }
      
      // Add const correctness
      if (!modernized.includes('const') || modernized.match(/\)\s*{/) && !modernized.includes('const {')) {
        changes.push('Consider adding const correctness for member functions and parameters')
      }
      
      // Suggest constructor initialization list
      if (modernized.includes('->') && modernized.includes('=') && modernized.includes('Person*')) {
        changes.push('Consider using constructor initialization lists instead of assignment')
      }
    }
    
    // Java modernization
    else if (lang === 'java') {
      const original = modernized
      
      // Suggest var for local variables (Java 10+)
      if (modernized.match(/\b(String|Integer|Double|List|Map|Set)\s+\w+\s*=/)) {
        changes.push('Consider using var for local variable type inference (Java 10+)')
      }
      
      // Suggest switch expressions (Java 14+)
      if (modernized.includes('switch')) {
        changes.push('Consider using switch expressions for more concise code (Java 14+)')
      }
      
      // Suggest records (Java 16+)
      if (modernized.includes('class') && modernized.includes('private final')) {
        changes.push('Consider using records for immutable data classes (Java 16+)')
      }
      
      // Suggest text blocks (Java 15+)
      if (modernized.includes('\\n') || modernized.includes('+ "')) {
        changes.push('Consider using text blocks for multi-line strings (Java 15+)')
      }
    }
    

    // Go modernization
    else if (lang === 'go' || lang === 'golang') {
      // Suggest error handling
      if (!modernized.includes('if err != nil')) {
        changes.push('Ensure proper error handling with if err != nil checks')
      }
      
      // Suggest defer for cleanup
      if (modernized.includes('Close()') && !modernized.includes('defer')) {
        changes.push('Consider using defer for resource cleanup')
      }
      
      // Suggest goroutines
      if (modernized.includes('for ') && !modernized.includes('go ')) {
        changes.push('Consider using goroutines for concurrent operations')
      }
    }
    
    // Rust modernization
    else if (lang === 'rust' || lang === 'rs') {
      // Suggest ownership patterns
      changes.push('Ensure proper ownership and borrowing patterns')
      
      // Suggest Result/Option
      if (!modernized.includes('Result') && !modernized.includes('Option')) {
        changes.push('Consider using Result<T, E> and Option<T> for error handling')
      }
      
      // Suggest iterators
      if (modernized.includes('for ') && !modernized.includes('.iter()')) {
        changes.push('Consider using iterator methods (map, filter, collect) for functional style')
      }
    }

    // If no changes were made, add generic suggestions
    if (changes.length === 0) {
      changes.push('Code structure analyzed')
      changes.push('Consider modern language features and best practices')
      changes.push('Review for performance optimizations')
    }

    return {
      modernizedCode: modernized,
      code: modernized,
      changes,
      explanation: `Code has been analyzed and modernized using ${language} best practices. ${changes.length} improvements identified.`,
      summary: `Applied ${changes.length} modernization improvements for ${language}.`
    }
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
