/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
export function formatDate(date) {
  if (!date) return 'Unknown'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Calculate days since date
 * @param {Date|string} date - Start date
 * @returns {number} Days elapsed
 */
export function daysSince(date) {
  if (!date) return 0
  const d = new Date(date)
  const now = new Date()
  const diff = now - d
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

/**
 * Format relative time (e.g., "2 days ago")
 * @param {Date|string} date - Date to format
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date) {
  if (!date) return 'Unknown time'
  const days = daysSince(date)
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}

/**
 * Format date range
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {string} Formatted range
 */
export function formatDateRange(startDate, endDate) {
  const start = formatDate(startDate)
  const end = formatDate(endDate)
  return `${start} - ${end}`
}

/**
 * Format date and time to readable string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date and time
 */
export function formatDateTime(date) {
  if (!date) return 'Unknown'
  const d = new Date(date)
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const dateFormatter = {
  formatDate,
  formatDateTime,
  daysSince,
  formatRelativeTime,
  formatDateRange,
}
