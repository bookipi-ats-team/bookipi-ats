import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface FormSectionProps {
	title: string;
	children: ReactNode;
	className?: string;
}

export const FormSection = ({
	title,
	children,
	className = '',
}: FormSectionProps) => {
	return (
		<Card
			className={`transition-all duration-300 hover:shadow-md ${className}`}
		>
			<CardHeader className='pb-4'>
				<CardTitle className='text-lg font-semibold'>{title}</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>{children}</CardContent>
		</Card>
	);
};
