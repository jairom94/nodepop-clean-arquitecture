import jwt from "jsonwebtoken";
import { ITokenService } from "../../features/auth/domain/TokenService.js";
import { ENVIRONMENTS } from "../../config/environments.js";


export class JwtTokenService implements ITokenService {
  sign(payload: { sub: string; email: string }): string {
    return jwt.sign(
      payload,
      ENVIRONMENTS.jwtSecret,
      {
        expiresIn: ENVIRONMENTS.jwtExpiresIn as jwt.SignOptions["expiresIn"],
      },
    );
  }

  getExpiry(token: string): Date | null {
    const decoded = jwt.decode(token);
    if (typeof decoded === "string" || !decoded || typeof decoded.exp !== "number") {
      return null;
    }
    return new Date(decoded.exp * 1000);
  }
}