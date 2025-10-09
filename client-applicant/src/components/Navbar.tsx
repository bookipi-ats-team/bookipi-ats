import { Link, useLocation } from 'react-router-dom';
import { Briefcase, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/user.store';

const Navbar = () => {
	const location = useLocation();
	const { isAuthenticated } = useUserStore();

	const isActive = (path: string) => location.pathname === path;

	return (
		<nav className='bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm hidden md:block'>
			<div className='container mx-auto px-4'>
				<div className='flex items-center justify-between h-16'>
					<Link
						to='/'
						className='flex items-center gap-2 transition-transform duration-200 hover:scale-105'
					>
						<img
							className='h-8'
							src='https://bookipi.com/nitropack_static/qfODMHYpeCWnRdCHYtYUiWKWXVAMFNMm/assets/images/optimized/rev-2f898a9/bookipi.com/wp-content/uploads/2021/04/Bookipi_Logo_For_LightBG.png'
						/>{' '}
						<div className='text-3xl font-bold text-blue-900'>Jobs</div>
					</Link>

					<div className='flex items-center gap-4'>
						<Link
							to='/jobs'
							className={`text-md font-semibold transition-colors ${
								isActive('/jobs')
									? 'text-primary'
									: 'text-muted-foreground hover:text-foreground'
							}`}
						>
							Jobs
						</Link>
						<Link
							to='/my-applications'
							className={`text-md font-semibold transition-colors ${
								isActive('/my-applications')
									? 'text-primary'
									: 'text-muted-foreground hover:text-foreground'
							}`}
						>
							My Applications
						</Link>
						<Link
							to={isAuthenticated ? '/profile' : '/login'}
							className='hidden md:block'
						>
							<Button variant='outline' size='sm' className='gap-2'>
								<User className='h-4 w-4' />
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
