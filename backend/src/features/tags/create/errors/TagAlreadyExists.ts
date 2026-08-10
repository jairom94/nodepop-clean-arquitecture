import { AppError } from "../../../../shared/errors/AppError.js";
import { ErrorCodes } from "../../../../shared/errors/error-codes.js";

export class TagAlreadyExistsError extends AppError {
  readonly code = ErrorCodes.TAG_ALREADY_EXISTS;
  readonly status = 409;

  constructor(name: string) {
    super(`Tag ${name} already exists`, { expose: true });
  }
}
