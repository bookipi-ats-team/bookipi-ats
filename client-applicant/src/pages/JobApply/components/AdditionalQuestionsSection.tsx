import { FormField } from './FormField';

export const AdditionalQuestionsSection = () => {
	return (
		<>
			<FormField
				id='experience'
				label='Years of Experience'
				type='number'
				required
				placeholder='5'
				min='0'
			/>

			<FormField
				id='salary'
				label='Expected Salary Range'
				placeholder='$120,000 - $150,000'
			/>

			<FormField
				id='availability'
				label='When can you start?'
				placeholder='2 weeks notice'
			/>
		</>
	);
};
