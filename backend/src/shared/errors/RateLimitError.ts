import { AppError } from "./AppError.js";
import { ErrorCodes } from "./error-codes.js";

export class RateLimitError extends AppError {
  readonly code = ErrorCodes.RATE_LIMIT_EXCEEDED;
  readonly status = 429;

  constructor(message = "Too many requests, please try again later") {
    super(message, { expose: true });
  }
}
