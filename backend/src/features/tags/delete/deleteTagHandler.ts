import { ITagRepository } from "../domain/tagRepository.js";
import { DeleteTagCommand } from "./deleteTagCommand.js";
import { TagNotFoundError } from "../update/errors/TagNotFound.js";
import { ForbiddenError } from "../../../shared/errors/ForbiddenError.js";

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

        // Los tags son compartidos: no se puede alterar uno del que dependen productos ajenos
        if (await this.tagRepository.isUsedByOtherOwners(command.id, command.requesterId)) {
            throw new ForbiddenError("This tag is used by other users' products");
        }

        await this.tagRepository.delete(command.id);
    }
}
