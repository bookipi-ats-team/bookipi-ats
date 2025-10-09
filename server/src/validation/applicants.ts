import { z } from "zod";
import { objectIdString, optionalObjectIdString, singleStringValue } from "./common.js";

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

const searchSchema = singleStringValue.transform((value) => {
  if (!value) {
    return undefined;
  }

  return value.length > 0 ? value : undefined;
});

export const getApplicantsQuerySchema = z.object({
  businessId: singleStringValue.pipe(optionalObjectIdString),
  q: searchSchema,
  cursor: singleStringValue.pipe(optionalObjectIdString),
  limit: limitSchema,
});

export type GetApplicantsQuery = z.infer<typeof getApplicantsQuerySchema>;

export const getApplicantByIdParamsSchema = z.object({
  id: objectIdString,
});

export type GetApplicantByIdParams = z.infer<typeof getApplicantByIdParamsSchema>;
