import { daysSince } from './dateFormatter'

/**
 * Calculate health score for a file
 * @param {Object} file - File metadata
 * @returns {number} Health score 0-100
 */
export function calculateHealthScore(file) {
  if (!file) return 0
  
  const { firstCommit, lastModified, commitCount, linesOfCode } = file
  
  // Recency score (0-50)
  const daysSinceModified = daysSince(lastModified)
  let recencyScore = 50
  
  if (daysSinceModified < 7) recencyScore = 50
  else if (daysSinceModified < 30) recencyScore = 40
  else if (daysSinceModified < 90) recencyScore = 30
  else if (daysSinceModified < 180) recencyScore = 20
  else recencyScore = 10
  
  // Frequency score (0-30)
  const totalDays = daysSince(firstCommit) || 1
  const commitFrequency = commitCount / totalDays
  let frequencyScore = 0
  
  if (commitFrequency > 0.1) frequencyScore = 30
  else if (commitFrequency > 0.05) frequencyScore = 25
  else if (commitFrequency > 0.01) frequencyScore = 20
  else frequencyScore = 10
  
  // Size score (0-20) - moderate size is healthy
  let sizeScore = 20
  if (linesOfCode > 500) sizeScore = 10
  if (linesOfCode > 1000) sizeScore = 5
  if (linesOfCode < 10) sizeScore = 10
  
  const totalScore = recencyScore + frequencyScore + sizeScore
  return Math.min(100, Math.max(0, totalScore))
}

/**
 * Get health status
 * @param {number} healthScore - Health score 0-100
 * @returns {string} Status: 'healthy', 'stale', or 'dead'
 */
export function getHealthStatus(healthScore) {
  if (healthScore >= 70) return 'healthy'
  if (healthScore >= 40) return 'stale'
  return 'dead'
}

/**
 * Get health color
 * @param {number} healthScore - Health score 0-100
 * @returns {string} Tailwind color class
 */
export function getHealthColor(healthScore) {
  const status = getHealthStatus(healthScore)
  
  const colors = {
    healthy: 'text-health-healthy',
    stale: 'text-health-stale',
    dead: 'text-health-dead',
  }
  
  return colors[status]
}

/**
 * Determine if code is dead
 * @param {Object} file - File metadata
 * @returns {boolean} Is dead code
 */
export function isDeadCode(file) {
  if (!file || !file.lastModified) return false
  const days = daysSince(file.lastModified)
  return days > 180 // No activity in 6 months
}
