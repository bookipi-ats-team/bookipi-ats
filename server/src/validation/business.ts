import { z } from "zod";
import { objectIdString, singleStringValue } from "./common.js";

const requiredBusinessName = singleStringValue.refine(
  (value): value is string => value !== undefined && value.length > 0,
  {
    message: "Name is required",
  },
);

const optionalBusinessField = singleStringValue.transform((value) =>
  value && value.length > 0 ? value : undefined,
);

export const createBusinessBodySchema = z.object({
  name: requiredBusinessName,
  description: optionalBusinessField,
  industry: optionalBusinessField,
});

export type CreateBusinessBody = z.infer<typeof createBusinessBodySchema>;

export const updateBusinessParamsSchema = z.object({
  id: objectIdString,
});

export const updateBusinessBodySchema = z
  .object({
    name: optionalBusinessField,
    description: optionalBusinessField,
    industry: optionalBusinessField,
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });

export type UpdateBusinessBody = z.infer<typeof updateBusinessBodySchema>;
export type UpdateBusinessParams = z.infer<typeof updateBusinessParamsSchema>;
