import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { ZodError } from "zod";

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

export const validateRequest = (schemas: ValidationSchemas): RequestHandler =>
  (req, res, next) => {
    try {
      if (schemas.body) {
        const result = schemas.body.safeParse(req.body);

        if (!result.success) {
          res.status(400).json({
            error: "Invalid request body",
            details: formatIssues(result.error),
          });
          return;
        }

        req.body = result.data as typeof req.body;
      }

      if (schemas.query) {
        const result = schemas.query.safeParse(req.query);

        if (!result.success) {
          res.status(400).json({
            error: "Invalid request query",
            details: formatIssues(result.error),
          });
          return;
        }

        req.query = result.data as typeof req.query;
      }

      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);

        if (!result.success) {
          res.status(400).json({
            error: "Invalid request params",
            details: formatIssues(result.error),
          });
          return;
        }

        req.params = result.data as typeof req.params;
      }

      next();
    } catch (error) {
      console.error("Failed to validate request", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
