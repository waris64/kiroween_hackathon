import { motion } from 'framer-motion'
import Tombstone from './Tombstone'
import GhostAvatar from './GhostAvatar'
import { Moon, Cloud } from 'lucide-react'

function Cemetery({ data, onTombstoneClick }) {
  const { files, contributors, aiInsights } = data

  // Get epitaphs map
  const epitaphsMap = {}
  if (aiInsights?.fileEpitaphs) {
    aiInsights.fileEpitaphs.forEach(e => {
      epitaphsMap[e.filePath] = e.epitaph
    })
  }

  // Get ghost personas map
  const personasMap = {}
  if (aiInsights?.ghostContributors) {
    aiInsights.ghostContributors.forEach(g => {
      personasMap[g.name] = g.persona
    })
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-cemetery-dark via-purple-950 to-cemetery-dark overflow-hidden">
      {/* Sky Elements */}
      <div className="absolute top-10 right-20 z-10">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Moon className="w-24 h-24 text-yellow-200" />
        </motion.div>
      </div>

      {/* Floating Clouds */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-20 opacity-20"
          initial={{ x: -100 }}
          animate={{ x: '100vw' }}
          transition={{ 
            duration: 30 + i * 10, 
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{ top: `${20 + i * 15}%` }}
        >
          <Cloud className="w-32 h-32 text-gray-400" />
        </motion.div>
      ))}

      {/* Repository Story */}
      {aiInsights?.repositoryStory && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-20 max-w-4xl mx-auto px-4 pt-8 pb-12"
        >
          <div className="bg-purple-900/40 backdrop-blur-sm rounded-lg p-6 border-2 border-cemetery-purple">
            <h2 className="text-2xl font-spooky text-cemetery-green mb-4 text-center">
              📜 The Haunted Tale 📜
            </h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {aiInsights.repositoryStory}
            </p>
          </div>
        </motion.div>
      )}

      {/* Ghosts Section */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 mb-12">
        <h3 className="text-xl font-spooky text-cemetery-purple text-center mb-6">
          👻 Ghostly Contributors 👻
        </h3>
        <div className="flex justify-center gap-8 flex-wrap">
          {contributors.slice(0, 8).map((contributor, index) => (
            <GhostAvatar
              key={contributor.email}
              contributor={contributor}
              persona={personasMap[contributor.name]}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Cemetery Ground */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-20">
        <h3 className="text-xl font-spooky text-cemetery-purple text-center mb-8">
          🪦 The Graveyard 🪦
        </h3>
        
        {/* Tombstones Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 justify-items-center">
          {files.slice(0, 24).map((file, index) => (
            <Tombstone
              key={file.path}
              file={file}
              epitaph={epitaphsMap[file.path]}
              onClick={() => onTombstoneClick(file)}
              index={index}
            />
          ))}
        </div>

        {files.length > 24 && (
          <p className="text-center text-gray-500 mt-8 font-mono text-sm">
            ... and {files.length - 24} more souls rest here ...
          </p>
        )}
      </div>

      {/* Ground Fog Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-900/50 to-transparent pointer-events-none" />
    </div>
  )
}

export default Cemetery
