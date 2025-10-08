import { Upload } from 'lucide-react';
import { FormField } from './FormField';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export const ProfessionalInfoSection = () => {
	return (
		<>
			<FormField
				id='linkedin'
				label='LinkedIn Profile'
				type='url'
				placeholder='https://linkedin.com/in/yourprofile'
			/>

			<FormField
				id='portfolio'
				label='Portfolio/Website'
				type='url'
				placeholder='https://yourportfolio.com'
			/>

			<div className='space-y-2'>
				<Label htmlFor='resume'>
					Resume/CV <span className='text-red-500'>*</span>
				</Label>
				<div className='flex items-center gap-2'>
					<Input id='resume' type='file' required accept='.pdf,.doc,.docx' />
					<Upload className='h-5 w-5 text-muted-foreground' />
				</div>
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
			/>
		</>
	);
};
