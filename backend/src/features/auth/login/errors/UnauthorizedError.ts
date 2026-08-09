import { AppError } from "../../../../shared/errors/AppError.js";
import { ErrorCodes } from "../../../../shared/errors/error-codes.js";

export class UnauthorizedError extends AppError {
  readonly code = ErrorCodes.UNAUTHORIZED;
  readonly status = 401;

  constructor(message = "Invalid credentials") {
    super(message);
  }
}
