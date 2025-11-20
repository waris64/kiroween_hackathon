import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import repositoryService from '@/services/repositoryService'
import { useSpectral } from '@/context/SpectralContext'

/**
 * Hook for managing repository data
 */
export function useSpectralData() {
  const { state, actions } = useSpectral()
  const queryClient = useQueryClient()

  // Analyze repository mutation
  const analyzeRepo = useMutation({
    mutationFn: (repoUrl) => repositoryService.analyzeRepository(repoUrl),
    onMutate: () => {
      actions.setAnalyzing(true)
      actions.clearError()
    },
    onSuccess: (data) => {
      actions.setRepository(data)
      actions.setFiles(data.files || [])
      actions.setAnalyzing(false)
    },
    onError: (error) => {
      actions.setError(error.message)
      actions.setAnalyzing(false)
    },
  })

  // Get file history query
  const useFileHistory = (repoId, filePath) => {
    return useQuery({
      queryKey: ['fileHistory', repoId, filePath],
      queryFn: () => repositoryService.getFileHistory(repoId, filePath),
      enabled: !!repoId && !!filePath,
      staleTime: 10 * 60 * 1000, // 10 minutes
    })
  }

  // Get dead code query
  const useDeadCode = (repoId) => {
    return useQuery({
      queryKey: ['deadCode', repoId],
      queryFn: () => repositoryService.getDeadCode(repoId),
      enabled: !!repoId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }

  return {
    data: state.repository,
    isLoading: state.isAnalyzing,
    error: state.error,
    repository: state.repository,
    files: state.files,
    isAnalyzing: state.isAnalyzing,
    analyzeRepo: analyzeRepo.mutate,
    isAnalyzingRepo: analyzeRepo.isPending,
    useFileHistory,
    useDeadCode,
    invalidateData: () => queryClient.invalidateQueries(),
  }
}
