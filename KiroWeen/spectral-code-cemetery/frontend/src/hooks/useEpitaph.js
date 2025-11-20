import { useMutation } from '@tanstack/react-query'
import aiService from '@/services/aiService'

/**
 * Hook for generating epitaphs
 */
export function useEpitaph() {
  const generateEpitaph = useMutation({
    mutationFn: ({ file, commits }) => aiService.generateEpitaph(file, commits),
  })

  return {
    generateEpitaph: generateEpitaph.mutate,
    isGenerating: generateEpitaph.isPending,
    epitaph: generateEpitaph.data,
    error: generateEpitaph.error,
  }
}
