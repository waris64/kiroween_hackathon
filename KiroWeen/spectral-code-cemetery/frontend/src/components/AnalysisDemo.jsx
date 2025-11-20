import { useState } from 'react'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useAnalyzeRepository, useAnalysisStatus } from '../hooks/useGitAnalysis'

function AnalysisDemo() {
  const [repoUrl, setRepoUrl] = useState('https://github.com/octocat/Hello-World')
  const { analyze, analysisId, isLoading, error } = useAnalyzeRepository()
  const { data: statusData } = useAnalysisStatus(analysisId, !!analysisId)

  const handleAnalyze = (e) => {
    e.preventDefault()
    analyze({ 
      repositoryUrl: repoUrl, 
      branch: 'master',
      options: { maxCommits: 100 }
    })
  }

  return (
    <div className="bg-purple-900/30 backdrop-blur-sm rounded-lg p-6 border-2 border-cemetery-purple">
      <h3 className="text-2xl font-bold mb-4 text-cemetery-green">
        🧪 Test Git Analysis
      </h3>
      
      <form onSubmit={handleAnalyze} className="space-y-4">
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/username/repository"
          className="w-full px-4 py-2 bg-cemetery-dark border border-cemetery-purple rounded text-ghost-white font-mono text-sm"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-cemetery-green hover:bg-green-600 text-cemetery-dark font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Repository'}
        </button>
      </form>

      {/* Status Display */}
      {statusData && (
        <div className="mt-4 p-4 bg-cemetery-dark rounded border border-cemetery-purple">
          <div className="flex items-center gap-2 mb-2">
            {statusData.status === 'processing' && (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-cemetery-green" />
                <span className="text-cemetery-green">Processing...</span>
              </>
            )}
            {statusData.status === 'completed' && (
              <>
                <CheckCircle className="w-5 h-5 text-cemetery-green" />
                <span className="text-cemetery-green">Complete!</span>
              </>
            )}
            {statusData.status === 'failed' && (
              <>
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-500">Failed</span>
              </>
            )}
          </div>

          {statusData.status === 'completed' && statusData.result && (
            <div className="text-sm font-mono space-y-1 text-gray-300">
              <p>📊 Commits: {statusData.result.stats.totalCommits}</p>
              <p>📁 Files: {statusData.result.stats.totalFiles}</p>
              <p>👻 Contributors: {statusData.result.stats.totalContributors}</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-900/30 border border-red-500 rounded text-red-300 text-sm">
          Error: {error.message}
        </div>
      )}
    </div>
  )
}

export default AnalysisDemo
