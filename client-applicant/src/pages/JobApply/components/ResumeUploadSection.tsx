import React, { useCallback, useState } from 'react';
import {
	UseFormRegister,
	FieldErrors,
	UseFormSetValue,
	UseFormWatch,
} from 'react-hook-form';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { JobApplicationFormData } from '@/schemas/job-application-schema';
import { cn } from '@/lib/utils';

interface ResumeUploadSectionProps {
	register: UseFormRegister<JobApplicationFormData>;
	errors: FieldErrors<JobApplicationFormData>;
	setValue: UseFormSetValue<JobApplicationFormData>;
	watch: UseFormWatch<JobApplicationFormData>;
}

export const ResumeUploadSection = ({
	register,
	errors,
	setValue,
	watch,
}: ResumeUploadSectionProps) => {
	const [isDragOver, setIsDragOver] = useState(false);
	const watchedResume = watch('resume');

	// Check if watchedResume is a valid File object
	const hasValidFile =
		watchedResume instanceof File &&
		watchedResume.name &&
		watchedResume.size > 0;

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	}, []);

	const validateFile = (file: File): string | null => {
		const allowedTypes = [
			'application/pdf',
			'image/jpeg',
			'image/jpg',
			'image/png',
			'image/gif',
			'image/webp',
		];

		if (!allowedTypes.includes(file.type)) {
			return 'Only PDF and image files (JPEG, PNG, GIF, WebP) are allowed';
		}

		if (file.size > 10 * 1024 * 1024) {
			return 'File size must be less than 10MB';
		}

		return null;
	};

	const handleFileSelection = useCallback(
		(file: File) => {
			const error = validateFile(file);
			if (!error) {
				setValue('resume', file, { shouldValidate: true });
			}
		},
		[setValue]
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragOver(false);

			const files = Array.from(e.dataTransfer.files);
			if (files.length > 0) {
				handleFileSelection(files[0]);
			}
		},
		[handleFileSelection]
	);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			handleFileSelection(files[0]);
		}
	};

	const removeFile = () => {
		setValue('resume', null as unknown as File, { shouldValidate: true });
	};

	const getFileIcon = (file: File) => {
		if (file.type === 'application/pdf') {
			return <FileText className='h-8 w-8 text-red-500' />;
		}
		return <FileText className='h-8 w-8 text-blue-500' />;
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	return (
		<div className='space-y-2'>
			<Label htmlFor='resume'>
				Resume/CV <span className='text-red-500'>*</span>
			</Label>

			{!hasValidFile ? (
				<div
					className={cn(
						'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
						isDragOver
							? 'border-primary bg-primary/5'
							: 'border-gray-300 hover:border-gray-400',
						errors.resume && 'border-red-500'
					)}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					onClick={() => document.getElementById('resume')?.click()}
				>
					<Upload className='h-12 w-12 text-gray-400 mx-auto mb-4' />
					<div className='space-y-2'>
						<p className='text-lg font-medium'>
							{isDragOver ? 'Drop your file here' : 'Upload your resume'}
						</p>
						<p className='text-sm text-gray-500'>
							Drag and drop your file here, or click to browse
						</p>
						<p className='text-xs text-gray-400'>
							Supports PDF and image files (JPEG, PNG, GIF, WebP) up to 10MB
						</p>
					</div>

					<input
						id='resume'
						type='file'
						accept='.pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp'
						className='hidden'
						{...register('resume')}
						onChange={handleFileChange}
					/>
				</div>
			) : (
				<div className='border rounded-lg p-4 bg-gray-50'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-3'>
							{getFileIcon(watchedResume as File)}
							<div>
								<p className='font-medium text-sm'>
									{(watchedResume as File).name}
								</p>
								<p className='text-xs text-gray-500'>
									{formatFileSize((watchedResume as File).size)}
								</p>
							</div>
						</div>
						<button
							type='button'
							onClick={removeFile}
							className='text-gray-400 hover:text-red-500 transition-colors'
						>
							<X className='h-5 w-5' />
						</button>
					</div>
				</div>
			)}

			{errors.resume && (
				<div className='flex items-center gap-2 text-red-500 text-sm'>
					<AlertCircle className='h-4 w-4' />
					<span>{errors.resume.message}</span>
				</div>
			)}
		</div>
	);
};
