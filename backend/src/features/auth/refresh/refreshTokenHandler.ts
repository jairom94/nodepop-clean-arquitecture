import { ITokenService } from "../domain/TokenService.js";
import { ITokenRepository } from "../domain/tokenRepository.js";
import { UnauthorizedError } from "../login/errors/UnauthorizedError.js";
import { RefreshTokenCommand, RefreshTokenResult } from "./refreshTokenCommand.js";

export class RefreshTokenHandler {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<RefreshTokenResult> {
    const payload = this.tokenService.verify(command.refreshToken, "refresh");
    if (!payload) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    // Rotación atómica: revocar el refresh token usado. Si ya estaba revocado
    // (reutilización o dos renovaciones a la vez), solo la primera petición obtiene sesión.
    const expiresAt = this.tokenService.getExpiry(command.refreshToken);
    const firstUse = expiresAt !== null
      && await this.tokenRepository.revoke(command.refreshToken, expiresAt);
    if (!firstUse) {
      throw new UnauthorizedError("Refresh token has been revoked");
    }

    const token = this.tokenService.sign(payload, "access");
    const refreshToken = this.tokenService.sign(payload, "refresh");
    return { token, refreshToken };
  }
}
