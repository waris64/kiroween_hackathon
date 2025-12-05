import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, Info } from 'lucide-react'
import PropTypes from 'prop-types'

/**
 * Modal for displaying detailed error messages
 */
function ErrorModal({ isOpen, onClose, error, title = 'Analysis Failed' }) {
  if (!isOpen) return null

  // Parse error to get details
  const getErrorDetails = () => {
    if (typeof error === 'string') {
      return { message: error, details: null }
    }

    if (error?.message) {
      return {
        message: error.message,
        details: error.details || error.originalError?.message || null,
        status: error.status || error.originalError?.response?.status
      }
    }

    return {
      message: 'An unknown error occurred while analyzing the repository',
      details: null
    }
  }

  const { message, details, status } = getErrorDetails()

  // Common error scenarios and solutions
  const getErrorSolution = () => {
    const msg = message.toLowerCase()

    if (msg.includes('not found') || msg.includes('404')) {
      return {
        icon: AlertTriangle,
        title: 'Repository Not Found',
        solutions: [
          'Verify the repository URL is correct',
          'Ensure the repository is public or you have access',
          'Check if the repository exists on GitHub',
        ]
      }
    }

    if (msg.includes('permission') || msg.includes('403') || msg.includes('unauthorized')) {
      return {
        icon: AlertTriangle,
        title: 'Access Denied',
        solutions: [
          'The repository may be private',
          'Check if you have permission to access it',
          'Try a public repository instead',
        ]
      }
    }

    if (msg.includes('timeout') || msg.includes('timed out')) {
      return {
        icon: AlertTriangle,
        title: 'Request Timeout',
        solutions: [
          'The repository may be too large',
          'Try again in a few moments',
          'Check your internet connection',
        ]
      }
    }

    if (msg.includes('clone') || msg.includes('git')) {
      return {
        icon: AlertTriangle,
        title: 'Git Clone Failed',
        solutions: [
          'The repository URL may be invalid',
          'Ensure the repository is accessible',
          'Try using the HTTPS URL format',
        ]
      }
    }

    if (msg.includes('network') || msg.includes('connection')) {
      return {
        icon: AlertTriangle,
        title: 'Network Error',
        solutions: [
          'Check your internet connection',
          'The server may be temporarily unavailable',
          'Try again in a few moments',
        ]
      }
    }

    // Default error
    return {
      icon: Info,
      title: 'Analysis Error',
      solutions: [
        'Verify the repository URL is correct',
        'Try a different repository',
        'Check the console for more details',
      ]
    }
  }

  const errorInfo = getErrorSolution()
  const Icon = errorInfo.icon

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6 md:p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-primary-800 border-2 border-secondary-500 rounded-lg shadow-2xl max-w-2xl w-full my-8 relative"
              >
                <div className="max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-secondary-500/30">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <Icon className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-creepster text-accent-bone">
                      {title}
                    </h2>
                    <p className="text-sm text-accent-bone/60 mt-1">
                      {errorInfo.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-accent-bone/60 hover:text-accent-bone transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Error Message */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-red-400 mb-2">
                    Error Message
                  </h3>
                  <div className="max-h-40 overflow-y-auto">
                    <p className="text-accent-bone/80 text-sm break-words whitespace-pre-wrap">
                      {message}
                    </p>
                  </div>
                  {status && (
                    <p className="text-accent-bone/60 text-xs mt-2">
                      Status Code: {status}
                    </p>
                  )}
                </div>

                {/* Details */}
                {details && (
                  <div className="bg-primary-900/50 border border-secondary-500/20 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-accent-bone mb-2">
                      Technical Details
                    </h3>
                    <div className="max-h-32 overflow-y-auto">
                      <p className="text-accent-bone/70 text-sm font-mono break-words whitespace-pre-wrap">
                        {details}
                      </p>
                    </div>
                  </div>
                )}

                {/* Solutions */}
                <div>
                  <h3 className="text-lg font-semibold text-accent-bone mb-3">
                    Possible Solutions
                  </h3>
                  <ul className="space-y-2">
                    {errorInfo.solutions.map((solution, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-3 text-accent-bone/80"
                      >
                        <span className="text-secondary-500 mt-1">•</span>
                        <span className="text-sm">{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Example */}
                <div className="bg-secondary-500/10 border border-secondary-500/30 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-secondary-400 mb-2">
                    💡 Example Repository URL
                  </h3>
                  <code className="text-accent-bone/80 text-sm">
                    https://github.com/facebook/react
                  </code>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end space-x-3 p-6 border-t border-secondary-500/30">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-secondary-500/20 border border-secondary-500 rounded-lg text-secondary-400 hover:bg-secondary-500/30 transition-colors"
                >
                  Close
                </button>
              </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

ErrorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      message: PropTypes.string,
      details: PropTypes.string,
      status: PropTypes.number,
      originalError: PropTypes.object,
    }),
  ]),
  title: PropTypes.string,
}

export default ErrorModal
