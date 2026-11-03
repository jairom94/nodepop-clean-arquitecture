import { IProductRepository } from "../domain/productRepository.js";
import { PrismaProductMapper } from "../infraestructura/PrismaProductMapper.js";
import { GetProductCommand } from "./getProductCommand.js";
import { ProductNotFoundError } from "../update/errors/ProductNotFound.js";

interface ProductResponse {
  id: number|null;
  name: string;
  price: number;
  ownerId: number;
  image: string|null;
  tags: { id: number|null; name: string }[];
}

interface ProductListResult {
  items: ProductResponse[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export class GetProductHandler {
    constructor(
        private readonly productRepository: IProductRepository
    ) {}

    async execute(command: GetProductCommand): Promise<ProductResponse | ProductListResult> {
        if (command.id !== undefined) {
            if (!Number.isInteger(command.id) || command.id <= 0) {
                throw new ProductNotFoundError(command.id);
            }

            const product = await this.productRepository.findById(command.id);
            if (!product) {
                throw new ProductNotFoundError(command.id);
            }
            return PrismaProductMapper.toResponse(product);
        }

        const { page, pageSize } = command;
        const [products, total] = await Promise.all([
            this.productRepository.findAll((page - 1) * pageSize, pageSize),
            this.productRepository.count(),
        ]);
        return {
            items: products.map((product) => PrismaProductMapper.toResponse(product)),
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
        };
    }
}
