import { Link, useParams, useNavigate } from 'react-router-dom';
import {
	MapPin,
	DollarSign,
	Briefcase,
	Clock,
	Bookmark,
	Share2,
	Building,
	ArrowLeft,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import JobDetailSkeleton from '@/components/JobDetailSkeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useJob } from '@/hooks/query/useJobs';

const JobDetail = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();

	const { data: job, isLoading, error } = useJob(id!);

	if (isLoading) {
		return (
			<div className='min-h-screen bg-background pb-20 md:pb-0'>
				<Navbar />
				<div className='container mx-auto px-4 py-8'>
					<JobDetailSkeleton />
				</div>
				<BottomNav />
			</div>
		);
	}

	if (error || !job) {
		return (
			<div className='min-h-screen bg-background pb-20 md:pb-0'>
				<Navbar />
				<div className='container mx-auto px-4 py-8'>
					<div className='max-w-4xl mx-auto'>
						<Button
							variant='ghost'
							onClick={() => navigate('/jobs')}
							className='mb-4 transition-transform duration-200 hover:scale-105'
						>
							<ArrowLeft className='mr-2 h-4 w-4' />
							Back to Job Listings
						</Button>
						<Card>
							<CardContent className='p-8 text-center'>
								<h2 className='text-2xl font-bold mb-2'>Job Not Found</h2>
								<p className='text-muted-foreground mb-4'>
									The job you're looking for doesn't exist or has been removed.
								</p>
								<Link to='/jobs'>
									<Button>Browse Other Jobs</Button>
								</Link>
							</CardContent>
						</Card>
					</div>
				</div>
				<BottomNav />
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-background pb-20 md:pb-0'>
			<Navbar />

			<div className='container mx-auto px-4 py-8'>
				<div className='max-w-4xl mx-auto'>
					<Button
						variant='ghost'
						onClick={() => navigate(-1)}
						className='mb-4 transition-transform duration-200 hover:scale-105'
					>
						<ArrowLeft className='mr-2 h-4 w-4' />
						Back to Job Listings
					</Button>
					{/* Header */}
					<Card className='mb-6 '>
						<CardHeader>
							<div className='flex justify-between items-start mb-4'>
								<div className='flex-1'>
									<CardTitle className='text-3xl [animation-delay:100ms]'>
										{job.title}
									</CardTitle>
									<CardDescription className='text-lg flex items-center gap-2  '>
										<Building className='h-5 w-5' />
										{job.business.name}
									</CardDescription>
								</div>
							</div>

							<div className='flex flex-wrap gap-4 text-muted-foreground'>
								{job.location && (
									<div className='flex items-center gap-1'>
										<MapPin className='h-4 w-4' />
										{job.location}
									</div>
								)}
								<div className='flex items-center gap-1'>
									<Briefcase className='h-4 w-4' />
									{job.employmentType
										.replace(/_/g, ' ')
										.toLowerCase()
										.replace(/\b\w/g, (l) => l.toUpperCase())}
								</div>
								<div className='flex items-center gap-1'>
									<Clock className='h-4 w-4' />
									{job.publishedAt
										? (() => {
												const date = new Date(job.publishedAt);
												const now = new Date();
												const diffTime = Math.abs(
													now.getTime() - date.getTime()
												);
												const diffDays = Math.ceil(
													diffTime / (1000 * 60 * 60 * 24)
												);

												if (diffDays === 1) return '1 day ago';
												if (diffDays < 7) return `${diffDays} days ago`;
												if (diffDays < 30)
													return `${Math.ceil(diffDays / 7)} weeks ago`;
												return `${Math.ceil(diffDays / 30)} months ago`;
										  })()
										: 'Recently posted'}
								</div>
							</div>
						</CardHeader>
					</Card>
					{/* Job Details */}
					<Card className='mb-6  [animation-delay:250ms]'>
						<CardHeader>
							<CardTitle>About the Job</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div>
								<p className='text-muted-foreground leading-relaxed'>
									{job.description}
								</p>
							</div>

							<Separator />

							{job.mustHaves && job.mustHaves.length > 0 && (
								<>
									<div>
										<h3 className='font-semibold text-lg mb-3'>Requirements</h3>
										{/* className='grid grid-cols-1 sm:grid-cols-2 gap-2' */}
										<div className='space-x-2'>
											{job.mustHaves.map((item, index) => (
												<Badge
													key={index}
													variant='outline'
													className='justify-start w-fit py-2 px-3'
												>
													{item}
												</Badge>
											))}
										</div>
									</div>
									<Separator />
								</>
							)}

							<div className='mt-8 flex justify-end'>
								<Link to={`/jobs/${job._id}/apply`}>
									<Button
										variant='ghost'
										className='w-fit text-primary hover:text-white px-10 hover:opacity-90 font-semibold text-md py-6 transition-transform duration-200 hover:scale-105'
									>
										Apply Now
									</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			<BottomNav />
		</div>
	);
};

export default JobDetail;
