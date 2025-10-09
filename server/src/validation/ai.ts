import { z } from "zod";
import {
  nonEmptyTrimmedString,
  objectIdString,
  optionalObjectIdString,
} from "./common.js";

const optionalTrimmedString = z.string().trim().min(1, "Value is required").optional();

export const suggestJobTitlesBodySchema = z.object({
  businessId: optionalObjectIdString,
  industry: optionalTrimmedString,
  description: optionalTrimmedString,
});

export type SuggestJobTitlesBody = z.infer<typeof suggestJobTitlesBodySchema>;

export const suggestMustHavesBodySchema = z.object({
  jobTitle: nonEmptyTrimmedString,
  industry: optionalTrimmedString,
  seniority: optionalTrimmedString,
});

export type SuggestMustHavesBody = z.infer<typeof suggestMustHavesBodySchema>;

export const generateJobDescriptionBodySchema = z.object({
  jobTitle: nonEmptyTrimmedString,
  mustHaves: z.array(nonEmptyTrimmedString).default([]),
  business: z.object({
    name: nonEmptyTrimmedString,
    description: z.string().trim().optional(),
    industry: optionalTrimmedString,
  }),
  extras: z.array(nonEmptyTrimmedString).optional(),
});

export type GenerateJobDescriptionBody = z.infer<typeof generateJobDescriptionBodySchema>;

const jobContextSchema = z.object({
  title: nonEmptyTrimmedString,
  mustHaves: z.array(nonEmptyTrimmedString).default([]),
  description: z.string().trim().optional(),
});

export const scoreResumeApplicationBodySchema = z.object({
  applicationId: objectIdString,
});

export type ScoreResumeApplicationBody = z.infer<typeof scoreResumeApplicationBodySchema>;

export const scoreResumeInlineBodySchema = z
  .object({
    resumeFileId: optionalObjectIdString,
    resumeText: z
      .string()
      .trim()
      .min(40, "Resume text must be at least 40 characters")
      .max(12_000, "Resume text is too long")
      .optional(),
    job: jobContextSchema,
  })
  .refine(
    (value) => Boolean(value.resumeFileId || value.resumeText),
    {
      message: "Provide resumeFileId or resumeText",
      path: ["resumeFileId"],
    },
  );

export type ScoreResumeInlineBody = z.infer<typeof scoreResumeInlineBodySchema>;

export const scoreResumeBodySchema = z.union([
  scoreResumeApplicationBodySchema,
  scoreResumeInlineBodySchema,
]);

export type ScoreResumeBody = z.infer<typeof scoreResumeBodySchema>;
