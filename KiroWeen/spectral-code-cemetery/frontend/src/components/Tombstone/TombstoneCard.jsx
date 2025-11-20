import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Code, GitCommit } from 'lucide-react'
import { getHealthColor } from '../../utils/healthCalculator'
import { getFileName } from '../../utils/fileHelpers'

/**
 * Tombstone card component
 */
function TombstoneCard({ file, epitaph, onClick }) {
  const [showEpitaph, setShowEpitaph] = useState(false)
  
  const healthColor = getHealthColor(file.healthScore || 0)
  const fileName = getFileName(file.path)

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      onMouseEnter={() => setShowEpitaph(true)}
      onMouseLeave={() => setShowEpitaph(false)}
      className="tombstone-card cursor-pointer relative p-4 h-48 flex flex-col justify-between"
    >
      {/* Health indicator */}
      <div className="absolute top-2 right-2">
        <div
          className={`w-3 h-3 rounded-full ${healthColor.replace('text-', 'bg-')}`}
          title={`Health: ${file.healthScore || 0}/100`}
        />
      </div>

      {/* File name */}
      <div className="flex-1 flex items-center justify-center">
        <h3 className="text-accent-bone font-semibold text-center break-words line-clamp-2">
          {fileName}
        </h3>
      </div>

      {/* Stats */}
      <div className="space-y-2 text-sm text-accent-bone/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Code className="w-4 h-4" />
            <span>{file.linesOfCode || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <GitCommit className="w-4 h-4" />
            <span>{file.commitCount || 0}</span>
          </div>
        </div>
      </div>

      {/* Epitaph overlay */}
      {showEpitaph && epitaph && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-primary-900/95 rounded-lg p-4 flex items-center justify-center"
        >
          <p className="text-accent-bone text-sm italic text-center font-epitaph">
            "{epitaph}"
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default TombstoneCard
