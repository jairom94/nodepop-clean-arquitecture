import { Tag } from "../domain/Tag.js";
import { Tag as PrismaTag } from "../../../generated/prisma/client.js";

export class PrismaTagMapper {
  static toDomain(model: PrismaTag): Tag {
    return new Tag({
      id: model.id,
      name: model.name,
    });
  }

  static toPersistence(tag: Tag) {
    return {
      name: tag.name,
    };
  }

  static toResponse(tag: Tag) {
    return {
      id: tag.id,
      name: tag.name,
    };
  }
}