import { useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import JobCard from './components/JobCard';
import FilterSection from './components/FilterSection';
import JobListSkeleton from './components/JobListSkeleton';
import Pagination from './components/Pagination';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useJobs } from '@/hooks/useJobs';
import { JobFilters } from '@/types/job';

const JobList = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
	const [filters, setFilters] = useState<JobFilters>({
		searchQuery: '',
		jobType: 'all',
		location: 'all',
		datePosted: 'all',
		language: 'all',
		industry: 'all',
		payRange: 'all',
	});

	// Fetch jobs using TanStack Query
	const { data, isLoading, error } = useJobs(currentPage, filters);

	const handleFiltersChange = (newFilters: JobFilters) => {
		setFilters(newFilters);
		setCurrentPage(1); // Reset to first page when filters change
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		// Scroll to top of results
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<div className='min-h-screen bg-background pb-20 md:pb-0'>
			<Navbar />
			<div className='container mx-auto px-4 py-8'>
				<div className='flex flex-col lg:flex-row gap-8'>
					{/* Filters - Mobile (Top) */}
					<div className='lg:hidden space-y-6'>
						<FilterSection
							onFiltersChange={handleFiltersChange}
							initialFilters={filters}
						/>
					</div>

					{/* Filters - Desktop (Right Column) */}
					<div className='hidden lg:block w-80 space-y-6'>
						<FilterSection
							onFiltersChange={handleFiltersChange}
							initialFilters={filters}
							className='sticky top-8'
						/>
					</div>

					{/* Main Content */}
					<div className='flex-1 space-y-6'>
						{/* Results Header */}
						<div
							className='flex justify-between items-center '
							style={{ animationDelay: '100ms' }}
						>
							<p className='text-muted-foreground'>
								{isLoading ? (
									'Loading jobs...'
								) : error ? (
									'Error loading jobs'
								) : (
									<>
										Found{' '}
										<span className='font-semibold text-foreground'>
											{data?.totalJobs || 0}
										</span>{' '}
										jobs
									</>
								)}
							</p>
							<ToggleGroup
								type='single'
								value={viewMode}
								onValueChange={(value) =>
									value && setViewMode(value as 'card' | 'list')
								}
							>
								<ToggleGroupItem value='card' aria-label='Card view'>
									<LayoutGrid className='h-4 w-4' />
								</ToggleGroupItem>
								<ToggleGroupItem value='list' aria-label='List view'>
									<List className='h-4 w-4' />
								</ToggleGroupItem>
							</ToggleGroup>
						</div>

						{/* Job Listings */}
						{isLoading ? (
							<JobListSkeleton viewMode={viewMode} />
						) : error ? (
							<div className='text-center py-8'>
								<p className='text-muted-foreground'>
									Failed to load jobs. Please try again.
								</p>
							</div>
						) : (
							<div
								className={
									viewMode === 'card' ? 'grid grid-cols-2 gap-4' : 'space-y-3'
								}
							>
								{data?.jobs.map((job, index) => (
									<JobCard
										key={job.id}
										job={job}
										viewMode={viewMode}
										index={index}
									/>
								))}
							</div>
						)}

						{/* Pagination */}
						{data && data.totalPages > 1 && (
							<div className='flex justify-center mt-8'>
								<Pagination
									currentPage={data.currentPage}
									totalPages={data.totalPages}
									hasNextPage={data.hasNextPage}
									hasPreviousPage={data.hasPreviousPage}
									onPageChange={handlePageChange}
								/>
							</div>
						)}
					</div>
				</div>
			</div>

			<BottomNav />
		</div>
	);
};

export default JobList;
