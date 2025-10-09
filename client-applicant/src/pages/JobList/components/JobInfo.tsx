import { MapPin, Briefcase, Calendar } from 'lucide-react';

interface JobInfoProps {
	location?: string;
	employmentType: string;
	publishedAt?: string;
	size?: 'sm' | 'md';
	className?: string;
}

const JobInfo = ({
	location,
	employmentType,
	publishedAt,
	size = 'md',
	className = '',
}: JobInfoProps) => {
	const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
	const textSize = size === 'sm' ? 'text-sm' : 'text-sm';

	// Format employment type for display
	const formatEmploymentType = (type: string) => {
		return type
			.replace(/_/g, ' ')
			.toLowerCase()
			.replace(/\b\w/g, (l) => l.toUpperCase());
	};

	// Format published date
	const formatDate = (dateString?: string) => {
		if (!dateString) return 'Recently posted';
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 1) return '1 day ago';
		if (diffDays < 7) return `${diffDays} days ago`;
		if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
		return `${Math.ceil(diffDays / 30)} months ago`;
	};

	return (
		<div
			className={`flex flex-wrap gap-3 ${textSize} text-muted-foreground ${className}`}
		>
			{location && (
				<div className='flex items-center gap-1'>
					<MapPin className={iconSize} />
					{location}
				</div>
			)}
			<div className='flex items-center gap-1'>
				<Briefcase className={iconSize} />
				{formatEmploymentType(employmentType)}
			</div>
			<div className='flex items-center gap-1'>
				<Calendar className={iconSize} />
				{formatDate(publishedAt)}
			</div>
		</div>
	);
};

export default JobInfo;
