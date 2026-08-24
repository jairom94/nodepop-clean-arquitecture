import { ITokenService } from "../domain/TokenService.js";
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

    if (command.token) {
      const expiresAt = this.tokenService.getExpiry(command.token);
      if (expiresAt) {
        await this.tokenRepository.revoke(command.token, expiresAt);
      }
    }

    if (command.refreshToken) {
      const expiresAt = this.tokenService.getExpiry(command.refreshToken);
      if (expiresAt) {
        await this.tokenRepository.revoke(command.refreshToken, expiresAt);
      }
    }
  }
}
