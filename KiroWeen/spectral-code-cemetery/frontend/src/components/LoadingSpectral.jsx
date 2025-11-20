import { motion } from 'framer-motion'
import { Ghost, Loader2 } from 'lucide-react'

function LoadingSpectral({ progress = 0, message = 'Summoning the ghosts...' }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cemetery-dark via-purple-950 to-cemetery-dark flex items-center justify-center">
      <div className="text-center">
        {/* Animated Ghost */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <Ghost className="w-24 h-24 mx-auto text-cemetery-green" />
        </motion.div>

        {/* Loading Message */}
        <h2 className="text-2xl font-spooky text-cemetery-purple mb-4">
          {message}
        </h2>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-cemetery-dark rounded-full overflow-hidden mx-auto mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-cemetery-purple to-cemetery-green"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Spinning Loader */}
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-mono text-sm">
            {progress > 0 ? `${progress}%` : 'Analyzing...'}
          </span>
        </div>

        {/* Spooky Messages */}
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mt-8 text-gray-500 text-sm font-mono"
        >
          {progress < 30 && '🔮 Cloning the haunted repository...'}
          {progress >= 30 && progress < 60 && '👻 Extracting ghostly commits...'}
          {progress >= 60 && progress < 90 && '🪦 Analyzing tombstone files...'}
          {progress >= 90 && '✨ Summoning AI spirits...'}
        </motion.p>
      </div>
    </div>
  )
}

export default LoadingSpectral
