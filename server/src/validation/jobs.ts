import { z } from "zod";
import { objectIdString, singleStringValue } from "./common.js";

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
