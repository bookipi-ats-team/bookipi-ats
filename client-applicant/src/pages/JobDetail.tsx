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

const JobDetail = () => {
	const navigate = useNavigate();
	const { id } = useParams();

	// Mock data - in real app, fetch based on id
	const job = {
		id,
		title: 'Senior Software Engineer',
		company: 'Tech Corp',
		location: 'San Francisco, CA',
		type: 'Full-time',
		salary: '$120k - $180k',
		posted: '2 days ago',
		bookmarked: false,
		description: `We're looking for an experienced software engineer to join our growing team. 
    You'll work on challenging problems and help build products used by millions of users worldwide.`,
		responsibilities: [
			'Design and develop scalable software solutions',
			'Collaborate with cross-functional teams',
			'Mentor junior developers',
			'Participate in code reviews and technical discussions',
			'Contribute to architectural decisions',
		],
		requirements: [
			'5+ years of software development experience',
			'Strong knowledge of React, TypeScript, and Node.js',
			'Experience with cloud platforms (AWS, GCP, or Azure)',
			'Excellent communication skills',
			"Bachelor's degree in Computer Science or related field",
		],
		benefits: [
			'Competitive salary and equity',
			'Health, dental, and vision insurance',
			'401(k) matching',
			'Flexible work hours',
			'Remote work options',
			'Professional development budget',
		],
	};

	return (
		<div className='min-h-screen bg-background pb-20 md:pb-0'>
			<Navbar />

			<div className='container mx-auto px-4 py-8'>
				<div className='max-w-4xl mx-auto'>
					<Button
						variant='ghost'
						onClick={() => navigate(-1)}
						className='mb-4  transition-transform duration-200 hover:scale-105'
					>
						<ArrowLeft className='mr-2 h-4 w-4' />
						Back to Job Listings
					</Button>
					{/* Header */}
					<Card className='mb-6 '>
						<CardHeader>
							<div className='flex justify-between items-start gap-4 mb-4'>
								<div className='flex-1'>
									<CardTitle className='text-3xl mb-2  [animation-delay:100ms]'>
										{job.title}
									</CardTitle>
									<CardDescription className='text-lg flex items-center gap-2  '>
										<Building className='h-5 w-5' />
										{job.company}
									</CardDescription>
								</div>
								<div className='flex gap-2  [animation-delay:200ms]'>
									<Button
										variant='outline'
										size='icon'
										className='transition-transform duration-200 hover:scale-110'
									>
										<Bookmark className='h-5 w-5' />
									</Button>
									<Button
										variant='outline'
										size='icon'
										className='transition-transform duration-200 hover:scale-110'
									>
										<Share2 className='h-5 w-5' />
									</Button>
								</div>
							</div>

							<div className='flex flex-wrap gap-4 text-muted-foreground'>
								<div className='flex items-center gap-1'>
									<MapPin className='h-4 w-4' />
									{job.location}
								</div>
								<div className='flex items-center gap-1'>
									<Briefcase className='h-4 w-4' />
									{job.type}
								</div>
								<div className='flex items-center gap-1'>
									<DollarSign className='h-4 w-4' />
									{job.salary}
								</div>
								<div className='flex items-center gap-1'>
									<Clock className='h-4 w-4' />
									{job.posted}
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<Link to={`/jobs/${id}/apply`}>
								<Button className='w-full bg-gradient-primary hover:opacity-90 font-semibold text-lg py-6 transition-transform duration-200 hover:scale-105'>
									Apply Now
								</Button>
							</Link>
						</CardContent>
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

							<div>
								<h3 className='font-semibold text-lg mb-3'>Responsibilities</h3>
								<ul className='space-y-2'>
									{job.responsibilities.map((item, index) => (
										<li
											key={index}
											className='flex gap-2 text-muted-foreground'
										>
											<span className='text-primary'>•</span>
											<span>{item}</span>
										</li>
									))}
								</ul>
							</div>

							<Separator />

							<div>
								<h3 className='font-semibold text-lg mb-3'>Requirements</h3>
								<ul className='space-y-2'>
									{job.requirements.map((item, index) => (
										<li
											key={index}
											className='flex gap-2 text-muted-foreground'
										>
											<span className='text-primary'>•</span>
											<span>{item}</span>
										</li>
									))}
								</ul>
							</div>

							<Separator />

							<div>
								<h3 className='font-semibold text-lg mb-3'>Benefits</h3>
								<div className='grid md:grid-cols-2 gap-2'>
									{job.benefits.map((item, index) => (
										<Badge
											key={index}
											variant='secondary'
											className='justify-start py-2'
										>
											{item}
										</Badge>
									))}
								</div>
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
