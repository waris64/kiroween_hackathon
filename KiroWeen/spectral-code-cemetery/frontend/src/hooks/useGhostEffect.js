import { useState, useEffect } from 'react'

/**
 * Hook for ghost fade-in effect
 * @param {number} delay - Delay in ms before appearing
 * @returns {boolean} Is visible
 */
export function useGhostEffect(delay = 0) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return isVisible
}
