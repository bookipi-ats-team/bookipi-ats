import { z } from "zod";
import { EmploymentType, WorkMode } from "../models/Job.js";
import {
  nonEmptyTrimmedString,
  objectIdString,
  optionalObjectIdString,
  singleStringValue,
} from "./common.js";

const employmentTypeEnum = z.nativeEnum(EmploymentType);
const workModeTypeEnum = z.nativeEnum(WorkMode);

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

// Helper to parse a date string (ISO or yyyy-mm-dd)
const dateString = singleStringValue
  .transform((value) => {
    if (!value) return undefined;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? undefined : d;
  })
  .optional();

// Helper to parse comma separated enum values (e.g. REMOTE,ONSITE)
const commaSeparatedWorkModes = singleStringValue
  .transform((value) => {
    if (!value) return undefined;
    return value
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
  })
  .pipe(z.array(workModeTypeEnum))
  .optional();

export const getPublicJobsQuerySchema = z.object({
  keyword: optionalTrimmedString,
  location: optionalTrimmedString,
  industry: optionalTrimmedString,
  workModes: commaSeparatedWorkModes,
  employmentType: singleStringValue.pipe(employmentTypeEnum).optional(),
  publishedAt: dateString,
  sortBy: singleStringValue
    .transform((value) => (value ? value : undefined))
    .refine(
      (value) => value === undefined || ["publishedAt", "relevance"].includes(value),
      { message: "Invalid sortBy" },
    )
    .optional(),
  sortOrder: singleStringValue
    .transform((value) => (value ? value.toLowerCase() : undefined))
    .refine(
      (value) => value === undefined || ["asc", "desc"].includes(value),
      { message: "Invalid sortOrder" },
    )
    .optional(),
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
