import React, { createContext, useContext, useReducer, useCallback } from 'react'

// Define initial state
const initialState = {
  repository: null,
  files: [],
  selectedFile: null,
  isAnalyzing: false,
  error: null,
  theme: 'dark',
  soundEnabled: true,
  cemeteryLayout: 'force-directed',
  filters: {
    showDeadCode: true,
    showHealthyCode: true,
    showStaleCode: true,
    fileTypes: [],
  },
}

// Define action types
const ActionTypes = {
  SET_REPOSITORY: 'SET_REPOSITORY',
  SET_FILES: 'SET_FILES',
  SELECT_FILE: 'SELECT_FILE',
  SET_ANALYZING: 'SET_ANALYZING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  TOGGLE_SOUND: 'TOGGLE_SOUND',
  SET_CEMETERY_LAYOUT: 'SET_CEMETERY_LAYOUT',
  UPDATE_FILTERS: 'UPDATE_FILTERS',
  RESET_STATE: 'RESET_STATE',
}

// Reducer function
function spectralReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_REPOSITORY:
      return { ...state, repository: action.payload }
    case ActionTypes.SET_FILES:
      return { ...state, files: action.payload }
    case ActionTypes.SELECT_FILE:
      return { ...state, selectedFile: action.payload }
    case ActionTypes.SET_ANALYZING:
      return { ...state, isAnalyzing: action.payload }
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isAnalyzing: false }
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null }
    case ActionTypes.TOGGLE_SOUND:
      return { ...state, soundEnabled: !state.soundEnabled }
    case ActionTypes.SET_CEMETERY_LAYOUT:
      return { ...state, cemeteryLayout: action.payload }
    case ActionTypes.UPDATE_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } }
    case ActionTypes.RESET_STATE:
      return initialState
    default:
      return state
  }
}

// Create context
const SpectralContext = createContext(undefined)

// Provider component
export function SpectralProvider({ children }) {
  const [state, dispatch] = useReducer(spectralReducer, initialState)

  // Action creators
  const setRepository = useCallback((repository) => {
    dispatch({ type: ActionTypes.SET_REPOSITORY, payload: repository })
  }, [])

  const setFiles = useCallback((files) => {
    dispatch({ type: ActionTypes.SET_FILES, payload: files })
  }, [])

  const selectFile = useCallback((file) => {
    dispatch({ type: ActionTypes.SELECT_FILE, payload: file })
  }, [])

  const setAnalyzing = useCallback((isAnalyzing) => {
    dispatch({ type: ActionTypes.SET_ANALYZING, payload: isAnalyzing })
  }, [])

  const setError = useCallback((error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error })
  }, [])

  const clearError = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_ERROR })
  }, [])

  const toggleSound = useCallback(() => {
    dispatch({ type: ActionTypes.TOGGLE_SOUND })
  }, [])

  const setCemeteryLayout = useCallback((layout) => {
    dispatch({ type: ActionTypes.SET_CEMETERY_LAYOUT, payload: layout })
  }, [])

  const updateFilters = useCallback((filters) => {
    dispatch({ type: ActionTypes.UPDATE_FILTERS, payload: filters })
  }, [])

  const resetState = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_STATE })
  }, [])

  const value = {
    state,
    actions: {
      setRepository,
      setFiles,
      selectFile,
      setAnalyzing,
      setError,
      clearError,
      toggleSound,
      setCemeteryLayout,
      updateFilters,
      resetState,
    },
  }

  return (
    <SpectralContext.Provider value={value}>
      {children}
    </SpectralContext.Provider>
  )
}

// Custom hook to use context
export function useSpectral() {
  const context = useContext(SpectralContext)
  if (context === undefined) {
    throw new Error('useSpectral must be used within a SpectralProvider')
  }
  return context
}
