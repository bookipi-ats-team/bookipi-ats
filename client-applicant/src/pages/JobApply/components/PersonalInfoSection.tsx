import { FormField } from './FormField';

export const PersonalInfoSection = () => {
	return (
		<>
			<div className='grid md:grid-cols-2 gap-4'>
				<FormField
					id='firstName'
					label='First Name'
					required
					placeholder='John'
				/>
				<FormField id='lastName' label='Last Name' required placeholder='Doe' />
			</div>

			<FormField
				id='email'
				label='Email'
				type='email'
				required
				placeholder='john.doe@example.com'
			/>

			<FormField
				id='phone'
				label='Phone Number'
				type='tel'
				required
				placeholder='+1 (555) 123-4567'
			/>

			<FormField
				id='location'
				label='Current Location'
				required
				placeholder='San Francisco, CA'
			/>
		</>
	);
};
