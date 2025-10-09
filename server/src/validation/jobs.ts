import { z } from "zod";
import { objectIdString, optionalObjectIdString, singleStringValue } from "./common.js";

const employmentTypeEnum = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERN",
  "TEMPORARY",
]);

const jobStatusEnum = z.enum(["DRAFT", "PUBLISHED", "PAUSED", "CLOSED"]);

const requiredString = singleStringValue.refine(
  (value): value is string => value !== undefined && value.length > 0,
  {
    message: "Value is required",
  },
);

const optionalString = singleStringValue.transform((value) =>
  value && value.length > 0 ? value : undefined,
);

export const createJobBodySchema = z.object({
  businessId: objectIdString,
  title: requiredString,
  description: requiredString,
  mustHaves: z
    .array(z.string().trim())
    .default([])
    .transform((arr) => arr.filter((item) => item.length > 0)),
  location: optionalString,
  employmentType: employmentTypeEnum,
  industry: optionalString,
});

export type CreateJobBody = z.infer<typeof createJobBodySchema>;

export const jobIdParamsSchema = z.object({
  id: objectIdString,
});

export type JobIdParams = z.infer<typeof jobIdParamsSchema>;

export const updateJobBodySchema = z
  .object({
    title: optionalString,
    description: optionalString,
    mustHaves: z
      .array(z.string().trim())
      .transform((arr) => arr.filter((item) => item.length > 0))
      .optional(),
    location: optionalString,
    employmentType: employmentTypeEnum.optional(),
    industry: optionalString,
    status: jobStatusEnum.optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });

export type UpdateJobBody = z.infer<typeof updateJobBodySchema>;

export const getJobsQuerySchema = z.object({
  businessId: optionalObjectIdString,
  status: jobStatusEnum.optional(),
  q: optionalString,
  location: optionalString,
  industry: optionalString,
  employmentType: employmentTypeEnum.optional(),
  publishedAfter: singleStringValue
    .transform((value) => {
      if (!value) return undefined;
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? undefined : date;
    })
    .optional(),
  cursor: optionalString,
  limit: singleStringValue
    .transform((value) => {
      if (value === undefined) return 20;
      const parsed = Number.parseInt(value, 10);
      return Number.isNaN(parsed) ? 20 : parsed;
    })
    .pipe(z.number().min(1).max(100)),
});

export type GetJobsQuery = z.infer<typeof getJobsQuerySchema>;
