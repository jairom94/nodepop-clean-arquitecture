import { Product } from "../domain/Product.js";
import { Tag } from "../../tags/domain/Tag.js";
import { IProductRepository } from "../domain/productRepository.js";
import { CreateProductCommand } from "./createProductCommand.js";

export class CreateProductHandler {
    constructor(private readonly productRepository: IProductRepository) {}

    async execute(command: CreateProductCommand): Promise<Product> {
        const product = new Product({
            id: null,
            name: command.name,
            price: command.price,
            ownerId: command.ownerId,
            image: command.image ?? null,
            tags: (command.tags ?? []).map((name) => new Tag({ id: null, name })),
        });
        return await this.productRepository.create(product);
    }
}
