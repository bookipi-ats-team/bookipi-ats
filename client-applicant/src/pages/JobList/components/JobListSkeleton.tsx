import JobCardSkeleton from './JobCardSkeleton';

interface JobListSkeletonProps {
	viewMode: 'card' | 'list';
	count?: number;
}

const JobListSkeleton = ({ viewMode, count = 6 }: JobListSkeletonProps) => {
	return (
		<div
			className={viewMode === 'card' ? 'grid grid-cols-2 gap-4' : 'space-y-3'}
		>
			{Array.from({ length: count }).map((_, index) => (
				<JobCardSkeleton key={index} viewMode={viewMode} />
			))}
		</div>
	);
};

export default JobListSkeleton;
