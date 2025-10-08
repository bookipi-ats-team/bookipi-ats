import * as z from 'zod';

export const filterSchema = z.object({
  searchQuery: z.string().optional().default(''),
  jobType: z.string().optional().default('all'),
  location: z.string().optional().default('all'),
  datePosted: z.string().optional().default('all'),
  language: z.string().optional().default('all'),
  industry: z.string().optional().default('all'),
  payRange: z.string().optional().default('all'),
});

export type FilterFormData = z.infer<typeof filterSchema>;
