import React, { useCallback, useState } from 'react';
import {
	UseFormRegister,
	FieldErrors,
	UseFormSetValue,
	UseFormWatch,
} from 'react-hook-form';
import {
	Upload,
	FileText,
	X,
	AlertCircle,
	Loader2,
	CheckCircle2,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { JobApplicationFormData } from '@/schemas/job-application-schema';
import { cn } from '@/lib/utils';
import {
	UploadResumeResponse,
	useUploadResume,
} from '@/hooks/mutation/useUploadResume';

interface ResumeUploadSectionProps {
	register: UseFormRegister<JobApplicationFormData>;
	errors: FieldErrors<JobApplicationFormData>;
	setValue: UseFormSetValue<JobApplicationFormData>;
	watch: UseFormWatch<JobApplicationFormData>;
	jobId?: string;
	applicantId?: string;
	onUploadStatusChange?: (isUploading: boolean) => void;
}

export const ResumeUploadSection = ({
	register,
	errors,
	setValue,
	watch,
	jobId,
	applicantId,
	onUploadStatusChange,
}: ResumeUploadSectionProps) => {
	const [isDragOver, setIsDragOver] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [uploadedResume, setUploadedResume] = useState<UploadResumeResponse | null>(
		null
	);
	const uploadResumeMutation = useUploadResume();
	const watchedResume = watch('resume');
	const watchedResumeFileId = watch('resumeFileId');

	const resumeField = register('resume');
	const resumeFileIdField = register('resumeFileId');

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

	const allowedMimeTypes = [
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'application/vnd.oasis.opendocument.text',
		'text/plain',
	];

	const validateFile = (file: File): string | null => {
		if (file.size > 15 * 1024 * 1024) {
			return 'File size must be less than 15MB';
		}

		if (!allowedMimeTypes.includes(file.type)) {
			return 'Only PDF, DOC, DOCX, ODT or TXT files are allowed';
		}

		return null;
	};

	const resetFileState = useCallback(() => {
		setValue('resume', null as unknown as File, {
			shouldValidate: true,
			shouldDirty: true,
			shouldTouch: true,
		});
		setValue('resumeFileId', undefined, {
			shouldValidate: true,
			shouldDirty: true,
			shouldTouch: true,
		});
		setUploadedResume(null);
		uploadResumeMutation.reset();
	}, [setValue, uploadResumeMutation]);

	const handleFileSelection = useCallback(
		async (file: File) => {
			if (uploadResumeMutation.isPending) {
				return;
			}

			setIsDragOver(false);

			const validationError = validateFile(file);
			if (validationError) {
				resetFileState();
				setUploadError(validationError);
				return;
			}

			setUploadError(null);
			setValue('resume', file, {
				shouldValidate: true,
				shouldDirty: true,
				shouldTouch: true,
			});
			setValue('resumeFileId', undefined, {
				shouldValidate: true,
				shouldDirty: true,
				shouldTouch: true,
			});

			setUploadedResume(null);
			onUploadStatusChange?.(true);

			try {
				const result = await uploadResumeMutation.mutateAsync({
					file,
					jobId,
					applicantId,
				});
				setUploadedResume(result);
				setValue('resumeFileId', result.fileId, {
					shouldValidate: true,
					shouldDirty: true,
					shouldTouch: true,
				});
			} catch (error) {
				const message =
					error instanceof Error
						? error.message
						: 'Failed to upload resume. Please try again.';
				resetFileState();
				setUploadError(message);
			} finally {
				onUploadStatusChange?.(false);
			}
		},
		[
			uploadResumeMutation,
			setValue,
			onUploadStatusChange,
			jobId,
			applicantId,
			resetFileState,
		]
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragOver(false);

			const files = Array.from(e.dataTransfer.files);
			if (files.length > 0) {
				void handleFileSelection(files[0]);
			}
		},
		[handleFileSelection]
	);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		resumeField.onChange(e);
		setIsDragOver(false);

		const files = e.target.files;
		if (files && files.length > 0) {
			void handleFileSelection(files[0]);
		}
	};

	const removeFile = () => {
		onUploadStatusChange?.(false);
		resetFileState();
		setUploadError(null);
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

			<input type='hidden' {...resumeFileIdField} />

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
							Supports PDF, DOC, DOCX, ODT or TXT files up to 15MB
						</p>
					</div>

					<input
						id='resume'
						type='file'
						accept='.pdf,.doc,.docx,.odt,.txt'
						className='hidden'
						{...resumeField}
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
								{uploadResumeMutation.isPending && (
									<p className='flex items-center gap-1 text-xs text-blue-600'>
										<Loader2 className='h-3 w-3 animate-spin' /> Uploading...
									</p>
								)}
								{!uploadResumeMutation.isPending && watchedResumeFileId && (
									<p className='flex items-center gap-1 text-xs text-green-600'>
										<CheckCircle2 className='h-3 w-3' /> Uploaded successfully
									</p>
								)}
								{!uploadResumeMutation.isPending && uploadedResume?.url && (
									<a
										href={uploadedResume.url}
										target='_blank'
										rel='noopener noreferrer'
										className='text-xs text-blue-600 hover:underline'
									>
										View uploaded file
									</a>
								)}
							</div>
						</div>
						<button
							type='button'
							onClick={removeFile}
							className='text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50'
							disabled={uploadResumeMutation.isPending}
						>
							<X className='h-5 w-5' />
						</button>
					</div>
				</div>
			)}

			{(uploadError || errors.resume) && (
				<div className='flex items-center gap-2 text-red-500 text-sm'>
					<AlertCircle className='h-4 w-4' />
					<span>{uploadError ?? errors.resume?.message}</span>
				</div>
			)}
		</div>
	);
};
