import { z } from "zod";
import { EmploymentType } from "../models/Job.js";
import {
  nonEmptyTrimmedString,
  objectIdString,
  optionalObjectIdString,
  singleStringValue,
} from "./common.js";

const employmentTypeEnum = z.nativeEnum(EmploymentType);

const optionalTrimmedString = singleStringValue.transform((value) =>
  value && value.length > 0 ? value : undefined,
);

const limitSchema = singleStringValue
  .transform((value) => {
    if (value === undefined) {
      return 20;
    }

    const parsed = Number.parseInt(value, 10);

    if (Number.isNaN(parsed)) {
      return 20;
    }

    return parsed;
  })
  .pipe(z.number().min(1).max(100));

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .max(320, "Email is too long")
  .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(value), {
    message: "Invalid email",
  })
  .transform((value) => value.toLowerCase());

export const getPublicJobsQuerySchema = z.object({
  q: optionalTrimmedString,
  location: optionalTrimmedString,
  industry: optionalTrimmedString,
  employmentType: singleStringValue.pipe(employmentTypeEnum).optional(),
  cursor: optionalObjectIdString,
  limit: limitSchema,
});

export type GetPublicJobsQuery = z.infer<typeof getPublicJobsQuerySchema>;

export const getPublicJobParamsSchema = z.object({
  jobId: objectIdString,
});

export type GetPublicJobParams = z.infer<typeof getPublicJobParamsSchema>;

const applicantSchema = z.object({
  email: emailSchema,
  name: nonEmptyTrimmedString,
  phone: optionalTrimmedString,
  location: optionalTrimmedString,
});

export const postPublicApplyBodySchema = z.object({
  jobId: objectIdString,
  applicant: applicantSchema,
  resumeFileId: optionalObjectIdString,
});

export type PostPublicApplyBody = z.infer<typeof postPublicApplyBodySchema>;

export const getPublicApplicationsParamsSchema = z.object({
  email: emailSchema,
});

export type GetPublicApplicationsParams = z.infer<
  typeof getPublicApplicationsParamsSchema
>;
