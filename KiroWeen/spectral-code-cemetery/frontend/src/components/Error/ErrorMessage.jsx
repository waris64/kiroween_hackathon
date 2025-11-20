import React from 'react'
import { AlertCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Error message component
 */
function ErrorMessage({ message, onDismiss }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-accent-blood/20 border border-accent-blood rounded-lg p-4 flex items-start space-x-3"
        >
          <AlertCircle className="w-5 h-5 text-accent-blood flex-shrink-0 mt-0.5" />
          <p className="flex-1 text-accent-bone text-sm">{message}</p>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="flex-shrink-0 text-accent-bone/60 hover:text-accent-bone transition-colors"
              aria-label="Dismiss error"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ErrorMessage
