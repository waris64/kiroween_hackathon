/**
 * Generate color based on health score
 * @param {number} healthScore - Score 0-100
 * @returns {string} RGB color string
 */
export function healthToColor(healthScore) {
  if (healthScore >= 70) {
    return 'rgb(0, 255, 136)' // Healthy green
  } else if (healthScore >= 40) {
    return 'rgb(255, 170, 0)' // Stale yellow
  } else {
    return 'rgb(255, 0, 102)' // Dead red
  }
}

/**
 * Generate gradient based on health
 * @param {number} healthScore - Score 0-100
 * @returns {string} CSS gradient
 */
export function healthToGradient(healthScore) {
  const color = healthToColor(healthScore)
  return `linear-gradient(135deg, ${color} 0%, rgba(26, 0, 51, 0.8) 100%)`
}

/**
 * Interpolate between two colors
 * @param {string} color1 - Start color (hex)
 * @param {string} color2 - End color (hex)
 * @param {number} factor - Interpolation factor 0-1
 * @returns {string} Interpolated color
 */
export function interpolateColor(color1, color2, factor) {
  const c1 = hexToRgb(color1)
  const c2 = hexToRgb(color2)
  
  const r = Math.round(c1.r + (c2.r - c1.r) * factor)
  const g = Math.round(c1.g + (c2.g - c1.g) * factor)
  const b = Math.round(c1.b + (c2.b - c1.b) * factor)
  
  return `rgb(${r}, ${g}, ${b})`
}

/**
 * Convert hex to RGB
 * @param {string} hex - Hex color
 * @returns {Object} RGB object
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}
