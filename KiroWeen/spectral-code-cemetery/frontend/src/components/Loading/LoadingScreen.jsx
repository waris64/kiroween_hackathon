import React from 'react'
import { motion } from 'framer-motion'
import { Skull } from 'lucide-react'
import { getRandomSpookyMessage } from '@/utils/constants'

/**
 * Full-screen loading component
 */
function LoadingScreen() {
  const message = getRandomSpookyMessage('LOADING')

  return (
    <div className="fixed inset-0 bg-primary-900 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated skull */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="inline-block mb-6"
        >
          <Skull className="w-20 h-20 text-secondary-500" />
        </motion.div>

        {/* Loading message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-creepster text-accent-bone text-shadow-glow"
        >
          {message}
        </motion.p>

        {/* Loading spinner */}
        <div className="mt-8 loading-spinner mx-auto"></div>
      </div>
    </div>
  )
}

export default LoadingScreen
