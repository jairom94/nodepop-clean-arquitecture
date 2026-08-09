import { AppError } from "./AppError.js";
import { ErrorCodes } from "./error-codes.js";

export class UnauthorizedError extends AppError {
  readonly code = ErrorCodes.UNAUTHORIZED;
  readonly status = 401;

  constructor(message = "Invalid credentials") {
    super(message);
  }
}
