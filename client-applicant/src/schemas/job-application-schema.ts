import { z } from 'zod';

export const jobApplicationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Current location is required'),
});

export const resumeSchema = z.object({
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
})

export const postPublicApplyBodySchema = z.object({
  jobId: z.string(),
  applicant: jobApplicationSchema,
  resumeFileId: z.string(),
});

export type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;
