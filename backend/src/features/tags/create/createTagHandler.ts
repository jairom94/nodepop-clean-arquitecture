import { Tag } from "../domain/Tag.js";
import { ITagRepository } from "../domain/tagRepository.js";
import { CreateTagCommand } from "./createTagCommand.js";

export class CreateTagHandler {
    constructor(private readonly tagRepository: ITagRepository) {}

    async execute(command: CreateTagCommand): Promise<Tag> {
        const tag = new Tag({
            id: null,
            name: command.name,
        });
        return await this.tagRepository.create(tag);
    }
}