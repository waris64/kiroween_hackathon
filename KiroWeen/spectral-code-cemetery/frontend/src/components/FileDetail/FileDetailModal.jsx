import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, GitCommit, Code, Sparkles } from 'lucide-react'
import HauntedModal from '../Modal/HauntedModal'
import GhostButton from '../Buttons/GhostButton'
import { formatDate, daysSince } from '../../utils/dateFormatter'
import { getHealthColor, getHealthStatus } from '../../utils/healthCalculator'

/**
 * File detail modal
 */
function FileDetailModal({ file, isOpen, onClose, epitaph }) {
  const navigate = useNavigate()

  if (!file) return null

  const healthColor = getHealthColor(file.healthScore || 0)
  const healthStatus = getHealthStatus(file.healthScore || 0)
  const daysInactive = daysSince(file.lastModified)

  const handleTimeTravel = () => {
    navigate(`/time-travel/${encodeURIComponent(file.path)}`)
    onClose()
  }

  const handleResurrect = () => {
    navigate(`/resurrection/${encodeURIComponent(file.path)}`)
    onClose()
  }

  return (
    <HauntedModal
      isOpen={isOpen}
      onClose={onClose}
      title={file.path.split('/').pop()}
      size="lg"
    >
      <div className="space-y-6">
        {/* File path */}
        <div>
          <p className="text-sm text-accent-bone/60 mb-1">Full Path</p>
          <p className="text-accent-bone font-code text-sm break-all">
            {file.path}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="spooky-card">
            <div className="flex items-center space-x-2 mb-2">
              <Code className="w-5 h-5 text-secondary-500" />
              <p className="text-sm text-accent-bone/60">Lines of Code</p>
            </div>
            <p className="text-3xl font-bold text-accent-bone">
              {file.linesOfCode || 0}
            </p>
          </div>

          <div className="spooky-card">
            <div className="flex items-center space-x-2 mb-2">
              <GitCommit className="w-5 h-5 text-secondary-500" />
              <p className="text-sm text-accent-bone/60">Total Commits</p>
            </div>
            <p className="text-3xl font-bold text-accent-bone">
              {file.commitCount || 0}
            </p>
          </div>

          <div className="spooky-card">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-secondary-500" />
              <p className="text-sm text-accent-bone/60">First Commit</p>
            </div>
            <p className="text-lg text-accent-bone">
              {formatDate(file.firstCommit)}
            </p>
          </div>

          <div className="spooky-card">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-secondary-500" />
              <p className="text-sm text-accent-bone/60">Last Modified</p>
            </div>
            <p className="text-lg text-accent-bone">
              {formatDate(file.lastModified)}
            </p>
            <p className="text-sm text-accent-bone/60 mt-1">
              {daysInactive} days ago
            </p>
          </div>
        </div>

        {/* Health status */}
        <div className="spooky-card">
          <p className="text-sm text-accent-bone/60 mb-2">Health Status</p>
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-primary-900 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full ${healthColor.replace('text-', 'bg-')} transition-all duration-500`}
                style={{ width: `${file.healthScore || 0}%` }}
              />
            </div>
            <span className={`text-lg font-bold ${healthColor} capitalize`}>
              {healthStatus}
            </span>
          </div>
        </div>

        {/* Epitaph */}
        {epitaph && (
          <div className="spooky-card bg-primary-900/60">
            <p className="text-sm text-accent-bone/60 mb-2">Epitaph</p>
            <p className="text-accent-bone italic font-epitaph text-lg">
              "{epitaph}"
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-4">
          <GhostButton
            onClick={handleTimeTravel}
            icon={Clock}
            className="flex-1"
          >
            Time Travel
          </GhostButton>
          {file.isDead && (
            <GhostButton
              onClick={handleResurrect}
              icon={Sparkles}
              variant="secondary"
              className="flex-1"
            >
              Resurrect Code
            </GhostButton>
          )}
        </div>
      </div>
    </HauntedModal>
  )
}

export default FileDetailModal
