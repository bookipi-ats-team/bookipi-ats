import { MapPin, Briefcase, DollarSign } from 'lucide-react';

interface JobInfoProps {
	location: string;
	type: string;
	salary: string;
	size?: 'sm' | 'md';
	className?: string;
}

const JobInfo = ({
	location,
	type,
	salary,
	size = 'md',
	className = '',
}: JobInfoProps) => {
	const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
	const textSize = size === 'sm' ? 'text-sm' : 'text-sm';

	return (
		<div
			className={`flex flex-wrap gap-3 ${textSize} text-muted-foreground ${className}`}
		>
			<div className='flex items-center gap-1'>
				<MapPin className={iconSize} />
				{location}
			</div>
			<div className='flex items-center gap-1'>
				<Briefcase className={iconSize} />
				{type}
			</div>
			<div className='flex items-center gap-1'>
				<DollarSign className={iconSize} />
				{salary}
			</div>
		</div>
	);
};

export default JobInfo;
