import { NextFunction, Request, Response } from "express";
import z from "zod";
import { ValidationError } from "../../../shared/errors/ValidationError.js";

export function validateBody(schema: z.ZodType) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void => {
    console.log("Validating request body:", req.body);
    const result = schema.safeParse(req.body ?? {});

    if (!result.success) {
      const err = new ValidationError(result.error);
      next(err);
      return;
    }

    req.body = result.data;

    next();
  };
}