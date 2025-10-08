import { z } from 'zod';

export const jobApplicationSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Current location is required'),

  // Professional Information
  linkedin: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  portfolio: z.string().url('Please enter a valid portfolio URL').optional().or(z.literal('')),
  resume: z.any().refine((files) => files?.length === 1, 'Resume is required'),
  coverLetter: z.string().optional(),

  // Additional Questions
  experience: z.string().min(1, 'Years of experience is required'),
  salary: z.string().optional(),
  availability: z.string().optional(),
});

export type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;
