import { useState } from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import JobCard from './components/JobCard';
import FilterSection from './components/FilterSection';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

// Mock data
const mockJobs = [
	{
		id: '1',
		title: 'Senior Software Engineer',
		company: 'Tech Corp',
		location: 'San Francisco, CA',
		type: 'Full-time',
		salary: '$120k - $180k',
		payRange: '$120k - $180k',
		description:
			"We're looking for an experienced software engineer to join our team...",
		posted: '2 days ago',
		datePosted: '2024-10-06',
		language: 'English',
		industry: 'Technology',
		bookmarked: false,
	},
	{
		id: '2',
		title: 'Product Designer',
		company: 'Design Studio',
		location: 'Remote',
		type: 'Full-time',
		salary: '$90k - $130k',
		payRange: '$90k - $130k',
		description:
			'Join our creative team to design beautiful user experiences...',
		posted: '1 week ago',
		datePosted: '2024-10-01',
		language: 'English',
		industry: 'Design',
		bookmarked: true,
	},
	{
		id: '3',
		title: 'Marketing Manager',
		company: 'Growth Co',
		location: 'New York, NY',
		type: 'Full-time',
		salary: '$80k - $120k',
		payRange: '$80k - $120k',
		description: 'Lead our marketing efforts and drive growth...',
		posted: '3 days ago',
		datePosted: '2024-10-05',
		language: 'English',
		industry: 'Marketing',
		bookmarked: false,
	},
	{
		id: '4',
		title: 'Data Analyst',
		company: 'Analytics Inc',
		location: 'Austin, TX',
		type: 'Contract',
		salary: '$70k - $100k',
		payRange: '$70k - $100k',
		description:
			'Analyze data and provide insights to drive business decisions...',
		posted: '5 days ago',
		datePosted: '2024-10-03',
		language: 'English',
		industry: 'Data & Analytics',
		bookmarked: false,
	},
];

const JobList = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [jobType, setJobType] = useState('all');
	const [location, setLocation] = useState('all');
	const [datePosted, setDatePosted] = useState('all');
	const [language, setLanguage] = useState('all');
	const [industry, setIndustry] = useState('all');
	const [payRange, setPayRange] = useState('all');
	const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

	return (
		<div className='min-h-screen bg-background pb-20 md:pb-0'>
			<Navbar />
			<div className='container mx-auto px-4 py-8'>
				<div className='flex flex-col lg:flex-row gap-8'>
					{/* Filters - Mobile (Top) */}
					<div className='lg:hidden space-y-6'>
						<FilterSection
							searchQuery={searchQuery}
							jobType={jobType}
							location={location}
							datePosted={datePosted}
							language={language}
							industry={industry}
							payRange={payRange}
							onSearchQueryChange={setSearchQuery}
							onJobTypeChange={setJobType}
							onLocationChange={setLocation}
							onDatePostedChange={setDatePosted}
							onLanguageChange={setLanguage}
							onIndustryChange={setIndustry}
							onPayRangeChange={setPayRange}
						/>
					</div>

					{/* Filters - Desktop (Right Column) */}
					<div className='hidden lg:block w-80 space-y-6'>
						<FilterSection
							searchQuery={searchQuery}
							jobType={jobType}
							location={location}
							datePosted={datePosted}
							language={language}
							industry={industry}
							payRange={payRange}
							onSearchQueryChange={setSearchQuery}
							onJobTypeChange={setJobType}
							onLocationChange={setLocation}
							onDatePostedChange={setDatePosted}
							onLanguageChange={setLanguage}
							onIndustryChange={setIndustry}
							onPayRangeChange={setPayRange}
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
								Found{' '}
								<span className='font-semibold text-foreground'>
									{mockJobs.length}
								</span>{' '}
								jobs
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
						<div
							className={
								viewMode === 'card' ? 'grid grid-cols-2 gap-4' : 'space-y-3'
							}
						>
							{mockJobs.map((job, index) => (
								<JobCard
									key={job.id}
									job={job}
									viewMode={viewMode}
									index={index}
								/>
							))}
						</div>
					</div>
				</div>
			</div>

			<BottomNav />
		</div>
	);
};

export default JobList;
