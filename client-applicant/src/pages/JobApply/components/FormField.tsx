import React, { forwardRef } from 'react';
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
	min?: string | number;
	max?: string | number;
	maxLength?: number;
	minLength?: number;
	className?: string;
	isTextarea?: boolean;
	helpText?: string;
	error?: string;
	name?: string;
	onChange?: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	onBlur?: (
		e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
}

export const FormField = forwardRef<
	HTMLInputElement | HTMLTextAreaElement,
	FormFieldProps
>(
	(
		{
			id,
			label,
			type = 'text',
			required = false,
			placeholder,
			accept,
			min,
			max,
			maxLength,
			minLength,
			className,
			isTextarea = false,
			helpText,
			error,
			name,
			onChange,
			onBlur,
		},
		ref
	) => {
		return (
			<div className='space-y-2'>
				<Label htmlFor={id}>
					{label} {required && <span className='text-red-500'>*</span>}
				</Label>
				{isTextarea ? (
					<Textarea
						id={id}
						name={name}
						placeholder={placeholder}
						className={`${className || ''} ${error ? 'border-red-500' : ''}`}
						ref={ref as React.Ref<HTMLTextAreaElement>}
						onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
						onBlur={onBlur as React.FocusEventHandler<HTMLTextAreaElement>}
						maxLength={maxLength}
						minLength={minLength}
					/>
				) : (
					<Input
						id={id}
						name={name}
						type={type}
						placeholder={placeholder}
						accept={accept}
						min={min}
						max={max}
						maxLength={maxLength}
						minLength={minLength}
						className={`${className || ''} ${error ? 'border-red-500' : ''}`}
						ref={ref as React.Ref<HTMLInputElement>}
						onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
						onBlur={onBlur as React.FocusEventHandler<HTMLInputElement>}
					/>
				)}
				{error && <p className='text-xs text-red-500'>{error}</p>}
				{helpText && (
					<p className='text-xs text-muted-foreground'>{helpText}</p>
				)}
			</div>
		);
	}
);

FormField.displayName = 'FormField';
