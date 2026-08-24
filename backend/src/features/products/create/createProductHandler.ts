import { Product } from "../domain/Product.js";
import { Tag } from "../../tags/domain/Tag.js";
import { IProductRepository } from "../domain/productRepository.js";
import { IFileStorage } from "../domain/FileStorage.js";
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
    constructor(
        private readonly productRepository: IProductRepository,
        private readonly fileStorage: IFileStorage,
    ) {}

    async execute(command: CreateProductCommand): Promise<ProductResponse> {
        let image: string | null = null;

        if (command.file) {
            const stored = await this.fileStorage.save({
                buffer: command.file.buffer,
                originalname: command.file.originalname,
                mimetype: command.file.mimetype,
            });
            image = `/uploads/${stored.filename}`;
        }

        const product = new Product({
            id: null,
            name: command.name,
            price: command.price,
            ownerId: command.ownerId,
            image,
            tags: (command.tags ?? []).map((name) => new Tag({ id: null, name })),
        });
        const productCreated = await this.productRepository.create(product);
        return PrismaProductMapper.toResponse(productCreated);
    }
}
