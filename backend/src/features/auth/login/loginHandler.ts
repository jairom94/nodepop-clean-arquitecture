import { IUserRepository } from "../../users/domain/userRepository.js";
import { IPasswordHasher } from "../../users/domain/PasswordHasher.js";
import { UnauthorizedError } from "./errors/UnauthorizedError.js";
import { LoginCommand, LoginResult } from "./loginCommand.js";
import { ITokenService } from "../domain/TokenService.js";

/**
 * Hash bcrypt (coste 12) de una contraseña aleatoria descartada. Se compara contra él
 * cuando el email no existe, para que la respuesta tarde lo mismo y no revele qué cuentas hay.
 */
const DUMMY_HASH = "$2b$12$Ku1Ge49WTE9aXl27cyYVfeMFruQqRmYpJ791EuqjrUpi7pOMRFot2";

export class LoginHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(command.email);
    const isValid = await this.passwordHasher.compare(
      command.password,
      user?.password ?? DUMMY_HASH,
    );
    if (!user || !isValid) {
      throw new UnauthorizedError();
    }

    // Hashes antiguos (coste menor) se actualizan al vuelo con la contraseña recién verificada
    if (this.passwordHasher.needsRehash(user.password)) {
      await this.userRepository.updatePassword(
        user.id as number,
        await this.passwordHasher.hash(command.password),
      );
    }

    const token = this.tokenService.sign({
      sub: String(user.id),
      email: user.email,
    }, "access");
    const refreshToken = this.tokenService.sign({
      sub: String(user.id),
      email: user.email,
    }, "refresh");
    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        lastname1: user.lastname1,
        email: user.email,
      },
    };
  }
}
