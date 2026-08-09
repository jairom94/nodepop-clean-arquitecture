import jwt from "jsonwebtoken";
import { ITokenService, TokenPayload, TokenType } from "../../features/auth/domain/TokenService.js";
import { ENVIRONMENTS } from "../../config/environments.js";

export class JwtTokenService implements ITokenService {
  sign(payload: TokenPayload, type: TokenType): string {
    const expiresIn = type === "refresh"
      ? ENVIRONMENTS.jwtRefreshExpiresIn
      : ENVIRONMENTS.jwtExpiresIn;

    return jwt.sign(
      { ...payload, type },
      ENVIRONMENTS.jwtSecret,
      { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] },
    );
  }

  verify(token: string, type: TokenType): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, ENVIRONMENTS.jwtSecret) as jwt.JwtPayload & {
        type?: TokenType;
      };
      if (decoded.type !== type || typeof decoded.sub !== "string" || typeof decoded.email !== "string") {
        return null;
      }
      return { sub: decoded.sub, email: decoded.email };
    } catch {
      return null;
    }
  }

  getExpiry(token: string): Date | null {
    const decoded = jwt.decode(token);
    if (typeof decoded === "string" || !decoded || typeof decoded.exp !== "number") {
      return null;
    }
    return new Date(decoded.exp * 1000);
  }
}
