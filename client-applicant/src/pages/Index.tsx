import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Briefcase, CheckCircle, TrendingUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

const Index = () => {
	return (
		<div className='min-h-screen bg-background pb-20 md:pb-0'>
			<Navbar />

			{/* Hero Section */}
			<section className='py-20 px-4'>
				<div className='container mx-auto max-w-6xl'>
					<div className='text-center space-y-6'>
						<h1 className='text-4xl md:text-6xl font-bold text-foreground '>
							Find Your Dream Job with{' '}
							<span className='text-primary'>Bookipi Jobs</span>
						</h1>
						<p className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto  '>
							Discover thousands of job opportunities from top companies. Apply
							with ease and track your applications all in one place.
						</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center pt-4  '>
							<Link to='/jobs'>
								<Button className='w-full sm:w-auto bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold transition-transform duration-200 hover:scale-105'>
									<Search className='h-5 w-5' />
									Browse Jobs
								</Button>
							</Link>
							{/* <Link to='/login'>
								<Button
									size='lg'
									variant='outline'
									className='w-full sm:w-auto transition-transform duration-200 hover:scale-105'
								>
									Sign In
								</Button>
							</Link> */}
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className='py-16 px-4 bg-muted'>
				<div className='container mx-auto max-w-6xl'>
					<div className='grid md:grid-cols-3 gap-8'>
						<div className='bg-card p-6 rounded-xl shadow-soft  [animation-delay:100ms] transition-all duration-300 hover:shadow-medium hover:-translate-y-1'>
							<div className='bg-gradient-primary p-3 rounded-lg w-fit mb-4'>
								<Search className='h-6 w-6 text-primary-foreground' />
							</div>
							<h3 className='text-xl font-semibold mb-2 text-card-foreground'>
								Easy Search
							</h3>
							<p className='text-muted-foreground'>
								Filter jobs by location, salary, type, and more to find the
								perfect match for you.
							</p>
						</div>

						<div className='bg-card p-6 rounded-xl shadow-soft  [animation-delay:200ms] transition-all duration-300 hover:shadow-medium hover:-translate-y-1'>
							<div className='bg-gradient-primary p-3 rounded-lg w-fit mb-4'>
								<Briefcase className='h-6 w-6 text-primary-foreground' />
							</div>
							<h3 className='text-xl font-semibold mb-2 text-card-foreground'>
								Quick Apply
							</h3>
							<p className='text-muted-foreground'>
								Apply to multiple jobs with a single click using your saved
								profile information.
							</p>
						</div>

						<div className='bg-card p-6 rounded-xl shadow-soft   transition-all duration-300 hover:shadow-medium hover:-translate-y-1'>
							<div className='bg-gradient-primary p-3 rounded-lg w-fit mb-4'>
								<CheckCircle className='h-6 w-6 text-primary-foreground' />
							</div>
							<h3 className='text-xl font-semibold mb-2 text-card-foreground'>
								Track Applications
							</h3>
							<p className='text-muted-foreground'>
								Monitor all your applications and their status in one
								centralized dashboard.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className='py-16 px-4'>
				<div className='container mx-auto max-w-6xl'>
					<div className='grid md:grid-cols-3 gap-8 text-center'>
						<div className=' [animation-delay:100ms]'>
							<div className='text-4xl font-bold text-primary mb-2'>
								10,000+
							</div>
							<div className='text-muted-foreground'>Active Jobs</div>
						</div>
						<div className=' [animation-delay:200ms]'>
							<div className='text-4xl font-bold text-primary mb-2'>5,000+</div>
							<div className='text-muted-foreground'>Companies</div>
						</div>
						<div className=' '>
							<div className='text-4xl font-bold text-primary mb-2'>
								50,000+
							</div>
							<div className='text-muted-foreground'>Job Seekers</div>
						</div>
					</div>
				</div>
			</section>

			<BottomNav />
		</div>
	);
};

export default Index;
