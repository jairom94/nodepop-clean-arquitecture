import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../../../features/auth/login/errors/UnauthorizedError.js";
import { ITokenService } from "../../../features/auth/domain/TokenService.js";

export function authGuard(tokenService: ITokenService) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const unauthorizedError = new UnauthorizedError("Missing or invalid Authorization header");
      return next(unauthorizedError);
    }
    const token = authHeader.split(" ")[1];

    const payload = tokenService.verify(token, "access");
    if (!payload) {
      const unauthorizedError = new UnauthorizedError("Invalid token");
      return next(unauthorizedError);
    }
    req.user = payload;
    next();
  };
}
