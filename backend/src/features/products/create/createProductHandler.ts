import { Product } from "../domain/Product.js";
import { Tag } from "../../tags/domain/Tag.js";
import { IProductRepository } from "../domain/productRepository.js";
import { PrismaProductMapper } from "../infraestructura/PrismaProductMapper.js";
import { CreateProductCommand } from "./createProductCommand.js";

interface ProductResponse {
  id: number|null;
  name: string;
  price: number;
  ownerId: number;
  image: string|null;
  tags: { id: number|null; name: string }[];
}

export class CreateProductHandler {
    constructor(private readonly productRepository: IProductRepository) {}

    async execute(command: CreateProductCommand): Promise<ProductResponse> {
        const product = new Product({
            id: null,
            name: command.name,
            price: command.price,
            ownerId: command.ownerId,
            image: command.image ?? null,
            tags: (command.tags ?? []).map((name) => new Tag({ id: null, name })),
        });
        const productCreated = await this.productRepository.create(product);
        return PrismaProductMapper.toResponse(productCreated);
    }
}
