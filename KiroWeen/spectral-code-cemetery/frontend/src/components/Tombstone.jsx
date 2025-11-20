import { motion } from 'framer-motion'
import { FileCode, Skull } from 'lucide-react'

function Tombstone({ file, epitaph, onClick, index }) {
  const getColorByActivity = (churnRate) => {
    if (churnRate > 3) return 'border-red-500 shadow-red-500/50'
    if (churnRate > 1) return 'border-cemetery-green shadow-cemetery-green/50'
    return 'border-tombstone-gray shadow-gray-500/30'
  }

  const getSizeByCommits = (commits) => {
    if (commits > 50) return 'h-48 w-40'
    if (commits > 20) return 'h-40 w-36'
    return 'h-36 w-32'
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.05, y: -5 }}
      onClick={onClick}
      className={`${getSizeByCommits(file.totalCommits)} ${getColorByActivity(file.churnRate)} 
        bg-gradient-to-b from-gray-700 to-gray-900 rounded-t-full rounded-b-lg 
        border-4 cursor-pointer relative overflow-hidden shadow-lg
        hover:shadow-xl transition-all duration-300`}
    >
      {/* Tombstone Top */}
      <div className="absolute top-4 left-0 right-0 flex justify-center">
        <Skull className="w-8 h-8 text-gray-400" />
      </div>

      {/* File Name */}
      <div className="absolute top-14 left-0 right-0 px-2">
        <div className="flex justify-center mb-2">
          <FileCode className="w-5 h-5 text-cemetery-green" />
        </div>
        <p className="text-xs font-mono text-center text-gray-300 break-all line-clamp-2">
          {file.path.split('/').pop()}
        </p>
      </div>

      {/* Stats */}
      <div className="absolute bottom-4 left-0 right-0 px-2 text-center">
        <p className="text-xs text-gray-400">
          {file.totalCommits} commits
        </p>
        <p className="text-xs text-gray-500">
          {file.contributors.length} spirits
        </p>
      </div>

      {/* Hover Epitaph */}
      {epitaph && (
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/90 p-4 flex items-center justify-center"
        >
          <p className="text-xs text-cemetery-green text-center italic">
            "{epitaph}"
          </p>
        </motion.div>
      )}

      {/* Glow effect for recent changes */}
      {file.churnRate > 2 && (
        <div className="absolute inset-0 bg-cemetery-green/10 animate-pulse" />
      )}
    </motion.div>
  )
}

export default Tombstone
