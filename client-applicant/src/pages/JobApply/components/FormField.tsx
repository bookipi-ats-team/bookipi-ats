import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface FormFieldProps {
	id: string;
	label: string;
	type?: string;
	required?: boolean;
	placeholder?: string;
	accept?: string;
	min?: string;
	className?: string;
	isTextarea?: boolean;
	helpText?: string;
}

export const FormField = ({
	id,
	label,
	type = 'text',
	required = false,
	placeholder,
	accept,
	min,
	className,
	isTextarea = false,
	helpText,
}: FormFieldProps) => {
	return (
		<div className='space-y-2'>
			<Label htmlFor={id}>
				{label} {required && <span className='text-red-500'>*</span>}
			</Label>
			{isTextarea ? (
				<Textarea id={id} placeholder={placeholder} className={className} />
			) : (
				<Input
					id={id}
					type={type}
					required={required}
					placeholder={placeholder}
					accept={accept}
					min={min}
					className={className}
				/>
			)}
			{helpText && <p className='text-xs text-muted-foreground'>{helpText}</p>}
		</div>
	);
};
