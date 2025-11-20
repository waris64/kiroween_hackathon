import { useEffect, useRef } from 'react'

/**
 * Hook for ghost float animation
 * @param {boolean} isActive - Whether animation is active
 * @returns {React.RefObject} Element ref
 */
export function useHauntedAnimation(isActive = true) {
  const elementRef = useRef(null)

  useEffect(() => {
    if (!isActive || !elementRef.current) return

    const element = elementRef.current
    element.style.animation = 'float 3s ease-in-out infinite'

    return () => {
      if (element) {
        element.style.animation = ''
      }
    }
  }, [isActive])

  return elementRef
}
