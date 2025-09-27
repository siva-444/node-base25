export class BadRequestError extends Error {
  status = 400 as const;
  headers: Record<string, string>;

  constructor(headers: Record<string, string>, message?: string) {
    super(message ?? "Required headers missing");
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
    this.name = this.constructor.name;
    this.headers = headers;
  }
}
export class UnauthorizedError extends Error {
  status = 401 as const;

  constructor(headers: Record<string, string>, message?: string) {
    super(message ?? "Unauthorized Access");
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
    this.name = this.constructor.name;
  }
}
export class NotFoundError extends Error {
  status = 404 as const;
  path: string | null;

  /**
   *
   * @param path req.originalUrl - it will return not found path
   */

  constructor(message: string, path: string | null = null) {
    super("Not Found");
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
    this.name = this.constructor.name;
    this.message = message;
    this.path = path;
  }
}
export class ValidationError extends Error {
  status = 400 as const;
  errors: Record<string, string>;

  constructor(errors: Record<string, string>, message?: string) {
    super(message ?? "Validation error");
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
    this.name = this.constructor.name;
    this.status = 400;
    this.errors = errors;
  }
}

export class UnHandledError extends Error {
  status = 417 as const;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);

    this.name = this.constructor.name;
  }
}
