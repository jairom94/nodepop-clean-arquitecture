import { Tag } from "../domain/Tag.js";
import { ITagRepository } from "../domain/tagRepository.js";
import { PrismaTagMapper } from "../infraestructura/PrismaTagMapper.js";
import { CreateTagCommand } from "./createTagCommand.js";
import { TagAlreadyExistsError } from "./errors/TagAlreadyExists.js";

interface TagResponse {
  id: number|null;
  name: string;
}

export class CreateTagHandler {
    constructor(private readonly tagRepository: ITagRepository) {}

    async execute(command: CreateTagCommand): Promise<TagResponse> {
        const tagExists = await this.tagRepository.findByName(command.name);
        if (tagExists) {
            throw new TagAlreadyExistsError(command.name);
        }

        const tag = new Tag({
            id: null,
            name: command.name,
        });
        const tagCreated = await this.tagRepository.create(tag);
        return PrismaTagMapper.toResponse(tagCreated);
    }
}
