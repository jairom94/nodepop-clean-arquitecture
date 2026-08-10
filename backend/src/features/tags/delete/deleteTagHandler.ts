import { ITagRepository } from "../domain/tagRepository.js";
import { DeleteTagCommand } from "./deleteTagCommand.js";
import { TagNotFoundError } from "../update/errors/TagNotFound.js";

export class DeleteTagHandler {
    constructor(
        private readonly tagRepository: ITagRepository
    ) {}

    async execute(command: DeleteTagCommand): Promise<void> {
        if (!Number.isInteger(command.id) || command.id <= 0) {
            throw new TagNotFoundError(command.id);
        }

        const tag = await this.tagRepository.findById(command.id);
        if (!tag) {
            throw new TagNotFoundError(command.id);
        }

        await this.tagRepository.delete(command.id);
    }
}
