import React from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

/**
 * Inline loading spinner
 */
function LoadingSpinner({ size = 'md', message = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className={`loading-spinner ${sizes[size]}`}></div>
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-accent-bone/80 text-sm"
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  message: PropTypes.string,
}

export default LoadingSpinner
