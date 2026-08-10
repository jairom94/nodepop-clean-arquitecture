import { AppError } from "../../../../shared/errors/AppError.js";
import { ErrorCodes } from "../../../../shared/errors/error-codes.js";

export class EmailAlreadyExistsError extends AppError {
  readonly code = ErrorCodes.EMAIL_ALREADY_EXISTS;
  readonly status = 409;

  constructor(email: string) {
    super(`Email ${email} already exists`, { expose: true });
  }
}