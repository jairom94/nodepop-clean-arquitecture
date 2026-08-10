import { IPasswordHasher } from "../domain/PasswordHasher.js";
import { User } from "../domain/User.js";
import { IUserRepository } from "../domain/userRepository.js";
import { PrismaUserMapper } from "../infraestructura/PrismaUserMapper.js";
import { CreateUserCommand } from "./createUserCommand.js";
import { EmailAlreadyExistsError } from "./errors/EmailExists.js";

interface UserResponse {
  id: number|null;
  name: string;
  lastname1: string;
  email: string;
}

export class CreateUserHandler {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordHasher: IPasswordHasher
    ) {}

    async execute(command: CreateUserCommand): Promise<UserResponse> {
        const userExists = await this.userRepository.findByEmail(command.email);
        if (userExists) {
            throw new EmailAlreadyExistsError(command.email);
        }
        const hashedPassword = await this.passwordHasher.hash(command.password);
        const user = new User({
            id: null,
            name: command.name,
            lastname1: command.lastname1,
            email: command.email,
            password: hashedPassword,
        });
        const userCreated = await this.userRepository.create(user);
        return PrismaUserMapper.toResponse(userCreated);
    }
}
