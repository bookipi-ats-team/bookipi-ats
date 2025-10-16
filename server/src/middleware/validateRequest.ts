import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { ZodError } from "zod";
import { ValidationError } from "../errors/AppError.js";

interface ValidationSchemas {
  readonly body?: ZodType<unknown>;
  readonly query?: ZodType<unknown>;
  readonly params?: ZodType<unknown>;
}

interface ValidationIssue {
  readonly path: string;
  readonly message: string;
}

const formatIssues = (error: ZodError): ValidationIssue[] =>
  error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

export const validateRequest =
  (
    schemas: ValidationSchemas,
  ): RequestHandler<unknown, unknown, unknown, unknown> =>
  (req, res, next) => {
    try {
      if (schemas.body) {
        const result = schemas.body.safeParse(req.body);

        if (!result.success) {
          throw new ValidationError(
            "Invalid request body",
            formatIssues(result.error),
          );
        }

        req.body = result.data as typeof req.body;
      }

      if (schemas.query) {
        const result = schemas.query.safeParse(req.query);

        if (!result.success) {
          throw new ValidationError(
            "Invalid request query",
            formatIssues(result.error),
          );
        }

        req.query = result.data as typeof req.query;
      }

      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);

        if (!result.success) {
          throw new ValidationError(
            "Invalid request params",
            formatIssues(result.error),
          );
        }

        req.params = result.data as typeof req.params;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
