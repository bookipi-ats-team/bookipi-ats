import { z } from "zod";

const userTypeSchema = z.enum(["applicant", "business"]);

export const loginBodySchema = z.object({
  type: userTypeSchema,
});

export type SignupBody = z.infer<typeof loginBodySchema>;
