import { IPasswordHasher } from "../domain/PasswordHasher.js";
import { User } from "../domain/User.js";
import { IUserRepository } from "../domain/userRepository.js";
import { CreateUserCommand } from "./createUserCommand.js";

export class CreateUserHandler {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordHasher: IPasswordHasher
    ) {}

    async execute(command: CreateUserCommand): Promise<User> {
        const hashedPassword = await this.passwordHasher.hash(command.password);
        const user = new User({
            id: null,
            name: command.name,
            lastname1: command.lastname1,
            email: command.email,
            password: hashedPassword,
        });
        return await this.userRepository.create(user);
    }
}
