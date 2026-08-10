import { ITagRepository } from "../domain/tagRepository.js";
import { PrismaTagMapper } from "../infraestructura/PrismaTagMapper.js";
import { UpdateTagCommand } from "./updateTagCommand.js";
import { TagNotFoundError } from "./errors/TagNotFound.js";
import { TagAlreadyExistsError } from "../create/errors/TagAlreadyExists.js";

interface TagResponse {
  id: number|null;
  name: string;
}

export class UpdateTagHandler {
    constructor(
        private readonly tagRepository: ITagRepository
    ) {}

    async execute(command: UpdateTagCommand): Promise<TagResponse> {
        if (!Number.isInteger(command.id) || command.id <= 0) {
            throw new TagNotFoundError(command.id);
        }

        const tag = await this.tagRepository.findById(command.id);
        if (!tag) {
            throw new TagNotFoundError(command.id);
        }

        if (command.name !== tag.name) {
            const nameTag = await this.tagRepository.findByName(command.name);
            if (nameTag && nameTag.id !== command.id) {
                throw new TagAlreadyExistsError(command.name);
            }
        }

        const tagUpdated = await this.tagRepository.update(command.id, {
            name: command.name,
        });
        return PrismaTagMapper.toResponse(tagUpdated);
    }
}
