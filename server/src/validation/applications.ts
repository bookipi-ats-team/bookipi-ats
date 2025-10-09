import { z } from "zod";
import { stageCodes } from "../models/Application.js";
import {
  nonEmptyTrimmedString,
  objectIdString,
  optionalObjectIdString,
  singleStringValue,
} from "./common.js";

const limitSchema = z
  .union([z.string(), z.number(), z.undefined()])
  .transform((value) => {
    if (value === undefined) {
      return undefined;
    }

    if (typeof value === "number") {
      return Number.isFinite(value) ? value : undefined;
    }

    const parsed = Number.parseInt(value, 10);

    if (Number.isNaN(parsed)) {
      return undefined;
    }

    return parsed;
  })
  .transform((value) => {
    const DEFAULT_LIMIT = 20;
    const MAX_LIMIT = 100;

    if (value === undefined) {
      return DEFAULT_LIMIT;
    }

    if (value <= 0) {
      return DEFAULT_LIMIT;
    }

    return Math.min(value, MAX_LIMIT);
  });

const stageSchema = singleStringValue
  .transform((value) => (value === undefined || value.length === 0 ? undefined : value))
  .pipe(z.enum(stageCodes).optional());

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const optionalEmailSchema = z
  .string()
  .transform((value) => value.trim())
  .superRefine((value, ctx) => {
    if (value.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Email is required",
      });
      return;
    }

    if (!emailRegex.test(value)) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid email",
      });
    }
  })
  .transform((value) => value.toLowerCase())
  .optional();

export const getJobApplicationsParamsSchema = z.object({
  jobId: objectIdString,
});

export const getJobApplicationsQuerySchema = z.object({
  stage: stageSchema,
  cursor: singleStringValue.pipe(optionalObjectIdString),
  limit: limitSchema,
});

export type GetJobApplicationsParams = z.infer<typeof getJobApplicationsParamsSchema>;
export type GetJobApplicationsQuery = z.infer<typeof getJobApplicationsQuerySchema>;

export const getApplicationByIdParamsSchema = z.object({
  id: objectIdString,
});

export type GetApplicationByIdParams = z.infer<typeof getApplicationByIdParamsSchema>;

const applicantBodySchema = z
  .object({
    id: optionalObjectIdString,
    email: optionalEmailSchema,
    name: nonEmptyTrimmedString.optional(),
    phone: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.id) {
      return;
    }

    if (!data.email) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Email is required when applicant id is not provided",
      });
    }

    if (!data.name) {
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message: "Name is required when applicant id is not provided",
      });
    }
  });

export const createApplicationBodySchema = z.object({
  jobId: objectIdString,
  applicant: applicantBodySchema,
  resumeFileId: optionalObjectIdString,
});

export type CreateApplicationBody = z.infer<typeof createApplicationBodySchema>;

export const patchApplicationParamsSchema = getApplicationByIdParamsSchema;

export const patchApplicationBodySchema = z
  .object({
    stage: z.enum(stageCodes).optional(),
  })
  .refine((data) => data.stage !== undefined, {
    message: "At least one field must be provided",
    path: ["stage"],
  });

export type PatchApplicationBody = z.infer<typeof patchApplicationBodySchema>;
export type PatchApplicationParams = z.infer<typeof patchApplicationParamsSchema>;

export const postApplicationNoteParamsSchema = getApplicationByIdParamsSchema;

export const postApplicationNoteBodySchema = z.object({
  body: nonEmptyTrimmedString,
});

export type PostApplicationNoteBody = z.infer<typeof postApplicationNoteBodySchema>;
export type PostApplicationNoteParams = z.infer<typeof postApplicationNoteParamsSchema>;

export const getApplicationNotesParamsSchema = getApplicationByIdParamsSchema;

export type GetApplicationNotesParams = z.infer<typeof getApplicationNotesParamsSchema>;
