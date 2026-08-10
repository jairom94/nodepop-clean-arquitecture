import { AppError } from "../../../../shared/errors/AppError.js";
import { ErrorCodes } from "../../../../shared/errors/error-codes.js";

export class ProductNotFoundError extends AppError {
  readonly code = ErrorCodes.PRODUCT_NOT_FOUND;
  readonly status = 404;

  constructor(id: number) {
    super(`Product with id ${id} not found`, { expose: true });
  }
}
