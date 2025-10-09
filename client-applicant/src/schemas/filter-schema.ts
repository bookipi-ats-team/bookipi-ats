import * as z from 'zod';

export const filterSchema = z.object({
  q: z.string().optional().default(''),
  // status: z.string().optional(),
  location: z.string().optional(),
  datePosted: z.string().optional(),
  industry: z.string().optional(),
});

export type FilterFormData = z.infer<typeof filterSchema>;
