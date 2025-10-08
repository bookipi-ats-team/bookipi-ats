import { Link } from 'react-router-dom';
import { Briefcase, Calendar, Eye } from 'lucide-react';
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

// Mock data
const mockApplications = [
	{
		id: '1',
		jobId: '1',
		jobTitle: 'Senior Software Engineer',
		company: 'Tech Corp',
		appliedDate: '2024-01-15',
		status: 'Under Review',
		statusColor: 'warning' as const,
	},
	{
		id: '2',
		jobId: '2',
		jobTitle: 'Product Designer',
		company: 'Design Studio',
		appliedDate: '2024-01-12',
		status: 'Interview Scheduled',
		statusColor: 'success' as const,
	},
	{
		id: '3',
		jobId: '3',
		jobTitle: 'Marketing Manager',
		company: 'Growth Co',
		appliedDate: '2024-01-10',
		status: 'Rejected',
		statusColor: 'destructive' as const,
	},
	{
		id: '4',
		jobId: '4',
		jobTitle: 'Data Analyst',
		company: 'Analytics Inc',
		appliedDate: '2024-01-08',
		status: 'Applied',
		statusColor: 'secondary' as const,
	},
];

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
					<div className='grid md:grid-cols-4 gap-4 mb-8'>
						<Card className=' [animation-delay:100ms] transition-all duration-300 hover:shadow-medium hover:-translate-y-1'>
							<CardContent className='pt-6'>
								<div className='text-center'>
									<div className='text-3xl font-bold text-primary mb-1'>
										{mockApplications.length}
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
											mockApplications.filter(
												(a) => a.statusColor === 'success'
											).length
										}
									</div>
									<div className='text-sm text-muted-foreground'>
										Interviews
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className='  transition-all duration-300 hover:shadow-medium hover:-translate-y-1'>
							<CardContent className='pt-6'>
								<div className='text-center'>
									<div className='text-3xl font-bold text-warning mb-1'>
										{
											mockApplications.filter(
												(a) => a.statusColor === 'warning'
											).length
										}
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
										{
											mockApplications.filter(
												(a) => a.statusColor === 'secondary'
											).length
										}
									</div>
									<div className='text-sm text-muted-foreground'>Pending</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Applications List */}
					<div className='space-y-4'>
						{mockApplications.map((application, index) => (
							<Card
								key={application.id}
								className='hover:shadow-medium transition-all duration-300 hover:-translate-y-1 '
								style={{ animationDelay: `${500 + index * 100}ms` }}
							>
								<CardHeader>
									<div className='flex justify-between items-start gap-4'>
										<div className='flex-1'>
											<CardTitle className='text-xl mb-1'>
												{application.jobTitle}
											</CardTitle>
											<CardDescription className='flex items-center gap-2'>
												<Briefcase className='h-4 w-4' />
												{application.company}
											</CardDescription>
										</div>
										<Badge variant={getStatusVariant(application.statusColor)}>
											{application.status}
										</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
										<div className='flex items-center gap-2 text-sm text-muted-foreground'>
											<Calendar className='h-4 w-4' />
											Applied on{' '}
											{new Date(application.appliedDate).toLocaleDateString(
												'en-US',
												{
													year: 'numeric',
													month: 'long',
													day: 'numeric',
												}
											)}
										</div>
										<Link to={`/jobs/${application.jobId}`}>
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
						))}
					</div>

					{/* Empty State (if no applications) */}
					{mockApplications.length === 0 && (
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
