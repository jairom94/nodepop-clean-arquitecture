import { Request } from "express";
import { TokenPayload } from "../../features/auth/domain/TokenService.ts";

declare global {
  namespace Express {
    interface Request {
        user?: TokenPayload;
    }
  }
}