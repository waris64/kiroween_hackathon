import { useCallback } from 'react'
import { useSpectral } from '../context/SpectralContext'
import soundService from '../services/soundService'

/**
 * Hook for playing spooky sounds
 */
export function useSpookySound() {
  const { state } = useSpectral()

  const playSound = useCallback(
    (soundName) => {
      console.log('[HOOK] playSound called:', soundName, 'soundEnabled:', state.soundEnabled)
      if (state.soundEnabled) {
        soundService.play(soundName)
      } else {
        console.log('[HOOK] Sound is disabled in context')
      }
    },
    [state.soundEnabled]
  )

  const playHover = useCallback(() => playSound('hover'), [playSound])
  const playClick = useCallback(() => playSound('click'), [playSound])
  const playError = useCallback(() => playSound('error'), [playSound])
  const playSuccess = useCallback(() => playSound('success'), [playSound])

  return {
    playSound,
    playHover,
    playClick,
    playError,
    playSuccess,
  }
}
