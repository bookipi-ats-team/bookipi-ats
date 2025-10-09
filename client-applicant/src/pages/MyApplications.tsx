import { Link } from 'react-router-dom';
import { Briefcase, Calendar, Eye, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useApplications } from '@/hooks/query/useApplications';
import { ApplicationWithJob, StageCode } from '@/types/applicant.type';

// Stage to display status mapping
const getStatusFromStage = (
	stage: StageCode
): {
	status: string;
	color: 'success' | 'warning' | 'destructive' | 'secondary';
} => {
	switch (stage) {
		case 'NEW':
			return { status: 'Applied', color: 'secondary' };
		case 'SCREEN':
			return { status: 'Under Review', color: 'warning' };
		case 'INTERVIEW':
			return { status: 'Interview Scheduled', color: 'success' };
		case 'OFFER':
			return { status: 'Offer Extended', color: 'success' };
		case 'HIRED':
			return { status: 'Hired', color: 'success' };
		case 'REJECTED':
			return { status: 'Rejected', color: 'destructive' };
		default:
			return { status: 'Applied', color: 'secondary' };
	}
};

const getStatusVariant = (color: string) => {
	switch (color) {
		case 'success':
			return 'default';
		case 'warning':
			return 'secondary';
		case 'destructive':
			return 'destructive';
		default:
			return 'outline';
	}
};

const MyApplications = () => {
	const { data: applicationsResponse, isLoading, error } = useApplications();
	const applications = applicationsResponse?.items || [];

	if (error) {
		return (
			<div className='min-h-screen bg-background pb-20 md:pb-0'>
				<Navbar />
				<div className='container mx-auto px-4 py-8'>
					<div className='max-w-4xl mx-auto'>
						<Card className='text-center py-12'>
							<CardContent>
								<h3 className='text-xl font-semibold mb-2 text-destructive'>
									Error loading applications
								</h3>
								<p className='text-muted-foreground'>
									{error instanceof Error
										? error.message
										: 'An unexpected error occurred'}
								</p>
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
					{/* Header */}
					<div className='mb-8 '>
						<h1 className='text-3xl font-bold mb-2'>My Applications</h1>
						<p className='text-muted-foreground'>
							Track and manage your job applications
						</p>
					</div>

					{/* Stats */}
					{isLoading ? (
						<div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
							{[...Array(4)].map((_, i) => (
								<Card
									key={i}
									className='transition-all duration-300 hover:shadow-medium hover:-translate-y-1'
								>
									<CardContent className='pt-6'>
										<div className='text-center'>
											<div className='h-8 w-12 bg-muted animate-pulse rounded mx-auto mb-1'></div>
											<div className='h-4 w-20 bg-muted animate-pulse rounded mx-auto'></div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
							<Card className=' [animation-delay:100ms] transition-all duration-300 hover:shadow-medium hover:-translate-y-1'>
								<CardContent className='pt-6'>
									<div className='text-center'>
										<div className='text-3xl font-bold text-primary mb-1'>
											{applications.length}
										</div>
										<div className='text-sm text-muted-foreground'>
											Total Applications
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className=' [animation-delay:200ms] transition-all duration-300 hover:shadow-medium hover:-translate-y-1'>
								<CardContent className='pt-6'>
									<div className='text-center'>
										<div className='text-3xl font-bold text-success mb-1'>
											{
												applications.filter((a) =>
													['INTERVIEW', 'OFFER', 'HIRED'].includes(a.stage)
												).length
											}
										</div>
										<div className='text-sm text-muted-foreground'>
											Interviews+
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className='  transition-all duration-300 hover:shadow-medium hover:-translate-y-1'>
								<CardContent className='pt-6'>
									<div className='text-center'>
										<div className='text-3xl font-bold text-warning mb-1'>
											{applications.filter((a) => a.stage === 'SCREEN').length}
										</div>
										<div className='text-sm text-muted-foreground'>
											Under Review
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className=' [animation-delay:400ms] transition-all duration-300 hover:shadow-medium hover:-translate-y-1'>
								<CardContent className='pt-6'>
									<div className='text-center'>
										<div className='text-3xl font-bold text-muted-foreground mb-1'>
											{applications.filter((a) => a.stage === 'NEW').length}
										</div>
										<div className='text-sm text-muted-foreground'>Pending</div>
									</div>
								</CardContent>
							</Card>
						</div>
					)}

					{/* Applications List */}
					{isLoading ? (
						<div className='space-y-4'>
							{[...Array(3)].map((_, i) => (
								<Card key={i} className='animate-pulse'>
									<CardHeader>
										<div className='flex justify-between items-start gap-4'>
											<div className='flex-1'>
												<div className='h-6 w-48 bg-muted rounded mb-2'></div>
												<div className='h-4 w-32 bg-muted rounded'></div>
											</div>
											<div className='h-6 w-20 bg-muted rounded'></div>
										</div>
									</CardHeader>
									<CardContent>
										<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
											<div className='h-4 w-40 bg-muted rounded'></div>
											<div className='h-8 w-24 bg-muted rounded'></div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<div className='space-y-4'>
							{applications.map((application, index) => {
								const statusInfo = getStatusFromStage(application.stage);
								return (
									<Card
										key={application.id}
										className='hover:shadow-medium transition-all duration-300 hover:-translate-y-1 '
										style={{ animationDelay: `${500 + index * 100}ms` }}
									>
										<CardHeader>
											<div className='flex justify-between items-start gap-4'>
												<div className='flex-1'>
													<CardTitle className='text-xl mb-1'>
														{application.job.title}
													</CardTitle>
													<CardDescription className='flex items-center gap-2'>
														<Briefcase className='h-4 w-4' />
														{application.job.location || 'Remote'}
													</CardDescription>
												</div>
												<Badge variant={getStatusVariant(statusInfo.color)}>
													{statusInfo.status}
												</Badge>
											</div>
										</CardHeader>
										<CardContent>
											<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
												<div className='flex items-center gap-2 text-sm text-muted-foreground'>
													<Calendar className='h-4 w-4' />
													Applied on{' '}
													{new Date(application.createdAt).toLocaleDateString(
														'en-US',
														{
															year: 'numeric',
															month: 'long',
															day: 'numeric',
														}
													)}
												</div>
												<Link to={`/jobs/${application.job._id}`}>
													<Button
														variant='outline'
														size='sm'
														className='transition-transform duration-200 hover:scale-105'
													>
														<Eye className='mr-2 h-4 w-4' />
														View Job
													</Button>
												</Link>
											</div>
										</CardContent>
									</Card>
								);
							})}
						</div>
					)}

					{/* Empty State (if no applications) */}
					{!isLoading && applications.length === 0 && (
						<Card className='text-center py-12'>
							<CardContent>
								<Briefcase className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
								<h3 className='text-xl font-semibold mb-2'>
									No applications yet
								</h3>
								<p className='text-muted-foreground mb-6'>
									Start applying to jobs and track your progress here
								</p>
								<Link to='/jobs'>
									<Button className='bg-gradient-primary hover:opacity-90'>
										Browse Jobs
									</Button>
								</Link>
							</CardContent>
						</Card>
					)}
				</div>
			</div>

			<BottomNav />
		</div>
	);
};

export default MyApplications;
