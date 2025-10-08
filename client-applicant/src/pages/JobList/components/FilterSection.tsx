import React from 'react';
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
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { filterSchema, FilterFormData } from '@/schemas/filter-schema';
import { JobFilters } from '@/types/job';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form';

interface FilterSectionProps {
	onFiltersChange: (filters: JobFilters) => void;
	initialFilters?: JobFilters;
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
		{ value: 'English', label: 'English' },
		{ value: 'Spanish', label: 'Spanish' },
		{ value: 'French', label: 'French' },
		{ value: 'German', label: 'German' },
		{ value: 'Chinese', label: 'Chinese' },
	],
	industry: [
		{ value: 'all', label: 'All Industries' },
		{ value: 'Technology', label: 'Technology' },
		{ value: 'Healthcare', label: 'Healthcare' },
		{ value: 'Finance', label: 'Finance' },
		{ value: 'Education', label: 'Education' },
		{ value: 'Marketing', label: 'Marketing' },
		{ value: 'Design', label: 'Design' },
		{ value: 'Sales', label: 'Sales' },
		{ value: 'Data & Analytics', label: 'Data & Analytics' },
		{ value: 'Management', label: 'Management' },
	],
	payRange: [
		{ value: 'all', label: 'Any Salary' },
		{ value: '40k-60k', label: '$40k - $60k' },
		{ value: '60k-80k', label: '$60k - $80k' },
		{ value: '80k-100k', label: '$80k - $100k' },
		{ value: '100k-120k', label: '$100k - $120k' },
		{ value: '120k+', label: '$120k+' },
	],
};

const FilterSection = ({
	onFiltersChange,
	initialFilters,
	className,
	isCard = true,
}: FilterSectionProps) => {
	const form = useForm<FilterFormData>({
		resolver: zodResolver(filterSchema),
		defaultValues: {
			searchQuery: initialFilters?.searchQuery || '',
			jobType: initialFilters?.jobType || 'all',
			location: initialFilters?.location || 'all',
			datePosted: initialFilters?.datePosted || 'all',
			language: initialFilters?.language || 'all',
			industry: initialFilters?.industry || 'all',
			payRange: initialFilters?.payRange || 'all',
		},
	});

	const watchedValues = form.watch();

	// Watch for changes and trigger filter updates with debouncing
	React.useEffect(() => {
		const timeoutId = setTimeout(() => {
			const filters: JobFilters = {
				searchQuery: watchedValues.searchQuery || '',
				jobType: watchedValues.jobType || 'all',
				location: watchedValues.location || 'all',
				datePosted: watchedValues.datePosted || 'all',
				language: watchedValues.language || 'all',
				industry: watchedValues.industry || 'all',
				payRange: watchedValues.payRange || 'all',
			};
			onFiltersChange(filters);
		}, 300); // 300ms debounce

		return () => clearTimeout(timeoutId);
	}, [watchedValues, onFiltersChange]);

	const onSubmit = (data: FilterFormData) => {
		const filters: JobFilters = {
			searchQuery: data.searchQuery || '',
			jobType: data.jobType || 'all',
			location: data.location || 'all',
			datePosted: data.datePosted || 'all',
			language: data.language || 'all',
			industry: data.industry || 'all',
			payRange: data.payRange || 'all',
		};
		onFiltersChange(filters);
	};

	const content = (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
				{/* Search */}
				<FormField
					control={form.control}
					name='searchQuery'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-sm font-medium text-foreground flex items-center gap-2'>
								<Search className='h-4 w-4' />
								Search Jobs
							</FormLabel>
							<FormControl>
								<div className='relative'>
									<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
									<Input
										placeholder='Search jobs by title or company...'
										{...field}
										className='pl-10 transition-all duration-200 focus:shadow-soft'
									/>
								</div>
							</FormControl>
						</FormItem>
					)}
				/>

				{/* Job Type */}
				<FormField
					control={form.control}
					name='jobType'
					render={({ field }) => (
						<FormItem>
							<FilterSelect
								label='Job Type'
								icon={<Briefcase className='h-4 w-4' />}
								value={field.value}
								onValueChange={field.onChange}
								placeholder='All Types'
								options={filterOptions.jobType}
							/>
						</FormItem>
					)}
				/>

				{/* Location */}
				<FormField
					control={form.control}
					name='location'
					render={({ field }) => (
						<FormItem>
							<FilterSelect
								label='Location'
								icon={<MapPin className='h-4 w-4' />}
								value={field.value}
								onValueChange={field.onChange}
								placeholder='All Locations'
								options={filterOptions.location}
							/>
						</FormItem>
					)}
				/>

				{/* Date Posted */}
				<FormField
					control={form.control}
					name='datePosted'
					render={({ field }) => (
						<FormItem>
							<FilterSelect
								label='Date Posted'
								icon={<Calendar className='h-4 w-4' />}
								value={field.value}
								onValueChange={field.onChange}
								placeholder='Any Time'
								options={filterOptions.datePosted}
							/>
						</FormItem>
					)}
				/>

				{/* Language */}
				<FormField
					control={form.control}
					name='language'
					render={({ field }) => (
						<FormItem>
							<FilterSelect
								label='Language'
								icon={<Globe className='h-4 w-4' />}
								value={field.value}
								onValueChange={field.onChange}
								placeholder='All Languages'
								options={filterOptions.language}
							/>
						</FormItem>
					)}
				/>

				{/* Industry */}
				<FormField
					control={form.control}
					name='industry'
					render={({ field }) => (
						<FormItem>
							<FilterSelect
								label='Industry'
								icon={<Building2 className='h-4 w-4' />}
								value={field.value}
								onValueChange={field.onChange}
								placeholder='All Industries'
								options={filterOptions.industry}
							/>
						</FormItem>
					)}
				/>

				{/* Pay Range */}
				<FormField
					control={form.control}
					name='payRange'
					render={({ field }) => (
						<FormItem>
							<FilterSelect
								label='Pay Range'
								icon={<DollarSign className='h-4 w-4' />}
								value={field.value}
								onValueChange={field.onChange}
								placeholder='Any Salary'
								options={filterOptions.payRange}
							/>
						</FormItem>
					)}
				/>

				<Button type='submit' className='w-full'>
					<Search className='h-4 w-4 mr-2' />
					Apply Filters
				</Button>
			</form>
		</Form>
	);

	return isCard ? (
		<Card className={`p-4 lg:p-6 ${className}`}>{content}</Card>
	) : (
		<div className={className}>{content}</div>
	);
};

export default FilterSection;
