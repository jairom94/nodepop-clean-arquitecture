import { ITokenService } from "../domain/TokenService.js";
import { UnauthorizedError } from "../login/errors/UnauthorizedError.js";
import { RefreshTokenCommand, RefreshTokenResult } from "./refreshTokenCommand.js";

export class RefreshTokenHandler {
  constructor(private readonly tokenService: ITokenService) {}

  async execute(command: RefreshTokenCommand): Promise<RefreshTokenResult> {
    const payload = this.tokenService.verify(command.refreshToken, "refresh");
    if (!payload) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const token = this.tokenService.sign(payload, "access");
    return { token };
  }
}
