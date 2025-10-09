import { z } from 'zod';

export const jobApplicationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Current location is required'),
  resume: z.instanceof(File, { message: 'Please upload your resume' })
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(
      (file) => {
        const allowedTypes = [
          'application/pdf',
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp'
        ];
        return allowedTypes.includes(file.type);
      },
      'Only PDF and image files (JPEG, PNG, GIF, WebP) are allowed'
    ),
});

// Schema for applicant data without the resume file (for API submission)
export const applicantDataSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Current location is required'),
});

export const postPublicApplyBodySchema = z.object({
  jobId: z.string(),
  applicant: applicantDataSchema,
  resumeFileId: z.string().optional(),
});

export type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;
export type ApplicantData = z.infer<typeof applicantDataSchema>;
