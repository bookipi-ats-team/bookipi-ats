import { Link } from 'react-router-dom';
import { CheckCircle, Briefcase, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import BottomNav from '@/components/BottomNav';

const JobApplySuccess = () => {
	return (
		<div className='min-h-screen bg-background pb-20 md:pb-0'>
			<div className='container max-w-2xl mx-auto px-4 py-8 md:py-16'>
				<Card className='p-8 md:p-12 text-center '>
					<div className='flex justify-center mb-6 animate-scale-in'>
						<CheckCircle className='h-20 w-20 text-primary' />
					</div>

					<h1
						className='text-3xl md:text-4xl font-bold mb-4 '
						style={{ animationDelay: '0.1s' }}
					>
						Application Submitted!
					</h1>

					<p
						className='text-muted-foreground text-lg mb-8 '
						style={{ animationDelay: '0.2s' }}
					>
						Your application has been successfully submitted. The employer will
						review your application and contact you if you're a good fit.
					</p>

					<div
						className='flex flex-col sm:flex-row gap-4 justify-center '
						style={{ animationDelay: '0.3s' }}
					>
						<Button
							asChild
							size='lg'
							className='hover:scale-105 transition-transform'
						>
							<Link to='/my-applications' className='flex items-center gap-2'>
								<FileText className='h-5 w-5' />
								View My Applications
							</Link>
						</Button>

						<Button
							asChild
							variant='outline'
							size='lg'
							className='hover:scale-105 transition-transform'
						>
							<Link to='/jobs' className='flex items-center gap-2'>
								<Briefcase className='h-5 w-5' />
								Search More Jobs
							</Link>
						</Button>
					</div>

					<div
						className='mt-8 pt-8 border-t border-border '
						style={{ animationDelay: '0.4s' }}
					>
						<h3 className='font-semibold mb-3'>What's Next?</h3>
						<ul className='text-sm text-muted-foreground space-y-2'>
							<li>✓ Check your email for confirmation</li>
							<li>✓ Track your application status in My Applications</li>
							<li>✓ Continue exploring more opportunities</li>
						</ul>
					</div>
				</Card>
			</div>

			<BottomNav />
		</div>
	);
};

export default JobApplySuccess;
