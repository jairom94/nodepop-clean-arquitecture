import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../../../features/auth/login/errors/UnauthorizedError.js";
import { ITokenService } from "../../../features/auth/domain/TokenService.js";
import { ITokenRepository } from "../../../features/auth/domain/tokenRepository.js";

export function authGuard(tokenService: ITokenService, tokenRepository: ITokenRepository) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
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

      const revoked = await tokenRepository.isRevoked(token);
      if (revoked) {
        const unauthorizedError = new UnauthorizedError("Token has been revoked");
        return next(unauthorizedError);
      }

      req.user = payload;
      next();
    } catch (error) {
      next(error);
    }
  };
}
