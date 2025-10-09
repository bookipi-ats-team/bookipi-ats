import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { FormSection } from './components/FormSection';
import { PersonalInfoSection } from './components/PersonalInfoSection';
import { ResumeUploadSection } from './components/ResumeUploadSection';
import {
	jobApplicationSchema,
	JobApplicationFormData,
} from '@/schemas/job-application-schema';
import { useSubmitApplication } from '@/hooks/mutation/useSubmitApplication';

const JobApply = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { toast } = useToast();
	const submitApplicationMutation = useSubmitApplication();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<JobApplicationFormData>({
		resolver: zodResolver(jobApplicationSchema),
	});

	const onSubmit = async (data: JobApplicationFormData) => {
		if (!id) {
			toast({
				title: 'Error',
				description: 'Job ID is missing',
				variant: 'destructive',
			});
			return;
		}

		try {
			await submitApplicationMutation.mutateAsync({
				jobId: id,
				data,
			});

			toast({
				title: 'Application Submitted!',
				description:
					"Your application has been sent successfully. We'll be in touch soon.",
			});

			navigate('/jobs/apply/success');
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to submit application. Please try again.',
				variant: 'destructive',
			});
		}
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

					<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
						<FormSection title='Personal Information'>
							<PersonalInfoSection register={register} errors={errors} />
						</FormSection>

						<FormSection title='Resume Upload'>
							<ResumeUploadSection
								register={register}
								errors={errors}
								setValue={setValue}
								watch={watch}
							/>
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
