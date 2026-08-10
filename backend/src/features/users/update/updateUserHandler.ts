import { IUserRepository } from "../domain/userRepository.js";
import { PrismaUserMapper } from "../infraestructura/PrismaUserMapper.js";
import { UpdateUserCommand } from "./updateUserCommand.js";
import { UserNotFoundError } from "./errors/UserNotFound.js";
import { EmailAlreadyExistsError } from "../create/errors/EmailExists.js";

interface UserResponse {
  id: number|null;
  name: string;
  lastname1: string;
  email: string;
}

export class UpdateUserHandler {
    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async execute(command: UpdateUserCommand): Promise<UserResponse> {
        if (!Number.isInteger(command.id) || command.id <= 0) {
            throw new UserNotFoundError(command.id);
        }

        const user = await this.userRepository.findById(command.id);
        if (!user) {
            throw new UserNotFoundError(command.id);
        }

        if (command.email && command.email !== user.email) {
            const emailUser = await this.userRepository.findByEmail(command.email);
            if (emailUser && emailUser.id !== command.id) {
                throw new EmailAlreadyExistsError(command.email);
            }
        }

        const userUpdated = await this.userRepository.update(command.id, {
            name: command.name ?? user.name,
            lastname1: command.lastname1 ?? user.lastname1,
            email: command.email ?? user.email,
        });
        return PrismaUserMapper.toResponse(userUpdated);
    }
}
