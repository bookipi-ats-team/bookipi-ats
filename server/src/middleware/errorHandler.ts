import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { AppError, ValidationError } from "../errors/AppError.js";

// Wrap async route handlers to forward errors to next()
export const asyncHandler = <T extends RequestHandler>(handler: T): T => {
  const wrapped: any = (req: any, res: any, next: any) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
  return wrapped;
};

const isAppError = (err: unknown): err is AppError => err instanceof AppError;

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Convert ZodError here if any slipped through validation middleware
  if (err instanceof ZodError) {
    err = new ValidationError(
      "Invalid request",
      err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    );
  }

  // Unknown / non-operational errors
  if (!isAppError(err)) {
    // Log full stack for diagnostics
    console.error("Unhandled error", err);
    const responsePayload = {
      error: {
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      },
    } as const;
    res.status(500).json(responsePayload);
    return;
  }

  // Operational / known error
  const { statusCode, message, code, details } = err;
  if (statusCode >= 500) {
    console.error("Server error", err);
  }
  res.status(statusCode).json({
    error: {
      message,
      code,
      ...(details !== undefined ? { details } : {}),
    },
  });
};
