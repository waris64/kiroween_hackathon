import React, { useEffect, useRef } from 'react'

/**
 * Ghost particle effect using canvas
 */
function GhostParticles({ isActive = true, color = 'rgba(0, 255, 136, 0.3)', count = 20 }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animationRef = useRef(null)

  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize particles
    class Particle {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = canvas.height + 20
        this.size = Math.random() * 3 + 2
        this.speedY = Math.random() * 0.5 + 0.3
        this.speedX = (Math.random() - 0.5) * 0.3
        this.opacity = Math.random() * 0.5 + 0.3
      }

      update() {
        this.y -= this.speedY
        this.x += this.speedX
        this.opacity -= 0.001

        if (this.y < -20 || this.opacity <= 0) {
          this.reset()
        }
      }

      draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    // Create particles
    particlesRef.current = Array.from({ length: count }, () => new Particle())

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach(particle => {
        particle.update()
        particle.draw()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, color, count])

  if (!isActive) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}

export default GhostParticles
