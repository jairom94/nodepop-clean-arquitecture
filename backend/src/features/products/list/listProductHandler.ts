import { IProductRepository } from "../domain/productRepository.js";
import { PrismaProductMapper } from "../infraestructura/PrismaProductMapper.js";
import { ListProductCommand } from "./listProductCommand.js";

interface ProductResponse {
  id: number|null;
  name: string;
  price: number;
  ownerId: number;
  image: string|null;
  tags: { id: number|null; name: string }[];
}

interface ListProductResult {
  items: ProductResponse[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export class ListProductHandler {
    constructor(
        private readonly productRepository: IProductRepository
    ) {}

    async execute(command: ListProductCommand): Promise<ListProductResult> {
        const { ownerId, page, pageSize } = command;
        const skip = (page - 1) * pageSize;

        const [products, total] = await Promise.all([
            this.productRepository.findByOwnerId(ownerId, skip, pageSize),
            this.productRepository.countByOwnerId(ownerId),
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
