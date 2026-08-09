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
    if (!command.token) {
      throw new UnauthorizedError("Token is required");
    }

    const expiresAt = this.tokenService.getExpiry(command.token);
    if (!expiresAt) {
      throw new UnauthorizedError("Invalid token");
    }

    await this.tokenRepository.revoke(command.token, expiresAt);
  }
}
