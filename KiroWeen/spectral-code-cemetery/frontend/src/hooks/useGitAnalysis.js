import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { analyzeRepository, getAnalysisStatus, getRepositoryData } from '../services/api'

/**
 * Hook for analyzing a Git repository
 */
export const useAnalyzeRepository = () => {
  const [analysisId, setAnalysisId] = useState(null)

  const mutation = useMutation({
    mutationFn: ({ repositoryUrl, branch, options }) => 
      analyzeRepository(repositoryUrl, branch, options),
    onSuccess: (data) => {
      setAnalysisId(data.analysisId)
    }
  })

  return {
    analyze: mutation.mutate,
    analysisId,
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data
  }
}

/**
 * Hook for polling analysis status
 */
export const useAnalysisStatus = (analysisId, enabled = true) => {
  return useQuery({
    queryKey: ['analysisStatus', analysisId],
    queryFn: () => getAnalysisStatus(analysisId),
    enabled: enabled && !!analysisId,
    refetchInterval: (data) => {
      // Stop polling if completed or failed
      if (data?.status === 'completed' || data?.status === 'failed') {
        return false
      }
      return 2000 // Poll every 2 seconds
    }
  })
}

/**
 * Hook for fetching repository data
 */
export const useRepositoryData = (analysisId, enabled = true) => {
  return useQuery({
    queryKey: ['repositoryData', analysisId],
    queryFn: () => getRepositoryData(analysisId),
    enabled: enabled && !!analysisId
  })
}
