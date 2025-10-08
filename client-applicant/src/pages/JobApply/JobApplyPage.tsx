import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AdditionalQuestionsSection } from './components/AdditionalQuestionsSection';
import { FormField } from './components/FormField';
import { FormSection } from './components/FormSection';
import { PersonalInfoSection } from './components/PersonalInfoSection';
import { ProfessionalInfoSection } from './components/ProfessionalInfoSection';

const JobApply = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate API call
		setTimeout(() => {
			toast({
				title: 'Application Submitted!',
				description:
					"Your application has been sent successfully. We'll be in touch soon.",
			});
			setIsSubmitting(false);
			navigate('/my-applications');
		}, 1500);
	};

	return (
		<div className='min-h-screen bg-background pb-20 md:pb-0'>
			<Navbar />

			<div className='container mx-auto px-4 py-8'>
				<div className='max-w-2xl mx-auto'>
					<Button
						variant='ghost'
						onClick={() => navigate(`/jobs/${id}`)}
						className='mb-4  transition-transform duration-200 hover:scale-105'
					>
						<ArrowLeft className='mr-2 h-4 w-4' />
						Back to Job Details
					</Button>

					<Card className='mb-6 transition-all duration-300 hover:shadow-lg'>
						<CardHeader>
							<CardTitle className='text-2xl'>
								Apply for Senior Software Engineer
							</CardTitle>
							<CardDescription>
								Fill out the form below to submit your application
							</CardDescription>
						</CardHeader>
					</Card>

					<form onSubmit={handleSubmit} className='space-y-6'>
						<FormSection title='Personal Information'>
							<PersonalInfoSection />
						</FormSection>

						<FormSection title='Professional Information'>
							<ProfessionalInfoSection />
						</FormSection>

						<FormSection title='Additional Questions'>
							<AdditionalQuestionsSection />
						</FormSection>

						<Card className='transition-all duration-300 hover:shadow-md'>
							<CardContent className='pt-6'>
								<Button
									type='submit'
									className='w-full bg-gradient-primary hover:opacity-90 font-semibold py-6 text-lg transition-transform duration-200 hover:scale-105'
									disabled={isSubmitting}
								>
									{isSubmitting ? 'Submitting...' : 'Submit Application'}
								</Button>
							</CardContent>
						</Card>
					</form>
				</div>
			</div>

			<BottomNav />
		</div>
	);
};

export default JobApply;
