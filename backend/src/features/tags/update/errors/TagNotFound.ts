import { AppError } from "../../../../shared/errors/AppError.js";
import { ErrorCodes } from "../../../../shared/errors/error-codes.js";

export class TagNotFoundError extends AppError {
  readonly code = ErrorCodes.TAG_NOT_FOUND;
  readonly status = 404;

  constructor(id: number) {
    super(`Tag with id ${id} not found`, { expose: true });
  }
}
