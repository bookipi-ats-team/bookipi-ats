import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const JobDetailSkeleton = () => {
	return (
		<div className='max-w-4xl mx-auto'>
			{/* Back button skeleton */}
			<div className='mb-4'>
				<Skeleton className='h-10 w-40' />
			</div>

			{/* Header Card */}
			<Card className='mb-6'>
				<CardHeader>
					<div className='flex justify-between items-start gap-4 mb-4'>
						<div className='flex-1 space-y-3'>
							<Skeleton className='h-8 w-3/4' />
							<div className='flex items-center gap-2'>
								<Skeleton className='h-5 w-5' />
								<Skeleton className='h-5 w-1/3' />
							</div>
						</div>
						<div className='flex gap-2'>
							<Skeleton className='h-10 w-10' />
							<Skeleton className='h-10 w-10' />
						</div>
					</div>

					<div className='flex flex-wrap gap-4'>
						{Array.from({ length: 4 }).map((_, index) => (
							<div key={index} className='flex items-center gap-1'>
								<Skeleton className='h-4 w-4' />
								<Skeleton className='h-4 w-20' />
							</div>
						))}
					</div>
				</CardHeader>
				<CardContent>
					<Skeleton className='h-12 w-full' />
				</CardContent>
			</Card>

			{/* Job Details Card */}
			<Card className='mb-6'>
				<CardHeader>
					<Skeleton className='h-6 w-32' />
				</CardHeader>
				<CardContent className='space-y-6'>
					{/* Description */}
					<div className='space-y-2'>
						<Skeleton className='h-4 w-full' />
						<Skeleton className='h-4 w-4/5' />
						<Skeleton className='h-4 w-3/4' />
					</div>

					<Separator />

					{/* Responsibilities */}
					<div className='space-y-3'>
						<Skeleton className='h-6 w-40' />
						<div className='space-y-2'>
							{Array.from({ length: 5 }).map((_, index) => (
								<div key={index} className='flex gap-2'>
									<Skeleton className='h-4 w-4 mt-0.5 rounded-full' />
									<Skeleton className='h-4 flex-1' />
								</div>
							))}
						</div>
					</div>

					<Separator />

					{/* Requirements */}
					<div className='space-y-3'>
						<Skeleton className='h-6 w-32' />
						<div className='space-y-2'>
							{Array.from({ length: 5 }).map((_, index) => (
								<div key={index} className='flex gap-2'>
									<Skeleton className='h-4 w-4 mt-0.5 rounded-full' />
									<Skeleton className='h-4 flex-1' />
								</div>
							))}
						</div>
					</div>

					<Separator />

					{/* Benefits */}
					<div className='space-y-3'>
						<Skeleton className='h-6 w-24' />
						<div className='grid md:grid-cols-2 gap-2'>
							{Array.from({ length: 6 }).map((_, index) => (
								<Skeleton key={index} className='h-8 w-full' />
							))}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default JobDetailSkeleton;
