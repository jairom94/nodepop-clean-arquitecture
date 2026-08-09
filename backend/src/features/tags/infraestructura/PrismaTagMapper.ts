import { Tag } from "../domain/Tag.js";

export class PrismaTagMapper {
  static toDomain(model: Tag): Tag {
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
}