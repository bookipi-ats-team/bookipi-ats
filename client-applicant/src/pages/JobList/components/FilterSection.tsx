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
import { JobFilters } from '@/types/job.type';
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
		{
			label: 'Building construction and trade',
			value: 'building_construction_and_trade',
		},
		{
			label: 'Personal services',
			value: 'personal_services',
		},
		{
			label: 'Professional services',
			value: 'professional_services',
		},
		{
			label: 'Transportation',
			value: 'transportation',
		},
		{
			label: 'Digital products',
			value: 'digital_products',
		},
		{
			label: 'Education',
			value: 'education',
		},
		{
			label: 'Farming and agriculture',
			value: 'farming_and_agriculture',
		},
		{
			label: 'Membership organisation',
			value: 'membership_organisation',
		},
		{
			label: 'Retail food and drink',
			value: 'retail_food_and_drink',
		},
		{
			label: 'Financial services',
			value: 'financial_services',
		},
		{
			label: 'Travel and lodging',
			value: 'travel_and_lodging',
		},
		{
			label: 'Medical services',
			value: 'medical_services',
		},
		{
			label: 'Entertainment and recreation',
			value: 'entertainment_and_recreation',
		},
		{
			label: 'Regulated and age restricted products',
			value: 'regulated_and_age_restricted_products',
		},
		{
			label: 'Non-profit and charity',
			value: 'non_profit_and_charity',
		},
		{
			label: 'Other',
			value: 'other',
		},
		{
			label: 'Accounting & Finance',
			value: 'accounting_and_finance',
		},
		{
			label: 'Arts & Recreation',
			value: 'arts_and_recreation',
		},
		{
			label: 'Beauty & Wellness',
			value: 'beauty_and_wellness',
		},
		{
			label: 'Cleaning & Maintenance',
			value: 'cleaning_and_maintenance',
		},
		{
			label: 'Construction & Trades',
			value: 'construction_and_trades',
		},
		{
			label: 'Consulting & Business Services',
			value: 'consulting_and_business_services',
		},
		{
			label: 'Education & Training',
			value: 'education_and_training',
		},
		{
			label: 'Energy & Utilities',
			value: 'energy_and_utilities',
		},
		{
			label: 'Food & Beverage',
			value: 'food_and_beverage',
		},
		{
			label: 'Health & Care Services',
			value: 'health_and_care_services',
		},
		{
			label: 'Manufacturing & Production',
			value: 'manufacturing_and_production',
		},
		{
			label: 'Retail & Wholesale',
			value: 'retail_and_wholesale',
		},
		{
			label: 'Technology & Digital Services',
			value: 'technology_and_digital_services',
		},
		{
			label: 'Tourism & Accommodation',
			value: 'tourism_and_accommodation',
		},
		{
			label: 'Transport & Delivery',
			value: 'transport_and_delivery',
		},
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
	});

	const onSubmit = (data: FilterFormData) => onFiltersChange(data);

	const content = (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
				{/* Search */}
				<FormField
					control={form.control}
					name='q'
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
				{/* <FormField
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
				/> */}

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
				{/* <FormField
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
				/> */}

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
				{/* <FormField
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
				/> */}

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
