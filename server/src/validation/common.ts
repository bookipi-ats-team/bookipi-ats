import { Types } from "mongoose";
import { z } from "zod";

export const singleStringValue = z
  .union([z.string(), z.array(z.string()), z.undefined()])
  .transform((value) => {
    if (Array.isArray(value)) {
      return value[0];
    }

    return value;
  })
  .transform((value) => (value === undefined ? undefined : value.trim()));

export const objectIdString = z
  .string()
  .trim()
  .min(1, "Value is required")
  .refine((value) => Types.ObjectId.isValid(value), {
    message: "Invalid ObjectId",
  });

export const optionalObjectIdString = objectIdString.optional();

export const nonEmptyTrimmedString = z.string().trim().min(1, "Value is required");
