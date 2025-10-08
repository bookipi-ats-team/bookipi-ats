import { Upload } from 'lucide-react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormField } from './FormField';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { JobApplicationFormData } from '@/schemas/job-application-schema';

interface ProfessionalInfoSectionProps {
	register: UseFormRegister<JobApplicationFormData>;
	errors: FieldErrors<JobApplicationFormData>;
}

export const ProfessionalInfoSection = ({
	register,
	errors,
}: ProfessionalInfoSectionProps) => {
	return (
		<>
			<FormField
				id='linkedin'
				label='LinkedIn Profile'
				type='url'
				placeholder='https://linkedin.com/in/yourprofile'
				error={errors.linkedin?.message}
				{...register('linkedin')}
			/>

			<FormField
				id='portfolio'
				label='Portfolio/Website'
				type='url'
				placeholder='https://yourportfolio.com'
				error={errors.portfolio?.message}
				{...register('portfolio')}
			/>

			<div className='space-y-2'>
				<Label htmlFor='resume'>
					Resume/CV <span className='text-red-500'>*</span>
				</Label>
				<div className='flex items-center gap-2'>
					<Input
						id='resume'
						type='file'
						accept='.pdf,.doc,.docx'
						{...register('resume')}
						className={errors.resume ? 'border-red-500' : ''}
					/>
					<Upload className='h-5 w-5 text-muted-foreground' />
				</div>
				{errors.resume && (
					<p className='text-xs text-red-500'>
						{String(errors.resume?.message)}
					</p>
				)}
				<p className='text-xs text-muted-foreground'>
					Accepted formats: PDF, DOC, DOCX (Max 5MB)
				</p>
			</div>

			<FormField
				id='coverLetter'
				label='Cover Letter'
				placeholder="Tell us why you're interested in this position..."
				isTextarea
				className='min-h-[150px]'
				error={errors.coverLetter?.message}
				{...register('coverLetter')}
			/>
		</>
	);
};
