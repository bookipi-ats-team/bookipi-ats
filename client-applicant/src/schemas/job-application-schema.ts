import { z } from 'zod';

export const jobApplicationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Current location is required'),
  resume: z.instanceof(File, { message: 'Please upload your resume' })
    .refine((file) => file.size <= 15 * 1024 * 1024, 'File size must be less than 15MB')
    .refine(
      (file) => {
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.oasis.opendocument.text',
          'text/plain',
        ];
        return allowedTypes.includes(file.type);
      },
      'Only PDF, DOC, DOCX, ODT or TXT files are allowed'
    ),
  resumeFileId: z.string().min(1, 'Resume upload was not confirmed').optional(),
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
