import { IProductRepository } from "../domain/productRepository.js";
import { DeleteProductCommand } from "./deleteProductCommand.js";
import { ProductNotFoundError } from "../update/errors/ProductNotFound.js";

export class DeleteProductHandler {
    constructor(
        private readonly productRepository: IProductRepository
    ) {}

    async execute(command: DeleteProductCommand): Promise<void> {
        if (!Number.isInteger(command.id) || command.id <= 0) {
            throw new ProductNotFoundError(command.id);
        }

        const product = await this.productRepository.findById(command.id);
        if (!product) {
            throw new ProductNotFoundError(command.id);
        }

        await this.productRepository.delete(command.id);
    }
}
