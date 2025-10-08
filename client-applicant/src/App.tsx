import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { queryClient } from './lib/query-client';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import JobList from './pages/JobList/JobListPage';
import JobDetail from './pages/JobDetail';
import JobApply from './pages/JobApply/JobApplyPage';
import JobApplySuccess from './pages/JobApplySuccess';
import MyApplications from './pages/MyApplications';
import Login from './pages/Login';
import Profile from './pages/Profile';

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<Toaster />
			<Sonner />
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Index />} />
					<Route path='/jobs' element={<JobList />} />
					<Route path='/jobs/:id' element={<JobDetail />} />
					<Route path='/jobs/:id/apply' element={<JobApply />} />
					<Route path='/jobs/apply/success' element={<JobApplySuccess />} />
					<Route path='/my-applications' element={<MyApplications />} />
					<Route path='/login' element={<Login />} />
					<Route path='/profile' element={<Profile />} />
					{/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
					<Route path='*' element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</TooltipProvider>
	</QueryClientProvider>
);

export default App;
