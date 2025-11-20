import React from 'react'
import PropTypes from 'prop-types'
import { useSpookySound } from '../../hooks/useSpookySound'

/**
 * Ghost-themed button component
 */
function GhostButton({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  ...props
}) {
  const { playClick, playHover } = useSpookySound()

  const variants = {
    primary: 'ghost-button',
    secondary: 'bg-primary-600 hover:bg-primary-500 border border-primary-400',
    danger: 'bg-accent-blood/20 hover:bg-accent-blood/30 border border-accent-blood',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const handleClick = (e) => {
    if (!disabled) {
      try {
        playClick()
      } catch (err) {
        console.error('[BUTTON] Click sound failed:', err)
      }
      onClick?.(e)
    }
  }

  const handleMouseEnter = () => {
    if (!disabled) {
      try {
        playHover()
      } catch (err) {
        console.error('[BUTTON] Hover sound failed:', err)
      }
    }
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      disabled={disabled}
      className={`${variants[variant]} ${sizes[size]} inline-flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{children}</span>
    </button>
  )
}

GhostButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  icon: PropTypes.elementType,
  className: PropTypes.string,
}

export default GhostButton
