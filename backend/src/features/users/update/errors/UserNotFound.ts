import { AppError } from "../../../../shared/errors/AppError.js";
import { ErrorCodes } from "../../../../shared/errors/error-codes.js";

export class UserNotFoundError extends AppError {
  readonly code = ErrorCodes.USER_NOT_FOUND;
  readonly status = 404;

  constructor(id: number) {
    super(`User with id ${id} not found`, { expose: true });
  }
}
