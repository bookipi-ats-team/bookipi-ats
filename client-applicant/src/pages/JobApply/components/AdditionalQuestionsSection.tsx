import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormField } from './FormField';
import { JobApplicationFormData } from '@/schemas/job-application-schema';

interface AdditionalQuestionsSectionProps {
	register: UseFormRegister<JobApplicationFormData>;
	errors: FieldErrors<JobApplicationFormData>;
}

export const AdditionalQuestionsSection = ({
	register,
	errors,
}: AdditionalQuestionsSectionProps) => {
	return (
		<>
			<FormField
				id='experience'
				label='Years of Experience'
				type='number'
				required
				placeholder='5'
				min={0}
				error={errors.experience?.message}
				{...register('experience')}
			/>

			<FormField
				id='salary'
				label='Expected Salary Range'
				placeholder='$120,000 - $150,000'
				error={errors.salary?.message}
				{...register('salary')}
			/>

			<FormField
				id='availability'
				label='When can you start?'
				placeholder='2 weeks notice'
				error={errors.availability?.message}
				{...register('availability')}
			/>
		</>
	);
};
