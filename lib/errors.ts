export class ApplicationError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number = 400,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApplicationError";
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string, details?: unknown) {
    super("validation_failed", message, 422, details);
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(message = "Authentication required.") {
    super("unauthorized", message, 401);
  }
}

export class ConflictError extends ApplicationError {
  constructor(message: string, details?: unknown) {
    super("conflict", message, 409, details);
  }
}
