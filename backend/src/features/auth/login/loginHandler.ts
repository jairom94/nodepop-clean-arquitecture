import jwt from "jsonwebtoken";
import { User } from "../../users/domain/User.js";
import { IUserRepository } from "../../users/domain/userRepository.js";
import { IPasswordHasher } from "../../users/domain/PasswordHasher.js";
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError.js";
import { ENVIRONMENTS } from "../../../config/environments.js";
import { LoginCommand, LoginResult } from "./loginCommand.js";
import { ITokenService } from "../domain/TokenService.js";

export class LoginHandler {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordHasher: IPasswordHasher,
        private readonly tokenService: ITokenService
    ) {}

    async execute(command: LoginCommand): Promise<LoginResult> {
        const user = await this.userRepository.findByEmail(command.email);
        if (!user) {
            throw new UnauthorizedError();
        }

        const isValid = await this.passwordHasher.compare(command.password, user.password);
        if (!isValid) {
            throw new UnauthorizedError();
        }

        const token = this.tokenService.sign({
            sub: String(user.id),
            email: user.email,
        });
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                lastname1: user.lastname1,
                email: user.email,
            },
        };
    }
}
