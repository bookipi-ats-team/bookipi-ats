import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormField } from './FormField';
import { JobApplicationFormData } from '@/schemas/job-application-schema';

interface PersonalInfoSectionProps {
	register: UseFormRegister<JobApplicationFormData>;
	errors: FieldErrors<JobApplicationFormData>;
}

export const PersonalInfoSection = ({
	register,
	errors,
}: PersonalInfoSectionProps) => {
	return (
		<>
			<FormField
				id='name'
				label='Full Name'
				required
				placeholder='John Doe'
				error={errors.name?.message}
				{...register('name')}
			/>

			<FormField
				id='email'
				label='Email'
				type='email'
				required
				placeholder='john.doe@example.com'
				error={errors.email?.message}
				{...register('email')}
			/>

			<FormField
				id='phone'
				label='Phone Number'
				type='tel'
				required
				placeholder='+1 (555) 123-4567'
				error={errors.phone?.message}
				{...register('phone')}
			/>

			<FormField
				id='location'
				label='Current Location'
				required
				placeholder='San Francisco, CA'
				error={errors.location?.message}
				{...register('location')}
			/>
		</>
	);
};
