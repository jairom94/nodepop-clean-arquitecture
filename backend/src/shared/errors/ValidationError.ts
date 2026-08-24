import z from "zod";
import { AppError } from "./AppError.js";
import { ErrorCodes } from "./error-codes.js";

export class ValidationError extends AppError {
  readonly code = ErrorCodes.VALIDATION_ERROR;
  readonly status = 401;

  constructor(zodError: z.ZodError) {
    const err = (zodError.issues ?? []).map(issue => ({
      msg:issue.message,
      field:issue.path.join("."),
      location:"body"
    }));
    super("Validation error", { 
      cause: err,
      expose:true 
    });
  }

  /**
   * Crea un ValidationError a partir de un mensaje y campo manuales,
   * sin necesidad de construir un ZodError.
   */
  static fromManual(field: string, message: string) {
    const err = new ValidationError({} as z.ZodError);
    (err as { cause: unknown }).cause = [
      { msg: message, field, location: "body" },
    ];
    return err;
  }
}