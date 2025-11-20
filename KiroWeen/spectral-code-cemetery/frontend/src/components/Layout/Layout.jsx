import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import FogEffect from '../Effects/FogEffect'

/**
 * Main layout wrapper component
 */
function Layout() {
  return (
    <div className="min-h-screen w-full bg-primary-900 relative overflow-hidden">
      {/* Fog background effect */}
      <FogEffect />

      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="relative z-10 min-h-screen pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-accent-bone/60 text-sm">
        <p>SPECTRAL - Code Cemetery &copy; 2024</p>
        <p className="mt-1">Built with 💀 for Kiroween Hackathon</p>
      </footer>
    </div>
  )
}

export default Layout
