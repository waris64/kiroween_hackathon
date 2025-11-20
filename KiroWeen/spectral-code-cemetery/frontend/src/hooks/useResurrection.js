import { useMutation } from '@tanstack/react-query'
import aiService from '../services/aiService'

/**
 * Hook for code resurrection feature
 */
export function useResurrection() {
  const mutation = useMutation({
    mutationFn: ({ filePath, originalCode, level }) =>
      aiService.resurrectCode(originalCode, level, filePath),
  })

  return {
    resurrect: mutation.mutate,
    isResurrecting: mutation.isPending,
    resurrectedCode: mutation.data,
    error: mutation.error,
    reset: mutation.reset,
  }
}
