/**
 * Application constants
 */

export const HEALTH_THRESHOLDS = {
  HEALTHY: 70,
  STALE: 40,
  DEAD: 0,
}

export const DEAD_CODE_DAYS = 180

export const FILE_CATEGORIES = {
  CODE: 'code',
  STYLE: 'style',
  MARKUP: 'markup',
  CONFIG: 'config',
  IMAGE: 'image',
  DOCUMENT: 'document',
  OTHER: 'other',
}

export const CEMETERY_LAYOUTS = {
  FORCE_DIRECTED: 'force-directed',
  TREE: 'tree',
  GRID: 'grid',
}

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  SLOWER: 800,
  SLOWEST: 1200,
}

export const SPOOKY_MESSAGES = {
  LOADING: [
    'Summoning the spirits...',
    'Disturbing the dead code...',
    'Resurrecting ancient commits...',
    'Consulting the cemetery records...',
    'Awakening dormant files...',
  ],
  ERROR: [
    'The spirits are restless. Please try again.',
    'A dark force prevents this action.',
    'The cemetery gates are locked.',
    'The undead code refuses to cooperate.',
    "Something wicked this way comes... and it's an error.",
  ],
  SUCCESS: [
    'The ritual is complete!',
    'The spirits have spoken!',
    'Your code lives again!',
    'The cemetery reveals its secrets!',
    'The resurrection was successful!',
  ],
}

export const EPITAPH_TEMPLATES = [
  'Here lies {fileName}, {description}',
  'In memory of {fileName}, {description}',
  'RIP {fileName}: {description}',
  '{fileName} - {description}',
]

/**
 * Get random spooky message
 * @param {string} type - Message type
 * @returns {string} Random message
 */
export function getRandomSpookyMessage(type = 'LOADING') {
  const messages = SPOOKY_MESSAGES[type] || SPOOKY_MESSAGES.LOADING
  return messages[Math.floor(Math.random() * messages.length)]
}
