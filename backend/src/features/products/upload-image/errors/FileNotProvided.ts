import { AppError } from "../../../../shared/errors/AppError.js";
import { ErrorCodes } from "../../../../shared/errors/error-codes.js";

export class FileNotProvidedError extends AppError {
  readonly code = ErrorCodes.FILE_NOT_PROVIDED;
  readonly status = 400;

  constructor() {
    super("No file provided. Upload an image with field name 'image'.", {
      expose: true,
    });
  }
}
