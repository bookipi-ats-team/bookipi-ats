import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, Mail, Lock } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [isSignUp, setIsSignUp] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate authentication
		setTimeout(() => {
			toast({
				title: isSignUp ? 'Account Created!' : 'Welcome Back!',
				description: isSignUp
					? 'Your account has been created successfully.'
					: "You've been logged in successfully.",
			});
			setIsLoading(false);
			navigate('/jobs');
		}, 1500);
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
						{isSignUp ? 'Create an Account' : 'Welcome Back'}
					</h1>
					<p className='text-muted-foreground  '>
						{isSignUp
							? 'Sign up to start applying for jobs'
							: 'Sign in to continue your job search'}
					</p>
				</div>

				<Card className=' [animation-delay:200ms]'>
					<CardHeader>
						<CardTitle>{isSignUp ? 'Sign Up' : 'Sign In'}</CardTitle>
						<CardDescription>
							{isSignUp
								? 'Create your account to get started'
								: 'Enter your credentials to access your account'}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className='space-y-4'>
							{isSignUp && (
								<div className='grid md:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label htmlFor='firstName'>First Name</Label>
										<Input id='firstName' required placeholder='John' />
									</div>
									<div className='space-y-2'>
										<Label htmlFor='lastName'>Last Name</Label>
										<Input id='lastName' required placeholder='Doe' />
									</div>
								</div>
							)}

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
									/>
								</div>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='password'>Password</Label>
								<div className='relative'>
									<Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
									<Input
										id='password'
										type='password'
										required
										placeholder='••••••••'
										className='pl-10'
									/>
								</div>
							</div>

							{isSignUp && (
								<div className='space-y-2'>
									<Label htmlFor='confirmPassword'>Confirm Password</Label>
									<div className='relative'>
										<Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
										<Input
											id='confirmPassword'
											type='password'
											required
											placeholder='••••••••'
											className='pl-10'
										/>
									</div>
								</div>
							)}

							{!isSignUp && (
								<div className='flex justify-end'>
									<button
										type='button'
										className='text-sm text-primary hover:underline'
									>
										Forgot password?
									</button>
								</div>
							)}

							<Button
								type='submit'
								className='w-full bg-gradient-primary hover:opacity-90 font-semibold transition-transform duration-200 hover:scale-105'
								disabled={isLoading}
							>
								{isLoading
									? 'Please wait...'
									: isSignUp
									? 'Create Account'
									: 'Sign In'}
							</Button>
						</form>

						<div className='mt-6'>
							<Separator className='my-4' />
							<p className='text-center text-sm text-muted-foreground'>
								{isSignUp
									? 'Already have an account?'
									: "Don't have an account?"}{' '}
								<button
									onClick={() => setIsSignUp(!isSignUp)}
									className='text-primary hover:underline font-medium'
								>
									{isSignUp ? 'Sign In' : 'Sign Up'}
								</button>
							</p>
						</div>
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
