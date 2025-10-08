import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface JobCardSkeletonProps {
	viewMode: 'card' | 'list';
}

const JobCardSkeleton = ({ viewMode }: JobCardSkeletonProps) => {
	if (viewMode === 'card') {
		return (
			<Card className='animate-pulse'>
				<CardHeader>
					<div className='flex justify-between items-start gap-4'>
						<div className='flex-1 space-y-2'>
							<Skeleton className='h-6 w-3/4' />
							<Skeleton className='h-4 w-1/2' />
							<div className='flex items-center gap-2'>
								<Skeleton className='h-4 w-4' />
								<Skeleton className='h-4 w-1/3' />
							</div>
						</div>
						<Skeleton className='h-8 w-8 rounded' />
					</div>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						<div className='flex flex-wrap gap-2'>
							<Skeleton className='h-6 w-16 rounded-full' />
							<Skeleton className='h-6 w-20 rounded-full' />
						</div>
						<div className='space-y-2'>
							<Skeleton className='h-4 w-full' />
							<Skeleton className='h-4 w-4/5' />
						</div>
						<div className='flex justify-between items-center pt-2'>
							<Skeleton className='h-4 w-1/4' />
							<Skeleton className='h-4 w-1/3' />
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className='animate-pulse'>
			<CardContent className='p-4'>
				<div className='flex justify-between items-start gap-4'>
					<div className='flex-1 space-y-2'>
						<Skeleton className='h-5 w-2/3' />
						<Skeleton className='h-4 w-1/2' />
						<div className='flex items-center gap-4'>
							<div className='flex items-center gap-1'>
								<Skeleton className='h-4 w-4' />
								<Skeleton className='h-4 w-20' />
							</div>
							<div className='flex items-center gap-1'>
								<Skeleton className='h-4 w-4' />
								<Skeleton className='h-4 w-16' />
							</div>
						</div>
					</div>
					<div className='flex items-center gap-2'>
						<Skeleton className='h-4 w-20' />
						<Skeleton className='h-8 w-8 rounded' />
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default JobCardSkeleton;
