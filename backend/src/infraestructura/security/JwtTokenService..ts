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
}