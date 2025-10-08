import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Layout } from './components/Layout';
import { OnboardingPage } from './pages/OnboardingPage';
import { JobsPage } from './pages/JobsPage';
import { NewJobPage } from './pages/NewJobPage';
import { JobSummaryPage } from './pages/JobSummaryPage';
import { PipelinePage } from './pages/PipelinePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/jobs" replace />} />
            <Route path="jobs" element={<JobsPage />} />
            <Route path="jobs/new" element={<NewJobPage />} />
            <Route path="jobs/:jobId" element={<JobSummaryPage />} />
            <Route path="jobs/:jobId/pipeline" element={<PipelinePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
