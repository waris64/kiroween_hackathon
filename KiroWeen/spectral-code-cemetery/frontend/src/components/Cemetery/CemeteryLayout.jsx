import React from 'react'
import { motion } from 'framer-motion'
import TombstoneCard from '../Tombstone/TombstoneCard'

/**
 * Cemetery layout component
 */
function CemeteryLayout({ files, onFileClick, epitaphs = {} }) {
  if (!files || files.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-accent-bone/60 text-xl">
          The cemetery is empty... No files to display
        </p>
      </div>
    )
  }

  return (
    <div className="spooky-card">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
        {files.map((file, index) => (
          <motion.div
            key={file.path}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.05,
              ease: 'easeOut',
            }}
          >
            <TombstoneCard
              file={file}
              epitaph={epitaphs[file.path]}
              onClick={() => onFileClick(file)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default CemeteryLayout
