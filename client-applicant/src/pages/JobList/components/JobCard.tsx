import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import JobInfo from './JobInfo';
import { Job } from '@/types/job.type';

interface JobCardProps {
	job: Job;
	viewMode: 'card' | 'list';
	index: number;
	onBookmarkToggle?: (jobId: string) => void;
}

const JobCard = ({ job, viewMode, index, onBookmarkToggle }: JobCardProps) => {
	const handleBookmarkClick = () => {
		onBookmarkToggle?.(job._id);
	};

	if (viewMode === 'card') {
		return (
			<Card className='hover:shadow-medium transition-all duration-300 hover:-translate-y-1'>
				<CardHeader>
					<div className='flex justify-between items-start gap-4'>
						<div className='flex-1'>
							<CardTitle className='text-xl mb-2'>
								<Link
									to={`/jobs/${job._id}`}
									className='hover:text-primary transition-colors'
								>
									{job.title}
								</Link>
							</CardTitle>
							<CardDescription className='text-base'>
								{job.industry && (
									<span className='text-sm text-muted-foreground'>
										{job.industry}
									</span>
								)}
							</CardDescription>
						</div>
						<Button
							variant='ghost'
							size='icon'
							onClick={handleBookmarkClick}
							className='transition-transform duration-200 hover:scale-110'
						>
							<Bookmark className='h-5 w-5' />
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<p className='text-muted-foreground mb-4 line-clamp-2'>
						{job.description}
					</p>

					<JobInfo
						location={job.location}
						employmentType={job.employmentType}
						publishedAt={job.publishedAt}
						className='mb-4'
					/>

					<div className='flex justify-end items-center'>
						<Link to={`/jobs/${job._id}`}>
							<Button
								variant='ghost'
								className='text-primary hover:text-white transition-transform duration-200 hover:scale-105'
							>
								View Details
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		);
	}

	// List view
	return (
		<Card className='hover:shadow-medium transition-all duration-300'>
			<CardContent className='p-4'>
				<div className='flex flex-col md:flex-row justify-between gap-4'>
					<div className='flex-1 space-y-2'>
						<div className='flex items-start justify-between gap-4'>
							<div className='flex-1'>
								<Link
									to={`/jobs/${job._id}`}
									className='hover:text-primary transition-colors'
								>
									<h3 className='font-semibold text-lg'>{job.title}</h3>
								</Link>
								{job.industry && (
									<p className='text-sm text-muted-foreground'>
										{job.industry}
									</p>
								)}
							</div>
							<Button
								variant='ghost'
								size='icon'
								onClick={handleBookmarkClick}
								className='transition-transform duration-200 hover:scale-110'
							>
								<Bookmark className='h-4 w-4' />
							</Button>
						</div>

						<div className='flex flex-wrap gap-3 text-sm text-muted-foreground items-center'>
							<JobInfo
								location={job.location}
								employmentType={job.employmentType}
								publishedAt={job.publishedAt}
								size='sm'
							/>
						</div>
					</div>

					<div className='flex items-center md:items-start'>
						<Link to={`/jobs/${job._id}`}>
							<Button
								variant='ghost'
								className='text-primary hover:text-white transition-transform duration-200 hover:scale-105'
							>
								View Details
							</Button>
						</Link>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default JobCard;
