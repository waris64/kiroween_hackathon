import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SpectralProvider } from './context/SpectralContext'
import Layout from './components/Layout/Layout'
import Landing from './pages/Landing'
import Cemetery from './pages/Cemetery'
import TimeTravel from './pages/TimeTravel'
import Resurrection from './pages/Resurrection'
import NotFound from './pages/NotFound'
import ErrorBoundary from './components/Error/ErrorBoundary'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SpectralProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Landing />} />
                <Route path="cemetery" element={<Cemetery />} />
                <Route path="time-travel" element={<TimeTravel />} />
                <Route path="resurrection" element={<Resurrection />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
        </SpectralProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
