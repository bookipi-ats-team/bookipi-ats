import {
	Briefcase,
	MapPin,
	Calendar,
	Globe,
	Building2,
	DollarSign,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import FilterSelect from './FilterSelect';
import { Input } from '@/components/ui/input';
import { Search, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterSectionProps {
	jobType: string;
	location: string;
	datePosted: string;
	language: string;
	industry: string;
	payRange: string;
	searchQuery: string;
	onSearchQueryChange: (value: string) => void;
	onJobTypeChange: (value: string) => void;
	onLocationChange: (value: string) => void;
	onDatePostedChange: (value: string) => void;
	onLanguageChange: (value: string) => void;
	onIndustryChange: (value: string) => void;
	onPayRangeChange: (value: string) => void;
	className?: string;
	isCard?: boolean;
}

const filterOptions = {
	jobType: [
		{ value: 'all', label: 'All Types' },
		{ value: 'full-time', label: 'Full-time' },
		{ value: 'part-time', label: 'Part-time' },
		{ value: 'contract', label: 'Contract' },
	],
	location: [
		{ value: 'all', label: 'All Locations' },
		{ value: 'remote', label: 'Remote' },
		{ value: 'onsite', label: 'On-site' },
		{ value: 'hybrid', label: 'Hybrid' },
	],
	datePosted: [
		{ value: 'all', label: 'Any Time' },
		{ value: '24h', label: 'Last 24 hours' },
		{ value: '7d', label: 'Last 7 days' },
		{ value: '30d', label: 'Last 30 days' },
	],
	language: [
		{ value: 'all', label: 'All Languages' },
		{ value: 'english', label: 'English' },
		{ value: 'spanish', label: 'Spanish' },
		{ value: 'french', label: 'French' },
	],
	industry: [
		{ value: 'all', label: 'All Industries' },
		{ value: 'technology', label: 'Technology' },
		{ value: 'design', label: 'Design' },
		{ value: 'marketing', label: 'Marketing' },
		{ value: 'data', label: 'Data & Analytics' },
	],
	payRange: [
		{ value: 'all', label: 'All Ranges' },
		{ value: '0-50k', label: '$0 - $50k' },
		{ value: '50k-100k', label: '$50k - $100k' },
		{ value: '100k-150k', label: '$100k - $150k' },
		{ value: '150k+', label: '$150k+' },
	],
};

const FilterSection = ({
	jobType,
	location,
	datePosted,
	language,
	industry,
	payRange,
	searchQuery,
	onSearchQueryChange,
	onJobTypeChange,
	onLocationChange,
	onDatePostedChange,
	onLanguageChange,
	onIndustryChange,
	onPayRangeChange,
	className = '',
	isCard = true,
}: FilterSectionProps) => {
	const content = (
		<>
			{isCard && <h3 className='font-semibold text-lg mb-4'>Filters</h3>}
			<div className='space-y-4'>
				<div className='relative'>
					<Search className='absolute left-3 top-3 h-5 w-5 text-muted-foreground' />
					<Input
						placeholder='Search jobs by title or company...'
						value={searchQuery}
						onChange={(e) => onSearchQueryChange(e.target.value)}
						className='pl-10 transition-all duration-200 focus:shadow-soft'
					/>
				</div>
				<FilterSelect
					label='Job Type'
					icon={<Briefcase className='h-4 w-4' />}
					value={jobType}
					onValueChange={onJobTypeChange}
					placeholder='All Types'
					options={filterOptions.jobType}
				/>
				{/* 
				<FilterSelect
					label='Location'
					icon={<MapPin className='h-4 w-4' />}
					value={location}
					onValueChange={onLocationChange}
					placeholder='All Locations'
					options={filterOptions.location}
				/> */}

				<FilterSelect
					label='Date Posted'
					icon={<Calendar className='h-4 w-4' />}
					value={datePosted}
					onValueChange={onDatePostedChange}
					placeholder='Any Time'
					options={filterOptions.datePosted}
				/>

				{/* <FilterSelect
					label='Language'
					icon={<Globe className='h-4 w-4' />}
					value={language}
					onValueChange={onLanguageChange}
					placeholder='All Languages'
					options={filterOptions.language}
				/>

				<FilterSelect
					label='Industry'
					icon={<Building2 className='h-4 w-4' />}
					value={industry}
					onValueChange={onIndustryChange}
					placeholder='All Industries'
					options={filterOptions.industry}
				/>

				<FilterSelect
					label='Pay Range'
					icon={<DollarSign className='h-4 w-4' />}
					value={payRange}
					onValueChange={onPayRangeChange}
					placeholder='All Ranges'
					options={filterOptions.payRange}
				/> */}

				<Button className='w-full'>
					<Search className='h-4 w-4' />
					Search
				</Button>
			</div>
		</>
	);

	return isCard ? (
		<Card className={`p-4 lg:p-6 ${className}`}>{content}</Card>
	) : (
		<div className={className}>{content}</div>
	);
};

export default FilterSection;
