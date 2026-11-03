import { ITokenService, TokenType } from "../domain/TokenService.js";
import { ITokenRepository } from "../domain/tokenRepository.js";
import { UnauthorizedError } from "../login/errors/UnauthorizedError.js";
import { LogoutCommand } from "./logoutCommand.js";

export class LogoutHandler {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    if (!command.token && !command.refreshToken) {
      throw new UnauthorizedError("Token is required");
    }

    // Solo se revocan tokens con firma válida y del propio usuario: así nadie puede
    // llenar la tabla con basura ni cerrar la sesión de otro con un token robado a medias.
    await this.revokeIfOwn(command.token, "access", command.requesterId);
    await this.revokeIfOwn(command.refreshToken, "refresh", command.requesterId);
  }

  private async revokeIfOwn(token: string | undefined, type: TokenType, requesterId: string) {
    if (!token) return;
    const payload = this.tokenService.verify(token, type);
    if (!payload || payload.sub !== requesterId) return;
    const expiresAt = this.tokenService.getExpiry(token);
    if (expiresAt) {
      await this.tokenRepository.revoke(token, expiresAt);
    }
  }
}
