import React from 'react'

/**
 * Fog background effect component
 */
function FogEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900 via-primary-800 to-primary-900 opacity-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-700/20 via-transparent to-transparent"></div>
    </div>
  )
}

export default FogEffect
