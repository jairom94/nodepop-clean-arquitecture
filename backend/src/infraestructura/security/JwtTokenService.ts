import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import { ITokenService, TokenPayload, TokenType } from "../../features/auth/domain/TokenService.js";
import { ENVIRONMENTS } from "../../config/environments.js";

// Algoritmo fijo: jwt.verify no acepta tokens firmados con otro distinto
const ALGORITHM = "HS256";

/** Cada tipo de token tiene su propio secreto: un refresh token no sirve como access y viceversa. */
function secretFor(type: TokenType): string {
  return type === "refresh" ? ENVIRONMENTS.jwtRefreshSecret : ENVIRONMENTS.jwtSecret;
}

export class JwtTokenService implements ITokenService {
  sign(payload: TokenPayload, type: TokenType): string {
    const expiresIn = type === "refresh"
      ? ENVIRONMENTS.jwtRefreshExpiresIn
      : ENVIRONMENTS.jwtExpiresIn;

    return jwt.sign(
      { ...payload, type },
      secretFor(type),
      {
        algorithm: ALGORITHM,
        expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
        // Identificador único (jti): sin él, dos sesiones abiertas en el mismo segundo
        // tendrían el mismo token y revocar una revocaría también la otra.
        jwtid: randomUUID(),
      },
    );
  }

  verify(token: string, type: TokenType): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, secretFor(type), { algorithms: [ALGORITHM] }) as jwt.JwtPayload & {
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
