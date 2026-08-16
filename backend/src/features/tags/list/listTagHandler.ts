import { ITagRepository } from "../domain/tagRepository.js";
import { PrismaTagMapper } from "../infraestructura/PrismaTagMapper.js";

interface TagResponse {
  id: number | null;
  name: string;
}

export class ListTagHandler {
    constructor(
        private readonly tagRepository: ITagRepository
    ) {}

    async execute(): Promise<TagResponse[]> {
        const tags = await this.tagRepository.findAll();
        return tags.map((tag) => PrismaTagMapper.toResponse(tag));
    }
}
