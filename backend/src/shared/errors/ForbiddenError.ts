import { AppError } from "./AppError.js";
import { ErrorCodes } from "./error-codes.js";

export class ForbiddenError extends AppError {
  readonly code = ErrorCodes.FORBIDDEN;
  readonly status = 403;

  constructor(message = "You do not have permission to perform this action") {
    super(message, { expose: true });
  }
}
