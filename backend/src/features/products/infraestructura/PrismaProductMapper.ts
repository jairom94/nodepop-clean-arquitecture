import { Product } from "../domain/Product.js";
import { Tag } from "../../tags/domain/Tag.js";
import { Product as PrismaProduct, Tag as PrismaTag } from "../../../generated/prisma/client.js";

type ProductWithTags = PrismaProduct & { tags: PrismaTag[] };

export class PrismaProductMapper {
  static toDomain(model: ProductWithTags): Product {
    const tags = model.tags.map((tag) => new Tag({ id: tag.id, name: tag.name }));
    return new Product({
      id: model.id,
      name: model.name,
      price: model.price,
      ownerId: model.ownerId,
      image: model.image,
      tags,
    });
  }

  static toPersistence(product: Product) {
    return {
      name: product.name,
      price: product.price,
      ownerId: product.ownerId,
      image: product.image,
      tags: {
        connectOrCreate: product.tags.map((tag) => ({
          where: { name: tag.name },
          create: { name: tag.name },
        })),
      },
    };
  }

  static toResponse(product: Product) {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      ownerId: product.ownerId,
      image: product.image,
      tags: product.tags.map((tag) => ({ id: tag.id, name: tag.name })),
    };
  }
}
