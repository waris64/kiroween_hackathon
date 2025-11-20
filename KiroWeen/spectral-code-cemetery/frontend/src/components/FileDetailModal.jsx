import { motion, AnimatePresence } from 'framer-motion'
import { X, GitCommit, Users, Activity, Calendar } from 'lucide-react'

function FileDetailModal({ file, onClose }) {
  if (!file) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-purple-900 to-cemetery-dark border-2 border-cemetery-purple rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-purple-900/95 backdrop-blur-sm p-6 border-b border-cemetery-purple flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-spooky text-cemetery-green mb-2">
                📜 File History
              </h2>
              <p className="text-sm font-mono text-gray-300 break-all">
                {file.path}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cemetery-dark/50 p-4 rounded-lg border border-cemetery-purple/30">
                <div className="flex items-center gap-2 mb-2">
                  <GitCommit className="w-5 h-5 text-cemetery-green" />
                  <span className="text-sm text-gray-400">Total Commits</span>
                </div>
                <p className="text-2xl font-bold text-cemetery-green">
                  {file.totalCommits}
                </p>
              </div>

              <div className="bg-cemetery-dark/50 p-4 rounded-lg border border-cemetery-purple/30">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-cemetery-purple" />
                  <span className="text-sm text-gray-400">Churn Rate</span>
                </div>
                <p className="text-2xl font-bold text-cemetery-purple">
                  {file.churnRate.toFixed(2)}
                </p>
              </div>

              <div className="bg-cemetery-dark/50 p-4 rounded-lg border border-cemetery-purple/30">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-gray-400">Contributors</span>
                </div>
                <p className="text-2xl font-bold text-blue-400">
                  {file.contributors.length}
                </p>
              </div>

              <div className="bg-cemetery-dark/50 p-4 rounded-lg border border-cemetery-purple/30">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-gray-400">Last Modified</span>
                </div>
                <p className="text-sm font-mono text-yellow-400">
                  {new Date(file.lastModified).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Contributors List */}
            <div>
              <h3 className="text-lg font-bold text-cemetery-purple mb-3">
                👻 Ghostly Contributors
              </h3>
              <div className="space-y-2">
                {file.contributors.map((contributor, index) => (
                  <div
                    key={index}
                    className="bg-cemetery-dark/30 p-3 rounded border border-cemetery-purple/20 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-200">
                        {contributor.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-300 font-mono">
                      {contributor}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* File Type Badge */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">File Type:</span>
              <span className="px-3 py-1 bg-cemetery-purple/30 rounded-full text-sm font-mono text-cemetery-green">
                .{file.type || 'unknown'}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FileDetailModal
