import { motion } from 'framer-motion'
import { Ghost } from 'lucide-react'

function GhostAvatar({ contributor, persona, index }) {
  const getOpacityByActivity = (commits) => {
    if (commits > 100) return 1
    if (commits > 50) return 0.8
    if (commits > 20) return 0.6
    return 0.4
  }

  const getSizeByCommits = (commits) => {
    if (commits > 100) return 'w-16 h-16'
    if (commits > 50) return 'w-14 h-14'
    return 'w-12 h-12'
  }

  const floatAnimation = {
    y: [0, -20, 0],
    x: [0, 10, -10, 0],
    transition: {
      duration: 4 + index,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: getOpacityByActivity(contributor.commits), 
        scale: 1,
        ...floatAnimation
      }}
      whileHover={{ scale: 1.2, opacity: 1 }}
      className="relative group cursor-pointer"
    >
      <div className={`${getSizeByCommits(contributor.commits)} 
        bg-gradient-to-br from-blue-400/30 to-purple-400/30 
        rounded-full flex items-center justify-center
        border-2 border-blue-300/50 shadow-lg shadow-blue-500/50
        backdrop-blur-sm`}
      >
        <Ghost className="w-8 h-8 text-blue-200" />
      </div>

      {/* Hover Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
          bg-purple-900/95 backdrop-blur-sm p-3 rounded-lg border border-cemetery-purple
          min-w-[200px] z-10 pointer-events-none"
      >
        <p className="text-sm font-bold text-cemetery-green mb-1">
          {contributor.name}
        </p>
        {persona && (
          <p className="text-xs text-gray-300 italic mb-2">
            {persona}
          </p>
        )}
        <div className="text-xs text-gray-400 space-y-1">
          <p>👻 {contributor.commits} commits</p>
          <p>➕ {contributor.linesAdded} lines added</p>
          <p>➖ {contributor.linesDeleted} lines deleted</p>
          <p className="text-cemetery-green">
            Last seen: {new Date(contributor.lastActive).toLocaleDateString()}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default GhostAvatar
