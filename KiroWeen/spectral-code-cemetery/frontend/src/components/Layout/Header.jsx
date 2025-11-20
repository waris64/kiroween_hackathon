import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Skull, Volume2, VolumeX } from 'lucide-react'
import { useSpectral } from '../../context/SpectralContext'

/**
 * Application header with navigation
 */
function Header() {
  const location = useLocation()
  const { state, actions } = useSpectral()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/cemetery', label: 'Cemetery' },
  ]

  const isActive = (path) => {
    return (
      location.pathname === path ||
      (path !== '/' && location.pathname.startsWith(path))
    )
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary-800/80 backdrop-blur-md border-b border-primary-600/30">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <Skull className="w-8 h-8 text-secondary-500 group-hover:text-accent-blood transition-colors duration-300" />
            <h1 className="font-creepster text-3xl text-accent-bone group-hover:text-shadow-glow transition-all duration-300">
              SPECTRAL
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-lg font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-secondary-500 text-shadow-ghost'
                    : 'text-accent-bone/80 hover:text-secondary-500'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Sound toggle */}
            <button
              onClick={actions.toggleSound}
              className="p-2 rounded-lg bg-primary-700/60 border border-primary-600 hover:border-secondary-500 transition-all duration-300"
              aria-label={state.soundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
              title={state.soundEnabled ? 'Sound Effects: ON' : 'Sound Effects: OFF'}
            >
              {state.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-secondary-500" />
              ) : (
                <VolumeX className="w-5 h-5 text-accent-bone/60" />
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
