import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, Mail } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/store/user.store';

const Login = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState('');
	const { login } = useUserStore();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate authentication
		setTimeout(() => {
			login(email);
			toast({
				title: 'Welcome!',
				description: "You've been logged in successfully.",
			});
			setIsLoading(false);
			navigate('/jobs');
		}, 1000);
	};

	return (
		<div className='min-h-screen bg-background flex items-center justify-center px-4 pb-20 md:pb-0'>
			<div className='w-full max-w-md'>
				<div className='text-center mb-8 '>
					<Link
						to='/'
						className='inline-flex items-center gap-2 mb-4 transition-transform duration-200 hover:scale-105'
					>
						<div className='bg-gradient-primary p-2 rounded-lg'>
							<Briefcase className='h-6 w-6 text-primary-foreground' />
						</div>
						<span className='font-bold text-2xl text-foreground'>
							Bookipi Jobs
						</span>
					</Link>
					<h1 className='text-3xl font-bold mb-2  [animation-delay:100ms]'>
						Welcome Back
					</h1>
					<p className='text-muted-foreground  '>
						Enter your email to continue your job search
					</p>
				</div>

				<Card className=' [animation-delay:200ms]'>
					<CardHeader>
						<CardTitle>Sign In</CardTitle>
						<CardDescription>
							Enter your email to access your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='email'>Email</Label>
								<div className='relative'>
									<Mail className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
									<Input
										id='email'
										type='email'
										required
										placeholder='you@example.com'
										className='pl-10'
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>
							</div>

							<Button
								type='submit'
								className='w-full bg-gradient-primary hover:opacity-90 font-semibold transition-transform duration-200 hover:scale-105'
								disabled={isLoading}
							>
								{isLoading ? 'Please wait...' : 'Sign In'}
							</Button>
						</form>
					</CardContent>
				</Card>

				<p className='text-center text-sm text-muted-foreground mt-6'>
					By continuing, you agree to our{' '}
					<a href='#' className='text-primary hover:underline'>
						Terms of Service
					</a>{' '}
					and{' '}
					<a href='#' className='text-primary hover:underline'>
						Privacy Policy
					</a>
				</p>
			</div>

			<BottomNav />
		</div>
	);
};

export default Login;
