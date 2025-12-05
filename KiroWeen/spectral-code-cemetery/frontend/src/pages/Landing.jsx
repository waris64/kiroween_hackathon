import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GitBranch, Skull, Code, Clock, Sparkles } from 'lucide-react'
import GhostButton from '../components/Buttons/GhostButton'
import ErrorModal from '../components/Modal/ErrorModal'
import { useSpectralData } from '../hooks/useSpectralData'
import GhostParticles from '../components/Effects/GhostParticles'
import { useSpectral } from '../context/SpectralContext'

/**
 * Landing page
 */
function Landing() {
  const [repoUrl, setRepoUrl] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const { analyzeRepo, isAnalyzingRepo, error } = useSpectralData()
  const { actions } = useSpectral()
  const navigate = useNavigate()

  // Clear state when landing page mounts
  useEffect(() => {
    actions.resetState()
  }, [])

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) return

    try {
      await analyzeRepo(repoUrl)
      navigate('/cemetery')
    } catch (err) {
      console.error('Analysis failed:', err)
      setShowErrorModal(true)
    }
  }

  const features = [
    {
      icon: GitBranch,
      title: 'Repository Analysis',
      description: 'Deep dive into Git history and file evolution',
    },
    {
      icon: Skull,
      title: 'Dead Code Detection',
      description: 'Identify abandoned and obsolete code paths',
    },
    {
      icon: Clock,
      title: 'Time Travel',
      description: 'Navigate through code history visually',
    },
    {
      icon: Sparkles,
      title: 'AI Resurrection',
      description: 'Modernize legacy code with AI assistance',
    },
  ]

  return (
    <div className="min-h-screen relative">
      <GhostParticles isActive={true} />

      <div className="container mx-auto px-6 py-20">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="inline-block mb-6"
          >
            <Skull className="w-24 h-24 text-secondary-500" />
          </motion.div>

          <h1 className="text-7xl font-creepster text-accent-bone mb-6 text-shadow-glow">
            SPECTRAL
          </h1>

          <p className="text-2xl text-accent-bone/80 mb-4">
            Code Cemetery & Time Machine
          </p>

          <p className="text-lg text-accent-bone/60 max-w-2xl mx-auto">
            Explore the haunting evolution of your codebase. Visualize dead code as tombstones,
            travel through time, and resurrect legacy code with AI.
          </p>
        </motion.div>

        {/* Input section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto mb-20"
        >
          <div className="spooky-card">
            <label className="block text-accent-bone mb-3 text-lg">
              Enter Repository URL or Local Path
            </label>

            <form 
              onSubmit={(e) => {
                e.preventDefault()
                if (repoUrl.trim() && !isAnalyzingRepo) {
                  handleAnalyze()
                }
              }}
              className="space-y-4"
            >
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/user/repo or /path/to/repo"
                  className="haunted-input flex-1"
                  disabled={isAnalyzingRepo}
                  autoFocus
                  required
                />

                <GhostButton
                  type="submit"
                  disabled={!repoUrl.trim() || isAnalyzingRepo}
                  icon={Code}
                  size="lg"
                >
                  {isAnalyzingRepo ? 'Analyzing...' : 'Analyze'}
                </GhostButton>
              </div>
            </form>

            <p className="mt-4 text-sm text-accent-bone/60">
              Example: https://github.com/facebook/react
            </p>
          </div>
        </motion.div>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-4xl font-creepster text-center text-accent-bone mb-12">
            Haunting Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="spooky-card text-center"
              >
                <div className="inline-block p-4 rounded-full bg-primary-900/60 mb-4">
                  <feature.icon className="w-8 h-8 text-secondary-500" />
                </div>

                <h3 className="text-xl font-semibold text-accent-bone mb-2">
                  {feature.title}
                </h3>

                <p className="text-accent-bone/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <h2 className="text-4xl font-creepster text-center text-accent-bone mb-12">
            How It Works
          </h2>

          <div className="space-y-8">
            {[
              {
                step: 1,
                title: 'Summon the Repository',
                description: 'Enter a Git repository URL or local path to begin the ritual',
              },
              {
                step: 2,
                title: 'Explore the Cemetery',
                description: 'Visualize your codebase as an interactive graveyard where each file is a tombstone',
              },
              {
                step: 3,
                title: 'Travel Through Time',
                description: 'Navigate commit history to see how your code evolved and died',
              },
              {
                step: 4,
                title: 'Resurrect the Dead',
                description: 'Use AI to modernize and revive legacy code with cutting-edge suggestions',
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                whileHover={{ x: 10 }}
                className="flex items-start space-x-6 spooky-card"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-900 border-2 border-secondary-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-secondary-500">
                    {item.step}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-accent-bone mb-2">
                    {item.title}
                  </h3>
                  <p className="text-accent-bone/70">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        error={error}
        title="Repository Analysis Failed"
      />
    </div>
  )
}

export default Landing
