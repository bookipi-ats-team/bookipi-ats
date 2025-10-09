import { z } from "zod";
import { nonEmptyTrimmedString, optionalObjectIdString } from "./common.js";
import env from "../config/env.js";

const mimeTypeSchema = z
  .string()
  .trim()
  .min(1, "Mime type is required")
  .refine((value) => env.allowedResumeMimeTypes.has(value), {
    message: "Unsupported mime type",
  });

const fileSizeSchema = z
  .number()
  .int("File size must be an integer")
  .positive("File size must be greater than zero")
  .max(env.maxResumeFileSize, "File exceeds maximum allowed size");

export const resumeSignBodySchema = z.object({
  mimeType: mimeTypeSchema,
  sizeBytes: fileSizeSchema,
});

export type ResumeSignBody = z.infer<typeof resumeSignBodySchema>;

export const resumeConfirmBodySchema = z.object({
  fileId: z.string().uuid({ message: "Invalid file id" }),
  applicantId: optionalObjectIdString,
  jobId: optionalObjectIdString,
  originalName: nonEmptyTrimmedString,
  mimeType: mimeTypeSchema,
  sizeBytes: fileSizeSchema,
});

export type ResumeConfirmBody = z.infer<typeof resumeConfirmBodySchema>;

export const resumeUploadParamsSchema = z.object({
  fileId: z.string().uuid({ message: "Invalid file id" }),
});

export type ResumeUploadParams = z.infer<typeof resumeUploadParamsSchema>;
