/**
 * Sound Service - Manages spooky sound effects
 */
class SoundService {
  constructor() {
    console.log('[SOUND] Initializing sound service...')
    
    this.sounds = {
      hover: new Audio('/assets/sounds/whoosh.mp3'),
      click: new Audio('/assets/sounds/ding.mp3'),
      error: new Audio('/assets/sounds/bell.mp3'),
      success: new Audio('/assets/sounds/spell.mp3'),
    }

    // Set volumes
    this.sounds.hover.volume = 0.3
    this.sounds.click.volume = 0.4
    this.sounds.error.volume = 0.5
    this.sounds.success.volume = 0.6

    this.enabled = true
    
    console.log('[SOUND] Sound service initialized. Enabled:', this.enabled)
    console.log('[SOUND] Available sounds:', Object.keys(this.sounds))
  }

  /**
   * Play a sound effect
   * @param {string} soundName - Name of sound to play
   */
  play(soundName) {
    if (!this.enabled) {
      console.log('[SOUND] Sound is disabled')
      return
    }
    
    if (!this.sounds[soundName]) {
      console.warn('[SOUND] Sound not found:', soundName)
      return
    }

    const sound = this.sounds[soundName]
    sound.currentTime = 0
    console.log('[SOUND] Playing:', soundName)
    sound.play().catch((err) => {
      console.error('[SOUND] Failed to play sound:', soundName, err)
    })
  }

  /**
   * Enable or disable sounds
   * @param {boolean} enabled - Enable state
   */
  setEnabled(enabled) {
    this.enabled = enabled
  }
}

export default new SoundService()
