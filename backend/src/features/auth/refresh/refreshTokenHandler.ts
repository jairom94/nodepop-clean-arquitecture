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

    const revoked = await this.tokenRepository.isRevoked(command.refreshToken);
    if (revoked) {
      throw new UnauthorizedError("Refresh token has been revoked");
    }

    // Rotación: revocar el refresh token usado y emitir uno nuevo
    const expiresAt = this.tokenService.getExpiry(command.refreshToken);
    if (expiresAt) {
      await this.tokenRepository.revoke(command.refreshToken, expiresAt);
    }

    const token = this.tokenService.sign(payload, "access");
    const refreshToken = this.tokenService.sign(payload, "refresh");
    return { token, refreshToken };
  }
}
