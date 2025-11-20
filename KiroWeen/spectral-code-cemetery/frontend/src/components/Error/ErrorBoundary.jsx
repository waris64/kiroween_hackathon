import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Skull, RefreshCw } from 'lucide-react'

/**
 * Error boundary component
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ERROR BOUNDARY]', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-primary-900 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full spooky-card text-center">
            <Skull className="w-24 h-24 text-accent-blood mx-auto mb-6 animate-pulse" />
            
            <h1 className="text-4xl font-creepster text-accent-bone mb-4">
              The Spirits Are Disturbed
            </h1>
            
            <p className="text-lg text-accent-bone/80 mb-6">
              Something wicked happened. The cemetery is temporarily haunted by errors.
            </p>

            {this.state.error && (
              <div className="bg-primary-900/60 rounded-lg p-4 mb-6 text-left">
                <p className="font-code text-sm text-accent-blood break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="ghost-button inline-flex items-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}
