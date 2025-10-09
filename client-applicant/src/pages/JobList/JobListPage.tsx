import { useState } from 'react';
import { LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import JobCard from './components/JobCard';
import FilterSection from './components/FilterSection';
import JobListSkeleton from './components/JobListSkeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useJobs } from '@/hooks/query/useJobs';
import { JobFilters } from '@/types/job.type';
import { Button } from '@/components/ui/button';

const JobList = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
	const [filters, setFilters] = useState<JobFilters>({});

	// Fetch jobs using TanStack Query
	const { data, isLoading, error } = useJobs(filters);

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
							className='flex justify-end items-center '
							style={{ animationDelay: '100ms' }}
						>
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
								{data?.items.map((job, index) => (
									<JobCard
										key={job._id}
										job={job}
										viewMode={viewMode}
										index={index}
									/>
								))}
							</div>
						)}

						{!isLoading && !data?.items?.length && (
							<div className='flex justify-center mt-8 text-base text-gray-600'>
								No jobs found
							</div>
						)}

						{!isLoading && !!data?.items?.length && (
							<div className='flex justify-center mt-8'>
								<div className='flex items-center justify-center space-x-2'>
									{data.previousCursor && (
										<Button
											variant='outline'
											size='sm'
											onClick={() =>
												setFilters((prev) => ({
													...prev,
													cursor: data.previousCursor,
												}))
											}
											disabled={isLoading || !data.previousCursor}
											className='flex items-center gap-1'
										>
											<ChevronLeft className='h-4 w-4' />
											Previous
										</Button>
									)}

									{data.nextCursor && (
										<Button
											variant='outline'
											size='sm'
											onClick={() =>
												setFilters((prev) => ({
													...prev,
													cursor: data.nextCursor,
												}))
											}
											disabled={isLoading || !data.nextCursor}
											className='flex items-center gap-1'
										>
											Next
											<ChevronRight className='h-4 w-4' />
										</Button>
									)}
								</div>
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
