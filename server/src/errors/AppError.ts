export interface AppErrorOptions {
  statusCode?: number;
  code?: string;
  details?: unknown;
  cause?: unknown;
  isOperational?: boolean;
}

export class AppError extends Error {
  readonly statusCode: number;
  readonly code?: string;
  readonly details?: unknown;
  readonly isOperational: boolean;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message);
    this.name = new.target.name;
    this.statusCode = options.statusCode ?? 500;
    this.code = options.code;
    this.details = options.details;
    this.isOperational = options.isOperational ?? this.statusCode < 500;
    if (options.cause) {
      // @ts-ignore - standard in newer TS/Node, but keep compatibility
      this.cause = options.cause;
    }
    Error.captureStackTrace?.(this, new.target);
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
      details: this.details,
    };
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", options: AppErrorOptions = {}) {
    super(message, { statusCode: 400, code: options.code ?? "BAD_REQUEST", ...options });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", options: AppErrorOptions = {}) {
    super(message, { statusCode: 401, code: options.code ?? "UNAUTHORIZED", ...options });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", options: AppErrorOptions = {}) {
    super(message, { statusCode: 403, code: options.code ?? "FORBIDDEN", ...options });
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found", options: AppErrorOptions = {}) {
    super(message, { statusCode: 404, code: options.code ?? "NOT_FOUND", ...options });
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", options: AppErrorOptions = {}) {
    super(message, { statusCode: 409, code: options.code ?? "CONFLICT", ...options });
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message = "Unprocessable entity", options: AppErrorOptions = {}) {
    super(message, { statusCode: 422, code: options.code ?? "UNPROCESSABLE_ENTITY", ...options });
  }
}

export class ValidationError extends BadRequestError {
  constructor(message = "Validation failed", details?: unknown, options: AppErrorOptions = {}) {
    super(message, { ...options, details, code: options.code ?? "VALIDATION_ERROR" });
  }
}
