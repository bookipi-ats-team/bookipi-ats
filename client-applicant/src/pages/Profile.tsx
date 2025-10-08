import { useState } from 'react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
	const { toast } = useToast();
	const [activeTab, setActiveTab] = useState('account');

	const handleSave = () => {
		toast({
			title: 'Profile Updated',
			description: 'Your profile has been successfully updated.',
		});
	};

	return (
		<div className='min-h-screen bg-background pb-20 md:pb-0'>
			<Navbar />

			<div className='container mx-auto px-4 py-8 max-w-4xl'>
				<div className='mb-6 '>
					<h1 className='text-3xl font-bold text-foreground'>
						Profile Settings
					</h1>
					<p className='text-muted-foreground mt-2'>
						Manage your account and job search preferences
					</p>
				</div>

				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className=' [animation-delay:100ms]'
				>
					<TabsList className='grid w-full grid-cols-2 mb-8'>
						<TabsTrigger value='account'>Account</TabsTrigger>
						<TabsTrigger value='profile'>Profile</TabsTrigger>
					</TabsList>

					<TabsContent value='account' className='space-y-6'>
						<Card className=''>
							<CardHeader>
								<CardTitle>Account Information</CardTitle>
								<CardDescription>
									Update your account settings and credentials
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label htmlFor='email'>Email Address</Label>
										<Input
											id='email'
											type='email'
											placeholder='john.doe@example.com'
											defaultValue='john.doe@example.com'
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='phone'>Phone Number</Label>
										<Input
											id='phone'
											type='tel'
											placeholder='+1 (555) 000-0000'
											defaultValue='+1 (555) 123-4567'
										/>
									</div>
								</div>

								<div className='space-y-2'>
									<Label htmlFor='current-password'>Current Password</Label>
									<Input id='current-password' type='password' />
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label htmlFor='new-password'>New Password</Label>
										<Input id='new-password' type='password' />
									</div>
									<div className='space-y-2'>
										<Label htmlFor='confirm-password'>Confirm Password</Label>
										<Input id='confirm-password' type='password' />
									</div>
								</div>

								<Button
									onClick={handleSave}
									className='w-full md:w-auto transition-transform duration-200 hover:scale-105'
								>
									Save Changes
								</Button>
							</CardContent>
						</Card>

						<Card className=' [animation-delay:100ms]'>
							<CardHeader>
								<CardTitle>Notification Preferences</CardTitle>
								<CardDescription>
									Manage how you receive updates
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='flex items-center justify-between'>
									<div>
										<p className='font-medium'>Email Notifications</p>
										<p className='text-sm text-muted-foreground'>
											Receive job alerts via email
										</p>
									</div>
									<input type='checkbox' defaultChecked className='h-4 w-4' />
								</div>
								<div className='flex items-center justify-between'>
									<div>
										<p className='font-medium'>Application Updates</p>
										<p className='text-sm text-muted-foreground'>
											Get notified about application status changes
										</p>
									</div>
									<input type='checkbox' defaultChecked className='h-4 w-4' />
								</div>
								<Button
									onClick={handleSave}
									className='w-full md:w-auto transition-transform duration-200 hover:scale-105'
								>
									Save Preferences
								</Button>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value='profile' className='space-y-6'>
						<Card className=''>
							<CardHeader>
								<CardTitle>Personal Information</CardTitle>
								<CardDescription>
									Update your professional profile details
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label htmlFor='first-name'>First Name</Label>
										<Input
											id='first-name'
											placeholder='John'
											defaultValue='John'
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='last-name'>Last Name</Label>
										<Input
											id='last-name'
											placeholder='Doe'
											defaultValue='Doe'
										/>
									</div>
								</div>

								<div className='space-y-2'>
									<Label htmlFor='location'>Location</Label>
									<Input
										id='location'
										placeholder='San Francisco, CA'
										defaultValue='San Francisco, CA'
									/>
								</div>

								<div className='space-y-2'>
									<Label htmlFor='bio'>Professional Summary</Label>
									<Textarea
										id='bio'
										placeholder='Tell us about yourself...'
										defaultValue='Experienced software developer with a passion for building innovative solutions.'
										rows={4}
									/>
								</div>

								<Button
									onClick={handleSave}
									className='w-full md:w-auto transition-transform duration-200 hover:scale-105'
								>
									Save Profile
								</Button>
							</CardContent>
						</Card>

						<Card className=' [animation-delay:100ms]'>
							<CardHeader>
								<CardTitle>Job Search Preferences</CardTitle>
								<CardDescription>
									Customize your job search experience
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='job-type'>Preferred Job Type</Label>
									<Select defaultValue='full-time'>
										<SelectTrigger id='job-type'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='full-time'>Full Time</SelectItem>
											<SelectItem value='part-time'>Part Time</SelectItem>
											<SelectItem value='contract'>Contract</SelectItem>
											<SelectItem value='internship'>Internship</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className='space-y-2'>
									<Label htmlFor='industry'>Preferred Industry</Label>
									<Select defaultValue='technology'>
										<SelectTrigger id='industry'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='technology'>Technology</SelectItem>
											<SelectItem value='healthcare'>Healthcare</SelectItem>
											<SelectItem value='finance'>Finance</SelectItem>
											<SelectItem value='education'>Education</SelectItem>
											<SelectItem value='retail'>Retail</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label htmlFor='min-salary'>Minimum Salary</Label>
										<Input
											id='min-salary'
											type='text'
											placeholder='$80,000'
											defaultValue='$80,000'
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='max-salary'>Maximum Salary</Label>
										<Input
											id='max-salary'
											type='text'
											placeholder='$120,000'
											defaultValue='$120,000'
										/>
									</div>
								</div>

								<div className='space-y-2'>
									<Label htmlFor='skills'>Skills</Label>
									<Textarea
										id='skills'
										placeholder='e.g., React, Node.js, Python...'
										defaultValue='React, TypeScript, Node.js, Python, SQL'
										rows={3}
									/>
								</div>

								<Button
									onClick={handleSave}
									className='w-full md:w-auto transition-transform duration-200 hover:scale-105'
								>
									Save Preferences
								</Button>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>

			<BottomNav />
		</div>
	);
};

export default Profile;
