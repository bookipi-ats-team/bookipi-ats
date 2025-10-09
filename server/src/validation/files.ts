import { z } from "zod";
import {
  nonEmptyTrimmedString,
  optionalObjectIdString,
  singleStringValue,
} from "./common.js";

const optionalResumeRelation = singleStringValue.pipe(optionalObjectIdString);
const optionalOriginalName = singleStringValue.pipe(
  z.union([nonEmptyTrimmedString, z.undefined()]),
);

export const resumeUploadQuerySchema = z.object({
  applicantId: optionalResumeRelation,
  jobId: optionalResumeRelation,
  originalName: optionalOriginalName,
});

export type ResumeUploadQuery = z.infer<typeof resumeUploadQuerySchema>;
